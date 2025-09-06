import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./component/navbar";
import Home from "./pages/home";
import About from "./pages/about";
import Explore from "./pages/explore";
import Lookbook from "./pages/lookbook";
import Stories from "./pages/stories";
import Footer from "./component/footer";
import StoryDetail from "./pages/story-detail";

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
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<StoryDetail />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
