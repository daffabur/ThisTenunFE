import { useState, useRef, useEffect, useMemo } from "react";
import Exp from "../assets/heroExp.svg";
import IndonesiaMap from "../component/IndonesiaMap";
import Penjelasan from "../component/penjelasan";
import { scroller } from "react-scroll";

const API = "https://thistenunbetest-production.up.railway.app";
const PLACEHOLDER = "https://via.placeholder.com/420x240?text=No+Image";

const CANON = {
  aceh: "Nanggroe Aceh Darussalam",
  nad: "Nanggroe Aceh Darussalam",
  "di aceh": "Nanggroe Aceh Darussalam",
  "nanggroe aceh darussalam": "Nanggroe Aceh Darussalam",

  diy: "Daerah Istimewa Yogyakarta",
  yogyakarta: "Daerah Istimewa Yogyakarta",
  "daerah istimewa yogyakarta": "Daerah Istimewa Yogyakarta",

  "sumatera utara": "Sumatra Utara",
  sumut: "Sumatra Utara",
  "sumatera selatan": "Sumatra Selatan",
  sumsel: "Sumatra Selatan",
  "sumatera barat": "Sumatra Barat",
  sumbar: "Sumatra Barat",

  banten: "Banten",
  probanten: "Banten",
  babel: "Bangka Belitung",
  "bangka belitung": "Bangka Belitung",
  kepri: "Kepulauan Riau",
  "kepulauan riau": "Kepulauan Riau",

  ntb: "Nusa Tenggara Barat",
  "nusa tenggara barat": "Nusa Tenggara Barat",
  ntt: "Nusa Tenggara Timur",
  "nusa tenggara timur": "Nusa Tenggara Timur",

  kalbar: "Kalimantan Barat",
  kaltim: "Kalimantan Timur",
  kalteng: "Kalimantan Tengah",
  kalsel: "Kalimantan Selatan",
  kaltara: "Kalimantan Utara",

  sulbar: "Sulawesi Barat",
  sulsel: "Sulawesi Selatan",
  sulteng: "Sulawesi Tengah",
  sultra: "Sulawesi Tenggara",
  sulut: "Sulawesi Utara",

  malut: "Maluku Utara",
  "maluku utara": "Maluku Utara",
  maluku: "Maluku",

  papua: "Papua",
  "papua barat": "Papua",
  "papua tengah": "Papua",
  "papua selatan": "Papua",
  "papua pegunungan": "Papua",
  "papua barat daya": "Papua",
  "irian jaya": "Papua",
  "irian jaya barat": "Papua",
  "irian jaya tengah": "Papua",
  "irian jaya timur": "Papua",

  dki: "DKI Jakarta",
  jakarta: "DKI Jakarta",
  jabar: "Jawa Barat",
  "jawa barat": "Jawa Barat",
  jateng: "Jawa Tengah",
  "jawa tengah": "Jawa Tengah",
  jatim: "Jawa Timur",
  "jawa timur": "Jawa Timur",
};

const toKey = (s = "") => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
const keyfy = (s = "") => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const parseArray = (data) =>
  Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.rows)
    ? data.rows
    : [];

function normalizeProvinceForApi(name = "") {
  const k = toKey(name);
  if (CANON[k]) return CANON[k];

  const k2 = k.replace(/^(pro|prov|propinsi)\s+/, "");
  if (CANON[k2]) return CANON[k2];

  const k3 = k2.replace(/^sumatera\s+/, "sumatra ");
  if (CANON[k3]) return CANON[k3];

  if (provincesCache.loaded) {
    if (provincesCache.byKey.has(keyfy(k))) return provincesCache.byKey.get(keyfy(k)).name;
    if (provincesCache.byKey.has(keyfy(k2))) return provincesCache.byKey.get(keyfy(k2)).name;
    if (provincesCache.byKey.has(keyfy(k3))) return provincesCache.byKey.get(keyfy(k3)).name;
  }
  return name;
}

function displayProvince(name = "") {
  const k = toKey(name);
  if (["diy","yogyakarta","daerah istimewa yogyakarta"].includes(k)) return "DI Yogyakarta";
  if (["aceh","nad","di aceh","nanggroe aceh darussalam"].includes(k)) return "Aceh";
  return normalizeProvinceForApi(name) || name;
}

