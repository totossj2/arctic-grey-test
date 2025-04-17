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
      <div className="max-w-screen">
        <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
          <Await resolve={products}>
            {(response) => {
              console.log('Await response:', response);

              // Temporary: Cast response to any to access title
              const collectionTitle = (response as any)?.collection?.title || "Products";
              const allProducts = (response as any)?.collection?.products?.nodes || [];

              const [startIndex, setStartIndex] = useState(0);
              const itemsPerPage = 4;
              const carouselContainerRef = useRef<HTMLDivElement>(null);
              const [containerWidth, setContainerWidth] = useState<number | null>(null);
              const gapPx = 24;

              useEffect(() => {
                const el = carouselContainerRef.current;
                if (!el) return;
                const ro = new ResizeObserver(([entry]) => {
                  setContainerWidth(entry.contentRect.width);
                });
                ro.observe(el);
                setContainerWidth(el.offsetWidth);
                return () => ro.disconnect();
              }, [allProducts]);

              if (allProducts.length === 0) {
                return <div className="text-center py-10">No products found in {collectionTitle}.</div>;
              }

              const handlePrev = () => setStartIndex(i => Math.max(0, i - 1));
              const handleNext = () =>
                setStartIndex(i =>
                  Math.min(Math.max(0, allProducts.length - itemsPerPage), i + 1)
                );

              const canPrev = startIndex > 0;
              const canNext = startIndex < allProducts.length - itemsPerPage;
              const itemW = containerWidth !== null
                ? (containerWidth - (itemsPerPage - 1) * gapPx) / itemsPerPage
                : 0;
              const tx = containerWidth !== null
                ? startIndex * (itemW + gapPx)
                : 0;

              return (
                <>
                  {/* Header and Buttons */}
                  <div className="flex flex-col items-center justify-center gap-4 mb-8">
                    <div className="text-center flex flex-row items-center justify-center gap-16">
                      <button
                        className={`p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canPrev ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
                        onClick={handlePrev} disabled={!canPrev} aria-label="Previous products"
                      >
                        <ArrowLeftIcon />
                      </button>
                      <div className='flex flex-col items-center justify-center'>
                        <div className="flex items-center capitalize justify-center text-[16px] text-black mb-1"><span className="mr-1 ">🌟</span> {collectionTitle}</div>
                        <h2 className="text-[40px] font-medium text-[#1B1F23] tracking-tight">Supplements</h2>
                      </div>
                      <button
                        className={`p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canNext ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
                        onClick={handleNext} disabled={!canNext} aria-label="Next products"
                      >
                        <ArrowRightIcon />
                      </button>
                    </div>
                    <div className="text-center"><a href={`/collections/${collectionTitle}`} className="text-[16px] text-[#1B1F23] hover:text-[#1B1F23]/50 underline mt-2 inline-block">View All</a></div>
                  </div>

                  {/* Carousel Container - Always rendered for measurement */}
                  <div ref={carouselContainerRef} className="overflow-hidden w-full">
                    {/* Inner Sliding Container - Initially hidden, fades in */}
                    <div
                      className={`flex transition-transform duration-300 ease-in-out opacity-0 transition-opacity ${containerWidth !== null ? 'opacity-100' : ''}`}
                      style={{
                        gap: `${gapPx}px`,
                        transform: `translateX(-${tx}px)`,
                        // Add min-height matching placeholder to prevent layout shift if needed
                        minHeight: containerWidth === null ? '500px' : undefined
                      }}
                    >
                      {/* Render cards only if width is calculated to avoid incorrect initial styles */}
                      {containerWidth !== null && allProducts.map((product: ProductNode, idx: number) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          style={{ width: `${itemW}px`, flexShrink: 0 }}
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
