// src/component/penjelasan.jsx
import React from "react";

const API = "https://thistenunbetest-production.up.railway.app";
const PLACEHOLDER = "https://via.placeholder.com/800x480?text=No+Image";

/* ---------- helpers ---------- */
const absolutize = (url) => {
  if (!url) return null;
  const s = String(url).trim();
  return /^https?:\/\//i.test(s) ? s : `${API}${s.startsWith("/") ? s : `/${s}`}`;
};

const toKey = (s = "") => String(s).replace(/[_-]+/g, " ").trim().toLowerCase();


const CANON = {
  // Aceh & DIY
  "aceh": "nanggroe aceh darussalam",
  "nad": "nanggroe aceh darussalam",
  "di aceh": "nanggroe aceh darussalam",
  "nanggroe aceh darussalam": "nanggroe aceh darussalam",

  "diy": "daerah istimewa yogyakarta",
  "yogyakarta": "daerah istimewa yogyakarta",
  "daerah istimewa yogyakarta": "daerah istimewa yogyakarta",

  // Sumatra (BE kamu pakai “Sumatra …”)
  "sumatra utara": "sumatra utara",
  "sumatera utara": "sumatra utara",
  "sumut": "sumatra utara",

  "sumatra selatan": "sumatra selatan",
  "sumatera selatan": "sumatra selatan",
  "sumsel": "sumatra selatan",

  "sumatra barat": "sumatra barat",
  "sumatera barat": "sumatra barat",
  "sumbar": "sumatra barat",

  // Banten (label peta sempat “PROBANTEN”)
  "banten": "banten",
  "probanten": "banten",

  // lain-lain umum
  "babel": "bangka belitung",
  "bangka belitung": "bangka belitung",

  "kepri": "kepulauan riau",
  "kepulauan riau": "kepulauan riau",

  "ntb": "nusa tenggara barat",
  "nusa tenggara barat": "nusa tenggara barat",
  "ntt": "nusa tenggara timur",
  "nusa tenggara timur": "nusa tenggara timur",

  // Kalimantan (singkatan)
  "kalimantan barat": "kalimantan barat",
  "kalbar": "kalimantan barat",
  "kalimantan timur": "kalimantan timur",
  "kaltim": "kalimantan timur",
  "kalimantan tengah": "kalimantan tengah",
  "kalteng": "kalimantan tengah",
  "kalimantan selatan": "kalimantan selatan",
  "kalsel": "kalimantan selatan",
  "kalimantan utara": "kalimantan utara",
  "kaltara": "kalimantan utara",

  // Sulawesi
  "sulawesi barat": "sulawesi barat",
  "sulbar": "sulawesi barat",
  "sulawesi selatan": "sulawesi selatan",
  "sulsel": "sulawesi selatan",
  "sulawesi tengah": "sulawesi tengah",
  "sulteng": "sulawesi tengah",
  "sulawesi tenggara": "sulawesi tenggara",
  "sultra": "sulawesi tenggara",
  "sulawesi utara": "sulawesi utara",
  "sulut": "sulawesi utara",

  // Maluku & Papua
  "maluku": "maluku",
  "maluku utara": "maluku utara",
  "malut": "maluku utara",

  // satukan semua istilah “Papua* / Irian Jaya*” → “papua”
  "papua": "papua",
  "papua barat": "papua",
  "papua tengah": "papua",
  "papua selatan": "papua",
  "papua pegunungan": "papua",
  "papua barat daya": "papua",
  "irian jaya": "papua",
  "irian jaya barat": "papua",
  "irian jaya tengah": "papua",
  "irian jaya timur": "papua",

  // Jawa
  "dki": "dki jakarta",
  "jakarta": "dki jakarta",
  "dki jakarta": "dki jakarta",
  "jabar": "jawa barat",
  "jawa barat": "jawa barat",
  "jateng": "jawa tengah",
  "jawa tengah": "jawa tengah",
  "jatim": "jawa timur",
  "jawa timur": "jawa timur",
};

// normalisasi ke bentuk kunci pembanding
const norm = (s = "") => {
  const k = toKey(s);
  // ganti awalan "sumatera " -> "sumatra " bila belum masuk CANON
  const sfix = k.replace(/^sumatera\s+/, "sumatra ");
  return CANON[sfix] || CANON[k] || sfix;
};

