import Gallery from "../component/galer";

function Lookbook() {
  return (
    <div className="bg-[#2A3E3F] min-h-screen">
      <h1 className="text-center font-poppins text-4xl text-white pt-30 pb-10 leading-13">
        Find Your Style on <br /> Lookbook by <span className="font-playfair">| This Tenun</span>
      </h1>
      <Gallery />
    </div>
  );
}

export default Lookbook;
