import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const API = "https://thistenunbetest-production.up.railway.app";
const PLACEHOLDER =
  "https://via.placeholder.com/1200x800?text=This+Tenun+Article";

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

const parseObject = (data) =>
  data && typeof data === "object" && !Array.isArray(data) ? data : null;

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

/* ====== Page ====== */
export default function StoryDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const tryUrls = [
          `${API}/api/articles/${encodeURIComponent(slug)}`,
          `${API}/api/articles?slug=${encodeURIComponent(slug)}`,
          `${API}/api/articles`,
        ];

        let found = null;

        for (const url of tryUrls) {
          const res = await fetch(url, { signal: ac.signal });
          if (!res.ok) continue;

          const json = await res.json();

          const asObj = parseObject(json);
          if (asObj && (asObj.slug === slug || String(asObj.id) === slug)) {
            found = asObj;
            break;
          }

          const asArr = parseArray(json);
          if (asArr.length) {
            const bySlug =
              asArr.find((it) => (it?.slug || "").trim() === slug) || null;
            if (bySlug) {
              found = bySlug;
              break;
            }
          }
        }

        if (!found) throw new Error("Artikel tidak ditemukan.");
        setArticle(found);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Gagal memuat artikel.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [slug]);

  const view = useMemo(() => {
    if (!article) return null;
    return {
      id: article.id ?? article.slug,
      title: article.title || "Untitled",
      image: absolutize(article.imageUrl) || PLACEHOLDER,
      date: article.publishedAt || article.createdAt || null,
      summary: article.summary || "",
      content: article.content || "",
    };
  }, [article]);

  const paragraphs = useMemo(() => {
    if (!view?.content) return [];
    return String(view.content)
      .split(/\n{2,}/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [view]);

  return (
    <div className="min-h-screen bg-[#402923] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-28 md:pt-32 lg:pt-36 pb-24">
        {err && (
          <div className="mb-6 rounded-xl border border-red-400/30 bg-red-900/30 p-4">
            {err}
          </div>
        )}

        {loading && (
          <>
            <div className="h-6 w-40 bg-white/15 rounded mb-3 animate-pulse" />
            <div className="h-12 w-11/12 bg-white/20 rounded mb-6 animate-pulse" />
            <div className="w-full aspect-[16/9] bg-white/10 rounded-2xl animate-pulse" />
            <div className="mt-8 space-y-4">
              <div className="h-4 w-10/12 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-9/12 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-8/12 bg-white/10 rounded animate-pulse" />
            </div>
          </>
        )}

        {!loading && view && (
          <>
            <p className="text-white/80">{formatDate(view.date)}</p>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mt-2 leading-tight">
              {view.title}
            </h1>

            {/* Hero Image */}
            <div className="mt-6 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 bg-[#261814]">
              <img
                src={view.image}
                alt={view.title}
                className="w-full h-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
            </div>

            {/* Body */}
            <div className="mt-8 space-y-5 leading-relaxed text-white/90">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </>
        )}

        {!loading && !view && !err && (
          <p className="text-white/80">Artikel tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
}
