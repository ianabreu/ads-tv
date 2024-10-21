import { useEffect, useRef, useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import { Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  durationInSeconds?: number;
  transitionTime?: keyof typeof TransitionTime;
  closeSlideShow: () => void;
}

const TransitionTime = {
  "1s": 1000,
  "2s": 2000,
  "3s": 3000,
};

const ImageGallery = ({
  images,
  durationInSeconds = 5,
  transitionTime = "1s",
  closeSlideShow,
}: ImageGalleryProps) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMouseMoving, setIsMouseMoving] = useState<boolean>(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detecta o movimento do mouse para exibir os controles
  useEffect(() => {
    const handleMouseMove = () => {
      setIsMouseMoving(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Atualiza a imagem do slideshow automaticamente
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, durationInSeconds * 1000);
    }
    return () => clearInterval(interval);
  }, [images.length, durationInSeconds, isPaused]);

  // Transição entre imagens
  const transitions = useTransition(index, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: TransitionTime[transitionTime] },
  });

  // Função para pausar/retomar o slideshow
  const togglePause = () => setIsPaused((prev) => !prev);

  // Função para fechar o slideshow
  const returnToHome = () => closeSlideShow();

  // Controles de visibilidade
  const isVisible = isMouseMoving || isPaused;

  return (
    <section className="w-full h-screen">
      <div className={cn("relative w-full h-full max-h-screen")}>
        {/* Controles de pause/play e fechar o slideshow */}

        {/* Slideshow de imagens */}
        {transitions((style, i) => (
          <animated.div
            key={i}
            style={{
              ...style,
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <div className="relative bg-black aspect-video w-screen max-h-screen">
              <img
                src={images[i]}
                alt={`Slide ${i}`}
                className="w-full h-full max-w-full max-h-full object-contain"
                loading="lazy"
              />
              {isVisible && (
                <div
                  className="backdrop-blur-sm bg-slate-800/50 border-slate-300 border-2 rounded-full
              p-1 flex absolute bottom-1/2 left-1/2 -ml-12 -mb-12 items-center justify-center gap-2"
                  style={{ zIndex: 1000 }}
                >
                  <button
                    className="h-12 w-12 hover:text-amber-500 text-center flex justify-center items-center"
                    onClick={togglePause}
                  >
                    {isPaused ? <Play /> : <Pause />}
                  </button>
                  <button
                    className="h-12 w-12 hover:text-amber-500 flex justify-center items-center"
                    onClick={returnToHome}
                  >
                    <X />
                  </button>
                </div>
              )}
            </div>
          </animated.div>
        ))}
      </div>
    </section>
  );
};

export default ImageGallery;
