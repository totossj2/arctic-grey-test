// RecommendedProducts.tsx
import { Suspense, useState, useRef, useEffect } from 'react';
import { Await, useFetcher } from '@remix-run/react';
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

interface Props {
    initialCollection: CollectionProductsQuery['collection'] | null;
}

// Mapeo de categorías a IDs de colección (Añade los IDs que faltan si los tienes)
const categoryCollectionIds: { [key: string]: string } = {
    'Sleep': 'gid://shopify/Collection/509335437588',
    'Cognitive Function': 'gid://shopify/Collection/509335503124',
    'Foundational Health': 'gid://shopify/Collection/509335535892',
    'Athletic Performance': 'gid://shopify/Collection/509340090644',
    'Hormone Support': 'gid://shopify/Collection/509340123412',
};

// Definir las categorías que tienen un ID asociado
const availableCategories = Object.keys(categoryCollectionIds);

// --- Responsive Settings ---
// Define breakpoints and corresponding items per page and gap based on Tailwind defaults
const responsiveSettings = [
  { breakpoint: 0,    items: 1, gap: 16 }, // Mobile default (< sm)
  { breakpoint: 640,  items: 2, gap: 16 }, // sm
  { breakpoint: 768,  items: 3, gap: 20 }, // md
  { breakpoint: 1024, items: 4, gap: 24 }, // lg
];
// --- End Responsive Settings ---

