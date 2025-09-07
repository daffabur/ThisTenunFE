// src/component/penjelasan.jsx
import { scroller } from "react-scroll";
import React from "react";

const API = "https://thistenunbetest-production.up.railway.app";
const PLACEHOLDER = "https://via.placeholder.com/800x480?text=No+Image";

const absolutize = (url) => {
  if (!url) return null;
  const s = String(url).trim();
  return /^https?:\/\//i.test(s) ? s : `${API}${s.startsWith("/") ? s : `/${s}`}`;
};

const toKey = (s = "") => String(s).replace(/[_-]+/g, " ").trim().toLowerCase();


const CANON = {
  "aceh": "nanggroe aceh darussalam",
  "nad": "nanggroe aceh darussalam",
  "di aceh": "nanggroe aceh darussalam",
  "nanggroe aceh darussalam": "nanggroe aceh darussalam",

  "diy": "daerah istimewa yogyakarta",
  "yogyakarta": "daerah istimewa yogyakarta",
  "daerah istimewa yogyakarta": "daerah istimewa yogyakarta",

  "sumatra utara": "sumatra utara",
  "sumatera utara": "sumatra utara",
  "sumut": "sumatra utara",

  "sumatra selatan": "sumatra selatan",
  "sumatera selatan": "sumatra selatan",
  "sumsel": "sumatra selatan",

  "sumatra barat": "sumatra barat",
  "sumatera barat": "sumatra barat",
  "sumbar": "sumatra barat",

  "banten": "banten",
  "probanten": "banten",

  "babel": "bangka belitung",
  "bangka belitung": "bangka belitung",

  "kepri": "kepulauan riau",
  "kepulauan riau": "kepulauan riau",

  "ntb": "nusa tenggara barat",
  "nusa tenggara barat": "nusa tenggara barat",
  "ntt": "nusa tenggara timur",
  "nusa tenggara timur": "nusa tenggara timur",

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

  "maluku": "maluku",
  "maluku utara": "maluku utara",
  "malut": "maluku utara",

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

const norm = (s = "") => {
  const k = toKey(s);
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

    function WhenSection({ title, text }) {
      if (!text) return null;
      return (
        <div className="mt-10 flex flex-col justify-start items-start ">
          <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-[#1E3A3A] text-center mb-4">
            {title}
          </h3>
          <p className="max-w-4xl mx-auto text-[#233] leading-7 font-poppins">
            {text}
          </p>
        </div>
      );
    }

    function ThisSection({title, text}) {
      if (!text) return null;
      return (
        <div className="my-30">
          <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-[#1E3A3A] text-center mb-4">
            {title}
          </h3>
          <p className="max-w-4xl mx-auto text-[#233] leading-7 font-poppins text-center">
            {text}
          </p>
        </div>
      );
    }

function Penjelasan({ province, items = [] }) {
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
    <div id="penjelasan" className="max-w-7xl mx-auto py-26">
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
            <header className="text-center mt-20 mb-10">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#2b4b4b]">
                {jenis}
              </h2>
              <p className="text-[#2b4b4b] mt-1 font-poppins">{provName}</p>
            </header>

            <div className="grid md:grid-cols-1 gap-50 items-center mt-10">
              <div className="flex justify-center item-cente">
                {intro && (
                  <p className="text-[#2b4b4b] leading-7 bg-white/70 rounded-xl p-5 shadow-sm font-poppins text-center w-200">
                    {intro}
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <img
                  src={hero}
                  alt={jenis}
                  className="w-150 h-[320px] md:h-70 md:w-150 rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>

            <ThisSection title="Motif & Ciri Khas" text={motifList} />
            <ThisSection title="Fun Fact" text={unikList} />
            
            <div className="flex flex-row md:flex-row justify-center ml-15">
                <div className="w-100">
                  <WhenSection title="Kapan dipakai" text={kapanList} />
                </div>

                {/* Image */}
                <div className="md:w-1/2 flex justify-center">
                  <img
                    src={pemakaian || PLACEHOLDER}
                    alt={`Pemakaian ${jenis}`}
                    className="w-full max-w-[350px] md:max-w-[300px] h-auto rounded-xl shadow-lg"
                    loading="lazy"
                  />
                </div>
            </div>

          </article>
        );
      })}
    </div>
  );
}

export default Penjelasan;
