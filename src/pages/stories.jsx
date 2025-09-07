import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://thistenunbetest-production.up.railway.app";
const ENDPOINT = `${API}/api/articles`;
const PLACEHOLDER =
  "https://via.placeholder.com/1200x800?text=This+Tenun+Article";

const absolutize = (url) => {
  if (!url) return null;
  const s = String(url).trim();
  return /^https?:\/\//i.test(s)
    ? s
    : `${API}${s.startsWith("/") ? s : `/${s}`}`;
};

const parseArray = (data) =>
  Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.items)
    ? data.items
    : [];

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function Stories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(ENDPOINT, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = parseArray(await res.json());

        const mapped = arr
          .map((it) => ({
            id: it.id ?? it.slug,
            slug: it.slug,
            title: it.title || "Untitled",
            summary: it.summary || it.content?.slice(0, 180) || "",
            image: absolutize(it.imageUrl) || PLACEHOLDER,
            date: it.publishedAt || it.createdAt || null,
          }))
          .sort((a, b) => {
            const da = new Date(a.date || 0).getTime();
            const db = new Date(b.date || 0).getTime();
            if (!Number.isNaN(db - da) && db !== da) return db - da;
            return (b.id ?? 0) - (a.id ?? 0);
          });

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

  const hero = useMemo(() => items[0] || null, [items]);
  const list = useMemo(() => (items.length > 1 ? items.slice(1) : []), [items]);

  const skeletonCards = new Array(8).fill(0);

  return (
    <div className="min-h-screen bg-[#402923]">
      <div className="max-w-7xl mx-auto px-4 pt-24 sm:pt-28 md:pt-32 lg:pt-40">
        <article className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
          <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] bg-[#261814]">
            {loading ? (
              <div className="absolute inset-0 w-full h-full animate-pulse bg-white/10" />
            ) : (
              <>
                <img
                  src={hero?.image || PLACEHOLDER}
                  alt={hero?.title || "Article"}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
            {loading ? (
              <div className="space-y-3">
                <div className="h-3 w-32 bg-white/30 rounded-md" />
                <div className="h-8 w-3/4 bg-white/40 rounded-md" />
                <div className="h-4 w-2/3 bg-white/30 rounded-md" />
              </div>
            ) : hero ? (
              <>
                <p className="text-white/80 text-xs sm:text-sm md:text-base mb-1">
                  {formatDate(hero.date)}
                </p>
                <h1 className="font-playfair text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] leading-snug">
                  <a href={`/stories/${hero.slug}`}>{hero.title}</a>
                </h1>
                {hero.summary && (
                  <p className="mt-2 max-w-2xl text-white/90 text-sm sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {hero.summary}
                  </p>
                )}
              </>
            ) : (
              <p className="text-white/80">Belum ada artikel.</p>
            )}
          </div>
        </article>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16 sm:pb-20">
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {(loading ? skeletonCards : list).map((p, i) =>
            loading ? (
              <div
                key={i}
                className="flex gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"
              >
                <div className="w-28 h-24 sm:w-36 sm:h-28 rounded-lg bg-white/20 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-white/20 animate-pulse rounded" />
                  <div className="h-4 w-4/5 bg-white/30 animate-pulse rounded" />
                  <div className="h-3 w-3/4 bg-white/20 animate-pulse rounded" />
                </div>
              </div>
            ) : (
              <article
                key={p.id}
                className="flex gap-3 sm:gap-4 rounded-2xl bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] ring-1 ring-black/5 hover:translate-y-[-2px] transition"
              >
                <a href={`/stories/${p.slug}`} className="shrink-0">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-24 h-20 sm:w-28 sm:h-24 rounded-lg object-cover bg-white/50"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                </a>
                <div className="min-w-0">
                  <p className="text-[12px] sm:text-[13px] text-[#3b241f]/80">
                    {formatDate(p.date)}
                  </p>
                  <h3 className="mt-1 font-poppins font-semibold text-[#1d1d1f] leading-snug sm:leading-6 text-sm sm:text-base">
                    <a
                      href={`/stories/${p.slug}`}
                      className="hover:underline decoration-2 underline-offset-2"
                    >
                      {p.title}
                    </a>
                  </h3>
                  {p.summary && (
                    <p className="mt-1 text-xs sm:text-sm text-[#2b2b2b]/80 line-clamp-2 sm:line-clamp-3">
                      {p.summary}
                    </p>
                  )}
                </div>
              </article>
            )
          )}
        </div>

        {err && (
          <div className="text-center text-red-200 bg-red-900/20 border border-red-400/30 rounded-xl py-3 mt-4">
            Gagal memuat stories. {err}
          </div>
        )}
      </div>
    </div>
  );
}
