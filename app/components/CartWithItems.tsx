import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import type {CartLayout} from './CartMain';
import {FreeShippingProgressBar} from './FreeShippingProgressBar';

type CartWithItemsProps = {
  cart: CartApiQueryFragment;
  layout: CartLayout;
};

const FREE_SHIPPING_THRESHOLD = 80;

export function CartWithItems({cart, layout}: CartWithItemsProps) {
  const subtotalAmount = cart.cost?.subtotalAmount;
  const currencyCode = subtotalAmount?.currencyCode || 'USD'; // Fallback a USD si no hay código

  return (
    <div className="cart-details">
      <FreeShippingProgressBar
        subtotalAmount={subtotalAmount}
        freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
        currencyCode={currencyCode}
      />
      <div aria-labelledby="cart-lines">
        <ul className='bg-[#F6F6F5] rounded-xl p-4 flex flex-col max-w-[400px] gap-3'>
          {(cart?.lines?.nodes ?? []).map((line) => (
            <CartLineItem key={line.id} line={line} layout={layout} />
          ))}
        </ul>
      </div>
      <CartSummary cart={cart} layout={layout} />
    </div>
  );
} 