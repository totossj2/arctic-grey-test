import { useState, useRef, useEffect } from 'react';

// SVGs de flechas (iguales a RecommendedProducts.tsx)
const ArrowLeftIcon = () => (
  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.40179 0.182292L0.6875 4.55729C0.5625 4.67882 0.5 4.82639 0.5 5C0.5 5.17361 0.5625 5.32118 0.6875 5.44271L5.40179 9.81771C5.72321 10.0608 6.02679 10.0608 6.3125 9.81771C6.5625 9.50521 6.5625 9.21007 6.3125 8.93229L2.75 5.625H11.8571C12.25 5.59028 12.4643 5.38194 12.5 5C12.4643 4.61806 12.25 4.40972 11.8571 4.375H2.75L6.3125 1.06771C6.5625 0.789931 6.5625 0.494792 6.3125 0.182292C6.02679 -0.0607639 5.72321 -0.0607639 5.40179 0.182292Z" fill="#1B1F23" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.59821 0.182292L12.3125 4.55729C12.4375 4.67882 12.5 4.82639 12.5 5C12.5 5.17361 12.4375 5.32118 12.3125 5.44271L7.59821 9.81771C7.27679 10.0608 6.97321 10.0608 6.6875 9.81771C6.4375 9.50521 6.4375 9.21007 6.6875 8.93229L10.25 5.625H1.14286C0.75 5.59028 0.535714 5.38194 0.5 5C0.535714 4.61806 0.75 4.40972 1.14286 4.375H10.25L6.6875 1.06771C6.4375 0.789931 6.4375 0.494792 6.6875 0.182292C6.97321 -0.0607639 7.27679 -0.0607639 7.59821 0.182292Z" fill="#1B1F23" />
  </svg>
);

interface VideoItem {
  id: string;
  videoUrl: string;
  productLink: string; // Link para la página del producto asociado
  title: string;
  price: string;
  productImage: string; // Imagen del producto
}

interface VideoCarouselProps {
  videos: VideoItem[];
  title?: string; // Título opcional para la sección
  subTitle?: string; // Subtítulo opcional
  viewAllLink?: string; // Link opcional para "View All"
  itemsToShow?: number; // Número de items a mostrar a la vez
}

