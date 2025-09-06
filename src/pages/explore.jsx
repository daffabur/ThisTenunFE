import { useState, useRef, useEffect } from "react";
import Exp from "../assets/heroExp.svg";
import IndonesiaMap from "../component/IndonesiaMap";
import Penjelasan from "../component/penjelasan";
import { scroller } from "react-scroll";

const API = "https://thistenunbetest-production.up.railway.app";
const PLACEHOLDER = "https://via.placeholder.com/420x240?text=No+Image";

/* ---------- Helpers (nama kanonis & alias) ---------- */
const CANON = {
  // Aceh & DIY
  "aceh": "Nanggroe Aceh Darussalam",
  "nad": "Nanggroe Aceh Darussalam",
  "di aceh": "Nanggroe Aceh Darussalam",
  "nanggroe aceh darussalam": "Nanggroe Aceh Darussalam",

  "diy": "Daerah Istimewa Yogyakarta",
  "yogyakarta": "Daerah Istimewa Yogyakarta",
  "daerah istimewa yogyakarta": "Daerah Istimewa Yogyakarta",

  // Sumatra (BE kamu pakai “Sumatra …”)
  "sumatera utara": "Sumatra Utara",
  "sumut": "Sumatra Utara",
  "sumatera selatan": "Sumatra Selatan",
  "sumsel": "Sumatra Selatan",
  "sumatera barat": "Sumatra Barat",
  "sumbar": "Sumatra Barat",

  // Lain-lain umum
  "banten": "Banten",
  "probanten": "Banten",
  "babel": "Bangka Belitung",
  "bangka belitung": "Bangka Belitung",
  "kepri": "Kepulauan Riau",
  "kepulauan riau": "Kepulauan Riau",

  "ntb": "Nusa Tenggara Barat",
  "nusa tenggara barat": "Nusa Tenggara Barat",
  "ntt": "Nusa Tenggara Timur",
  "nusa tenggara timur": "Nusa Tenggara Timur",

  // Kalimantan
  "kalbar": "Kalimantan Barat",
  "kaltim": "Kalimantan Timur",
  "kalteng": "Kalimantan Tengah",
  "kalsel": "Kalimantan Selatan",
  "kaltara": "Kalimantan Utara",

  // Sulawesi
  "sulbar": "Sulawesi Barat",
  "sulsel": "Sulawesi Selatan",
  "sulteng": "Sulawesi Tengah",
  "sultra": "Sulawesi Tenggara",
  "sulut": "Sulawesi Utara",

  // Maluku & Papua
  "malut": "Maluku Utara",
  "maluku utara": "Maluku Utara",
  "maluku": "Maluku",

  // ===== Papua (samakan semua ke “Papua” untuk satu konten) =====
  "papua": "Papua",
  "papua barat": "Papua",
  "papua tengah": "Papua",
  "papua selatan": "Papua",
  "papua pegunungan": "Papua",
  "papua barat daya": "Papua",
  "irian jaya": "Papua",
  "irian jaya barat": "Papua",
  "irian jaya tengah": "Papua",
  "irian jaya timur": "Papua",

  // Jawa
  "dki": "DKI Jakarta",
  "jakarta": "DKI Jakarta",
  "jabar": "Jawa Barat",
  "jawa barat": "Jawa Barat",
  "jateng": "Jawa Tengah",
  "jawa tengah": "Jawa Tengah",
  "jatim": "Jawa Timur",
  "jawa timur": "Jawa Timur",
};

// ⬇️ Buang SEMUA tanda baca ke spasi, lalu trim (fix "DI. ACEH")
const toKey = (s = "") => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const keyfy = (s = "") => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "");
const parseArray = (data) =>
  Array.isArray(data) ? data :
  Array.isArray(data?.data) ? data.data :
  Array.isArray(data?.items) ? data.items :
  Array.isArray(data?.rows) ? data.rows : [];

/** Kembalikan nama KANONIS (persis seperti di /api/provinces) */
function normalizeProvinceForApi(name = "") {
  let k = toKey(name);
  if (CANON[k]) return CANON[k];

  let k2 = k.replace(/^(pro|prov|propinsi)\s+/, "");
  if (CANON[k2]) return CANON[k2];

  let k3 = k2.replace(/^sumatera\s+/, "sumatra ");
  if (CANON[k3]) return CANON[k3];

  if (provincesCache.loaded) {
    if (provincesCache.byKey.has(k))  return provincesCache.byKey.get(k).name;
    if (provincesCache.byKey.has(k2)) return provincesCache.byKey.get(k2).name;
    if (provincesCache.byKey.has(k3)) return provincesCache.byKey.get(k3).name;
  }
  return name;
}

