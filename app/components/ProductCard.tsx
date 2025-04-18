import React from 'react';
import { Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import type { CurrencyCode } from '@shopify/hydrogen/storefront-api-types';

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
}

interface ProductCardProps {
  product: ProductNode;
  style?: React.CSSProperties;
  version?: 'bundle' | 'default';
}

export function ProductCard({ product, style, version = 'default' }: ProductCardProps) {
  const description = product.description || "High-quality supplement.";

  return (
    <div
      className={`rounded-lg flex flex-col p-4 ${version === 'bundle' ? 'bg-[#F6F6F5]' : 'bg-white'}`}
      style={style}
    >
      <Link to={`/products/${product.handle}`} className="block group mb-4">
        <div className="aspect-square overflow-hidden relative">
          {product.images?.nodes?.[0] && (

            <Image
              data={product.images.nodes[0]}
              aspectRatio="1/1"
              sizes="(min-width: 45em) 20vw, 50vw"
              className="w-full h-full object-contain transition-transform duration-300"
            />
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap flex-col gap-1.5 absolute top-0 left-0 z-10">
              {product.tags.map(tag =>
                (tag === 'New Release' || tag === 'bestseller') ? (
                  <span key={tag} className={` bg-[#FFED92] text-[#1B1F23] text-[12px] capitalize flex items-center gap-1 px-[10px] py-[6px] rounded-[4px]`}>
                    {tag}
                  </span>

                ) : null

              )}

            </div>
          )}
        </div>
      </Link>
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags.map(tag =>
            (tag !== 'New Release' && tag !== 'bestseller') ? (
              <span key={tag} className={`${version === 'bundle' ? 'bg-[#FFFFFF]' : 'bg-[#F6F6F6]'} text-gray-800 text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-[4px]`}>
                <svg width="5" height="6" viewBox="0 0 5 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="2.5" cy="3" r="2.5" fill="#101226" />
                </svg>
                {tag}
              </span>
            ) : null
          )}
        </div>
      )}


      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        <Link to={`/products/${product.handle}`} className="hover:underline">
          {product.title}
        </Link>
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {description}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="text-yellow-400 w-4 h-4" />
          ))}
        </div>
        {product.priceRange?.minVariantPrice && (
          <button className="bg-[#1B1F23] text-white text-[13px] py-[5px] px-[15px] rounded-[4px] hover:bg-gray-700 transition duration-200">
            Add • <Money data={product.priceRange.minVariantPrice} as="span" />
          </button>
        )}
      </div>
    </div >
  );
} 
