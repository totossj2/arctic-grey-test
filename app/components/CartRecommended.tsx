// RecommendedProducts.tsx
import { Suspense, useState, useRef, useEffect } from 'react';
import { Await } from '@remix-run/react';
import { ProductCard, PRODUCT_CARD_FRAGMENT, ProductNode } from './CartProductCard';
import type { CollectionProductsQuery } from 'storefrontapi.generated';
import type { CartLayout } from './CartMain'; // Importar layout type

// Define and export the GraphQL query using the fragment
export const COLLECTION_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT} 
  query CollectionProducts(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      title
      products(first: 8) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;

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
  products: Promise<CollectionProductsQuery | null>;
  layout?: CartLayout; // Añadir layout opcional: 'page' o 'aside'
}

export default function CartRecommendedProducts({ products, layout = 'page' }: Props) {
  return (
    <section className="py-8  bg-white]">
      <div className="max-w-screen mx-auto">
        <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
          <Await resolve={products}>
            {(response) => {
              // Log para depurar - ¿Qué se resolvió de la promesa?
              console.log('[CartRecommendedProducts] Await resolved response:', response);

              const collectionTitle = (response as any)?.collection?.title || "Products";
              const allProducts = (response as any)?.collection?.products?.nodes || [];

              const [startIndex, setStartIndex] = useState(0);
              const carouselContainerRef = useRef<HTMLDivElement>(null);
              const [containerWidth, setContainerWidth] = useState<number | null>(null);
              // Estado para el número de items por página (entero, para paginación)
              const [itemsPerPage, setItemsPerPage] = useState(3); // Inicializar (se recalculará)
              // Estado para el ancho calculado de cada item
              const [itemW, setItemW] = useState<number>(0);
              const gapPx = 24; // Equivalente a gap-6 (24px)

              // Touch swipe state
              const touchStartX = useRef(0);
              const touchEndX = useRef(0);
              const isDragging = useRef(false);
              const dragOffset = useRef(0); // To show visual drag feedback

              // --- Responsive Logic Modificada ---
              useEffect(() => {
                const el = carouselContainerRef.current;
                if (!el) return;

                const mobileBreakpoint = 768;

                const updateLayout = (width: number) => {
                  if (width <= 0) return;

                  // Determinar número de items visibles según layout y ancho
                  // Si es aside (sidebar), siempre mostrar 2.5 items
                  const targetVisibleItems = layout === 'aside'
                    ? 2.2
                    : width < mobileBreakpoint
                      ? 1
                      : 2;

                  let newItemW = (width - (targetVisibleItems - 1) * gapPx) / targetVisibleItems;
                  if (newItemW <= 0) newItemW = width;

                  const newItemsPerPage = Math.ceil(targetVisibleItems);

                  setContainerWidth(width);
                  setItemW(newItemW);
                  setItemsPerPage(newItemsPerPage);

                  setStartIndex(current => {
                    const maxIndex = Math.max(0, allProducts.length - newItemsPerPage);
                    return Math.min(current, maxIndex);
                  });
                };

                const ro = new ResizeObserver(([entry]) => {
                  updateLayout(entry.contentRect.width);
                });

                ro.observe(el);
                updateLayout(el.offsetWidth);

                return () => ro.disconnect();
              }, [allProducts.length, gapPx, layout]);

              if (allProducts.length === 0) {
                 return <div className="text-center py-10">No products found in {collectionTitle}.</div>;
               }

              const handlePrev = () => {
                  setStartIndex(i => Math.max(0, i - 1));
                  dragOffset.current = 0;
              }

              const handleNext = () => {
                  // Usar itemsPerPage del estado
                  setStartIndex(i => Math.min(Math.max(0, allProducts.length - itemsPerPage), i + 1));
                  dragOffset.current = 0;
              }

              const canPrev = startIndex > 0;
              // Usar itemsPerPage del estado
              const canNext = startIndex < Math.max(0, allProducts.length - itemsPerPage);

              // Calcular translación base usando itemW del estado
              const baseTx = itemW > 0
                ? startIndex * (itemW + gapPx)
                : 0;
              const totalTx = baseTx - dragOffset.current; // Restar offset de arrastre

              // Log para depurar dimensiones y layout
              console.log(`[CartRecommendedProducts] layout=${layout}, containerWidth=${containerWidth}, itemW=${itemW}, itemsPerPage=${itemsPerPage}`);

              // --- Touch Handlers (Modificar threshold) ---
              const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
                touchStartX.current = e.targetTouches[0].clientX;
                touchEndX.current = touchStartX.current;
                isDragging.current = true;
                if (e.currentTarget) {
                   e.currentTarget.style.transition = 'none';
                }
              };

              const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
                if (!isDragging.current) return;
                touchEndX.current = e.targetTouches[0].clientX;
                const diff = touchStartX.current - touchEndX.current;
                dragOffset.current = diff;
                 if (e.currentTarget) {
                    e.currentTarget.style.transform = `translateX(-${totalTx}px)`;
                 }
              };

               const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
                if (!isDragging.current) return;
                isDragging.current = false;

                 if (e.currentTarget) {
                    e.currentTarget.style.transition = 'transform 0.3s ease-in-out';
                    void e.currentTarget.offsetWidth;
                 }

                const diff = touchStartX.current - touchEndX.current;
                // Usar itemW del estado para el threshold
                const threshold = itemW / 4;

                if (Math.abs(diff) > threshold) {
                  if (diff > 0 && canNext) { // Swipe left
                    handleNext();
                  } else if (diff < 0 && canPrev) { // Swipe right
                    handlePrev();
                  } else {
                     // Snap back
                     dragOffset.current = 0;
                      if (e.currentTarget) {
                        e.currentTarget.style.transform = `translateX(-${baseTx}px)`;
                     }
                  }
                } else {
                   // Snap back
                   dragOffset.current = 0;
                    if (e.currentTarget) {
                      e.currentTarget.style.transform = `translateX(-${baseTx}px)`;
                   }
                }
              };

              return (
                <>
                  {/* Header and Buttons - Adjust visibility/layout for mobile? */}
                  <div className="flex flex-row items-center justify-between gap-4 mb-8">

                    <h2 className="text-[14px] text-left md:text-[22px] ">Enhance Your Performance</h2>


                     {/* Buttons and View All Link */}
                    <div className="flex items-center justify-end gap-4 w-fit md:justify-between  max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ">
                      <button
                        className={`p-2 sm:p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canPrev ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
                        onClick={handlePrev} disabled={!canPrev} aria-label="Previous products"
                      >
                        <ArrowLeftIcon />
                      </button>
                       <button
                        className={`p-2 sm:p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canNext ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
                        onClick={handleNext} disabled={!canNext} aria-label="Next products"
                      >
                        <ArrowRightIcon />
                      </button>
                    </div>
                  </div>

                  {/* Carousel Container - Always rendered for measurement */}
                  <div ref={carouselContainerRef} className="overflow-hidden w-full cursor-grab active:cursor-grabbing">
                    {/* Inner Sliding Container - Add touch handlers */}
                    <div
                       className={`flex opacity-0 transition-opacity ${containerWidth !== null ? 'opacity-100' : ''}`}
                       style={{
                         gap: `${gapPx}px`,
                         transform: `translateX(-${totalTx}px)`,
                         transition: isDragging.current ? 'none' : 'transform 0.3s ease-in-out',
                         minHeight: containerWidth === null ? '300px' : undefined // Reducir un poco el minHeight?
                       }}
                       onTouchStart={handleTouchStart}
                       onTouchMove={handleTouchMove}
                       onTouchEnd={handleTouchEnd}
                     >
                      {/* Render cards only if width and itemW are calculated */}
                      {containerWidth !== null && itemW > 0 && allProducts.map((product: ProductNode) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          style={{ width: `${itemW}px`, flexShrink: 0 }}
                          // Prevent card interactions during swipe
                          className={isDragging.current ? 'pointer-events-none' : ''}
                        />
                      ))}
                    </div>
                  </div>
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}
