import { useState, useRef, useEffect } from 'react';

// SVGs de flechas (iguales a RecommendedProducts.tsx)
const ArrowLeftIcon = () => (
  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.40179 0.182292L0.6875 4.55729C0.5625 4.67882 0.5 4.82639 0.5 5C0.5 5.17361 0.5625 5.32118 0.6875 5.44271L5.40179 9.81771C5.72321 10.0608 6.02679 10.0608 6.3125 9.81771C6.5625 9.50521 6.5625 9.21007 6.3125 8.93229L2.75 5.625H11.8571C12.25 5.59028 12.4643 5.38194 12.5 5C12.4643 4.61806 12.25 4.40972 11.8571 4.375H2.75L6.3125 1.06771C6.5625 0.789931 6.5625 0.494792 6.3125 0.182292C6.02679 -0.0607639 5.72321 -0.0607639 5.40179 0.182292Z" fill="#1B1F23"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.59821 0.182292L12.3125 4.55729C12.4375 4.67882 12.5 4.82639 12.5 5C12.5 5.17361 12.4375 5.32118 12.3125 5.44271L7.59821 9.81771C7.27679 10.0608 6.97321 10.0608 6.6875 9.81771C6.4375 9.50521 6.4375 9.21007 6.6875 8.93229L10.25 5.625H1.14286C0.75 5.59028 0.535714 5.38194 0.5 5C0.535714 4.61806 0.75 4.40972 1.14286 4.375H10.25L6.6875 1.06771C6.4375 0.789931 6.4375 0.494792 6.6875 0.182292C6.97321 -0.0607639 7.27679 -0.0607639 7.59821 0.182292Z" fill="#1B1F23"/>
  </svg>
);

interface VideoItem {
  id: string;
  videoUrl: string;
  productLink: string; // Link para la página del producto asociado
  title: string;
  price: string;
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

  const [activeIndex, setActiveIndex] = useState(0);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  // containerWidth ya no es necesario para el cálculo de tx, pero podría ser útil para el itemW
  const [containerWidth, setContainerWidth] = useState<number | null>(null); 
  const gapPx = 16;