export default function Bundles({ initialCollection }: Props) {
    const fetcher = useFetcher<CollectionProductsQuery>();
    const [selectedCategory, setSelectedCategory] = useState(availableCategories[0] || 'Sleep');
    const [startIndex, setStartIndex] = useState(0);
    const carouselContainerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number | null>(null);
    // --- State for responsive settings ---
    const [itemsPerPage, setItemsPerPage] = useState(responsiveSettings[responsiveSettings.length - 1].items); // Default to largest
    const [gapPx, setGapPx] = useState(responsiveSettings[responsiveSettings.length - 1].gap);
    // --- End State for responsive settings ---

    // Efecto para iniciar la carga de datos
    useEffect(() => {
        const isInitialCategory = selectedCategory === availableCategories[0];
        if (isInitialCategory && initialCollection) {
            return; 
        }
        const collectionId = categoryCollectionIds[selectedCategory];
        if (collectionId) {
            if (fetcher.state === 'idle' && (!fetcher.data || (fetcher.data.collection as any)?.id !== collectionId)) {
                fetcher.load(`/api/collection-products?collectionId=${collectionId}`);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, initialCollection]); // Depende solo de la categoría y datos iniciales

    const handleCategoryClick = (category: string) => {
        if (category !== selectedCategory) {
            setSelectedCategory(category);
            setStartIndex(0);
        }
    };

    // Hook para ResizeObserver y actualizar itemsPerPage/gapPx
    useEffect(() => {
        const el = carouselContainerRef.current;
        if (!el) return;

        const updateLayoutSettings = (width: number) => {
          setContainerWidth(width);
          // Find the correct settings based on width
          let currentSettings = responsiveSettings[0]; // Default to smallest breakpoint setting
          for (let i = responsiveSettings.length - 1; i >= 0; i--) {
            if (width >= responsiveSettings[i].breakpoint) {
              currentSettings = responsiveSettings[i];
              break;
            }
          }
          // Set state based on the determined settings
          setItemsPerPage(currentSettings.items);
          setGapPx(currentSettings.gap);

          // Reset startIndex if it becomes invalid with new itemsPerPage
          // Ensure startIndex does not exceed the maximum possible value
          const currentProducts = getCurrentProducts(); // Helper function to get products
          const maxPossibleIndex = Math.max(0, currentProducts.length - itemsPerPage);
            if (startIndex > maxPossibleIndex) {
                 setStartIndex(maxPossibleIndex); // Adjust startIndex if out of bounds
            }
        };


        const ro = new ResizeObserver(([entry]) => {
             updateLayoutSettings(entry.contentRect.width);
        });

        ro.observe(el);
        // Initial calculation
        updateLayoutSettings(el.offsetWidth);

        return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startIndex]); // Add startIndex to deps to recalculate max index if needed

    // Determinar qué categoría está seleccionada para lógica de datos
    const isInitialCategorySelected = selectedCategory === availableCategories[0];

    // --- Helper to get current products consistently ---
    const getCurrentProducts = (): ProductNode[] => {
        let currentCollectionData: CollectionProductsQuery['collection'] | null | undefined = null;

        if (isInitialCategorySelected && initialCollection) {
            currentCollectionData = initialCollection;
        } else if (fetcher.data?.collection) {
            // Ensure we don't overwrite initial data if fetcher completes for initial category
            if (!isInitialCategorySelected || !initialCollection) {
                 currentCollectionData = fetcher.data.collection;
            }
        }
        // Fallback if fetcher is loading or no data yet, but we have initial
        if (!currentCollectionData && isInitialCategorySelected && initialCollection) {
             currentCollectionData = initialCollection;
        }
        return (currentCollectionData?.products?.nodes || []) as ProductNode[];
    }
    // --- End Helper ---


    // Usamos 'as any' temporalmente para evitar error de linter.
    const productsToShow: ProductNode[] = getCurrentProducts();
    // Determinar título y handle basados en los datos actuales
    const currentDataForMeta = isInitialCategorySelected && initialCollection ? initialCollection : fetcher.data?.collection;
    const collectionTitle = (currentDataForMeta as any)?.title ?? "Bundles";
    const collectionHandle = (currentDataForMeta as any)?.handle ?? 'all';


    // Lógica del carrusel - depends on state itemsPerPage
    const handlePrev = () => setStartIndex(i => Math.max(0, i - 1));
    const handleNext = () =>
        setStartIndex(i =>
            Math.min(Math.max(0, productsToShow.length - itemsPerPage), i + 1) // Use state itemsPerPage
        );

    const canPrev = startIndex > 0;
    const canNext = startIndex < productsToShow.length - itemsPerPage; // Use state itemsPerPage

    // --- Swipe Handlers ---
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => { if (canNext) handleNext(); },
        onSwipedRight: () => { if (canPrev) handlePrev(); },
        trackMouse: true, // Permitir arrastrar con el ratón en desktop
        preventScrollOnSwipe: true, // Prevenir scroll vertical durante swipe horizontal
    });
    // --- End Swipe Handlers ---

    const itemW = containerWidth !== null && itemsPerPage > 0 // Check itemsPerPage > 0
        ? (containerWidth - (itemsPerPage - 1) * gapPx) / itemsPerPage // Use state gapPx & itemsPerPage
        : 0;
    const tx = containerWidth !== null && itemW > 0 // Check itemW > 0 to avoid NaN/Infinity issues
        ? startIndex * (itemW + gapPx) // Use state gapPx
        : 0;

    // Renderizar el componente
    return (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white"> {/* Adjusted padding */}
            <div className="max-w-screen"> {/* Consider max-w-7xl or similar if needed */}
                {/* Header y botones de categoría */}
                {/* Use flex-col on small screens, flex-row on larger screens */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-8 w-full gap-6 lg:gap-0">
                    {/* Title section */}
                    <div className="flex flex-row items-center gap-4 lg:gap-8 w-full lg:w-auto"> {/* Adjusted gap */}
                        <div className="text-start">
                           <p className="text-sm md:text-base text-[#1B1F23]"> {/* Adjusted text size */}
                               <span role="img" aria-label="thinking face" className="mr-1">📦</span> Goals Specific
                           </p>
                           <h2 className="mt-1 md:mt-2 text-3xl md:text-[40px] leading-tight md:leading-[40px] font-medium tracking-tight text-gray-900"> {/* Adjusted text size/leading */}
                               Bundles
                           </h2>
                        </div>
                    </div>

                     {/* Category buttons - wrap on smaller screens */}
                     <div className='flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 md:gap-x-8 lg:gap-x-12 text-[#1B1F23] text-[14px] flex-grow lg:flex-grow-0 lg:pl-8'> {/* Added wrap and gap */}
                        {availableCategories.map((category) => (
                            <li
                                key={category}
                                className={`list-none cursor-pointer whitespace-nowrap ${selectedCategory === category ? 'underline underline-offset-8 md:underline-offset-10 decoration-1' : ''}`} // Adjusted offset
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </div>

                    {/* Navigation section - stack on small screens */}
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                        <div className="text-center order-2 sm:order-1">
                             {/* Adjusted text size */}
                            <a href={`/collections/${collectionHandle}`} className="text-base md:text-[18px] text-[#1B1F23] hover:text-[#1B1F23]/50 underline">View All Bundles</a>
                        </div>
                         {/* Buttons */}
                        <div className="flex flex-row items-center gap-3 order-1 sm:order-2"> {/* Adjusted gap */}
                            <button
                                className={`p-2 md:p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canPrev ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`} // Adjusted padding
                                onClick={handlePrev} disabled={!canPrev || fetcher.state === 'loading'} aria-label="Previous products"
                            >
                                <ArrowLeftIcon />
                            </button>
                            <button
                                className={`p-2 md:p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canNext ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`} // Adjusted padding
                                onClick={handleNext} disabled={!canNext || fetcher.state === 'loading'} aria-label="Next products"
                            >
                                <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenedor del carrusel con minHeight fijo */}
                <div
                    ref={carouselContainerRef}
                    className="overflow-hidden w-full relative"
                    style={{ minHeight: '450px' }} // Adjusted minHeight slightly if needed
                >
                    {/* Use transition for smooth transform */}
                    <div
                        {...swipeHandlers}
                        className="flex transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing"
                        style={{
                            gap: `${gapPx}px`, // Use state gapPx
                            transform: `translateX(-${tx}px)`, // Use state tx
                        }}
                    >
                         {containerWidth !== null && itemW > 0 && productsToShow.length > 0 ? ( // Check itemW > 0
                            productsToShow.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    style={{ width: `${itemW}px`, flexShrink: 0 }} // Use state itemW
                                    version='bundle'
                                />
                            ))
                        ) : (
                             fetcher.state !== 'loading' && <div className="text-center py-10 w-full">No products found in {collectionTitle}.</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
