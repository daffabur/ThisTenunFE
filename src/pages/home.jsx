import React, { useEffect, useMemo, useState } from "react";
import Masonry from "react-masonry-css";

import Hero from "../assets/hero.svg";
import figure1 from "../assets/1.svg";
import Ulos from "../assets/ulos.svg";
import Arrow from "../assets/arrow.svg";
import Gal from "../assets/Gallery.svg"; // fallback untuk inspo
import artic from "../assets/article.svg";

// dua Link berbeda: scroll & router (pakai alias supaya tidak bentrok)
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";

/* ==== konfigurasi fetch API ==== */
const API = "https://thistenunbetest-production.up.railway.app";
const ENDPOINT_ARTICLES = `${API}/api/articles`;
const ENDPOINT_TENUN = `${API}/api/tenun`;
const ENDPOINT_INSPO = `${API}/api/inspo`;
const PLACEHOLDER =
  "https://via.placeholder.com/1200x800?text=This+Tenun+Article";

/* berapa banyak inspo yang ditampilkan */
const INSPO_TAKE = 9;

/* ===== helpers ===== */
const absolutize = (url) => {
  if (!url) return null;
  const s = String(url).trim();
  return /^https?:\/\//i.test(s) ? s : `${API}${s.startsWith("/") ? s : `/${s}`}`;
};

