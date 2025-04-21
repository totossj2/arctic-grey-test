import type {CartApiQueryFragment, CollectionProductsQuery} from 'storefrontapi.generated';
import {CartEmpty} from './CartEmpty';
import {CartWithItems} from './CartWithItems';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
  recommendedProducts?: Promise<CollectionProductsQuery | null>;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart, recommendedProducts}: CartMainProps) {
  const cart = originalCart;
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity && cart?.totalQuantity > 0;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} recommendedProducts={recommendedProducts} />
      {/* Pasar recommendedProducts a CartWithItems */}
      {cartHasItems && cart && <CartWithItems cart={cart} layout={layout} recommendedProducts={recommendedProducts}/>}
    </div>
  );
}
