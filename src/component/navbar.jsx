import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed w-full bg-transparent backdrop-blur-xs pt-7 pb-6  flex flex-row justify-between items-center z-50 text-white">
      <div className="font-playfair font-bold text-xl flex gap-4 ml-10">
        <h1>| This Tenun</h1>
      </div>

      <div className="-mb-1 font-semibold font-poppins flex gap-4 mr-10 ">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/about" className="hover:text-gray-300">About Tenun</Link>
        <Link to="/explore" className="hover:text-gray-300">Explore</Link>
        <Link to="/lookbook" className="hover:text-gray-300">Lookbook</Link>
        <Link to="/stories" className="hover:text-gray-300">Stories</Link>
      </div>
    </nav>
  );
}

export default Navbar;