function splitSection(text = "", label, nextLabels) {
  if (!text) return "";
  const re = new RegExp(`${label}\\s*:\\s*([\\s\\S]*?)(?=${nextLabels.join("|")}|$)`, "i");
  const m = text.match(re);
  return m ? m[1].trim() : "";
}

function parseDescription(desc = "") {
  const nextTokens = ["\\n\\s*Fakta\\s+Unik\\s*:", "\\n\\s*Kapan\\s+dipakai\\s*:"];
  const intro = desc.split(/\n\s*Motif\s*&\s*Ciri\s*Khas\s*:/i)[0]?.trim() || "";

  const motif = splitSection(desc, "Motif\\s*&\\s*Ciri\\s*Khas", nextTokens);
  const unik = splitSection(desc, "Fakta\\s+Unik", ["\\n\\s*Kapan\\s+dipakai\\s*:", "$"]);
  const kapan = splitSection(desc, "Kapan\\s+dipakai", ["$"]);

  const toBullets = (s) =>
    s
      .split(/\n+/)
      .map((v) => v.replace(/^\s*[-•]\s*/, "").trim())
      .filter(Boolean);

  return {
    intro,
    motifList: toBullets(motif),
    unikList: toBullets(unik),
    kapanList: toBullets(kapan),
  };
}

function Section({ title, bullets }) {
  if (!bullets?.length) return null;
  return (
    <div className="mt-10">
      <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-[#1E3A3A] text-center">
        {title}
      </h3>
      <ul className="mt-4 space-y-2 max-w-4xl mx-auto list-disc pl-6 text-[#233] leading-7">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- main component ---------- */
function Penjelasan({ province, items = [] }) {
  // Filter ulang supaya hanya item dari provinsi yang dipilih yang tampil
  const filtered = React.useMemo(() => {
    if (!Array.isArray(items) || !items.length) return [];
    const target = norm(province);
    const onlyThisProv = items.filter((it) => {
      const pName = it?.province?.name || it?.provinceName || it?.provinsi || "";
      return norm(pName) === target;
    });
    return onlyThisProv.length ? onlyThisProv : items;
  }, [items, province]);

  return (
    <div id="penjelasan" className="max-w-6xl mx-auto py-16">
      {filtered.length === 0 && (
        <p className="text-center text-[#335]">Belum ada data untuk provinsi ini.</p>
      )}

      {filtered.map((it, idx) => {
        const jenis = it?.jenisTenun || "Tenun";
        const provName = it?.province?.name || province || "";
        const hero =
          absolutize(it?.tenunImageUrl) ||
          absolutize(it?.imageUrl) ||
          PLACEHOLDER;
        const pemakaian = absolutize(it?.pemakaianImageUrl);

        const { intro, motifList, unikList, kapanList } = parseDescription(
          it?.description || ""
        );

        return (
          <article
            key={`${it?.id ?? idx}`}
            className={`mb-20 ${idx > 0 ? "pt-12 border-t border-black/10" : ""}`}
          >
            {/* Header */}
            <header className="text-center mb-8">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#123]">
                {jenis}
              </h2>
              <p className="text-[#2b4b4b] mt-1">{provName}</p>
            </header>

            {/* Images */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="rounded-xl overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                <img
                  src={hero}
                  alt={jenis}
                  className="w-full h-[320px] md:h-[420px] object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col gap-6">
                {intro && (
                  <p className="text-[#223] leading-7 bg-white/70 rounded-xl p-5 shadow-sm">
                    {intro}
                  </p>
                )}
                <div className="rounded-xl overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                  <img
                    src={pemakaian || PLACEHOLDER}
                    alt={`Pemakaian ${jenis}`}
                    className="w-full h-[220px] md:h-[260px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Sections */}
            <Section title="Motif & Ciri Khas" bullets={motifList} />
            <Section title="Fakta Unik" bullets={unikList} />
            <Section title="Kapan dipakai" bullets={kapanList} />
          </article>
        );
      })}
    </div>
  );
}

export default Penjelasan;
