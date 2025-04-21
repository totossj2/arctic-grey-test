import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {type SelectedOption} from '@shopify/hydrogen/storefront-api-types';

type CartLine = OptimisticCartLine<
  CartApiQueryFragment['lines']['nodes'][0]
>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise, cost, quantity, isOptimistic} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const {close} = useAside();

  if (!line?.id) return null;

  const lineItemUrl = `/products/${product.handle}`;

  return (
    <li
      key={id}
      className="flex items-center gap-4 p-4 bg-white rounded-lg "
    >
      {image && (
        <div className="flex-shrink-0 w-24 h-24">
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={96}
            loading="lazy"
            width={96}
            className="object-cover object-center w-full h-full rounded"
          />
        </div>
      )}

      <div className="flex-grow flex flex-col gap-3 justify-between">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
          className="hover:underline flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <p className="font-medium text-sm text-[#1B1F23]">
            {product.title}
          </p>
          <div className="text-left md:text-right text-sm font-medium">
            <ProductPrice price={cost.totalAmount} />
        </div>
        </Link>

        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between ">

          <CartLineQuantity line={line} />

          <button className="text-xs border border-dashed border-black/10 rounded px-2 md:px-4 py-[5px] md:py-[10px] flex items-center gap-1 text-gray-600 hover:border-gray-800 hover:text-gray-900">
            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5625 1.71875V5.21875C13.526 5.61979 13.3073 5.83854 12.9062 5.875H9.40625C9.00521 5.83854 8.78646 5.61979 8.75 5.21875C8.75 5.03646 8.8138 4.88151 8.94141 4.75391L10.3633 3.33203C9.45182 2.4388 8.33073 1.97396 7 1.9375C5.63281 1.97396 4.49349 2.4388 3.58203 3.33203C2.6888 4.24349 2.22396 5.38281 2.1875 6.75C2.22396 8.11719 2.69792 9.25651 3.60938 10.168C4.5026 11.0612 5.63281 11.526 7 11.5625C7.72917 11.5443 8.32161 11.4349 8.77734 11.2344C9.21484 11.0339 9.5612 10.8333 9.81641 10.6328C10.0898 10.4323 10.3086 10.3229 10.4727 10.3047C10.6185 10.3047 10.7643 10.3594 10.9102 10.4688C11.056 10.5781 11.1289 10.7422 11.1289 10.9609C11.0924 11.3438 10.6641 11.7448 9.84375 12.1641C9.02344 12.6016 8.06641 12.8385 6.97266 12.875C5.84245 12.8568 4.8125 12.5742 3.88281 12.0273C2.97135 11.4805 2.24219 10.7513 1.69531 9.83984C1.14844 8.92839 0.865885 7.89844 0.847656 6.75C0.865885 5.61979 1.14844 4.58984 1.69531 3.66016C2.24219 2.7487 2.97135 2.01953 3.88281 1.47266C4.8125 0.94401 5.84245 0.670573 6.97266 0.652344C7.79297 0.652344 8.57682 0.807292 9.32422 1.11719C10.0534 1.42708 10.7005 1.86458 11.2656 2.42969L12.3867 1.30859C12.5143 1.18099 12.6693 1.11719 12.8516 1.11719C13.2891 1.11719 13.526 1.31771 13.5625 1.71875Z" fill="#0E0804" fill-opacity="0.7"/>
            </svg>
            Subscribe & Save 10%
          </button>
        </div>

      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  const buttonStyle =
    'w-6 h-6  text-center leading-none disabled:opacity-50 disabled:cursor-not-allowed transition';

  return (
    <div className="flex items-center gap-2 border border-black/20 rounded-md p-1 w-fit mt-1">
      {quantity === 1 ? (
        // Render Remove Form when quantity is 1
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesRemove}
          inputs={{lineIds: [lineId]}}
        >
          <button
            type="submit"
            aria-label="Remove item"
            disabled={!!isOptimistic}
            className={buttonStyle}
          >
            <span>&#8722;</span>
          </button>
        </CartForm>
      ) : (
        // Render Update Form when quantity > 1
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={!!isOptimistic} // Only disable if optimistic
            name="decrease-quantity"
            value={prevQuantity.toString()}
            className={buttonStyle}
          >
            <span>&#8722;</span>
          </button>
        </CartLineUpdateButton>
      )}

      <span className="w-6 text-center text-[#1B1F23]/70 text-sm">{quantity}</span>

      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity.toString()}
          disabled={!!isOptimistic}
          className={buttonStyle}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="text-xs text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
