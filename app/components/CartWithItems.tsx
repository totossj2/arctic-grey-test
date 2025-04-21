import type {CartApiQueryFragment, CollectionProductsQuery} from 'storefrontapi.generated';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import type {CartLayout} from './CartMain';
import {FreeShippingProgressBar} from './FreeShippingProgressBar';
import CartRecommendedProducts from './CartRecommended';
import { PRODUCT_CARD_FRAGMENT } from './CartProductCard';

type CartWithItemsProps = {
  cart: CartApiQueryFragment;
  layout: CartLayout;
  recommendedProducts?: Promise<CollectionProductsQuery | null>;
};

const FREE_SHIPPING_THRESHOLD = 80;

const BUNDLE_COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query BundleCollection(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      id
      title
      handle
      products(first: 8) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;

export function CartWithItems({cart, layout, recommendedProducts}: CartWithItemsProps) {
  const subtotalAmount = cart.cost?.subtotalAmount;
  const currencyCode = subtotalAmount?.currencyCode || 'USD'; // Fallback a USD si no hay código
  
  // Log para depurar - ¿Qué props recibe CartWithItems?
  console.log('[CartWithItems] Received recommendedProducts promise:', recommendedProducts);

  return (
    <div className="cart-details">
      <div className="flex flex-col gap-2 px-4">
        <FreeShippingProgressBar
          subtotalAmount={subtotalAmount}
          freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
          currencyCode={currencyCode}
        />
        <div aria-labelledby="cart-lines ">
          <ul className='bg-[#F6F6F5] rounded-lg px-2 py-4 flex flex-col gap-3'>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>

        {recommendedProducts && <CartRecommendedProducts products={recommendedProducts} layout={layout} />}
      </div>
      <CartSummary cart={cart} layout={layout} />
    </div>
  );
} 