import {Suspense, useState, useRef, useEffect} from 'react';
import {Await, Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

// Placeholder Star SVG component
const StarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-4 h-4 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c.321-.662 1.135-.662 1.456 0l1.679 3.442 3.798.552c.73.106 1.021.99.494 1.502l-2.748 2.678.648 3.784c.124.726-.638 1.281-1.296.942L10 13.804l-3.4 1.786c-.658.34-1.42-.216-1.296-.942l.648-3.784L3.204 8.38c-.527-.512-.236-1.396.494-1.502l3.798-.552L9.175 2.884z"
      clipRule="evenodd"
    />
  </svg>
);

// Placeholder Arrow SVG components
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

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

export function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  // Static data for tags - adjust as needed
  const productTags: { [key: number]: string[] } = {
    0: [], // Omega 3 in image has no tags shown directly on card
    1: ['GMO Free', 'Gluten Free'],
    2: ['GMO Free', 'Vegan', 'Dairy Free'],
    3: ['Gluten Free', 'Vegan', 'Dairy Free'],
    // Add more tags if needed for products beyond index 3
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F7F7]">
      <div className="max-w-screen">

        <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
          <Await resolve={products}>
            {(response) => {
              const allProducts = response?.products?.nodes || [];
              const [startIndex, setStartIndex] = useState(0);
              const itemsPerPage = 4;
              const carouselContainerRef = useRef<HTMLDivElement>(null);
              const [containerWidth, setContainerWidth] = useState<number | null>(null);
              const gapPx = 24;

              useEffect(() => {
                const carouselElement = carouselContainerRef.current;
                if (!carouselElement) return;
                const resizeObserver = new ResizeObserver(entries => {
                  setContainerWidth(entries[0]?.contentRect.width);
                });
                resizeObserver.observe(carouselElement);
                setContainerWidth(carouselElement.offsetWidth);
                return () => resizeObserver.disconnect();
              }, [allProducts]);

              if (allProducts.length === 0) {
                 return <div className="text-center py-10">No products found.</div>;
              }

              const handlePrev = () => setStartIndex(prev => Math.max(0, prev - 1));
              const handleNext = () => setStartIndex(prev => Math.min(Math.max(0, allProducts.length - itemsPerPage), prev + 1));

              const canScrollPrev = startIndex > 0;
              const canScrollNext = startIndex < Math.max(0, allProducts.length - itemsPerPage);

              const itemWidthPx = containerWidth !== null ? (containerWidth - (itemsPerPage - 1) * gapPx) / itemsPerPage : 0;
              const translateXValue = containerWidth !== null ? startIndex * (itemWidthPx + gapPx) : 0;

              return (
                <>
                  {/* Button container */} 
                  <div className="flex flex-col items-center justify-center gap-4 mb-8">

                  <div className="text-center flex flex-row items-center justify-center gap-16">
                    <button
                      className={`p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canScrollPrev ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                      onClick={handlePrev}
                      disabled={!canScrollPrev}
                      aria-label="Previous products"
                    >
                      <ArrowLeftIcon />
                    </button>
                    <div className='flex flex-col items-center justify-center'>
                      <div className="flex items-center justify-center text-[16px] text-black mb-1">
                        <span className="mr-1">🌟</span> Trending
                      </div>
                      <h2 className="text-[40px] font-medium text-[#1B1F23] tracking-tight">
                        Supplements
                      </h2>
                    </div>
                    <button
                      className={`p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canScrollNext ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                      onClick={handleNext}
                      disabled={!canScrollNext}
                      aria-label="Next products"
                    >
                      <ArrowRightIcon />
                    </button>
                  </div>
                  <div className="text-center mb-4">

                    <a href="#" className="text-[16px] text-[#1B1F23] hover:text-[#1B1F23]/50 underline mt-2 inline-block">
                      View All
                    </a>
                  </div>


                    
                    <div className="w-20"></div> {/* Spacer */} 


                  </div>

                  {/* Carousel container */} 
                  <div ref={carouselContainerRef} className="overflow-hidden w-full">
                    {containerWidth === null ? (
                       <div className="text-center py-10 h-[500px]">Calculating layout...</div>
                    ) : (
                      <div
                        className="flex flex-nowrap transition-transform duration-300 ease-in-out"
                        style={{
                           display: 'flex',
                           gap: `${gapPx}px`,
                           transform: `translateX(-${translateXValue}px)`
                         }}
                      >
                        {allProducts.map((product: any, index: number) => (
                          <div
                            key={product.id}
                            className={`bg-white rounded-lg border overflow-hidden flex flex-col transition-shadow duration-300 ${ 
                              index === 0
                                ? 'border-gray-300 shadow-lg relative'
                                : 'border-gray-200 hover:shadow-md'
                            }`}
                            style={{
                              width: `${itemWidthPx}px`,
                              flexShrink: 0
                            }}
                          >
                            {index === 0 && (
                              <div className="absolute top-3 left-3 bg-[#FFD700] text-black text-xs font-semibold px-2.5 py-1 rounded z-10">
                                Bestseller
                              </div>
                            )}
                            <Link to={`/products/${product.handle}`} className="block p-6 pb-0 group">
                              <div className="aspect-square overflow-hidden relative mb-4">
                                <Image
                                  data={product.images.nodes[0]}
                                  aspectRatio="1/1"
                                  sizes="(min-width: 45em) 20vw, 50vw"
                                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            </Link>

                            <div className="p-4 pt-0 flex flex-col flex-grow text-center">
                              <h3 className="text-base font-semibold text-gray-800 mb-1">
                                <Link to={`/products/${product.handle}`} className="hover:underline">
                                  {product.title}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-600 mb-3 h-10">
                                {product.description ||
                                  (index === 0 ? "Cognitive Health & Foundational Health" : index === 1 ? "Enhances the quality of sleep." : index === 2 ? "Supports muscle mass and strength" : "Deepens sleep cycles for rejuvenated mornings")}
                              </p>

                              <div className="flex justify-center items-center mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon key={i} className="text-yellow-400" />
                                ))}
                              </div>

                              {(productTags[index] && productTags[index].length > 0) && (
                                <div className="flex justify-center flex-wrap gap-1.5 mb-4 text-xs text-gray-600 min-h-[22px]">
                                  {productTags[index].map(tag => (
                                    <span key={tag} className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                                      • {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="space-y-2 mb-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto overflow-hidden">
                                <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:border-gray-400">
                                  <input type="radio" name={`purchase-${product.id}`} value="onetime" className="mr-2 accent-gray-800" defaultChecked/>
                                  <span className="flex-grow font-medium text-left">One-Time Purchase</span>
                                  <span className="font-semibold"><Money data={product.priceRange.minVariantPrice} /></span>
                                </label>
                                <label className="flex items-center p-3 border-2 border-gray-800 rounded-md cursor-pointer relative">
                                  <input type="radio" name={`purchase-${product.id}`} value="subscribe" className="mr-2 accent-gray-800" />
                                  <span className="flex-grow font-medium text-left">Subscribe & Save</span>
                                  <span className="font-semibold mr-1">
                                    <Money data={{ amount: (parseFloat(product.priceRange.minVariantPrice.amount) * 0.9).toFixed(2), currencyCode: product.priceRange.minVariantPrice.currencyCode }} />
                                  </span>
                                  <span className="text-red-600 font-bold text-xs">Save 10%</span>
                                </label>
                              </div>

                              <div className="mt-auto relative h-[60px]">
                                <div className="absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300 flex flex-col items-center justify-center">
                                  <button className="w-full bg-[#212529] text-white py-2.5 px-4 rounded-md font-semibold hover:bg-gray-700 transition duration-200 text-sm">
                                    Add - <Money data={product.priceRange.minVariantPrice} />
                                  </button>
                                </div>

                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end">
                                  <button className="w-full bg-[#212529] text-white py-2.5 px-4 rounded-md font-semibold hover:bg-gray-700 transition duration-200 text-sm">
                                    Add to Cart - <Money data={product.priceRange.minVariantPrice} />
                                  </button>
                                  <Link to={`/products/${product.handle}`} className="block text-center text-sm text-gray-600 mt-2 hover:underline font-medium">
                                    View Full Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

// Helper class for hiding scrollbar if needed (add this to your global CSS or Tailwind config)
/*
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/

export default RecommendedProducts; 