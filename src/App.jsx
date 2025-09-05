import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./component/navbar";
import Home from "./pages/home";

function App() {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          
        </Routes>
      </div>
    </>
  );
}

export default App;