  useEffect(() => {
    const el = carouselContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []); // No necesita depender de videos aquí

  if (!videos || videos.length === 0) {
    return <div className="text-center py-10">No videos available.</div>;
  }
  if (itemsToShow % 2 === 0) {
    console.warn("itemsToShow should be an odd number for a clear center item. Adjusting...");
    itemsToShow += 1;
  }

  const totalItems = videos.length;

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  // Función para obtener los videos en el orden visual correcto
  const getDisplayedVideos = () => {
    const displayed = [];
    const half = Math.floor(itemsToShow / 2);
    // Calcular el índice inicial en el array original para el primer elemento visible
    const startOriginalIndex = (activeIndex - half + totalItems) % totalItems;

    for (let i = 0; i < itemsToShow; i++) {
      const originalIndex = (startOriginalIndex + i + totalItems) % totalItems;
       // Asegurarse de que solo añadimos si hay suficientes videos o duplicamos si es necesario (opcional, por ahora asumimos totalItems >= itemsToShow)
      if (totalItems >= itemsToShow || i < totalItems) {
        displayed.push(videos[originalIndex]);
      } else {
         // Placeholder o lógica para pocos items (ej. mostrar null o items vacíos)
         // displayed.push(null); // Ejemplo
         // Por simplicidad, asumimos que siempre hay suficientes videos
         displayed.push(videos[originalIndex]);
      }
    }
    // Si totalItems < itemsToShow, el array puede ser más corto.
    // Podríamos rellenar con null o elementos vacíos si quisiéramos estrictamente itemsToShow espacios visuales.
    return displayed;
  };

  const displayedVideos = getDisplayedVideos();
  const centerDisplayIndex = Math.floor(itemsToShow / 2);

  // Ancho base del item (podría ajustarse si el contenedor es muy pequeño)
  const baseItemWidth = containerWidth !== null && itemsToShow > 0
      ? (containerWidth / itemsToShow) - gapPx * ((itemsToShow -1) / itemsToShow) // Ajuste por gap promedio
      : 250; // Un valor por defecto razonable

  const handleMouseEnter = (e: React.MouseEvent<HTMLVideoElement>) => {
    // La lógica de hover ahora depende del índice de display (si es el central)
    const videoElement = e.currentTarget;
    const parentDiv = videoElement.closest('[data-display-index]');
    const displayIndex = parentDiv ? parseInt(parentDiv.getAttribute('data-display-index') || '-1', 10) : -1;

    if (displayIndex === centerDisplayIndex) {
        videoElement.play().catch(error => {
            console.error("Video play failed:", error);
        });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.currentTarget.pause();
  };

  // Pausar videos no centrales cuando cambia activeIndex (o displayedVideos)
  useEffect(() => {
    const centralVideoId = displayedVideos[centerDisplayIndex]?.id;
    carouselContainerRef.current?.querySelectorAll('video').forEach(video => {
        const parentDiv = video.closest('[data-video-id]');
        const videoId = parentDiv?.getAttribute('data-video-id');
        if (videoId !== centralVideoId) {
            video.pause();
        }
         // Opcional: Autoplay del video central al navegar (si se desea)
         // else if (videoId === centralVideoId) {
         //    video.play().catch(e => console.error("Autoplay failed", e));
         // }
    });
 // Dependencia clave: activeIndex o la recalculación de displayedVideos
 }, [activeIndex, videos]); // Re-ejecutar si cambia el índice activo o el array original

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F7F7] overflow-x-hidden">
      <div className="max-w-screen mx-auto"> {/* Añadido mx-auto */}
        {/* Cabecera con título y botones */}
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <div className="text-center flex flex-row items-center justify-center gap-16">
            <button
              className={`p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors hover:bg-gray-200 cursor-pointer`}
              onClick={handlePrev} aria-label="Previous videos"
            >
              <ArrowLeftIcon />
            </button>
            <div className='flex flex-col items-center justify-center'>
              {subTitle && <div className="text-sm text-gray-600 mb-1">{subTitle}</div>}
              <h2 className="text-[40px] font-medium text-[#1B1F23] tracking-tight">{title}</h2>
            </div>
            <button
              className={`p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors hover:bg-gray-200 cursor-pointer`}
              onClick={handleNext} aria-label="Next videos"
            >
              <ArrowRightIcon />
            </button>
          </div>
          {viewAllLink && <div className="text-center"><a href={viewAllLink} className="text-[16px] text-[#1B1F23] hover:text-[#1B1F23]/50 underline mt-2 inline-block">View All</a></div>}
        </div>

        {/* Contenedor del Carrusel */}
        {/* Añadido perspective para posible 3D effect y flex para centrar */}
        <div 
          ref={carouselContainerRef} 
          className="w-full flex justify-center items-center" 
          style={{ 
            minHeight: '450px', // Altura mínima para dar espacio
            perspective: '1000px' // Para efectos 3D si se añaden
          }}
        >
          {/* Contenedor Interno: No necesita transform, usa flex gap */}
          <div
            className={`flex justify-center items-center transition-all duration-500 ease-in-out`}
            style={{ gap: `${gapPx}px` }}
          >
            {/* Mapear sobre los videos a mostrar (array rotado) */}
            {displayedVideos.map((videoItem, displayIndex) => {
              // videoItem puede ser null si totalItems < itemsToShow y no rellenamos
              if (!videoItem) return <div key={`placeholder-${displayIndex}`} style={{width: `${baseItemWidth}px`}}></div>; 

              const isCenter = displayIndex === centerDisplayIndex;
              const distanceFromCenter = Math.abs(displayIndex - centerDisplayIndex);

              // Calcular escala y opacidad basado en la distancia al centro
              let scale = 1;
              let opacity = 1;
              let zIndex = 0;
              if (distanceFromCenter === 0) { // Centro
                scale = 1.1; // Más grande
                opacity = 1;
                zIndex = 10;
              } else if (distanceFromCenter === 1) { // Adyacentes
                scale = 0.9; // Más pequeño
                opacity = 0.7; // Semitransparente
                zIndex = 5;
              } else { // Más alejados
                scale = 0.8; // Aún más pequeño
                opacity = 0.5; // Más transparente
                zIndex = 1;
              }
              // Opcional: Añadir un ligero desplazamiento Y para los no centrales
              const translateY = distanceFromCenter > 0 ? '10px' : '0px';

              return (
                <div
                  key={videoItem.id} // Usar ID original como key para React
                  data-display-index={displayIndex} // Índice visual actual
                  data-video-id={videoItem.id} // ID del video para pausar otros
                  className={`flex-shrink-0 transition-all duration-500 ease-in-out`}
                  style={{
                    width: `${baseItemWidth}px`,
                    transform: `scale(${scale}) translateY(${translateY})`,
                    opacity: opacity,
                    zIndex: zIndex,
                     // marginRight no es necesario si usamos flex gap en el padre
                  }}
                >
                  <a href={videoItem.productLink} className="block group cursor-pointer" target="_blank" rel="noopener noreferrer">
                    {/* Contenedor con aspect ratio y sombra */}
                    <div className={`aspect-w-9 aspect-h-16 mb-3 overflow-hidden rounded-md bg-gray-200 shadow-md transition-shadow ${isCenter ? 'shadow-xl' : ''}`}>
                      <video
                        src={videoItem.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        poster=""
                      />
                    </div>
                    {/* Texto solo visible en el centro */}
                    <div className={`text-center px-1 transition-opacity duration-300 ${isCenter ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <h3 className="text-base font-semibold truncate" title={videoItem.title}>{videoItem.title}</h3>
                      <p className="text-sm text-gray-600">{videoItem.price}</p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
} 