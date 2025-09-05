    import React from "react";
    import Hero from "../assets/hero.svg";
    import figure1 from "../assets/1.svg";
    import songketz from "../assets/songket.svg";
    import apahini from "../assets/apah.svg";
    import Toraja from "../assets/toraja.svg";
    import Ulos from "../assets/ulos.svg";
    import Arrow from "../assets/arrow.svg";
    import Gal from "../assets/Gallery.svg";
    import artic from "../assets/article.svg";
    import { Link } from "react-scroll";


    <Link to="about" smooth={true} duration={1200} offset={-50} className="cursor-pointer bg-white text-black px-6 py-3 rounded-lg">
    Learn More
    </Link>

    function Home() {
    return (
        <div>
            <div className="relative h-screen w-full">
                <img src={Hero} alt="Tenun hero" className="h-full w-full object-cover" 
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h1 className="text-7xl text-[#F6D69B] font-playfair font-bold w-200 text-center leading-21 ">
                    Weaving Heritage Inspiring Style
                    </h1>
                    <p className="font-poppins mt-5 text-center w-110 leading-7 ">
                        Tenun is more than fabric — it’s a legacy of stories, symbols, and traditions woven by the hands of Indonesia’s artisans
                    </p>
                    <Link 
                        to="2" 
                        smooth={true} 
                        duration={1200} 
                        offset={0}
                        className="font-poppins text-[#3E0703] font-poppins font-extrabold mt-5 bg-[#F6D69B] rounded-2xl px-5 py-1 hover:bg-[#fae3b8] cursor-pointer transition"
                    >
                        Discover more
                    </Link>

                </div>
            </div>

            <div id="2" className="bg-[#452C27] relative h-screen w-full flex flex-row gap-50 ">
                <div className="ml-10">
                    <h1 className="md:mx-20 mt-40 font-playfair font-bold md:text-5xl text-white inline-block border-2 border-[#F6D69B] rounded-full px-6 pt-2 pb-3">
                        What is Tenun?
                    </h1>
                    <p className="text-white text-justify pl-25 mt-5 w-135 text- font-poppins font-light ">
                        Tenun is Indonesia’s handwoven textile art, created by intertwining threads on a loom. Each region across the archipelago has its own distinctive tenun, carrying unique motifs, colors, and stories that reflect local culture and identity.<br /> <br />
                        More than just fabric, tenun is a heritage passed down through generations — once worn in rituals and ceremonies, now inspiring modern fashion and creative expression.
                    </p>
                </div>
                
                <div>
                    <img src={figure1} alt="figure1" className="w-xs mt-20"/>
                </div>
            </div>

            <div className="bg-[#2A3E3F] flex flex-col">
                <div className="mt-20 font-playfair font-bold text-white text-5xl leading-16 flex flex-col justify-center items-center">
                    <h1 className="border-2 border-[#F6D69B] rounded-full px-8 pb-1">
                        Explore Tenun
                    </h1>
                    <h1>
                        Across Indonesia
                    </h1>
                </div>
                
                <div className="flex flex-row justify-center gap-10">
                    <div className="relative">
                        <img src={songketz} alt="figure1" className="w-40 mt-15"/>
                        <p className="absolute inset-0 flex items-center ml-2 mt-51 font-playfair text-white text-sm font-bold">
                            Tenun Songket
                        </p>
                        <p className="absolute inset-0 flex items-center ml-2 mt-59 font-poppins text-white text-xs">
                            Sumatra
                        </p>
                    </div>
                    
                    <div className="relative">
                        <img src={apahini} alt="figure1" className="w-40 mt-15"/>
                        <p className="absolute inset-0 flex items-center ml-2 mt-51 font-playfair text-white text-sm font-bold">
                            Tenun Ikat
                        </p>
                        <p className="absolute inset-0 flex items-center ml-2 mt-59 font-poppins text-white text-xs">
                            Kalimantan Barat
                        </p>
                    </div>

                    <div className="relative">
                        <img src={Toraja} alt="figure1" className="w-40 mt-15"/>
                        <p className="absolute inset-0 flex items-center ml-2 mt-51 font-playfair text-white text-sm font-bold">
                            Tenun Toraja
                        </p>
                        <p className="absolute inset-0 flex items-center ml-2 mt-59 font-poppins text-white text-xs">
                            Sulawesi Selatan
                        </p>
                    </div>

                    <div className="relative transform transition duration-300 hover:-translate-y-2 hover:shadow-lg">
                        <a href="/explore">
                            <img src={Ulos} alt="figure1" className="w-40 mt-15" />
                            <img src={Arrow} alt="figure1" className="w-5 mt-17 absolute inset-0 ml-33"/>
                            <p className="absolute inset-0 flex items-center justify-center text-center px-10 mt-15 leading-6 font-poppins text-white text-lg">
                            See All Regions
                            </p>
                        </a>
                    </div>
                </div>

                <div className="flex justify-center mt-20 mb-20">
                    <p className="font-poppins font-light text-center text-white w-130">
                        Every region has its own threads of story. Discover the beauty, meaning, and craft behind Indonesia’s handwoven textiles
                    </p>
                </div>
            </div>

            <div className="flex flex-col bg-[#452C27]">
                <div className="mt-20 mb-30 flex justify-center relative">
                    <div className="absolute bg-[#2A3E3F] w-67 h-12 top-20 right-104"></div>
                        <a href="/Lookbook" className="absolute top-1 right-105 z-30 hover:scale-110 transition-transform">
                            <img src={Arrow} alt="Go to Lookbook" className="w-12"/>
                        </a>
                    
                        <h1 className="font-playfair text-white font-bold text-5xl w-110 text-center leading-15 z-10 relative">
                            Discover Your Outfit With Tenun
                        </h1>
                    </div>

                <div className="flex justify-center">
                    <img src={Gal} alt="figure1" className="w-2xl mt-2"/>
                </div>
            </div>

            <div className="bg-[#2A3E3F] flex flex-col">
                <div className="flex flex-row">
                    <div className="ml-10 mt-9 bg-white w-1 h-22"></div>
                    <h1 className="font-playfair font-bold  text-white mt-10 ml-5 mb-20 text-4xl w-50">Threads <br/>Of Strories</h1>
                </div>

                <div className="flex flex-row mb-50 gap-10 justify-center">
                    <div className="flex flex-col bg-white rounded-2xl mb-10">
                        <img src={artic} alt="figure1" className="w-md mt-5 mb-10 px-5"/>
                        <h1 className="ml-5 font-poppins font-bold text-xl">Stories of Tenun Ikat Tanimbar</h1>
                        <p className="ml-5 mt-2 mb-13 font-poppins text-sm w-70">Keindahan dalam Kesederhanaan Kain Tradisional Maluku</p>
                    </div>

                    <div className="bg-white mb-10 rounded-2xl flex justify-center">
                        <a href="/article" className="absolute right-31 mt-3 underline font-poppins">See All</a>
                        <div className="flex flex-col gap-5 mt-18">
                            <a href="">
                                <div className="flex flex-row justify-center items-center px-10">
                                    <img src={artic} alt="figure1" className="w-35 px-5"/>
                                    <div className="flex flex-col">
                                        <p className="text-poppins font-light text-xs">7 agustus 2025</p>
                                        <h1 className="w-85 text-poppins font-semibold text-sm leading-5">Macam-macam Kain Tenun, dari Songket Minang, Ulos, hingga Tenun Toraja</h1>
                                    </div>
                                </div>
                            </a>
                            <a href="">
                                <div className="flex flex-row justify-center items-center px-10">
                                    <img src={artic} alt="figure1" className="w-35 px-5"/>
                                    <div className="flex flex-col">
                                        <p className="text-poppins font-light text-xs">7 agustus 2025</p>
                                        <h1 className="w-85 text-poppins font-semibold text-sm leading-5">Macam-macam Kain Tenun, dari Songket Minang, Ulos, hingga Tenun Toraja</h1>
                                    </div>
                                </div>
                            </a>
                            <a href="">
                                <div className="flex flex-row justify-center items-center px-10">
                                    <img src={artic} alt="figure1" className="w-35 px-5"/>
                                    <div className="flex flex-col">
                                        <p className="text-poppins font-light text-xs">7 agustus 2025</p>
                                        <h1 className="w-85 text-poppins font-semibold text-sm leading-5">Macam-macam Kain Tenun, dari Songket Minang, Ulos, hingga Tenun Toraja</h1>
                                    </div>
                                </div>
                            </a>
                            <a href="">
                                <div className="flex flex-row justify-center items-center px-10">
                                    <img src={artic} alt="figure1" className="w-35 px-5"/>
                                    <div className="flex flex-col">
                                        <p className="text-poppins font-light text-xs">7 agustus 2025</p>
                                        <h1 className="w-85 text-poppins font-semibold text-sm leading-5">Macam-macam Kain Tenun, dari Songket Minang, Ulos, hingga Tenun Toraja</h1>
                                    </div>
                                </div>
                                
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }

    export default Home;
