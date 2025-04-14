import React from 'react';

interface TestimonialsProps {
  doctorRecommended?: string;
  starCount?: number;
  reviewCount?: string;
  mediaLogos?: MediaLogo[];
}

interface MediaLogo {
  name: string;
  imageSrc: string;
  altText?: string;
}

const defaultMediaLogos: MediaLogo[] = [
  { name: 'Rolling Stone', imageSrc: '/images/logos/rolling-stone.png', altText: 'Rolling Stone logo' },
  { name: 'Men\'s Journal', imageSrc: '/images/logos/mens-journal.png', altText: 'Men\'s Journal logo' },
  { name: 'LA Weekly', imageSrc: '/images/logos/la-weekly.png', altText: 'LA Weekly logo' },
  { name: 'Herb', imageSrc: '/images/logos/herb.png', altText: 'Herb logo' },
  { name: 'New York Times', imageSrc: '/images/logos/nyt.png', altText: 'The New York Times logo' },
  { name: 'BBC News', imageSrc: '/images/logos/bbc.png', altText: 'BBC News logo' },
  { name: 'Rolling Stone', imageSrc: '/images/logos/rolling-stone.png', altText: 'Rolling Stone logo' },
  { name: 'Men\'s Journal', imageSrc: '/images/logos/mens-journal.png', altText: 'Men\'s Journal logo' },
];

const StarIcon = () => (
  <svg className="w-5 h-5 text-[#FFA800]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);

// Estilos para la animación del carrusel
const carouselStyles = `
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .logo-carousel {
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    width: 100%;
    padding: 0.5rem 0;
  }
  
  .logo-carousel-track {
    display: inline-block;
    animation: scroll 55s linear infinite;
    will-change: transform;
  }
  
  .logo-carousel-track:hover {
    animation-play-state: paused;
  }
  
  .logo-item {
    display: inline-block;
    margin: 0 0.75rem;
    vertical-align: middle;
  }
  
  .logo-card {
    background-color: white;
    width: 120px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    padding: 0.5rem;
    transition: all 0.2s ease;
  }
  
  .logo-card:hover {
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  
  .logo-text {
    font-weight: 600;
    color: #666;
    font-size: 14px;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .logo-carousel-track {
      animation: scroll 55s linear infinite;
    }
    
    .logo-card {
      width: 90px;
      height: 45px;
    }
  }
`;

export function Testimonials({
  doctorRecommended = "#1 Doctor Recommended",
  starCount = 5,
  reviewCount = "12,000+ 5-star Reviews",
  mediaLogos = defaultMediaLogos,
}: TestimonialsProps) {
  // Duplicamos los logos varias veces para crear el efecto de movimiento infinito y suave
  const duplicatedLogos = [...mediaLogos, ...mediaLogos, ...mediaLogos];
  
  return (
    <div className="w-full bg-gray-[#F6F6F5] border-y border-gray-100 py-3">
      <style dangerouslySetInnerHTML={{ __html: carouselStyles }} />
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:justify-between md:flex-row md:items-center">
          {/* Doctor Recommendation and Reviews Section */}
          <div className="flex flex-col mb-6 md:mb-0 md:w-fit md:pr-6">
            <div className="inline-block mb-2">
              <div className="inline-block border border-[#000000] border-opacity-100 rounded-[8px] px-4 py-2 bg-black/10 text-[#1B1F23] font-medium text-sm">
                {doctorRecommended}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex">
                {Array.from({ length: starCount }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <span className="ml-2 text-[#1B1F23]">{reviewCount}</span>
            </div>
          </div>

          <div className='separator w-[1px] h-[70px] bg-[#1B1F23]/10'></div>
          
          {/* Logos Section with Carousel */}
          <div className="md:w-2/3 md:pl-6">
            <div className="logo-carousel">
              <div className="logo-carousel-track">
                {duplicatedLogos.map((logo, index) => (
                  <div key={`${logo.name}-${index}`} className="logo-item">
                    <div className="logo-card">
                      <img 
                        src={logo.imageSrc} 
                        alt={logo.altText || logo.name} 
                        className="max-h-[80%] max-w-[80%] object-contain grayscale hover:grayscale-0 transition-all"
                        onError={(e) => {
                          // Si la imagen no se puede cargar, mostrar el nombre como texto
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            const textNode = document.createElement('span');
                            textNode.className = 'text-gray-500 text-sm font-medium text-center';
                            textNode.textContent = logo.name;
                            parent.replaceChild(textNode, target);
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
