import { useEffect, useState, useCallback, useRef } from "react";

const API = "https://thistenunbetest-production.up.railway.app";
const PLACEHOLDER = "https://via.placeholder.com/600x800?text=This+Tenun";

const absolutize = (url) => {
  if (!url) return null;
  const s = String(url).trim();
  return /^https?:\/\//i.test(s) ? s : `${API}${s.startsWith("/") ? s : `/${s}`}`;
};
const parseArray = (data) =>
  Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.items)
    ? data.items
    : [];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [active, setActive] = useState(null);
  const hasItems = items && items.length > 0;

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/inspo`, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = parseArray(await res.json());

        const mapped = arr.map((it, idx) => ({
          id: it.id ?? it.slug ?? idx,
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

  useEffect(() => {
    if (active != null) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [active]);

  useEffect(() => {
    if (active == null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowLeft")
        setActive((i) => (i != null ? (i > 0 ? i - 1 : (items.length || 1) - 1) : null));
      if (e.key === "ArrowRight")
        setActive((i) => (i != null ? (i < (items.length || 1) - 1 ? i + 1 : 0) : null));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, items.length]);

  const startX = useRef(null);
  const onTouchStart = useCallback((e) => {
    startX.current = e.touches?.[0]?.clientX ?? null;
  }, []);
  const onTouchEnd = useCallback(
    (e) => {
      if (startX.current == null || active == null) return;
      const endX = e.changedTouches?.[0]?.clientX ?? startX.current;
      const dx = endX - startX.current;
      const THRESH = 40;
      if (dx > THRESH) {
        setActive((i) => (i > 0 ? i - 1 : items.length - 1));
      } else if (dx < -THRESH) {
        setActive((i) => (i < items.length - 1 ? i + 1 : 0));
      }
      startX.current = null;
    },
    [active, items.length]
  );

  const skeletons = new Array(10).fill(0);

  return (
    <section className="max-w-7xl mx-auto px-4 pb-20 sm:pb-24">
      {err && (
        <div className="mb-6 rounded-xl border border-red-400/30 bg-red-900/20 py-3 text-center text-red-200">
          Gagal memuat lookbook. {err}
        </div>
      )}

      <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-4 sm:gap-6 [column-fill:_balance]">
        {(loading ? skeletons : items).map((it, i) => (
          <figure
            key={loading ? i : it.id}
            className="mb-4 sm:mb-6 break-inside-avoid rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
            style={{ breakInside: "avoid" }}
          >
            {loading ? (
              <div className="h-[260px] sm:h-[320px] w-full animate-pulse bg-white/10" />
            ) : (
              <img
                src={it.url}
                alt={it.title}
                loading="lazy"
                decoding="async"
                className="block w-full h-auto cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
                onClick={() => setActive(i)}
              />
            )}
          </figure>
        ))}
      </div>

      {active != null && hasItems && items[active] && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-[92vw] sm:w-auto max-w-[94vw] sm:max-w-[88vw] max-h-[88vh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={items[active].url}
              alt={items[active].title}
              className="block w-full h-full object-contain rounded-xl shadow-2xl"
            />

            <button
              onClick={() => setActive(null)}
              className="absolute -top-3 -right-3 sm:top-2 sm:right-2 h-10 w-10 sm:h-9 sm:w-9 grid place-items-center rounded-full bg-white/90 hover:bg-white text-black text-2xl leading-none shadow"
              aria-label="Tutup"
              title="Tutup (Esc)"
            >
              ×
            </button>

            {items.length > 1 && (
              <>
                <button
                  onClick={() => setActive((i) => (i > 0 ? i - 1 : items.length - 1))}
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-white/90 hover:text-white bg-black/35 hover:bg-black/45"
                  aria-label="Sebelumnya"
                  title="Sebelumnya (←)"
                >
                  ‹
                </button>
                <button
                  onClick={() => setActive((i) => (i < items.length - 1 ? i + 1 : 0))}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-white/90 hover:text-white bg-black/35 hover:bg-black/45"
                  aria-label="Berikutnya"
                  title="Berikutnya (→)"
                >
                  ›
                </button>
              </>
            )}

            {(items[active].credit || items[active].sourceUrl) && (
              <figcaption className="absolute left-3 right-12 bottom-3 text-[11px] sm:text-xs text-white/90">
                {items[active].credit && (
                  <span className="bg-black/40 px-2 py-1 rounded">
                    {items[active].credit}
                  </span>
                )}
                {items[active].sourceUrl && (
                  <a
                    href={items[active].sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 underline hover:text-white"
                  >
                    Source
                  </a>
                )}
              </figcaption>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
