import React from 'react';
import { Link } from '@remix-run/react'; // Asegúrate de que Link esté importado si usas Remix

interface ArticleProps {
  imageUrl: string;
  category: string;
  title: string;
  author: string;
  date: string;
  isLarge?: boolean;
  url: string;
}

const ArticleCard: React.FC<ArticleProps> = ({ imageUrl, category, title, author, date, url, isLarge = false }) => {
  if (isLarge) {
    // Renderizado para la tarjeta grande (imagen de fondo, texto superpuesto)
    return (
      <Link to={url} className="block h-full overflow-hidden rounded-lg group">
        {/* Contenedor con aspect ratio para mantener la forma antes de que cargue la imagen */}
        <div className="relative  overflow-hidden h-full text-white ">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full flex flex-col gap-3 sm:gap-4">
            <div className='flex flex-col gap-1 sm:gap-1.5'>
              <p className="text-xs sm:text-sm mb-0.5 sm:mb-1">{category}</p>
              <h3 className="font-medium text-lg sm:text-xl lg:text-2xl max-w-[35ch] line-clamp-2">{title}</h3>
            </div>
            <div className="text-[10px] sm:text-xs flex gap-1.5 sm:gap-2 items-center">
              <span>By {author}</span>
              <span>|</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  } else {
    // Renderizado para tarjetas pequeñas (imagen izquierda, texto derecha)
    return (
      <Link to={url} className="block group h-1/2 ">
        <div className="flex flex-row gap-7 h-32 md:h-full">
          <div className="w-[42%] flex-shrink-0 overflow-hidden rounded-lg h-full">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
          </div>
          <div className="flex flex-col gap-2 md:gap-8 flex-1 justify-center ">
             <p className="text-xs md:text-[16px]  text-[#1B1F23]">{category}</p>
             <h3 className="font-medium text-sm md:text-lg md:leading-6  group-hover:underline group-hover:text-[#1B1F23]/80 transition-colors line-clamp-3">{title}</h3>
             <div className="text-xs md:text-[16px]  flex flex-col md:flex-row md:gap-2 text-left md:items-center text-[#1B1F23] ">
                 <span>By {author}</span>
                 <span className='hidden text-left md:block text-[#1B1F23]/30'>|</span>
                 <span>{date}</span>
             </div>
          </div>
        </div>
      </Link>
    );
  }
};


export default function Blogs() {
    const articles = [
        {
            imageUrl: '/images/blogs/blogs_1.jpg',
            category: 'Balanced Diet',
            url: '/blogs/Foundational-Supplements:-Build-a-Better-You',
            title: 'Foundational Supplements: Build a Better You',
            author: 'Emily Thompson',
            date: 'August 31, 2023',
            isLarge: true,
        },
        {
            imageUrl: '/images/blogs/blogs_2.jpg',
            category: 'Balanced Diet',
            url: '/blogs/Taming-the-Fire-Within-Everything-You-Need-to-Know-About-Inflammation',
            title: 'Taming the Fire Within: Everything You Need to Know About Inflammation',
            author: 'Emily Thompson',
            date: 'August 31, 2023',
        },
        {
            imageUrl: '/images/blogs/blogs_3.jpg',
            category: 'Balanced Diet',
            url: '/blogs/Optimize-Your-Sleep-with-These-15-Strategies',
            title: 'Optimize Your Sleep with These 15 Strategies',
            author: 'Emily Thompson',
            date: 'August 31, 2023',
        },
    ];

    return (
        // Padding ajustado y quitado color de texto global innecesario aquí
        <section id='blogs' className='relative bg-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 '>
             {/* Encabezado */}
             <div className="flex justify-between items-center mb-8 sm:mb-12">
                <div className='flex flex-col gap-1 sm:gap-2'> {/* Ajustado gap */}
                    <span className="text-sm sm:text-base text-[#1B1F23]/80">✍️ Blogs</span>
                    <h2 className="text-3xl sm:text-4xl font-medium text-[#1B1F23]">Latest Articles</h2> {/* Ajustado tamaño de fuente */}
                </div>
                 {/* Link View All */}
                 <Link to="/blogs" className="text-sm sm:text-base underline text-[#1B1F23] hover:text-[#0052FF] transition-colors"> {/* Hover effect y tamaño de texto base */}
                     View All
                 </Link>
             </div>

             {/* Grid de Artículos con proporción 52/48 en md+ */}
             {/* Cambiado md:grid-cols-3 a md:grid-cols-[minmax(0,_52fr)_minmax(0,_48fr)] */}
             <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_52fr)_minmax(0,_48fr)] gap-5 md:h-[500px]">
                 {/* Artículo Grande - Eliminado md:col-span-2 */}
                 <div>
                   {articles[0] && <ArticleCard {...articles[0]} isLarge={true} />}
                 </div>

                 {/* Artículos Pequeños - Eliminado md:col-span-1 */}
                 <div className="flex flex-col gap-5">
                    {articles[1] && <ArticleCard {...articles[1]} />}
                    {articles[2] && <ArticleCard {...articles[2]} />}
                 </div>
             </div>
        </section>
    );
}
