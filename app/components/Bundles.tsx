// Bundles.tsx - Displays categorized product bundles in a carousel
import { useState, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ProductCard, PRODUCT_CARD_FRAGMENT, ProductNode } from './ProductCard';
import type { CollectionProductsQuery } from 'storefrontapi.generated';

// SVGs omited…
// Placeholder Arrow SVG components
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

// Mapeo de categorías a IDs de colección
export const categoryCollectionIds: { [key: string]: string } = {
    'Sleep': 'gid://shopify/Collection/509335437588',
    'Cognitive Function': 'gid://shopify/Collection/509335503124',
    'Foundational Health': 'gid://shopify/Collection/509335535892',
    'Athletic Performance': 'gid://shopify/Collection/509340090644',
    'Hormone Support': 'gid://shopify/Collection/509340123412',
};

// Definir las categorías que tienen un ID asociado
export const availableCategories = Object.keys(categoryCollectionIds);

// --- Responsive Settings ---
// Define breakpoints and corresponding items per page and gap based on Tailwind defaults
const responsiveSettings = [
  { breakpoint: 0,    items: 1, gap: 16 }, // Mobile default (< sm)
  { breakpoint: 640,  items: 2, gap: 16 }, // sm
  { breakpoint: 768,  items: 3, gap: 20 }, // md
  { breakpoint: 1024, items: 4, gap: 24 }, // lg
];
// --- End Responsive Settings ---

// Nueva interfaz para las props
interface Props {
    allCollectionsData: Record<string, CollectionProductsQuery['collection'] | null>;
}

