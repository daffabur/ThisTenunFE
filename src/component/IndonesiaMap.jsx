import { useEffect, useMemo, useState, memo } from "react";
import { geoMercator, geoPath, geoArea } from "d3-geo";
import * as topo from "topojson-client";

const API = "https://thistenunbetest-production.up.railway.app";
const DATA_URL = "/data/indonesia-provinces.topo.json";

function IndonesiaMap({ onSelect, onHover, onLeave }) {
  const [features, setFeatures] = useState([]);
  const width = 1100, height = 480;

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(DATA_URL, { cache: "no-store" });
        const data = await resp.json();

        let feats = [];
        if (data.type === "Topology") {
          const key = Object.keys(data.objects)
            .sort((a, b) =>
              (data.objects[b]?.geometries?.length || 0) -
              (data.objects[a]?.geometries?.length || 0)
            )[0];
          feats = topo.feature(data, data.objects[key]).features;
        } else if (data.type === "FeatureCollection") {
          feats = data.features || [];
        }
        setFeatures(feats);
      } catch (e) {
        console.error("Gagal memuat peta:", e);
        setFeatures([]);
      }
    })();
  }, []);

  // --- PROYEKSI: fit-kan semua fitur ke kanvas (supaya Aceh tidak kepotong)
  const featureCollection = useMemo(
    () => ({ type: "FeatureCollection", features }),
    [features]
  );

  const projection = useMemo(() => {
    // beri padding sedikit biar tidak nempel tepi
    const pad = 12;
    const proj = geoMercator();
    return features.length
      ? proj.fitExtent([[pad, pad], [width - pad, height - pad]], featureCollection)
      : proj.scale(1).translate([0, 0]);
  }, [features, featureCollection]);

  const path = useMemo(() => geoPath(projection), [projection]);

  // gambar dari yang besar -> kecil (fitur kecil di atas, tidak ketutup)
  const ordered = useMemo(() => {
    return features
      .map((f, i) => {
        const raw =
          f.properties?.name ??
          f.properties?.Propinsi ??
          f.properties?.province ??
          f.properties?.PROVINSI ??
          f.properties?.NAME_1 ??
          `prov-${i}`;
        const prov = (raw + "")
          .trim()
          .replace(/^(nad|di\s*aceh|nanggroe aceh darussalam)$/i, "Aceh")
          .replace(/d\.?\s*i\.?\s*yogyakarta|daerah istimewa yogyakarta/i, "Daerah Istimewa Yogyakarta");
        return { f, prov, i };
      })
      .sort((a, b) => geoArea(b.f) - geoArea(a.f));
  }, [features]);

  if (!ordered.length) return null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-[1100px] max-w-full"
      shapeRendering="geometricPrecision"
    >
      {ordered.map(({ f, prov, i }) => (
        <path
          key={`${prov}-${i}`}
          d={path(f)}
          fill="#BABABA"
          stroke="#2a3e3f"
          strokeWidth={0.6}
          style={{ cursor: "pointer", transition: "fill .15s" }}
          onMouseEnter={(e) => {
            e.currentTarget.setAttribute("fill", "#9fb1b3");
            onHover?.(prov);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.setAttribute("fill", "#BABABA");
            onLeave?.();
          }}
          onClick={async () => {
            try {
              const res = await fetch(`${API}/api/tenun?province=${encodeURIComponent(prov)}`);
              const data = await res.json();
              onSelect?.(prov, Array.isArray(data) ? data : []);
            } catch (err) {
              console.error(err);
              onSelect?.(prov, []);
            }
          }}
        />
      ))}
    </svg>
  );
}

export default memo(IndonesiaMap);
