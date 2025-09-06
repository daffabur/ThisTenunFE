import { useEffect, useState } from "react";

const API = "https://thistenunbetest-production.up.railway.app";
const PLACEHOLDER = "https://via.placeholder.com/600x800?text=This+Tenun";

/* helpers */
const absolutize = (url) => {
  if (!url) return null;
  const s = String(url).trim();
  return /^https?:\/\//i.test(s) ? s : `${API}${s.startsWith("/") ? s : `/${s}`}`;
};
const parseArray = (data) =>
  Array.isArray(data) ? data :
  Array.isArray(data?.data) ? data.data :
  Array.isArray(data?.items) ? data.items : [];

/* ---------- PAGE ---------- */
function Lookbook() {
  return (
    <div className="bg-[#2A3E3F] min-h-screen">
      <h1 className="text-center font-poppins text-4xl text-white pt-30 pb-10 leading-13">
        Find Your Style on <br /> Lookbook by <span className="font-playfair">| This Tenun</span>
      </h1>
      <Gallery />
    </div>
  );
}

/* ---------- GALLERY ---------- */
function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [modalIndex, setModalIndex] = useState(-1);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/inspo`, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = parseArray(await res.json());
        const mapped = arr.map((it) => ({
          id: it.id ?? it.slug,
          title: it.title || "",
          url: absolutize(it.imageUrl) || PLACEHOLDER,
          credit: it.credit || null,
          sourceUrl: it.sourceUrl || null,
        }));
        setItems(mapped);
        setErr(null);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Gagal memuat.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // Lock scroll saat modal terbuka
  useEffect(() => {
    if (modalIndex >= 0) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [modalIndex]);

  // Esc untuk close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setModalIndex(-1);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const skeletons = new Array(12).fill(0);

  return (
    <section className="max-w-7xl mx-auto px-4 pb-24">
      {err && (
        <div className="mb-6 rounded-xl border border-red-400/30 bg-red-900/20 py-3 text-center text-red-200">
          Gagal memuat lookbook. {err}
        </div>
      )}

      {/* Masonry columns */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-6 [column-fill:_balance]">
        {(loading ? skeletons : items).map((it, i) => (
          <figure
            key={loading ? i : it.id}
            className="mb-6 break-inside-avoid rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
            style={{ breakInside: "avoid" }}
          >
            {loading ? (
              <div className="h-[320px] w-full animate-pulse bg-white/10" />
            ) : (
              <img
                src={it.url}
                alt={it.title || "Lookbook"}
                loading="lazy"
                className="block w-full h-auto cursor-pointer"
                onClick={() => setModalIndex(i)}
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
            )}
            {/* Tidak ada caption/title agar “Inspo 1, dst” hilang */}
          </figure>
        ))}
      </div>

      {/* MODAL: tanpa panah, close di dalam foto */}
      {modalIndex >= 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalIndex(-1);
          }}
        >
          <div className="relative max-w-[75vw] max-h-[85vh]">
            <img
              src={items[modalIndex]?.url}
              alt=""
              className="block max-w-[75vw] max-h-[85vh] object-contain rounded-xl"
            />
            <button
              aria-label="Close"
              onClick={() => setModalIndex(-1)}
              className="absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full bg-white/85 hover:bg-white shadow text-black text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Lookbook;
