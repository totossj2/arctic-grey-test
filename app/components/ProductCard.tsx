import React from 'react';
import { Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
// Assuming the fragment type can be imported. Adjust path if necessary.
import type { RecommendedProductFragment } from 'storefrontapi.generated'; 

// Placeholder Star SVG component - Moved here
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

interface ProductCardProps {
  product: RecommendedProductFragment; // Use the specific fragment type
  tags: string[];
  style: React.CSSProperties;
}

export function ProductCard({ product, tags, style }: ProductCardProps) {
  // Static descriptions based on title match (adjust if needed)
  const descriptionMap: { [key: string]: string } = {
    "Omega-3 Fish Oil": "Cognitive Health & Foundational Health",
    "Magnesium L-Threonate": "Enhances the quality of sleep.",
    "Grass Fed Whey Protein Isolate Powder": "Supports muscle mass and strength",
    "Melatonin": "Deepens sleep cycles for rejuvenated mornings", // Example for another potential product
  };
  const description = product.description || descriptionMap[product.title] || "High-quality supplement."; // Fallback description

  return (
    <div
      className="bg-white rounded-lg flex flex-col p-4" // Base styles from previous iteration
      style={style} // Apply width, flexShrink from props
    >
      {/* Image Link */}
      <Link to={`/products/${product.handle}`} className="block group mb-4">
        <div className="aspect-square overflow-hidden relative">
          {product.images?.nodes?.[0] && ( // Check if image exists
            <Image
              data={product.images.nodes[0]}
              aspectRatio="1/1"
              sizes="(min-width: 45em) 20vw, 50vw"
              className="w-full h-full object-contain transition-transform duration-300"
            />
          )}
        </div>
      </Link>

      {/* Tags Section */}
      {(tags && tags.length > 0) && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">
              • {tag}
            </span>
          ))}
        </div>
      )}

      {/* Product Details */}
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        <Link to={`/products/${product.handle}`} className="hover:underline">
          {product.title}
        </Link>
      </h3>
      {/* Description */}
      <p className="text-sm text-gray-500 mb-4">
        {description}
      </p>

      {/* Bottom Row: Stars + Add Button */}
      <div className="mt-auto flex items-center justify-between">
        {/* Stars */}
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="text-yellow-400 w-4 h-4" />
          ))}
        </div>
        {/* Add Button */}
        {product.priceRange?.minVariantPrice && ( // Check if price exists
            <button className="bg-gray-900 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200">
            Add • <Money data={product.priceRange.minVariantPrice} as="span" />
            </button>
        )}
      </div>
    </div>
  );
} 