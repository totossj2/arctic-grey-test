import {Suspense} from 'react';
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
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
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
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
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
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeftIcon />
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center text-sm font-medium text-gray-600 mb-1">
              <span className="mr-1">✨</span> Trending
            </div>
            <h2 className="text-3xl font-bold text-[#1B1F23] tracking-tight">
              Supplements
            </h2>
            <a href="#" className="text-sm font-medium text-gray-700 hover:underline mt-2 inline-block">
              View All
            </a>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowRightIcon />
          </button>
        </div>
        
        <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {response
                  ? response.products.nodes.map((product: any, index) => (
                      <div
                        key={product.id}
                        className={`bg-white rounded-lg border overflow-hidden flex flex-col transition-shadow duration-300 ${
                          index === 0
                            ? 'border-gray-300 shadow-lg relative'
                            : 'border-gray-200 hover:shadow-md'
                        }`}
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
                    ))
                  : null}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

export default RecommendedProducts; 