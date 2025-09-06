import AbHero from "../assets/aboutpic.svg";
import Menenun from "../assets/menenun.svg";
import iniTst1 from "../assets/test1.svg";
import iniTst2 from "../assets/test2.svg";
import iniTst3 from "../assets/test3.svg";
import iniTst4 from "../assets/test4.svg";

function About(){
    return (
        <>
        <div id="Hero Section" className="relative">
            <div>
                <img src={AbHero} alt="" className="w-full h-screen object-cover" />
            </div>

            <div className="absolute inset-0 flex flex-col items-start justify-end p-20">
                <h1 className="text-[#F6D69B] text-6xl font-playfair font-semibold w-200 leading-16 mb-5">
                    Tenun: Indonesia’s Handwoven Legacy
                </h1>
                <p className="font-poppins text-white text-xl text-light w-110">
                    A cultural heritage woven through threads, colors, and generations.
                </p>
            </div>
        </div>

        <div id="section2" className="flex flex-col justify-center items-center bg-[#2A3E3F]">
            <div>
                <h1 className="text-white text-5xl font-playfair my-20 px-10 py-1 border-2 border-[#F6D69B] rounded-full">
                    What is Tenun
                </h1>
            </div>

            <div className="flex flex-row justify-start items-center w-full pt-10 pb-40"> 
                <div>
                <img src={Menenun} alt="tenun" className="max-h-[430px] w-180" />
                </div>

                <div className="mr-10">
                <p className="text-white w-140 font-poppins">
                    Tenun is a traditional Indonesian handwoven textile made on a loom, where patterns are created directly during the weaving process. Unlike batik, which uses wax-resist dyeing, tenun motifs emerge from the careful combination of threads, colors, and techniques unique to each region. From the golden Songket of Palembang, the sacred Geringsing of Bali, to the bold Ikat of Sumba, every tenun reflects local philosophies, beliefs, and ways of life. <br /> <br />
                    Beyond its function as fabric, tenun embodies cultural identity and heritage. Each piece can take weeks or even months to finish, often using natural dyes from plants and roots, with motifs that symbolize prosperity, spirituality, or protection. Once reserved for ceremonies and symbols of status, tenun today is reimagined in fashion and modern design, carrying forward Indonesia’s timeless traditions into contemporary culture.
                </p>
                </div>
            </div>
            
            <h1 className="text-white text-5xl font-playfair mb-20 px-10 py-1 border-2 border-[#F6D69B] rounded-full">
                    The Making Of Tenun
            </h1>

            <div className="flex justify-center items-center mb-30">
                <iframe
                    width="592"
                    height="335"
                    src="https://www.youtube.com/embed/VZxz6nt-yJU?si=xbNqnI-Um2MMRE1a" // ganti dengan link video
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-xl"
                ></iframe>
            </div>
        </div>

        <div className="flex flex-col bg-[#2A3E3F]">
            <div className="ml-25 flex flex-col">
                <h1 className="font-playfair font-semibold text-[#F6D69B] text-3xl">
                    Preparing the Threads
                </h1>
                <p className="font-poppins text-white text-light text-lg w-170 mt-2 mb-20">
                    Weavers start by choosing cotton or silk threads, then spin and arrange them into the warp. To keep them strong, the threads are often coated with natural starch.                </p>
            </div>
            <div className="mr-25 flex flex-col items-end">
                <h1 className="font-playfair font-semibold text-[#F6D69B] text-3xl">
                    Dyeing the Threads
                </h1>
                <p className="font-poppins text-white text-light text-lg w-170 mt-2 mb-20 text-right">
                    The threads are dyed using natural colors like indigo, turmeric, or morinda roots. In ikat, parts of the thread are tied before dyeing, creating unique resist patterns.
                </p>
            </div>
            <div className="ml-25 flex flex-col">
                <h1 className="font-playfair font-semibold text-[#F6D69B] text-3xl">
                    Weaving on the Loom
                </h1>
                <p className="font-poppins text-white text-light text-lg w-170 mt-2 mb-20">
                    The prepared threads are placed on a loom. Through a repeated rhythm of lifting, passing, and pressing, the cloth slowly takes shape.
                </p>
            </div>
            <div className="mr-25 flex flex-col items-end">
                <h1 className="font-playfair font-semibold text-[#F6D69B] text-3xl">
                    Creating the Motifs
                </h1>
                <p className="font-poppins text-white text-light text-lg w-170 mt-2 mb-20 text-right">
                    Each tradition has its own technique—ikat reveals dyed patterns, songket weaves gold or silver into the fabric, while Ulos uses bold colors and textures to carry meaning.
                </p>
            </div>
            <div className="ml-25 flex flex-col">
                <h1 className="font-playfair font-semibold text-[#F6D69B] text-3xl">
                    Finishing the Cloth
                </h1>
                <p className="font-poppins text-white text-light text-lg w-170 mt-2 mb-50">
                    The fabric is washed, dried, and pressed, sometimes with fringes added. The result is a piece of Tenun ready for ceremonies or modern fashion.
                </p>
            </div>

            <div className="relative">
                <img src={iniTst1} alt="tenoon models" className="absolute w-45 left-250"/>
                <img src={iniTst2} alt="tenoon" className="absolute w-45 left-15 top-40"/>

                <div className="flex flex-col justify-center items-center">
                    <h1 className="font-playfair font-bold text-6xl text-[#F6D69B] text-center w-170 leading-20">
                        Every thread tells a story. Discover more about Indonesia’s weaving traditions.
                    </h1>
                    <a href="/explore" className="mt-10 mb-50 font-poppins text-white border-1 border-[#F6D69B] px-5 py-2 rounded-full">
                    Explore Tenun by Region
                    </a>
                </div>
            </div>
        </div>


        </>
    )
}

export default About;