export default function VideoCarousel({
  videos,
  title = "Real People. Real Results.",
  subTitle = "Trusted & Proven by Science",
  viewAllLink = "#",
  itemsToShow = 5, // Debe ser impar para un centro claro
}: VideoCarouselProps) {
  // Normalizamos items para mostrar a un número impar
  if (itemsToShow % 2 === 0) {
    itemsToShow += 1;
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0); // -1: prev, 0: none, 1: next
  const carouselRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const gapPx = 16;
  const [isReady, setIsReady] = useState(false); // Nuevo estado para controlar la visibilidad inicial

  // Calcular el ancho de cada item basado en el contenedor
  const calculateItemWidth = () => {
    // Hardcoded width to 300px
    return 300;
    // Original calculation:
    // if (!containerWidth) return 250;
    // return (containerWidth - (gapPx * (itemsToShow - 1))) / itemsToShow;
  };

  const itemWidth = calculateItemWidth();
  const halfItemsCount = Math.floor(itemsToShow / 2);

  // Medir el ancho del contenedor
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        const width = carouselRef.current.clientWidth;
        if (width > 0) { // Asegurarse de que tenemos un ancho válido
          setContainerWidth(width);
          setIsReady(true); // Marcar como listo una vez medido
        }
      }
    };

    // Intentar medir inmediatamente y luego en resize
    updateWidth();
    window.addEventListener('resize', updateWidth);

    // Fallback por si la medición inicial falla (raro, pero seguro)
    const timer = setTimeout(() => {
      if (!isReady) {
        updateWidth();
      }
    }, 100);

    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, [isReady]); // Depender de isReady previene bucles si la medición falla inicialmente

  // Efectivamente manejamos el total de videos
  const totalItems = videos.length;

  // Navegación con bloqueo durante animación
  const handlePrev = () => {
    if (isAnimating) return;
    setDirection(-1);
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    setTimeout(() => setIsAnimating(false), 500); // Coincidir con duración de la transición
  };

  const handleNext = () => {
    if (isAnimating) return;
    setDirection(1);
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % totalItems);
    setTimeout(() => setIsAnimating(false), 500); // Coincidir con duración de la transición
  };

  // Auto-reproducir video central y pausar los demás
  useEffect(() => {
    const videoElements = carouselRef.current?.querySelectorAll('video') || [];

    videoElements.forEach((video, index) => {
      const videoItem = video.closest('[data-video-index]');
      if (!videoItem) return;

      const videoIndex = parseInt(videoItem.getAttribute('data-video-index') || '0', 10);
      const virtualIndex = (videoIndex - activeIndex + totalItems) % totalItems;
      const position = virtualIndex <= halfItemsCount
        ? virtualIndex
        : virtualIndex - totalItems;

      // Central = reproducir, resto = pausar
      if (position === 0) {
        // video.play().catch(() => {}); // Opcional: auto-reproducir
      } else {
        video.pause();
      }
    });
  }, [activeIndex, totalItems, halfItemsCount]);

  // Manejadores para video
  const handleVideoMouseEnter = (e: React.MouseEvent<HTMLVideoElement>, videoIndex: number) => {
    const virtualIndex = (videoIndex - activeIndex + totalItems) % totalItems;
    const position = virtualIndex <= halfItemsCount
      ? virtualIndex
      : virtualIndex - totalItems;

    if (position === 0) {
      e.currentTarget.play().catch(() => { });
    }
  };

  const handleVideoMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.currentTarget.pause();
  };

  if (!videos || videos.length === 0) {
    return <div className="text-center py-10">No videos available.</div>;
  }

  return (
    <section className="py-16 bg-[#F7F7F7] overflow-hidden">
      <div className="">
        {/* Cabecera con título y botones */}
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <div className="text-center flex flex-row items-center justify-center gap-16">
            <button
              className="p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors hover:bg-gray-200 cursor-pointer"
              onClick={handlePrev}
              disabled={isAnimating}
              aria-label="Videos anteriores"
            >
              <ArrowLeftIcon />
            </button>
            <div className="flex flex-col items-center justify-center">
              {subTitle && <div className="text-sm text-gray-600 mb-1">{subTitle}</div>}
              <h2 className="text-[40px] font-medium text-[#1B1F23] tracking-tight">{title}</h2>
            </div>
            <button
              className="p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors hover:bg-gray-200 cursor-pointer"
              onClick={handleNext}
              disabled={isAnimating}
              aria-label="Videos siguientes"
            >
              <ArrowRightIcon />
            </button>
          </div>
          {viewAllLink && (
            <div className="text-center">
              <a href={viewAllLink} className="text-[16px] text-[#1B1F23] hover:text-[#1B1F23]/50 underline mt-2 inline-block">
                View All
              </a>
            </div>
          )}
        </div>

        {/* Carrusel Principal */}
        <div
          ref={carouselRef}
          className={`relative w-full h-[650px] flex items-center justify-center transition-opacity duration-500 ease-out ${isReady ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Renderizamos los videos solo cuando esté listo */}
          {isReady && (
            <div className="relative w-full h-full flex items-center justify-center">
              {videos.map((video, index) => {
                // Calcular la posición "virtual" basada en activeIndex
                const virtualIndex = (index - activeIndex + totalItems) % totalItems;

                // Transformar el índice virtual a posición (-2, -1, 0, 1, 2) donde 0 es el centro
                const position = virtualIndex <= halfItemsCount
                  ? virtualIndex
                  : virtualIndex - totalItems;

                // Determinar si este elemento debe mostrarse (está en el rango visible)
                const isVisible = Math.abs(position) <= halfItemsCount;

                if (!isVisible) return null;

                // Calcular estilos basados en la posición relativa al centro
                let zIndex;
                let maxHeight; // Valor absoluto, no porcentaje

                if (position === 0) { // Centro
                  zIndex = 10;
                  maxHeight = 500; // Altura máxima para el video activo (px)
                } else { // Todos los demás (adyacentes y lejanos)
                  zIndex = position === -1 || position === 1 ? 5 : 1;
                  maxHeight = 420; // Altura máxima menor para inactivos (70% del activo)
                }

                // Calcular desplazamiento horizontal basado en la posición
                const translateX = position * (itemWidth + gapPx);

                return (
                  <div
                    key={video.id}
                    data-video-index={index}
                    className="absolute transition-all duration-500 ease-out"
                    style={{
                      width: `${itemWidth}px`,
                      transform: `translateX(${translateX}px)`,
                      zIndex,
                      willChange: 'transform',
                    }}
                  >
                    <a
                      href={video.productLink}
                      className="block cursor-pointer"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* Contenedor de video con altura fija y max-height variable */}
                      <div
                        className={`relative overflow-hidden rounded-md bg-gray-200 shadow-md transition-all duration-500 ease-out ${position === 0 ? 'shadow-xl' : ''}`}
                        style={{
                          height: 500, // Altura fija para todos (misma que el max-height del activo)
                          maxHeight: maxHeight, // Recorta según la posición
                        }}
                      >
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: 'center top' // Anclar al borde superior
                          }}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onMouseEnter={(e) => handleVideoMouseEnter(e, index)}
                          onMouseLeave={handleVideoMouseLeave}
                          poster=""
                        />
                      </div>
                      <div
                        className='flex flex-row justify-center items-center text-center bg-white gap-3 px-1 mt-2 h-[80px] rounded-[8px] w-full transition-opacity duration-300 opacity-100'
                      >
                        <div className='w-16 h-16 rounded-[8px] bg-[#F6F6F5]'>
                          <img src={video.productImage} alt={video.title} className="w-full h-auto p-2" />
                        </div>
                        <div className='text-[#1B1F23] text-start flex gap-1 flex-col'>
                          <span className='text-[13px] '>
                            {video.title}
                          </span>
                          <span className='font-medium  text-[12px]'>
                            {video.price}
                          </span>
                        </div>

                        <div className='rounded-full bg-[#1B1F23] flex items-center justify-center w-8 h-8 ml-auto'>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3125 7.75C13.276 8.15104 13.0573 8.36979 12.6562 8.40625H8.28125V12.7812C8.24479 13.1823 8.02604 13.401 7.625 13.4375C7.22396 13.401 7.00521 13.1823 6.96875 12.7812V8.40625H2.59375C2.19271 8.36979 1.97396 8.15104 1.9375 7.75C1.97396 7.34896 2.19271 7.13021 2.59375 7.09375H6.96875V2.71875C7.00521 2.31771 7.22396 2.09896 7.625 2.0625C8.02604 2.09896 8.24479 2.31771 8.28125 2.71875V7.09375H12.6562C13.0573 7.13021 13.276 7.34896 13.3125 7.75Z" fill="white" />
                          </svg>
                        </div>


                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}