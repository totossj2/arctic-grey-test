import React, { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import type { CurrencyCode } from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from './AddToCartButton';
import {useAside} from './Aside';


// Define and export the fragment
export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    description
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
  }
` as const;

// Placeholder Star SVG component
const StarIcon = ({ className }: { className?: string }) => (
  <svg className={`w-4 h-4 ${className}`} viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0.5L7.34708 4.6459H11.7063L8.17963 7.2082L9.52671 11.3541L6 8.7918L2.47329 11.3541L3.82037 7.2082L0.293661 4.6459H4.65292L6 0.5Z" fill="#1B1F23" />
  </svg>
);

// Export the ProductNode interface
export interface ProductNode {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  description?: string | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: CurrencyCode;
    };
  };
  images: {
    nodes: Array<{
      id?: string | null;
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    }>;
  };
  variants: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
    }>;
  };
}

interface ProductCardProps {
  product: ProductNode;
  style?: React.CSSProperties;
  version?: 'bundle' | 'default';
  className?: string;
}

export function ProductCard({ product, style, version = 'default', className }: ProductCardProps) {
  const description = product.description || "High-quality supplement.";
  const firstVariant = product.variants?.nodes?.[0];
  const availableForSale = firstVariant?.availableForSale;
  const merchandiseId = firstVariant?.id;
  const { open } = useAside();
  const [isHovered, setIsHovered] = useState(false);
  const [purchaseOption, setPurchaseOption] = useState<'one-time' | 'subscribe'>('one-time');

  const oneTimePrice = product.priceRange.minVariantPrice;
  // Calculate discounted price (e.g., 10% off) - adjust logic as needed
  const subscribePriceAmount = parseFloat(oneTimePrice.amount) * 0.90;
  const subscribePrice = {
    ...oneTimePrice,
    amount: subscribePriceAmount.toFixed(2),
  };

  const selectedPrice = purchaseOption === 'one-time' ? oneTimePrice : subscribePrice;

  // Reconstruct a selectedVariant object for optimistic cart
  const reconstructedVariant = firstVariant ? {
    id: firstVariant.id,
    availableForSale: firstVariant.availableForSale,
    price: selectedPrice, // Use the price corresponding to the purchase option
    product: {
      handle: product.handle,
      title: product.title,
    },
    // Add other necessary fields if AddToCartButton expects them
    // e.g., image, selectedOptions, etc. Might need adjustments to FRAGMENT
  } : undefined;

  const handleAddToCart = () => {
    if (!merchandiseId) return;
    // TODO: If purchaseOption is 'subscribe', you might need to pass a sellingPlanId
    // along with the merchandiseId in the 'lines' array.
    console.log(`Adding to cart: ${merchandiseId}, Option: ${purchaseOption}, Price: ${selectedPrice.amount}`);

    open('cart');
  };

  const handleOptionChange = (option: 'one-time' | 'subscribe') => {
    setPurchaseOption(option);
  };

  return (
    <div
      className={`rounded-lg flex h-fit flex-col p-4 ${version === 'bundle' ? 'bg-[#F6F6F5]' : 'bg-[#F6F6F5]'} ${className || ''} transition-all duration-300 ease-in-out group/card`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.handle}`} className="block group mb-4">
        <div className="aspect-square overflow-hidden relative">
          {product.images?.nodes?.[0] && (
            <Image
              data={product.images.nodes[0]}
              aspectRatio="1/1"
              sizes="(min-width: 45em) 20vw, 50vw"
              className="w-full h-full object-contain transition-transform duration-300 group-hover/card:scale-105"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
          )}
          

        </div>
      </Link>


        <div className='flex flex-col gap-3.5'>
            <span
              className="text-[14px] font-medium text-[#1B1F23] h-[42px] mb-1 leading-6 overflow-hidden"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              <Link to={`/products/${product.handle}`} className="hover:underline">
                {product.title}
              </Link>
            </span>

            <div className="mt-auto flex items-center justify-between w-full">
                {product.priceRange?.minVariantPrice && (
                <div className="flex justify-between items-center gap-2 w-full">
                    <Money data={selectedPrice} as="span" className='text-sm' />
                    <span className="bg-[#1B1F23] text-white gap-1 text-[13px] py-[5px] px-[15px] flex flex-row rounded-[4px] hover:bg-gray-700 transition duration-200">
                    {firstVariant && reconstructedVariant && (
                        <AddToCartButton
                        disabled={!availableForSale || !merchandiseId}
                        onClick={handleAddToCart}
                        lines={
                            merchandiseId
                            ? [
                                {
                                    merchandiseId: merchandiseId,
                                    quantity: 1,
                                    selectedVariant: reconstructedVariant,
                                },
                                ]
                            : []
                        }
                        >
                        {availableForSale ? (
                            <span className="w-full bg-[#1B1F23] text-white  text-[12px] rounded-sm hover:bg-gray-700 transition duration-200 disabled:opacity-50 text-center  block">
                            Add to Cart  +
                            </span>
                        ) : (
                            <span className="w-full bg-gray-400 text-white  text-[13px] rounded-sm text-center block cursor-not-allowed">
                            Sold out
                            </span>
                        )}
                        </AddToCartButton>
                    )}
                    </span>
                </div>
                )}
                </div>

        </div>


    </div >
  );
} 
