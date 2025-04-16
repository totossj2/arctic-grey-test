import React from 'react';
import { Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
// Import CurrencyCode type
import type { CurrencyCode } from '@shopify/hydrogen/storefront-api-types';
// Assuming CollectionProductsQuery is the type for the *whole* query response
// We need the type for a single product node within that response.
// Replace 'any' with the correct generated fragment type (e.g., TrendingProductFragment) when available.
// import type { CollectionProductsQuery } from 'storefrontapi.generated'; 

// Define and export the fragment
export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    description
    priceRange { # Ensure this matches the fragment name used below
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
    <path d="M6 0.5L7.34708 4.6459H11.7063L8.17963 7.2082L9.52671 11.3541L6 8.7918L2.47329 11.3541L3.82037 7.2082L0.293661 4.6459H4.65292L6 0.5Z" fill="#1B1F23"/>
  </svg>
);

// Export the ProductNode interface
export interface ProductNode {
  id: string;
  title: string;
  handle: string;
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
  tags: string[];
  style: React.CSSProperties;
}

export function ProductCard({ product, tags, style }: ProductCardProps) {
  const descriptionMap: { [key: string]: string } = {
    "Omega-3 Fish Oil": "Cognitive Health & Foundational Health",
    "Magnesium L-Threonate": "Enhances the quality of sleep.",
    "Grass Fed Whey Protein Isolate Powder": "Supports muscle mass and strength",
    "Melatonin": "Deepens sleep cycles for rejuvenated mornings",
  };
  // Now properties like description, title, handle exist on `product`
  const description = product.description || descriptionMap[product.title] || "High-quality supplement."; 

  return (
    <div
      className="bg-white rounded-lg flex flex-col p-4"
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
        </div>
      </Link>

      {(tags && tags.length > 0) && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">
              • {tag}
            </span>
          ))}
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
            Add • <Money 
                      data={product.priceRange.minVariantPrice as any} // Keep temporary cast
                      as="span" 
                   />
            </button>
        )}
      </div>
    </div>
  );
} 