export default function Bundles({ allCollectionsData }: Props) {
    const [selectedCategory, setSelectedCategory] = useState(availableCategories[0] || 'Sleep');
    const [startIndex, setStartIndex] = useState(0);
    const carouselContainerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState(responsiveSettings[responsiveSettings.length - 1].items);
    const [gapPx, setGapPx] = useState(responsiveSettings[responsiveSettings.length - 1].gap);

    const handleCategoryClick = (category: string) => {
        if (category !== selectedCategory) {
            setSelectedCategory(category);
            setStartIndex(0); // Reset index on category change
        }
    };

    // Hook para ResizeObserver (lógica interna simplificada respecto a productos)
    useEffect(() => {
        const el = carouselContainerRef.current;
        if (!el) return;

        const updateLayoutSettings = (width: number) => {
          setContainerWidth(width);
          let currentSettings = responsiveSettings[0];
          for (let i = responsiveSettings.length - 1; i >= 0; i--) {
            if (width >= responsiveSettings[i].breakpoint) {
              currentSettings = responsiveSettings[i];
              break;
            }
          }
          setItemsPerPage(currentSettings.items);
          setGapPx(currentSettings.gap);

          // Recalcular max index basado en la categoría actual
          const currentProducts = allCollectionsData[selectedCategory]?.products?.nodes || [];
          const maxPossibleIndex = Math.max(0, currentProducts.length - itemsPerPage);
          if (startIndex > maxPossibleIndex) {
            setStartIndex(maxPossibleIndex);
          }
        };

        const ro = new ResizeObserver(([entry]) => {
             updateLayoutSettings(entry.contentRect.width);
        });

        ro.observe(el);
        updateLayoutSettings(el.offsetWidth);

        return () => ro.disconnect();
    // Dependencias simplificadas: solo recalcular en cambio de categoría o itemsPerPage
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, itemsPerPage]);

    // --- Obtener productos, título y handle de la categoría seleccionada --- 
    const currentCollection = allCollectionsData[selectedCategory];
    const productsToShow: ProductNode[] = (currentCollection?.products?.nodes || []) as ProductNode[];
    
    // Guarda de tipo más específica para title y handle
    let collectionTitle = selectedCategory; // Default
    let collectionHandle = 'all'; // Default
    if (currentCollection && 'title' in currentCollection && 'handle' in currentCollection) {
        collectionTitle = currentCollection.title;
        collectionHandle = currentCollection.handle;
    }
    // --- Fin obtención de datos --- 

    const handlePrev = () => {
        setStartIndex(i => Math.max(0, i - itemsPerPage));
    };
    
    const handleNext = () => {
      const maxIndex = Math.max(0, productsToShow.length - itemsPerPage);
      setStartIndex(i => Math.min(i + itemsPerPage, maxIndex));
    };
      
    const canPrev = startIndex > 0;
    const canNext = startIndex < productsToShow.length - itemsPerPage;

    // --- Swipe Handlers ---
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => { if (canNext) handleNext(); },
        onSwipedRight: () => { if (canPrev) handlePrev(); },
        trackMouse: true, // Permitir arrastrar con el ratón en desktop
        preventScrollOnSwipe: true, // Prevenir scroll vertical durante swipe horizontal
    });
    // --- End Swipe Handlers ---

    const itemW = containerWidth !== null && itemsPerPage > 0
        ? (containerWidth - (itemsPerPage - 1) * gapPx) / itemsPerPage
        : 0;
    const tx = containerWidth !== null && itemW > 0
        ? startIndex * (itemW + gapPx)
        : 0;

    // Renderizar el componente
    return (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-screen">
                {/* Header y botones de categoría */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-8 w-full gap-6 lg:gap-0">
                    {/* Title section */}
                    <div className="flex flex-row justify-between items-center gap-4 lg:gap-8 w-full lg:w-auto">
                        <div className="text-start">
                           <p className="text-sm md:text-base text-[#1B1F23]">
                               <span role="img" aria-label="thinking face" className="mr-1">📦</span> Goals Specific
                           </p>
                           <h2 className="mt-1 md:mt-2 text-3xl md:text-[40px] leading-tight md:leading-[40px] font-medium tracking-tight text-gray-900">
                               Bundles
                           </h2>
                        </div>
                        <a href={`/collections/${collectionHandle}`} className="block md:hidden text-base md:text-[18px] text-[#1B1F23] hover:text-[#1B1F23]/50 underline">View All Bundles</a>
                    </div>

                     {/* Category buttons */}
                     <div className='flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 md:gap-x-8 lg:gap-x-12 text-[#1B1F23] text-[14px] flex-grow lg:flex-grow-0 lg:pl-8'>
                        {availableCategories.map((category) => (
                            <li
                                key={category}
                                className={`list-none cursor-pointer whitespace-nowrap ${selectedCategory === category ? 'underline underline-offset-8 md:underline-offset-10 decoration-1' : ''}`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </div>

                    {/* Navigation section */}
                    <div className="flex  flex-row-reverse md:flex-row items-center justify-between md:justify-center sm:justify-end gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                        <div className="text-center order-2 sm:order-1">
                            <a href={`/collections/${collectionHandle}`} className="hidden md:block text-base md:text-[18px] text-[#1B1F23] hover:text-[#1B1F23]/50 underline">View All Bundles</a>
                        </div>
                         {/* Buttons - fetcher.state eliminado de disabled */}
                        <div className="flex flex-row items-center gap-3 order-1 sm:order-2">
                            <button
                                className={`p-2 md:p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canPrev ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
                                onClick={handlePrev} disabled={!canPrev} aria-label="Previous products"
                            >
                                <ArrowLeftIcon />
                            </button>
                            <button
                                className={`p-2 md:p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canNext ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
                                onClick={handleNext} disabled={!canNext} aria-label="Next products"
                            >
                                <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenedor del carrusel */}
                <div
                    ref={carouselContainerRef}
                    className="overflow-hidden w-full relative"
                    style={{ minHeight: '450px' }}
                >
                    <div
                        {...swipeHandlers}
                        className="flex transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing"
                        style={{ gap: `${gapPx}px`, transform: `translateX(-${tx}px)` }}
                    >
                         {containerWidth !== null && itemW > 0 && productsToShow.length > 0 ? (
                            productsToShow.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    style={{ width: `${itemW}px`, flexShrink: 0 }}
                                    version='bundle'
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 w-full">No products found in {collectionTitle}.</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