const pickImageUrl = (obj) => {
  if (!obj || typeof obj !== "object") return null;
  const cand =
    obj.tenunImageUrl ||
    obj.pemakaianImageUrl ||
    obj.imageUrl ||
    obj.imageURL ||
    obj.image ||
    obj.photo ||
    obj.gambar ||
    obj.thumbnail ||
    obj.cover ||
    obj.img ||
    null;
  if (!cand) return null;
  const s = String(cand).trim();
  return /^https?:\/\//i.test(s) ? s : `${API}${s.startsWith("/") ? s : `/${s}`}`;
};

const PROV_DEFAULT_IMG = {
  "Daerah Istimewa Yogyakarta": "/public/images/tenun/tenun-yogya.jpg",
  "Nanggroe Aceh Darussalam": "/public/images/tenun/tenun-aceh.jpg",
  "Sumatra Utara": "/public/images/tenun/tenun-sumut.jpg",
  "Sumatra Selatan": "/public/images/tenun/tenun-sumsel.jpg",
  Papua: "/public/images/tenun/tenun-papua.jpg",
};

const provincesCache = { loaded: false, byKey: new Map() };

async function loadProvinces() {
  if (provincesCache.loaded) return provincesCache;
  try {
    const res = await fetch(`${API}/api/provinces`);
    const arr = parseArray(await res.json());
    provincesCache.byKey.clear();
    for (const p of arr) {
      const name = p?.name || p?.nama || p?.title || "";
      provincesCache.byKey.set(keyfy(name), { ...p, name });
    }
  } finally {
    provincesCache.loaded = true;
  }
  return provincesCache;
}

async function fetchTenunForProvince(provinceName) {
  const qName = normalizeProvinceForApi(provinceName);
  await loadProvinces();
  const meta = provincesCache.byKey.get(keyfy(qName));
  const id = meta?.id ?? null;

  const tries = [
    `${API}/api/tenun?province=${encodeURIComponent(qName)}`,
    `${API}/api/tenun?provinceName=${encodeURIComponent(qName)}`,
    `${API}/api/tenun?province=${encodeURIComponent(qName.toUpperCase())}`,
  ];
  if (id != null) {
    tries.push(
      `${API}/api/tenun?province=${encodeURIComponent(id)}`,
      `${API}/api/tenun?provinceId=${encodeURIComponent(id)}`,
      `${API}/api/tenun?province_id=${encodeURIComponent(id)}`
    );
  }

  for (const url of tries) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const arr = parseArray(await res.json());
      if (arr.length) return arr;
    } catch {}
  }
  return [];
}

async function fetchAllTenunAndFilter(name) {
  const key = toKey(name);
  try {
    const res = await fetch(`${API}/api/tenun`);
    if (!res.ok) return [];
    const all = parseArray(await res.json());
    if (!all?.length) return [];
    return all.filter(
      (it) =>
        toKey(it?.province?.name || it?.provinceName || it?.provinsi || "") ===
        key
    );
  } catch {
    return [];
  }
}


