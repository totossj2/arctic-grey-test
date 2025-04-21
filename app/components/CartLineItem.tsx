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
      className="flex items-center gap-4 py-4 border-b border-gray-200"
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

      <div className="flex-grow flex flex-col gap-1 justify-between">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
          className="hover:underline"
        >
          <p className="font-semibold">
            {product.title}
          </p>
        </Link>
        {selectedOptions && selectedOptions.length > 0 && (
          <ul className="text-xs text-gray-600">
            {selectedOptions.map((option: SelectedOption) => (
              <li key={option.name}>
                {option.name}: {option.value}
              </li>
            ))}
          </ul>
        )}
        <CartLineQuantity line={line} />
      </div>

      <div className="flex flex-col items-end gap-2 ml-4">
        <div className="text-right font-medium">
          <ProductPrice price={cost.totalAmount} />
        </div>
        <button className="text-xs border border-dashed border-gray-400 rounded px-2 py-1 flex items-center gap-1 text-gray-600 hover:border-gray-800 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 14.992 0l-3.181-3.183m-4.994 0-3.182-3.182a8.25 8.25 0 0 0-14.992 0l3.182 3.182" />
          </svg>
          Subscribe & Save 10%
        </button>
        <div className="mt-1">
          <CartLineRemoveButton lineIds={[id]} disabled={!!isOptimistic} />
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
    'w-6 h-6 border rounded text-center leading-none disabled:opacity-50 disabled:cursor-not-allowed transition';

  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded p-1 w-fit mt-1">
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

      <span className="w-6 text-center text-sm">{quantity}</span>

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
