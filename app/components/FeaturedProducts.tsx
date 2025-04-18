import { Image, Money } from '@shopify/hydrogen';
import type { Collection } from '@shopify/hydrogen/storefront-api-types'; // Using a general type
import { Link } from '@remix-run/react';
import type { ProductNode } from '~/components/ProductCard'; // Import ProductNode type
import { useState } from 'react'; // Import useState
import type { SVGProps } from 'react'; // Import SVGProps type

// Define the expected structure for the collection prop using ProductNode
interface FeaturedProductsProps {
  products: {
    collection: Pick<Collection, 'id' | 'title' | 'handle'> & {
      products: {
        nodes: ProductNode[]; // Use ProductNode[] which includes images
      };
    };
  } | null; // Allow null if data isn't loaded
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0); // State for current product index

  const productNodes = products?.collection?.products?.nodes;
  const totalProducts = productNodes?.length ?? 0;

  // Get the currently selected product based on currentIndex
  const featuredProduct = productNodes?.[currentIndex];

  // Handlers for arrow clicks
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalProducts - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalProducts - 1 ? 0 : prevIndex + 1
    );
  };

  // Define props for icons if needed
  interface IconProps extends SVGProps<SVGSVGElement> {}

  // Updated LeafIcon to accept props and apply fill universally
  const LeafIcon = ({ fill = 'white', ...props }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_10435_4940)">
        {/* Apply the single fill color to all paths */}
        <path d="M12.5168 1.57227H11.4857V15.9676H12.5168V1.57227Z" fill={fill} />
        <path d="M0.933392 13.4238L0.204346 14.1528L8.78376 22.7322L9.5128 22.0032L0.933392 13.4238Z" fill={fill} />
        <path d="M23.0661 13.4212L14.478 22.0093L15.2071 22.7383L23.7952 14.1502L23.0661 13.4212Z" fill={fill} />
        <path d="M12.0012 16.483C11.8889 16.483 11.7767 16.4465 11.6833 16.3733C11.6393 16.3389 10.5941 15.5143 9.5395 14.1788C8.12116 12.3827 7.37146 10.5123 7.37146 8.76982C7.37146 7.02733 8.12116 5.15698 9.5395 3.36082C10.5941 2.0253 11.6393 1.20075 11.6833 1.16631C11.87 1.02009 12.1324 1.02009 12.319 1.16631C12.363 1.20075 13.4082 2.0253 14.4628 3.36082C15.8812 5.15698 16.6309 7.02737 16.6309 8.76982C16.6309 10.5123 15.8812 12.3827 14.4628 14.1788C13.4082 15.5143 12.363 16.3389 12.319 16.3733C12.2257 16.4464 12.1134 16.483 12.0012 16.483ZM12.0012 2.24941C11.0678 3.08174 8.40254 5.72546 8.40254 8.76982C8.40254 11.8142 11.0676 14.4578 12.0012 15.2902C12.9346 14.4579 15.5998 11.8142 15.5998 8.76982C15.5998 5.72546 12.9347 3.08188 12.0012 2.24941Z" fill={fill} />
        <path d="M8.06205 22.9366C6.5282 22.9366 3.80739 22.6596 2.04221 20.8944C-0.475537 18.3767 0.0342632 13.9147 0.0572272 13.726C0.085815 13.4906 0.271355 13.3051 0.506759 13.2765C0.695486 13.2535 5.15748 12.7437 7.67523 15.2614C10.1929 17.7791 9.68313 22.2412 9.66016 22.4299C9.63157 22.6653 9.44603 22.8508 9.21063 22.8794C9.15425 22.8863 8.71592 22.9366 8.06205 22.9366ZM1.04955 14.2687C0.993971 15.3754 1.01914 18.4133 2.77124 20.1654C4.52302 21.9172 7.5606 21.9426 8.66788 21.8871C8.72346 20.7804 8.6983 17.7425 6.94619 15.9904C5.19437 14.2386 2.15693 14.2134 1.04955 14.2687Z" fill={fill} />
        <path d="M15.9304 22.943C15.2756 22.943 14.8371 22.8925 14.7806 22.8857C14.5452 22.8571 14.3597 22.6716 14.3311 22.4362C14.3081 22.2472 13.7978 17.7809 16.3179 15.2609C18.838 12.7408 23.3043 13.2511 23.4931 13.274C23.7286 13.3026 23.9141 13.4882 23.9427 13.7236C23.9656 13.9125 24.476 18.3788 21.9559 20.8989C20.1892 22.6656 17.4658 22.943 15.9304 22.943ZM15.3234 21.8934C16.4309 21.949 19.4726 21.9241 21.2269 20.1698C22.9811 18.4156 23.0061 15.3742 22.9504 14.2663C21.8429 14.2107 18.8012 14.2356 17.047 15.9899C15.2928 17.7441 15.2677 20.7855 15.3234 21.8934Z" fill={fill} />
      </g>
      <defs>
        <clipPath id="clip0_10435_4940">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
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
  

  // Don't render the section if there are no products
  if (!productNodes || totalProducts === 0 || !featuredProduct) {
    return null;
  }

  // Prepare data for dynamic sections
  const blendTags = featuredProduct.tags?.slice(0, 3) ?? [];
  const productTitle = featuredProduct.title ?? 'Product Title';
  const productDescription = featuredProduct.description ?? 'No description available.';

  return (
    <section className="py-16 lg:py-24 bg-[#F6F6F5]">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 mb-1 tracking-wide">Simple & Effective Ingredients</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-10 md:mb-16 min-h-[48px] flex items-center justify-center">
          {productTitle}
        </h2>
        <div className='flex flex-row items-center justify-around '>
          {totalProducts > 1 && (
            <button
              aria-label="Previous Item"
              onClick={handlePrev}
              className={`p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors hover:bg-gray-200 cursor-pointer`}
            >
              <ArrowLeftIcon />
            </button>
          )}
          <div className="relative bg-white rounded-[8px] w-[85%] ">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="w-full lg:w-[43%] flex justify-center lg:justify-end">
                <div className="max-w-md w-full">
                  {featuredProduct.images?.nodes?.[0] ? (
                    <Image
                      key={featuredProduct.id}
                      data={featuredProduct.images.nodes[0]}
                      sizes="(max-width: 1024px) 90vw, 40vw"
                      className="w-full h-auto object-contain rounded transition-opacity duration-300 ease-in-out"
                    />
                  ) : (
                    <div className="bg-gray-200 aspect-square w-full rounded flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-full text-left flex flex-col">
                <div className="bg-[#1B1F23] text-white text-center w-full py-8 px-14 gap-6 flex flex-col rounded-t-lg">
                  <h3 className="text-2xl font-medium">The Blend</h3>
                  <div className="flex justify-around items-start min-h-[60px]">
                    {blendTags.length > 0 ? (
                      blendTags.map((tag, index) => (
                        <div key={index} className="flex flex-row items-center text-center px-2 w-1/3 ">
                          <div className="flex items-center justify-center p-3 bg-[#252A2F] rounded-full mr-2 flex-shrink-0">
                            <LeafIcon />
                          </div>
                          <p className="text-lg line-clamp-2 text-left">{tag}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic w-full">No features listed.</p>
                    )}
                    {[...Array(Math.max(0, 3 - blendTags.length))].map((_, i) => (
                      <div key={`placeholder-${i}`} className="flex flex-col items-center text-center px-2 opacity-50 w-1/3 min-h-[60px]">
                        <p className="text-sm font-medium mt-1">Feature</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-14 py-8 flex gap-8 flex-col items-center flex-grow bg-white rounded-b-lg ">
                  <h4 className="text-lg font-medium text-center">Active Ingredients</h4>
                  <div className="grid grid-cols-3 gap-4 md:gap-6 text-left w-full ">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-start gap-3 h-[180px]">
                        <div className="flex items-center justify-center w-fit h-fit p-3 bg-[#F6F6F5] rounded-full flex-shrink-0">
                          <LeafIcon fill='#1B1F23' />
                        </div>
                        <h5 className="font-medium text-[16px]">{productTitle}</h5>
                        <p className="text-sm text-[#1B1F23]/60 leading-snug line-clamp-3 overflow-hidden">
                          {productDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link
                      key={featuredProduct.id}
                      to={`/products/${featuredProduct.handle}`}
                      className="inline-block bg-[#1B1F23] w-full mt-auto text-white py-3 px-10 text-center rounded-md hover:bg-gray-700 transition text-[16px] duration-300 font-medium shadow-md"
                  >
                      Customize This Blend
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {totalProducts > 1 && (
            <button
              aria-label="Next Item"
              onClick={handleNext}
              className={`p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors hover:bg-gray-200 cursor-pointer`}
            >
              <ArrowRightIcon />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// Added default export to resolve potential module issues
export default FeaturedProducts;
