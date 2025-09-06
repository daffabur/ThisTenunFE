import { useState, useRef, useEffect } from "react";
import Exp from "../assets/heroExp.svg";
import Map from "../assets/map.svg";
import Penjelasan from "../component/penjelasan";
import { scroller } from "react-scroll";


function Explore() {
    const [showDetail, setShowDetail] = useState(false);
    const detailRef = useRef(null);

    useEffect(() => {
    if (showDetail) {
        scroller.scrollTo("penjelasan", {
        duration: 2000,
        delay: 0,
        smooth: "easeOutCubic",
        offset: -80
        });
    }
    }, [showDetail]);

    return(
        <>
        <div id="hero" className="relative">
                <img src={Exp} alt="hero explore" className="w-screen h-screen object-cover"/>
                <div className="flex flex-col justify-center items-center absolute inset-0">
                    <h1 className="font-playfair font-bold text-[#F6D69B] text-7xl text-center w-140 leading-20">
                        Tenun Across the Archipelago
                    </h1>
                    <p className="text-white text-2xl text-light font-poppins text-center w-115 mt-5">
                        From Sabang to Merauke, each region weaves its own story
                    </p>
                </div>
        </div>

         <div id="map" className="bg-[#2A3E3F] flex justify-center cursor-pointer" onClick={() => setShowDetail(true)}>
            <img src={Map} alt="indonesia map" className="w-250 my-50" />
        </div>

        {showDetail && (
        <div ref={detailRef}>
          <Penjelasan />
        </div>
      )}
        </>
    )
}

export default Explore;