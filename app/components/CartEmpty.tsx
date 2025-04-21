import {Link} from '@remix-run/react';
import {useAside} from '~/components/Aside';
import type {CartLayout} from './CartMain';

type CartEmptyProps = {
  hidden: boolean;
  layout?: CartLayout;
};

export function CartEmpty({hidden = false, layout}: CartEmptyProps) {
  const {close} = useAside();
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link>
    </div>
  );
} 