/** Nama untuk badge (boleh dipendekkan) */
function displayProvince(name = "") {
  const k = toKey(name);
  if (k === "probanten") return "Banten";
  if (["diy","yogyakarta","daerah istimewa yogyakarta"].includes(k)) return "DI Yogyakarta";
  if (["aceh","nad","di aceh","nanggroe aceh darussalam"].includes(k)) return "Aceh";
  const canon = normalizeProvinceForApi(name);
  return name || canon;
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

/* ---- Fallback gambar per-provinsi (kalau record BE tak punya gambar) ---- */
const PROV_DEFAULT_IMG = {
  "Daerah Istimewa Yogyakarta": "/public/images/tenun/tenun-yogya.jpg",
  "Nanggroe Aceh Darussalam": "/public/images/tenun/tenun-aceh.jpg",
  "Sumatra Utara": "/public/images/tenun/tenun-sumut.jpg",
  "Sumatra Selatan": "/public/images/tenun/tenun-sumsel.jpg",
  "Papua": "/public/images/tenun/tenun-papua.jpg",
};

/* ---------- Cache provinsi ---------- */
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

/* ---------- Fetch tenun per provinsi (nama/id fleksibel) ---------- */
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

/* ---------- Fallback terakhir: tarik semua & filter client-side ---------- */
async function fetchAllTenunAndFilter(name) {
  const key = toKey(name);
  try {
    const res = await fetch(`${API}/api/tenun`);
    if (!res.ok) return [];
    const all = parseArray(await res.json());
    if (!all?.length) return [];
    return all.filter((it) => toKey(it?.province?.name || it?.provinceName || it?.provinsi || "") === key);
  } catch {
    return [];
  }
}

/* ===================== PAGE ===================== */
function Explore() {
  const [showDetail, setShowDetail] = useState(false);
  const detailRef = useRef(null);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [items, setItems] = useState([]);

  // Hover preview (ikut kursor)
  const [hovered, setHovered] = useState(null);
  const [hoverCard, setHoverCard] = useState({ img: null });
  const previewCache = useRef(new Map());
  const fetchTimer = useRef(null);

  // refs untuk gerak kartu tanpa re-render
  const previewRef = useRef(null);

  // ukuran kartu utk clamp
  const CARD_W = 420; // sinkron dgn w-[420px]
  const CARD_H = 240; // sinkron dgn h-[240px]
  const GAP = 12;

  // gerakkan kartu mengikuti kursor, clamp biar nggak keluar layar
  useEffect(() => {
    let raf;
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
  }, []);

  // ambil gambar preview (debounce + cache)
  useEffect(() => {
    if (!hovered) { setHoverCard({ img: null }); return; }

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

        // prioritaskan item yang match nama/id provinsi
        let subset = arr.filter(
          (it) =>
            normalizeProvinceForApi(
              it?.province?.name || it?.provinceName || it?.provinsi || ""
            ) === qProv
        );
        if (!subset.length && provId != null) {
          subset = arr.filter((it) => {
            const idIn =
              it?.provinceId ?? it?.province_id ?? it?.provinceID ?? null;
            return String(idIn ?? "") === String(provId);
          });
        }

        // ⬇️ hanya pakai item yang benar2 milik provinsi tsb
        const itemWithImg = subset.find((d) => pickImageUrl(d)) || null;

        // fallback per-provinsi kalau tidak ada gambar di data BE
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
  }, [hovered]);

  // scroll saat detail
  useEffect(() => {
    if (showDetail) {
      scroller.scrollTo("penjelasan", {
        duration: 2000,
        delay: 0,
        smooth: "easeOutCubic",
        offset: -80,
      });
    }
  }, [showDetail]);

  const handleSelect = async (province, listFromChild) => {
    const rawProv = province;
    const qProv = normalizeProvinceForApi(rawProv);

    let list = listFromChild;

    // ⬇️ PERBAIKAN UTAMA: kalau [] juga kita anggap "belum ada" → fetch dari BE
    if (!Array.isArray(list) || list.length === 0) {
      try {
        // coba pakai label mentah dulu
        list = await fetchTenunForProvince(rawProv);
        // kalau kosong, pakai kanonis
        if (!list?.length) list = await fetchTenunForProvince(qProv);
        // fallback terakhir: tarik semuanya lalu filter
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
    <>
      <div id="hero" className="relative">
        <img src={Exp} alt="hero explore" className="w-screen h-screen object-cover" />
        <div className="flex flex-col justify-center items-center absolute inset-0">
          <h1 className="font-playfair font-bold text-[#F6D69B] text-7xl text-center w-140 leading-20">
            Tenun Across the Archipelago
          </h1>
          <p className="text-white text-2xl text-light font-poppins text-center w-115 mt-5">
            From Sabang to Merauke, each region weaves its own story
          </p>
        </div>
      </div>

      {/* MAP */}
      <div
        id="map"
        className="bg-[#2A3E3F] flex justify-center relative min-h-[520px] py-10"
      >
        <IndonesiaMap
          onSelect={handleSelect}
          onHover={(prov) => setHovered(prov)}
          onLeave={() => setHovered(null)}
        />

        {/* PREVIEW CARD: mengikuti pointer + label provinsi */}
        {hovered && (
          <div
            ref={previewRef}
            className="
              pointer-events-none fixed left-0 top-0 z-30
              w-[420px] max-w-[84vw] rounded-lg bg-white/95
              shadow-[0_12px_28px_rgba(0,0,0,0.28)] border border-white/70 overflow-hidden
              will-change-transform
            "
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
      </div>

      {/* DETAIL */}
      {showDetail && (
        <div ref={detailRef} className="px-4 md:px-8">
          <Penjelasan province={selectedProvince} items={items} />
        </div>
      )}
    </>
  );
}

export default Explore;
