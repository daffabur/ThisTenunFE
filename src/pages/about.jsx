import AbHero from "../assets/aboutpic.svg";
import Menenun from "../assets/menenun.svg";
import iniTst1 from "../assets/test1.svg";
import iniTst2 from "../assets/test2.svg";


function About(){
    return (
        <>
        <div className="relative">
            <div>
                <img src={AbHero} alt="" className="w-full h-screen object-cover" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center md:justify-end p-4 sm:p-8 md:p-20">
                <h1 className="text-[#F6D69B] text-3xl sm:text-4xl md:text-6xl font-playfair font-semibold w-full sm:w-200 leading-8 sm:leading-12 md:leading-16 mb-3 sm:mb-4 md:mb-5 text-center md:text-left">
                    Tenun: Indonesia's Handwoven Legacy
                </h1>
                <p className="font-poppins text-white text-base sm:text-lg md:text-xl text-light w-80 sm:w-110 text-center md:text-left">
                    A cultural heritage woven through threads, colors, and generations.
                </p>
            </div>
        </div>

        <div id="section2" className="flex flex-col justify-center items-center bg-[#2A3E3F]">
            <div>
                <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-playfair mt-20 mb-8 sm:my-12 md:my-20 px-6 sm:px-8 md:px-10 py-1 border-2 border-[#F6D69B] rounded-full text-center">
                    What is Tenun
                </h1>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-center w-full pt-6 sm:pt-8 md:pt-10 pb-20 sm:pb-30 md:pb-40 px-4 sm:px-6 md:px-0"> 
                <div className="mb-6 md:mb-0">
                    <img src={Menenun} alt="tenun" className="max-h-[250px] sm:max-h-[350px] md:max-h-[430px] w-full rounded-xl sm:w-auto md:w-180" />
                </div>

                <div className="px-4 sm:px-6 md:mr-10">
                    <p className="text-white w-full md:w-140 font-poppins text-sm sm:text-base md:text-base text-justify md:text-left">
                        Tenun is a traditional Indonesian handwoven textile made on a loom, where patterns are created directly during the weaving process. Unlike batik, which uses wax-resist dyeing, tenun motifs emerge from the careful combination of threads, colors, and techniques unique to each region. From the golden Songket of Palembang, the sacred Geringsing of Bali, to the bold Ikat of Sumba, every tenun reflects local philosophies, beliefs, and ways of life. <br /> <br />
                        Beyond its function as fabric, tenun embodies cultural identity and heritage. Each piece can take weeks or even months to finish, often using natural dyes from plants and roots, with motifs that symbolize prosperity, spirituality, or protection. Once reserved for ceremonies and symbols of status, tenun today is reimagined in fashion and modern design, carrying forward Indonesia's timeless traditions into contemporary culture.
                    </p>
                </div>
            </div>
            
            <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-playfair mt-10 mb-8 sm:mb-12 md:mb-20 px-6 sm:px-8 md:px-10 py-1 border-2 border-[#F6D69B] rounded-full text-center">
                The Making Of Tenun
            </h1>

            <div className="flex justify-center items-center mb-20 sm:mb-25 md:mb-30 px-4">
                <iframe
                    width="100%"
                    height="200"
                    src="https://www.youtube.com/embed/VZxz6nt-yJU?si=xbNqnI-Um2MMRE1a"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-xl max-w-[350px] sm:max-w-[500px] md:min-w-148 sm:h-[250px] md:h-[335px]"
                ></iframe>
            </div>
        </div>

        <div className="flex flex-col bg-[#2A3E3F] -mt-1">
            <div className="ml-4 sm:ml-8 md:ml-25 flex flex-col mr-4 sm:mr-8 md:mr-0">
                <h1 className="font-playfair font-semibold text-[#F6D69B] text-xl sm:text-2xl md:text-3xl">
                    Preparing the Threads
                </h1>
                <p className="font-poppins text-white text-light text-xs sm:text-base md:text-lg w-80 md:w-170 mt-2 mb-12 sm:mb-16 md:mb-20">
                    Weavers start by choosing cotton or silk threads, then spin and arrange them into the warp. To keep them strong, the threads are often coated with natural starch.
                </p>
            </div>
            <div className="mr-4 sm:mr-8 md:mr-25 flex flex-col items-end md:items-end ml-4 sm:ml-8 md:ml-0">
                <h1 className="font-playfair font-semibold text-[#F6D69B] text-xl sm:text-2xl md:text-3xl">
                    Dyeing the Threads
                </h1>
                <p className="font-poppins text-white text-light text-xs sm:text-base md:text-lg w-80 md:w-170 mt-2 mb-12 sm:mb-16 md:mb-20 text-right md:text-right">
                    The threads are dyed using natural colors like indigo, turmeric, or morinda roots. In ikat, parts of the thread are tied before dyeing, creating unique resist patterns.
                </p>
            </div>
            <div className="ml-4 sm:ml-8 md:ml-25 flex flex-col mr-4 sm:mr-8 md:mr-0">
                <h1 className="font-playfair font-semibold text-[#F6D69B] text-xl sm:text-2xl md:text-3xl">
                    Weaving on the Loom
                </h1>
                <p className="font-poppins text-white text-light text-xs sm:text-base md:text-lg w-80 md:w-170 mt-2 mb-12 sm:mb-16 md:mb-20">
                    The prepared threads are placed on a loom. Through a repeated rhythm of lifting, passing, and pressing, the cloth slowly takes shape.
                </p>
            </div>
            <div className="mr-4 sm:mr-8 md:mr-25 flex flex-col items-end md:items-end ml-4 sm:ml-8 md:ml-0">
                <h1 className="font-playfair font-semibold text-[#F6D69B] text-xl sm:text-2xl md:text-3xl">
                    Creating the Motifs
                </h1>
                <p className="font-poppins text-white text-light text-xs sm:text-base md:text-lg w-80 md:w-170 mt-2 mb-12 sm:mb-16 md:mb-20 text-right md:text-right">
                    Each tradition has its own technique—ikat reveals dyed patterns, songket weaves gold or silver into the fabric, while Ulos uses bold colors and textures to carry meaning.
                </p>
            </div>
            <div className="ml-4 sm:ml-8 md:ml-25 flex flex-col mr-4 sm:mr-8 md:mr-0">
                <h1 className="font-playfair font-semibold text-[#F6D69B] text-xl sm:text-2xl md:text-3xl">
                    Finishing the Cloth
                </h1>
                <p className="font-poppins text-white text-light text-xs sm:text-base md:text-lg w-80 md:w-170 mt-2 mb-20 sm:mb-35 md:mb-50">
                    The fabric is washed, dried, and pressed, sometimes with fringes added. The result is a piece of Tenun ready for ceremonies or modern fashion.
                </p>
            </div>

            <div className="relative">
                <div className="flex flex-col justify-center items-center my-30 px-4 sm:px-6 md:px-0">
                    <h1 className="font-playfair font-bold text-3xl sm:text-4xl md:text-6xl text-[#F6D69B] text-center w-80 md:w-170 leading-10 sm:leading-16 md:leading-20">
                        Every thread tells a story. Discover more about Indonesia's weaving traditions.
                    </h1>
                    <a href="/explore" className="mt-6 sm:mt-8 md:mt-10 mb-20 sm:mb-35 md:mb-50 font-poppins text-white border-1 border-[#F6D69B] px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base">
                    Explore Tenun by Region
                    </a>
                </div>
            </div>
        </div>


        </>
    )
}

export default About;