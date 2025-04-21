import {Link} from '@remix-run/react';
import {useAside} from '~/components/Aside';
import type {CartLayout} from './CartMain';
import type {CollectionProductsQuery} from 'storefrontapi.generated';
import CartRecommendedProducts from './CartRecommended';

type CartEmptyProps = {
  hidden: boolean;
  layout?: CartLayout;
  recommendedProducts?: Promise<CollectionProductsQuery | null>;
};

export function CartEmpty({hidden = false, layout, recommendedProducts}: CartEmptyProps) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className='px-4 flex flex-col gap-4' >
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link>
      {recommendedProducts && <CartRecommendedProducts products={recommendedProducts} layout={layout} />}
    </div>
  );
} 