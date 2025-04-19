// RecommendedProducts.tsx
import { Suspense, useState, useRef, useEffect } from 'react';
import { Await } from '@remix-run/react';
import { ProductCard, PRODUCT_CARD_FRAGMENT, ProductNode } from './ProductCard';
import type { CollectionProductsQuery } from 'storefrontapi.generated';

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
}

export default function RecommendedProducts({ products }: Props) {
  // Static data for tags - adjust as needed
  const productTags: { [key: number]: string[] } = {
    0: [], 1: ['GMO Free', 'Gluten Free'], 2: ['GMO Free', 'Vegan', 'Dairy Free'], 3: ['Gluten Free', 'Vegan', 'Dairy Free'],
  };
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F7F7]">
      <div className="max-w-screen mx-auto">
        <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
          <Await resolve={products}>
            {(response) => {
              console.log('Await response:', response);

              // Temporary: Cast response to any to access title
              const collectionTitle = (response as any)?.collection?.title || "Products";
              const allProducts = (response as any)?.collection?.products?.nodes || [];

              const [startIndex, setStartIndex] = useState(0);
              const carouselContainerRef = useRef<HTMLDivElement>(null);
              const [containerWidth, setContainerWidth] = useState<number | null>(null);
              const [itemsPerPage, setItemsPerPage] = useState(4); // Default to 4, will update
              const gapPx = 24; // Equivalent to gap-6 in Tailwind (24px)

              // Touch swipe state
              const touchStartX = useRef(0);
              const touchEndX = useRef(0);
              const isDragging = useRef(false);
              const dragOffset = useRef(0); // To show visual drag feedback

              // --- Responsive Logic ---
              useEffect(() => {
                const el = carouselContainerRef.current;
                if (!el) return;

                const updateItemsPerPage = (width: number) => {
                  if (width < 640) return 1; // sm breakpoint
                  if (width < 768) return 2; // md breakpoint
                  if (width < 1024) return 3; // lg breakpoint
                  return 4; // >= lg breakpoint
                };

                const ro = new ResizeObserver(([entry]) => {
                  const newWidth = entry.contentRect.width;
                  setContainerWidth(newWidth);
                  const newItemsPerPage = updateItemsPerPage(newWidth);
                  // Adjust startIndex if it becomes invalid after resize
                  setStartIndex(current => Math.min(current, Math.max(0, allProducts.length - newItemsPerPage)));
                  setItemsPerPage(newItemsPerPage);

                });

                ro.observe(el);
                // Initial calculation
                const initialWidth = el.offsetWidth;
                setContainerWidth(initialWidth);
                const initialItemsPerPage = updateItemsPerPage(initialWidth);
                 // Adjust startIndex if it becomes invalid after initial load
                setStartIndex(current => Math.min(current, Math.max(0, allProducts.length - initialItemsPerPage)));
                setItemsPerPage(initialItemsPerPage);


                return () => ro.disconnect();
              }, [allProducts.length]); // Rerun observer setup if product count changes

              if (allProducts.length === 0) {
                return <div className="text-center py-10">No products found in {collectionTitle}.</div>;
              }

              const handlePrev = () => {
                  setStartIndex(i => Math.max(0, i - 1));
                  dragOffset.current = 0; // Reset drag offset on navigation
              }

              const handleNext = () => {
                  setStartIndex(i => Math.min(Math.max(0, allProducts.length - itemsPerPage), i + 1));
                  dragOffset.current = 0; // Reset drag offset on navigation
              }

              const canPrev = startIndex > 0;
              const canNext = startIndex < Math.max(0, allProducts.length - itemsPerPage);

              const itemW = containerWidth !== null && itemsPerPage > 0
                ? (containerWidth - (itemsPerPage - 1) * gapPx) / itemsPerPage
                : 0;

              // Calculate total offset including drag
              const baseTx = containerWidth !== null && itemW > 0
                ? startIndex * (itemW + gapPx)
                : 0;
              const totalTx = baseTx - dragOffset.current; // Subtract drag offset


             // --- Touch Handlers ---
              const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
                touchStartX.current = e.targetTouches[0].clientX;
                touchEndX.current = touchStartX.current; // Initialize endX
                isDragging.current = true;
                // Disable transition during drag for immediate feedback
                if (e.currentTarget) {
                   e.currentTarget.style.transition = 'none';
                }
              };

              const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
                if (!isDragging.current) return;
                touchEndX.current = e.targetTouches[0].clientX;
                const diff = touchStartX.current - touchEndX.current;
                 // Limit drag offset visually if needed, but calculation uses full diff
                dragOffset.current = diff;
                 // Update transform directly for smooth feedback without re-render
                 if (e.currentTarget) {
                    e.currentTarget.style.transform = `translateX(-${totalTx}px)`;
                 }
              };

               const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
                if (!isDragging.current) return;
                isDragging.current = false;

                 // Re-enable transition
                 if (e.currentTarget) {
                    e.currentTarget.style.transition = 'transform 0.3s ease-in-out';
                    // Force repaint before transition
                    void e.currentTarget.offsetWidth;
                 }


                const diff = touchStartX.current - touchEndX.current;
                const threshold = itemW / 4; // Swipe threshold (e.g., 1/4 of item width)

                if (Math.abs(diff) > threshold) {
                  if (diff > 0 && canNext) { // Swipe left
                    handleNext();
                  } else if (diff < 0 && canPrev) { // Swipe right
                    handlePrev();
                  } else {
                     // Snap back if swipe didn't cross threshold or couldn't move
                     dragOffset.current = 0;
                      if (e.currentTarget) {
                        e.currentTarget.style.transform = `translateX(-${baseTx}px)`;
                     }
                  }
                } else {
                   // Snap back if swipe didn't cross threshold
                   dragOffset.current = 0;
                    if (e.currentTarget) {
                      e.currentTarget.style.transform = `translateX(-${baseTx}px)`;
                   }
                }

                 // Reset drag offset after snapping/navigation animation starts
                 // (setTimeout might be needed if transition isn't instant)
                 // setTimeout(() => dragOffset.current = 0, 300); // Match transition duration
                 // Simpler: Resetting in handlePrev/Next and snapback covers it.
              };


              return (
                <>
                  {/* Header and Buttons - Adjust visibility/layout for mobile? */}
                  <div className="flex flex-col items-center justify-center gap-4 mb-8">
                     {/* Centered Title and Subtitle for all screens */}
                    <div className='flex flex-col items-center justify-center mb-4'>
                         <div className="flex items-center capitalize justify-center text-sm sm:text-base text-black mb-1"><span className="mr-1 ">🌟</span> {collectionTitle}</div>
                         <h2 className="text-3xl sm:text-4xl font-medium text-[#1B1F23] tracking-tight">Supplements</h2>
                    </div>

                     {/* Buttons and View All Link */}
                    <div className="flex items-center justify-between w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
                      <button
                        className={`p-2 sm:p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canPrev ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
                        onClick={handlePrev} disabled={!canPrev} aria-label="Previous products"
                      >
                        <ArrowLeftIcon />
                      </button>
                      <a href={`/collections/${collectionTitle}`} className="text-sm sm:text-base text-[#1B1F23] hover:text-[#1B1F23]/50 underline inline-block mx-4">View All</a>
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
                         transform: `translateX(-${totalTx}px)`, // Use totalTx including drag offset
                         transition: isDragging.current ? 'none' : 'transform 0.3s ease-in-out', // Conditional transition
                         minHeight: containerWidth === null ? '500px' : undefined // Prevent layout shift
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
