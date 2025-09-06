import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./component/navbar";
import Home from "./pages/home";
import About from "./pages/about";
import Explore from "./pages/explore";
import Lookbook from "./pages/lookbook";
import Footer from "./component/footer";

function App() {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/lookbook" element={<Lookbook />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
