import React from "react";
import { useTransition, animated } from "@react-spring/web";

interface ImageGalleryProps {
  images: string[];
  duration?: number;
  transitionTime?: keyof typeof TransitionTime;
}
const TransitionTime = {
  "1s": 1000,
  "2s": 2000,
  "3s": 3000,
};
const ImageGallery = ({
  images,
  duration = 5000,
  transitionTime = "1s",
}: ImageGalleryProps) => {
  const [index, setIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, duration);
      return () => {
        console.log("componente desmontado");

        clearInterval(interval);
      };
    }
  }, [images.length, duration, isPaused]);

  const transitions = useTransition(index, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: TransitionTime[transitionTime] },
  });

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };
  return (
    <>
      <div className="image-gallery">
        <div style={{ position: "absolute", zIndex: 1000 }}>
          <button onClick={togglePause}>{isPaused ? "Tocar" : "Pausar"}</button>
          <button
            onClick={() => {
              setIndex((prevIndex) => (prevIndex - 1) % images.length);
            }}
          >
            voltar
          </button>
        </div>
        {transitions((style, i) => (
          <animated.div
            style={{
              ...style,
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={images[i]}
              alt={`Slide ${i}`}
              style={{ width: "100%", height: "100%" }}
            />
          </animated.div>
        ))}
      </div>
    </>
  );
};

export default ImageGallery;
