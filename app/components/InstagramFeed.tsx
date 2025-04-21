import { Link } from '@remix-run/react';

const images = [
  '/images/instagramFeed/instagram_1.webp', 
  '/images/instagramFeed/instagram_2.webp',
  '/images/instagramFeed/instagram_3.webp',
  '/images/instagramFeed/instagram_4.webp',
  '/images/instagramFeed/instagram_5.webp',
  '/images/instagramFeed/instagram_6.webp',
  '/images/instagramFeed/instagram_7.webp',
  '/images/instagramFeed/instagram_8.webp',
  '/images/instagramFeed/instagram_9.webp',
  '/images/instagramFeed/instagram_10.webp',
];

export function InstagramFeed() {
  return (
    <div className="bg-white p-4 md:p-8">


      <div className=" grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-[#F5F5F5] col-span-2 flex flex-col gap-8   rounded-lg p-6  md:items-center md:justify-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              Logo
            </div>
            <span className="font-semibold text-lg">@uncmfrt.com</span>
          </div>
          <Link
            to="https://www.instagram.com/uncmfrt" // Reemplaza con tu enlace real de Instagram
            target="_blank"
            rel="noopener noreferrer"
            className="border font-medium text-sm border-black bg-white rounded-lg px-7 py-[13px] text-center hover:bg-gray-100 transition-colors w-full md:w-auto"
          >
            Follow Us on Instagram
          </Link>
        </div>
        {images.map((src, index) => (
          <div key={index} className="aspect-square overflow-hidden rounded-lg">
            <img
              src={src}
              alt={`Instagram post ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy" // Carga diferida para mejorar rendimiento
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Asegúrate de tener imágenes de placeholder en public/placeholder/ o reemplaza las rutas
