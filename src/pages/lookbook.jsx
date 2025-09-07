import { useEffect, useState } from "react";

const API = "https://thistenunbetest-production.up.railway.app";
const PLACEHOLDER = "https://via.placeholder.com/600x800?text=This+Tenun";

/* Helpers */
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

function Lookbook() {
  return (
    <div className="bg-[#2A3E3F] min-h-screen">
      <header className="px-4 pt-20 pb-8 sm:pt-24 sm:pb-10">
        <h1 className="text-center text-white font-poppins leading-tight">
          <span className="block text-2xl sm:text-3xl md:text-4xl">
            Find Your Style on
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl mt-1">
            Lookbook by <span className="font-playfair">| This Tenun</span>
          </span>
        </h1>
      </header>
      <Gallery />
    </div>
  );
}

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
          id: it.id ?? it.slug ?? it.imageUrl,
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

  // Lock scroll saat modal buka
  useEffect(() => {
    document.body.style.overflow = modalIndex >= 0 ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [modalIndex]);

  // Escape untuk tutup modal
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

      {/* Masonry dengan CSS columns, responsif */}
      <div className="columns-1 xs:columns-2 sm:columns-3 xl:columns-4 gap-4 sm:gap-6 [column-fill:_balance]">
        {(loading ? skeletons : items).map((it, i) => (
          <figure
            key={loading ? i : it.id}
            className="mb-4 sm:mb-6 break-inside-avoid overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
            style={{ breakInside: "avoid" }}
          >
            {loading ? (
              <div className="h-[300px] sm:h-[360px] w-full animate-pulse bg-white/10" />
            ) : (
              <img
                src={it.url}
                alt={it.title || "Lookbook"}
                loading="lazy"
                decoding="async"
                className="block w-full h-auto cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                onClick={() => setModalIndex(i)}
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              />
            )}
          </figure>
        ))}
      </div>

      {/* ===== Modal (klik backdrop untuk tutup) ===== */}
      {modalIndex >= 0 && items[modalIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalIndex(-1);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-[92vw] sm:w-auto max-w-[94vw] sm:max-w-[85vw] max-h-[88vh] sm:max-h-[90vh]">
            <img
              src={items[modalIndex].url}
              alt={items[modalIndex].title || "Preview"}
              className="block w-full h-full object-contain rounded-xl"
            />

            {/* Tombol close besar (mudah di-tap) */}
            <button
              aria-label="Close"
              onClick={() => setModalIndex(-1)}
              className="absolute -top-3 -right-3 sm:top-2 sm:right-2 h-10 w-10 sm:h-9 sm:w-9 grid place-items-center rounded-full bg-white/90 hover:bg-white shadow text-black text-2xl leading-none"
            >
              ×
            </button>

            {/* Credit / Source (opsional) */}
            {(items[modalIndex].credit || items[modalIndex].sourceUrl) && (
              <figcaption className="absolute left-3 right-12 bottom-3 text-xs sm:text-sm text-white/90">
                {items[modalIndex].credit && (
                  <span className="bg-black/40 px-2 py-1 rounded">
                    {items[modalIndex].credit}
                  </span>
                )}
                {items[modalIndex].sourceUrl && (
                  <a
                    href={items[modalIndex].sourceUrl}
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

export default Lookbook;