const normalizeImage = (url) => {
  if (!url) return null;
  let s = String(url).trim().replace(/\\/g, "/");
  if (!/^https?:\/\//i.test(s)) s = `${API}${s.startsWith("/") ? s : `/${s}`}`;
  s = s.replace(/([^:]\/)\/+/g, "$1");
  try {
    const u = new URL(s);
    u.pathname = u.pathname
      .split("/")
      .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
      .join("/");
    return u.toString();
  } catch {
    return s;
  }
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

function Home() {
  // ===== STORIES (section paling bawah) =====
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [errStories, setErrStories] = useState(null);

  // ===== TENUN (Explore) =====
  const [tenunList, setTenunList] = useState([]);
  const [loadingTenun, setLoadingTenun] = useState(true);
  const [errTenun, setErrTenun] = useState(null);

  // ===== INSPO (Lookbook masonry) =====
  const [inspoList, setInspoList] = useState([]);
  const [loadingInspo, setLoadingInspo] = useState(true);
  const [errInspo, setErrInspo] = useState(null);

  /* ---------- Fetch STORIES ---------- */
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoadingStories(true);
        const res = await fetch(ENDPOINT_ARTICLES, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = parseArray(await res.json());

        const mapped = arr
          .map((it) => ({
            id: it.id ?? it.slug ?? Math.random().toString(36).slice(2),
            slug: it.slug ?? "",
            title: it.title || "Untitled",
            summary:
              it.summary || (it.content ? String(it.content).slice(0, 160) : ""),
            image: normalizeImage(it.imageUrl) || PLACEHOLDER,
            date: it.publishedAt || it.createdAt || null,
          }))
          .sort((a, b) => {
            const da = new Date(a.date || 0).getTime();
            const db = new Date(b.date || 0).getTime();
            if (!Number.isNaN(db - da) && db !== da) return db - da;
            return (b.id ?? 0) - (a.id ?? 0);
          });

        setStories(mapped);
        setErrStories(null);
      } catch (e) {
        if (e.name !== "AbortError") setErrStories(e.message || "Gagal memuat.");
        setStories([]);
      } finally {
        setLoadingStories(false);
      }
    })();
    return () => ac.abort();
  }, []);

  /* ---------- Fetch TENUN (Explore) ---------- */
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoadingTenun(true);
        const res = await fetch(ENDPOINT_TENUN, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const arr = parseArray(raw);

        const mapped = arr.slice(0, 3).map((it, idx) => ({
          id: it.id ?? idx,
          name: it.jenisTenun || "Tenun",
          region:
            (it.province && (it.province.name || it.province.nama || it.province)) ||
            "-",
          image:
            normalizeImage(it.tenunImageUrl) ||
            normalizeImage(it.imageUrl) ||
            PLACEHOLDER,
        }));

        setTenunList(mapped);
        setErrTenun(null);
      } catch (e) {
        if (e.name !== "AbortError")
          setErrTenun(e.message || "Gagal memuat data tenun.");
        setTenunList([]);
      } finally {
        setLoadingTenun(false);
      }
    })();
    return () => ac.abort();
  }, []);

  /* ---------- Fetch INSPO (Lookbook masonry) ---------- */
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoadingInspo(true);
        const res = await fetch(ENDPOINT_INSPO, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = parseArray(await res.json());

        const imgs = arr
          .map((it, idx) => {
            const candidate =
              it.inspoImageUrl ||
              it.imageUrl ||
              it.photoUrl ||
              it.image ||
              it.url;
            const image = normalizeImage(candidate);
            return image
              ? {
                  id: it.id ?? idx,
                  image,
                  title: it.title || it.caption || "Inspo",
                }
              : null;
          })
          .filter(Boolean);

        // acak dan ambil N
        const shuffled = imgs
          .map((x) => ({ x, r: Math.random() }))
          .sort((a, b) => a.r - b.r)
          .map((o) => o.x)
          .slice(0, INSPO_TAKE);

        setInspoList(shuffled);
        setErrInspo(null);
      } catch (e) {
        if (e.name !== "AbortError")
          setErrInspo(e.message || "Gagal memuat inspirasi lookbook.");
        setInspoList([]);
      } finally {
        setLoadingInspo(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const hero = useMemo(() => (Array.isArray(stories) && stories[0]) || null, [stories]);
  const sideList = useMemo(
    () => (Array.isArray(stories) && stories.length > 1 ? stories.slice(1, 5) : []),
    [stories]
  );

  /* Masonry breakpoints */
  const masonryBreakpoints = {
    default: 3,
    1280: 3,
    1024: 3,
    900: 2,
    640: 1,
  };

  return (
    <div>
      {/* ===== HERO TOP ===== */}
      <div className="relative h-screen w-full">
        <img src={Hero} alt="Tenun hero" className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-7xl text-[#F6D69B] font-playfair font-bold w-200 text-center leading-21 ">
            Weaving Heritage Inspiring Style
          </h1>
          <p className="font-poppins mt-5 text-center w-110 leading-7 ">
            Tenun is more than fabric — it’s a legacy of stories, symbols, and
            traditions woven by the hands of Indonesia’s artisans
          </p>
          <ScrollLink
            to="2"
            smooth={true}
            duration={1200}
            offset={0}
            className="font-poppins text-[#3E0703] font-extrabold mt-5 bg-[#F6D69B] rounded-2xl px-5 py-1 hover:bg-[#fae3b8] cursor-pointer transition"
          >
            Discover more
          </ScrollLink>
        </div>
      </div>

      {/* ===== WHAT IS TENUN ===== */}
      <div id="2" className="bg-[#452C27] relative h-screen w-full flex flex-row gap-50 ">
        <div>
          <div className="ml-10">
            <h1 className="md:mx-20 mt-40 font-playfair font-bold md:text-5xl text-white inline-block border-2 border-[#F6D69B] rounded-full px-6 pt-2 pb-3">
              What is Tenun?
            </h1>
            <p className="text-white text-justify pl-25 mt-5 w-135 text-base font-poppins font-light ">
              Tenun is Indonesia’s handwoven textile art, created by intertwining
              threads on a loom. Each region across the archipelago has its own
              distinctive tenun, carrying unique motifs, colors, and stories that
              reflect local culture and identity.<br /> <br />
              More than just fabric, tenun is a heritage passed down through
              generations — once worn in rituals and ceremonies, now inspiring
              modern fashion and creative expression.
            </p>
          </div>

          <div className="ml-117">
            <RouterLink to="/about" className="border-1 border-[#F6D69B] rounded-full px-6 text-white ">
              Find Out
            </RouterLink>
          </div>
        </div>

        <div>
          <img src={figure1} alt="figure1" className="w-xs mt-20" />
        </div>
      </div>

      {/* ===== EXPLORE (dinamis dari API /api/tenun) ===== */}
      <div className="bg-[#2A3E3F] flex flex-col">
        <div className="mt-20 font-playfair font-bold text-white text-5xl leading-16 flex flex-col justify-center items-center">
          <h1 className="border-2 border-[#F6D69B] rounded-full px-8 pb-1">Explore Tenun</h1>
          <h1>Across Indonesia</h1>
        </div>

        <div className="flex flex-row justify-center gap-10">
          {loadingTenun ? (
            // Skeletons untuk 3 kartu
            new Array(3).fill(0).map((_, i) => (
              <div key={i} className="w-40 h-56 bg-black/20 rounded-lg mt-15 animate-pulse" />
            ))
          ) : errTenun ? (
            <p className="text-white mt-16">{errTenun}</p>
          ) : (
            tenunList.map((t) => (
              <div key={t.id} className="relative">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-40 h-56 mt-15 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER;
                  }}
                />
                <p className="absolute bottom-8 left-2 font-playfair text-white text-sm font-bold">
                  {t.name}
                </p>
                <p className="absolute bottom-2 left-2 font-poppins text-white text-xs">
                  {t.region}
                </p>
              </div>
            ))
          )}

          {/* Card terakhir: See All */}
          <div className="relative transform transition duration-300 hover:-translate-y-2 hover:shadow-lg">
            <RouterLink to="/explore">
              <img src={Ulos} alt="See all" className="w-40 mt-15 rounded-lg object-cover" />
              <img src={Arrow} alt="arrow" className="w-5 mt-17 absolute inset-0 ml-33" />
              <p className="absolute inset-0 flex items-center justify-center text-center px-10 mt-15 leading-6 font-poppins text-white text-lg">
                See All Regions
              </p>
            </RouterLink>
          </div>
        </div>

        <div className="flex justify-center mt-20 mb-20">
          <p className="font-poppins font-light text-center text-white w-130">
            Every region has its own threads of story. Discover the beauty, meaning, and craft behind Indonesia’s
            handwoven textiles
          </p>
        </div>
      </div>

      {/* ===== LOOKBOOK: Discover Your Outfit (masonry dari /api/inspo) ===== */}
      <div className="flex flex-col bg-[#452C27]">
        <div className="mt-20 mb-6 flex justify-center items-center gap-3 relative">
          <h1 className="font-playfair text-white font-bold text-5xl text-center leading-tight">
            Discover Your <br className="sm:hidden" />
            <span className="inline-flex items-center gap-2">Outfit With Tenun</span>
          </h1>
          <RouterLink to="/lookbook" className="ml-2 hover:scale-110 transition-transform" aria-label="Go to Lookbook">
            <img src={Arrow} alt="" className="w-8 inline-block align-middle" />
          </RouterLink>
        </div>

        <div className="flex justify-center px-6 pb-20">
          {loadingInspo ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
              {new Array(INSPO_TAKE).fill(0).map((_, i) => (
                <div key={i} className="w-full h-72 bg-black/20 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : errInspo ? (
            <div className="text-white">{errInspo}</div>
          ) : inspoList.length ? (
            <Masonry
              breakpointCols={masonryBreakpoints}
              className="flex gap-6 w-full max-w-5xl"
              columnClassName="flex flex-col gap-6"
            >
              {inspoList.map((p) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={p.title}
                  className="w-full rounded-2xl object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = Gal; // fallback lokal
                  }}
                />
              ))}
            </Masonry>
          ) : (
            <img src={Gal} alt="Lookbook" className="w-2xl mt-2 rounded-2xl" />
          )}
        </div>
      </div>

      {/* ===== THREADS OF STORIES (dinamis dari API) ===== */}
      <div className="bg-[#2A3E3F] flex flex-col">
        <div className="flex flex-row">
          <div className="ml-10 mt-9 bg-white w-1 h-22"></div>
          <h1 className="font-playfair font-bold text-white mt-10 ml-5 mb-20 text-4xl w-50">
            Threads <br /> Of Strories
          </h1>
        </div>

        <div className="flex flex-row mb-20 gap-10 justify-center">
          {/* kiri: hero card */}
          <div className="flex flex-col bg-white rounded-2xl mb-10 max-w-[700px] w-full">
            <div className="px-5 pt-5">
              {loadingStories ? (
                <div className="w-full h-[360px] rounded-xl bg-black/10 animate-pulse" />
              ) : hero ? (
                <RouterLink to={`/stories/${encodeURIComponent(hero.slug || "")}`}>
                  <img
                    src={hero.image || artic}
                    alt={hero.title}
                    className="w-full rounded-xl"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                </RouterLink>
              ) : (
                <img src={artic} alt="placeholder" className="w-full rounded-xl" />
              )}
            </div>

            <div className="px-5 pb-6 pt-4">
              {errStories && (
                <p className="text-red-700 bg-red-100/70 rounded-lg px-3 py-2 mb-2">
                  Gagal memuat stories: {errStories}
                </p>
              )}

              {loadingStories ? (
                <>
                  <div className="h-6 w-40 bg-black/10 rounded-md mb-2" />
                  <div className="h-7 w-5/6 bg-black/10 rounded-md mb-2" />
                  <div className="h-4 w-3/4 bg-black/10 rounded-md" />
                </>
              ) : hero ? (
                <>
                  <p className="text-xs text-black/60 mb-1">{formatDate(hero.date)}</p>
                  <RouterLink to={`/stories/${encodeURIComponent(hero.slug || "")}`}>
                    <h2 className="ml-0 font-poppins font-bold text-xl text-black hover:underline">
                      {hero.title}
                    </h2>
                  </RouterLink>
                  {hero.summary && (
                    <p className="ml-0 mt-2 font-poppins text-sm text-black/80">{hero.summary}</p>
                  )}
                </>
              ) : (
                <p className="ml-0 text-black/70">Belum ada artikel.</p>
              )}
            </div>
          </div>

          {/* kanan: list + See All di dalam kotak */}
          <div className="relative bg-white mb-10 rounded-2xl flex justify-center max-w-[700px] w-full">
            <div className="absolute right-6 top-4">
              <RouterLink to="/stories" className="underline font-poppins hover:opacity-80">
                See All
              </RouterLink>
            </div>

            <div className="flex flex-col gap-5 mt-18 py-8 px-10 w-full">
              {(loadingStories ? new Array(4).fill(0) : sideList).map((p, idx) =>
                loadingStories ? (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-35 h-20 rounded-lg bg-black/10 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-3 w-28 bg-black/10 rounded mb-2" />
                      <div className="h-4 w-3/4 bg-black/10 rounded mb-1" />
                      <div className="h-4 w-2/3 bg-black/10 rounded" />
                    </div>
                  </div>
                ) : (
                  <RouterLink
                    key={p.id}
                    to={`/stories/${encodeURIComponent(p.slug || "")}`}
                    className="group"
                  >
                    <div className="flex flex-row items-center gap-4">
                      <img
                        src={p.image || artic}
                        alt={p.title}
                        className="w-35 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = PLACEHOLDER;
                        }}
                      />
                      <div className="flex flex-col">
                        <p className="text-poppins font-light text-xs text-black/60">
                          {formatDate(p.date)}
                        </p>
                        <h3 className="w-85 text-poppins font-semibold text-sm leading-5 text-black group-hover:underline">
                          {p.title}
                        </h3>
                      </div>
                    </div>
                  </RouterLink>
                )
              )}

              {!loadingStories && sideList.length === 0 && (
                <p className="text-black/70">Belum ada artikel lain.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