function Explore() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [items, setItems] = useState([]);

  const [hovered, setHovered] = useState(null);
  const [hoverCard, setHoverCard] = useState({ img: null });
  const previewCache = useRef(new Map());
  const fetchTimer = useRef(null);
  const previewRef = useRef(null);

  const isTouch = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  }, []);

  useEffect(() => {
    if (isTouch) return;
    let raf;
    const CARD_W = 420;
    const CARD_H = 240;
    const GAP = 12;

    const move = (e) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = e.clientX + GAP;
      let y = e.clientY + GAP;

      if (x + CARD_W + GAP > vw) x = vw - CARD_W - GAP;
      if (y + CARD_H + GAP > vh) y = vh - CARD_H - GAP;
      if (x < GAP) x = GAP;
      if (y < GAP) y = GAP;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (previewRef.current) {
          previewRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }
      });
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  useEffect(() => {
    if (isTouch) return;
    if (!hovered) {
      setHoverCard({ img: null });
      return;
    }
    const qProv = normalizeProvinceForApi(hovered);
    if (previewCache.current.has(qProv)) {
      setHoverCard(previewCache.current.get(qProv));
      return;
    }
    clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(async () => {
      try {
        await loadProvinces();
        const meta = provincesCache.byKey.get(keyfy(qProv));
        const provId = meta?.id ?? null;

        const arr = await fetchTenunForProvince(qProv);

        let subset = arr.filter(
          (it) =>
            normalizeProvinceForApi(
              it?.province?.name || it?.provinceName || it?.provinsi || ""
            ) === qProv
        );
        if (!subset.length && provId != null) {
          subset = arr.filter((it) => {
            const idIn = it?.provinceId ?? it?.province_id ?? it?.provinceID ?? null;
            return String(idIn ?? "") === String(provId);
          });
        }

        const itemWithImg = subset.find((d) => pickImageUrl(d)) || null;
        const fallback = PROV_DEFAULT_IMG[qProv]
          ? `${API}${PROV_DEFAULT_IMG[qProv]}`
          : null;

        const card = { img: itemWithImg ? pickImageUrl(itemWithImg) : fallback };
        previewCache.current.set(qProv, card);
        setHoverCard(card);
      } catch {
        setHoverCard({ img: null });
      }
    }, 140);

    return () => clearTimeout(fetchTimer.current);
  }, [hovered, isTouch]);

  useEffect(() => {
    if (showDetail) {
      scroller.scrollTo("penjelasan", {
        duration: 600,
        smooth: "easeOutCubic",
        offset: -72,
      });
    }
  }, [showDetail]);

  const handleSelect = async (province, listFromChild) => {
    const rawProv = province;
    const qProv = normalizeProvinceForApi(rawProv);

    let list = listFromChild;
    if (!Array.isArray(list) || list.length === 0) {
      try {
        list = await fetchTenunForProvince(rawProv);
        if (!list?.length) list = await fetchTenunForProvince(qProv);
        if (!list?.length) list = await fetchAllTenunAndFilter(rawProv);
      } catch {
        list = await fetchAllTenunAndFilter(rawProv);
      }
    }

    setSelectedProvince(qProv);
    setItems(Array.isArray(list) ? list : []);
    setShowDetail(true);
  };

  return (
    <main className="bg-white">
      <section className="relative">
        <img
          src={Exp}
          alt="hero explore"
          className="w-full h-[60vh] md:h-[70vh] lg:h-screen object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-playfair font-bold text-[#F6D69B] text-4xl leading-tight max-w-[20ch] md:text-5xl lg:text-7xl">
            Tenun Across the Archipelago
          </h1>
          <p className="text-white/95 text-sm md:text-lg font-poppins mt-3 max-w-[30ch] md:max-w-[44ch]">
            From Sabang to Merauke, each region weaves its own story
          </p>
        </div>
      </section>

      <section
        id="map"
        className="bg-[#2A3E3F] relative flex justify-center items-center py-8 sm:py-10"
      >

        <div className="w-full max-w-6xl px-3 sm:px-6">
          {/* tinggi adaptif per breakpoint */}
          <div className="w-full h-[320px] sm:h-[420px] md:h-[520px]">
            <IndonesiaMap
              onSelect={handleSelect}
              onHover={(prov) => !isTouch && setHovered(prov)}
              onLeave={() => !isTouch && setHovered(null)}
            />
          </div>
        </div>


        {!isTouch && hovered && (
          <div
            ref={previewRef}
            className="pointer-events-none fixed left-0 top-0 z-30 w-[420px] max-w-[84vw] rounded-lg bg-white/95 shadow-[0_12px_28px_rgba(0,0,0,0.28)] border border-white/70 overflow-hidden will-change-transform"
            style={{ transform: "translate(-9999px, -9999px)" }}
          >
            <div className="absolute left-3 top-3 px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-black/60 backdrop-blur-sm">
              {displayProvince(hovered).toUpperCase()}
            </div>
            <div
              className="w-full h-[240px] bg-center bg-cover"
              style={{
                backgroundImage: `url('${hoverCard.img || PLACEHOLDER}')`,
              }}
            />
          </div>
        )}
      </section>


      {showDetail && (
        <section className="px-4 md:px-8 lg:px-10">
          <Penjelasan province={selectedProvince} items={items} />
        </section>
      )}
    </main>
  );
}

export default Explore;
