import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedImage]);

  const images = [
    "/modelz1.png",
    "/modelz2.png",
    "/modelz3.png",
    "/modelz4.png",
    "/modelz5.png",
    "/modelz6.png",
    "/modelz6.png",
    "/modelz1.png",
    "/modelz1.png",
  ];

  const breakpointColumnsObj = {
    default: 4,
    1100: 2,
    700: 1,
  };

  return (
    <div className="px-35 pt-20 pb-30">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-5"
        columnClassName="space-y-5"
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`img-${i}`}
            className="rounded-xl w-full cursor-pointer hover:opacity-80 transition"
            onClick={() => setSelectedImage(src)}
          />
        ))}
      </Masonry>

        {selectedImage && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" 
            onClick={() => setSelectedImage(null)}>
                <div
                className="relative mt-10 transform transition-all duration-300 scale-95 opacity-0 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}>
                <img
                    src={selectedImage}
                    alt="preview"
                    className="max-h-[80vh] max-w-[80vw] rounded-lg shadow-lg"
                />
                <button
                    className="absolute top-2 right-2 bg-white/40 text-black px-3 py-1 rounded-full font-poppins font-bold text-xs cursor-pointer"
                    onClick={() => setSelectedImage(null)}>
                    ✕
                </button>
                </div>
            </div>
        )}

    </div>
  );
}

export default Gallery;
