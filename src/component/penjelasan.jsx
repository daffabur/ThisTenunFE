import Penj from "../assets/contohPenj.svg";
import Models from "../assets/modle.svg";

function Penjelasan() {
  return (
    <>
    <div id="penjelasan" className="flex flex-col justify-center items-center mt-20">
        <h1 className="font-playfair text-4xl text-[#2A3E3F] font-semibold">
            Tenun Songket
        </h1>
        <p className="font-poppins text-[#2A3E3F]">
            Palembang - Sumatra
        </p>
        <p className="font-poppins text-[#2A3E3F] text-lg text-center w-220 mt-30 mb-50 ">
            Songket Palembang has a long history dating back to the Sriwijaya Kingdom (7th–13th century), when Palembang thrived as a major trade center. Influenced by cultural exchanges with India and China, artisans began weaving with gold and silver threads, making Songket a symbol of luxury, prestige, and social status. Until today, it remains one of Indonesia’s most treasured textiles, admired for its elegance and shimmering beauty.
        </p>

        <h1 className="font-playfair text-4xl text-[#2A3E3F] font-semibold mb-35">
                Motifs & Unique Features
        </h1>
        <img src={Penj} alt="" className="w-300 mr-10"/>  {/*disini buat gambar motif uniq*/}

        <div className="flex flex-row justify-center items-center my-60 gap-50">
            <div className="flex flex-col gap-5">
                <h1 className="font-playfair font-semibold text-2xl">
                    When It’s Worn
                </h1>
                <p className="font-poppins w-100 text-md text-light">
                    In the past, Songket was reserved for royalty and nobility, worn during palace ceremonies, weddings, and religious rituals. Today, it continues to be an important part of weddings, traditional dances, and cultural celebrations, while also inspiring modern fashion designers to create contemporary looks.
                </p>
            </div>
            <img src={Models} alt="" className="w-70"/>
        </div>
    </div>
    </>
  );
}

export default Penjelasan;
