// src/component/IndonesiaMap.jsx
import { useEffect, useMemo, useState, memo } from "react";
import { geoMercator, geoPath, geoArea } from "d3-geo";
import * as topo from "topojson-client";

const API = "https://thistenunbetest-production.up.railway.app";
const DATA_URL = "/data/indonesia-provinces.topo.json";

// viewBox tetap; ukuran tampilan mengikuti parent (w-full h-full)
const VIEW_W = 1200;
const VIEW_H = 700;

// kecilkan helper biar aman di berbagai bentuk response
const asArray = (d) =>
  Array.isArray(d)
    ? d
    : Array.isArray(d?.data)
    ? d.data
    : Array.isArray(d?.items)
    ? d.items
    : Array.isArray(d?.rows)
    ? d.rows
    : [];

function IndonesiaMap({ onSelect, onHover, onLeave, className = "" }) {
  const [features, setFeatures] = useState([]);

  // fetch file topo/geojson
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const resp = await fetch(DATA_URL, { cache: "no-store" });
        const data = await resp.json();

        let feats = [];
        if (data?.type === "Topology") {
          // ambil objek dengan geometries terbanyak (umumnya provinsi)
          const key = Object.keys(data.objects || {}).sort(
            (a, b) =>
              (data.objects[b]?.geometries?.length || 0) -
              (data.objects[a]?.geometries?.length || 0)
          )[0];
          if (key) feats = topo.feature(data, data.objects[key]).features || [];
        } else if (data?.type === "FeatureCollection") {
          feats = data.features || [];
        }
        if (alive) setFeatures(feats);
      } catch (e) {
        console.error("Gagal memuat peta:", e);
        if (alive) setFeatures([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const featureCollection = useMemo(
    () => ({ type: "FeatureCollection", features }),
    [features]
  );

  // Fit semua fitur ke viewbox dengan sedikit padding
  const projection = useMemo(() => {
    const pad = 12;
    const proj = geoMercator();
    return features.length
      ? proj.fitExtent(
          [
            [pad, pad],
            [VIEW_W - pad, VIEW_H - pad],
          ],
          featureCollection
        )
      : proj.scale(1).translate([0, 0]);
  }, [features, featureCollection]);

  const path = useMemo(() => geoPath(projection), [projection]);

  // Urut besar → kecil (yang kecil digambar terakhir = di atas)
  const ordered = useMemo(() => {
    return features
      .map((f, i) => {
        const raw =
          f?.properties?.name ??
          f?.properties?.Propinsi ??
          f?.properties?.province ??
          f?.properties?.PROVINSI ??
          f?.properties?.NAME_1 ??
          `prov-${i}`;
        const prov = String(raw)
          .trim()
          .replace(/^(nad|di\s*aceh|nanggroe aceh darussalam)$/i, "Aceh")
          .replace(
            /d\.?\s*i\.?\s*yogyakarta|daerah istimewa yogyakarta/i,
            "Daerah Istimewa Yogyakarta"
          );
        return { f, prov, i };
      })
      .sort((a, b) => geoArea(b.f) - geoArea(a.f));
  }, [features]);

  if (!ordered.length) {
    return (
      <div className={`w-full h-full ${className}`}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full block"
        >
          {/* skeleton simple */}
          <rect
            x="0"
            y="0"
            width={VIEW_W}
            height={VIEW_H}
            fill="#274143"
            opacity="0.15"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full block"
        shapeRendering="geometricPrecision"
        onMouseLeave={() => onLeave?.()}
        role="img"
        aria-label="Peta provinsi Indonesia"
      >
        {ordered.map(({ f, prov, i }) => (
          <path
            key={`${prov}-${i}`}
            d={path(f)}
            fill="#BABABA"
            stroke="#2a3e3f"
            strokeWidth={0.6}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ cursor: "pointer", transition: "fill .15s ease" }}
            onMouseEnter={(e) => {
              e.currentTarget.setAttribute("fill", "#9fb1b3");
              onHover?.(prov);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.setAttribute("fill", "#BABABA");
              // onLeave dipanggil dari SVG onMouseLeave juga, tapi aman dipanggil di sini
              onLeave?.();
            }}
            onClick={async () => {
              try {
                const res = await fetch(
                  `${API}/api/tenun?province=${encodeURIComponent(prov)}`
                );
                const json = await res.json();
                onSelect?.(prov, asArray(json));
              } catch (err) {
                console.error("Fetch tenun gagal:", err);
                onSelect?.(prov, []);
              }
            }}
          >
            <title>{prov}</title>
          </path>
        ))}
      </svg>
    </div>
  );
}

export default memo(IndonesiaMap);
