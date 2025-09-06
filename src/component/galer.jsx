// src/component/galer.jsx
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

/* component */
export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // lightbox state
  const [active, setActive] = useState(null); // index atau null

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
          title: it.title || "Inspiration",
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

  // keyboard nav utk lightbox
  useEffect(() => {
    if (active == null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowLeft") setActive((i) => (i > 0 ? i - 1 : items.length - 1));
      if (e.key === "ArrowRight") setActive((i) => (i < items.length - 1 ? i + 1 : 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, items.length]);

  const skeletons = new Array(12).fill(0);

  return (
    <section className="max-w-7xl mx-auto px-4 pb-24">
      {err && (
        <div className="mb-6 rounded-xl border border-red-400/30 bg-red-900/20 py-3 text-center text-red-200">
          Gagal memuat lookbook. {err}
        </div>
      )}

      {/* Masonry dengan CSS columns */}
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
                alt={it.title}
                loading="lazy"
                className="block w-full h-auto cursor-zoom-in"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                onClick={() => setActive(i)}
              />
            )}
            {/* Caption DIHILANGKAN */}
          </figure>
        ))}
      </div>

      {/* LIGHTBOX */}
      {active != null && items[active] && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={items[active].url}
              alt={items[active].title}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            {/* Close */}
            <button
              onClick={() => setActive(null)}
              className="absolute -top-10 right-0 md:-top-12 md:right-0 text-white/90 hover:text-white text-3xl"
              aria-label="Tutup"
              title="Tutup (Esc)"
            >
              ×
            </button>

            {/* Prev / Next */}
            <button
              onClick={() => setActive((i) => (i > 0 ? i - 1 : items.length - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/40"
              aria-label="Sebelumnya"
              title="Sebelumnya (←)"
            >
              ‹
            </button>
            <button
              onClick={() => setActive((i) => (i < items.length - 1 ? i + 1 : 0))}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/40"
              aria-label="Berikutnya"
              title="Berikutnya (→)"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
