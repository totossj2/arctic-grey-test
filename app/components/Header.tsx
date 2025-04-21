import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Link} from '@remix-run/react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

const navigation = [
  { name: 'Shop', href: '/shop' },
  { name: 'Science', href: '/science' },
  { name: 'Podcasts', href: '/podcasts' },
  { name: 'Trainers', href: '/trainers' },
  { name: 'Blog', href: '/blog' },
];

export function Header({
  header,
  cart,
  isLoggedIn,
  publicStoreDomain,
}: HeaderProps) {
  const {open: openAside} = useAside();
  const {shop, menu} = header;
  return (
    <header className="rounded-[8px] mx-2 md:mx-10 mt-2 md:mt-6 bg-white/90 fixed top-0 left-0 right-0 z-50 py-4 backdrop-blur-sm">
      <div className="items-center justify-between px-4 md:px-8 lg:px-8 grid grid-cols-12">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl md:text-2xl tracking-tight col-span-4">
          UNCMFRT<span className='hidden md:inline-block'>.COM</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-9 justify-center col-span-4 text-[14px]">
          {/* Add Search Button back */}
          <button
              className="text-black hover:text-gray-600 transition-colors"
              aria-label="Search"
              onClick={() => openAside('search')}
            >
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.375 14.7188C16.6875 15.0729 16.6979 15.4271 16.4062 15.7812C16.2604 15.9271 16.0833 16 15.875 16C15.6875 16 15.5 15.9271 15.3125 15.7812L11.125 11.5938C10 12.5104 8.65625 12.9792 7.09375 13C5.26042 12.9583 3.73958 12.3229 2.53125 11.0938C1.30208 9.86458 0.666667 8.33333 0.625 6.5C0.666667 4.66667 1.29167 3.13542 2.5 1.90625C3.72917 0.677083 5.26042 0.0416667 7.09375 0C8.92708 0.0416667 10.4583 0.677083 11.6875 1.90625C12.9167 3.13542 13.5521 4.66667 13.5938 6.5C13.5729 8.04167 13.1042 9.38542 12.1875 10.5312L16.375 14.7188ZM2.125 6.5C2.16667 7.91667 2.65625 9.09375 3.59375 10.0312C4.53125 10.9688 5.70833 11.4583 7.125 11.5C8.54167 11.4583 9.71875 10.9688 10.6562 10.0312C11.5938 9.09375 12.0833 7.91667 12.125 6.5C12.0833 5.08333 11.5938 3.90625 10.6562 2.96875C9.71875 2.03125 8.54167 1.54167 7.125 1.5C5.70833 1.54167 4.53125 2.03125 3.59375 2.96875C2.65625 3.90625 2.16667 5.08333 2.125 6.5Z" fill="#0E0804"/>
            </svg>
          </button>
          {/* Navigation Links */}
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-black hover:text-gray-600 transition-colors text-sm"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Actions Desktop */}
        {/* Hide on mobile, show on md and up */}
        <div className="hidden md:flex justify-end items-center space-x-4 col-span-4 text-[14px]">

          {/* Men Link Button */}
          <div className="bg-[#E4E4E4] rounded-[8px] px-2 pl-3 py-1">
            <Link to="/men" className="flex items-center space-x-4">
              <span className="font-semibold">Men</span>
              <span className='p-2 bg-white rounded-full'>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_21502_275)">
                <path d="M8 8C10.206 8 12 6.206 12 4C12 1.794 10.206 0 8 0C5.794 0 4 1.794 4 4C4 6.206 5.794 8 8 8ZM8 1.33333C9.47067 1.33333 10.6667 2.52933 10.6667 4C10.6667 5.47067 9.47067 6.66667 8 6.66667C6.52933 6.66667 5.33333 5.47067 5.33333 4C5.33333 2.52933 6.52933 1.33333 8 1.33333ZM14 15.3333C14 15.7013 13.702 16 13.3333 16C12.9647 16 12.6667 15.7013 12.6667 15.3333C12.6667 13.3207 11.3833 11.6067 9.594 10.9533L8.58267 12.4707L9.31133 15.1307C9.43333 15.5747 9.04133 16.0007 8.51067 16.0007H7.48933C6.95867 16.0007 6.56733 15.5747 6.68867 15.1307L7.41733 12.4707L6.406 10.9533C4.61667 11.6067 3.33333 13.3207 3.33333 15.334C3.33333 15.702 3.03467 16.0007 2.66667 16.0007C2.29867 16.0007 2 15.702 2 15.334C2 12.026 4.692 9.334 8 9.334C11.308 9.334 14 12.0253 14 15.3333Z" fill="black"/>
                </g>
                <defs>
                <clipPath id="clip0_21502_275">
                <rect width="16" height="16" fill="white"/>
                </clipPath>
                </defs>
                </svg>
              </span>

            </Link>
          </div>

          <Link
            to="/quiz"
            className="hidden md:inline-block bg-black text-white px-4 py-2 rounded-[8px] font-semibold hover:bg-gray-900 transition-colors"
          >
            Take The Quiz
          </Link>

          <Link to="/account" className="text-black hover:text-gray-600 transition-colors">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 9.5C10.0625 9.54167 11.3542 10.0833 12.375 11.125C13.4167 12.1458 13.9583 13.4375 14 15C14 15.2917 13.9062 15.5312 13.7188 15.7188C13.5312 15.9062 13.2917 16 13 16H1C0.708333 16 0.46875 15.9062 0.28125 15.7188C0.09375 15.5312 0 15.2917 0 15C0.0416667 13.4375 0.583333 12.1458 1.625 11.125C2.64583 10.0833 3.9375 9.54167 5.5 9.5H8.5ZM1.53125 14.5H12.4688C12.3229 13.5 11.8854 12.6667 11.1562 12C10.4271 11.3542 9.54167 11.0208 8.5 11H5.5C4.45833 11.0208 3.57292 11.3542 2.84375 12C2.11458 12.6667 1.67708 13.5 1.53125 14.5ZM7 8C5.875 7.97917 4.92708 7.59375 4.15625 6.84375C3.40625 6.07292 3.02083 5.125 3 4C3.02083 2.875 3.40625 1.92708 4.15625 1.15625C4.92708 0.40625 5.875 0.0208333 7 0C8.125 0.0208333 9.07292 0.40625 9.84375 1.15625C10.5938 1.92708 10.9792 2.875 11 4C10.9792 5.125 10.5938 6.07292 9.84375 6.84375C9.07292 7.59375 8.125 7.97917 7 8ZM7 1.5C6.29167 1.52083 5.69792 1.76042 5.21875 2.21875C4.76042 2.69792 4.52083 3.29167 4.5 4C4.52083 4.70833 4.76042 5.30208 5.21875 5.78125C5.69792 6.23958 6.29167 6.47917 7 6.5C7.70833 6.47917 8.30208 6.23958 8.78125 5.78125C9.23958 5.30208 9.47917 4.70833 9.5 4C9.47917 3.29167 9.23958 2.69792 8.78125 2.21875C8.30208 1.76042 7.70833 1.52083 7 1.5Z" fill="#0E0804"/>
          </svg>
          </Link>

          <button
            className="text-black hover:text-gray-600 transition-colors"
            aria-label="Cart"
            onClick={() => openAside('cart')}
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 5V3.5C3.52083 2.5 3.86458 1.67708 4.53125 1.03125C5.17708 0.364583 6 0.0208333 7 0C8 0.0208333 8.82292 0.364583 9.46875 1.03125C10.1354 1.67708 10.4792 2.5 10.5 3.5V5H12.5C12.9167 5.02083 13.2708 5.16667 13.5625 5.4375C13.8333 5.72917 13.9792 6.08333 14 6.5V13C13.9792 13.8542 13.6875 14.5625 13.125 15.125C12.5625 15.6875 11.8542 15.9792 11 16H3C2.14583 15.9792 1.4375 15.6875 0.875 15.125C0.3125 14.5625 0.0208333 13.8542 0 13V6.5C0.0208333 6.08333 0.166667 5.72917 0.4375 5.4375C0.729167 5.16667 1.08333 5.02083 1.5 5H3.5ZM5 5H9V3.5C8.97917 2.9375 8.78125 2.46875 8.40625 2.09375C8.03125 1.71875 7.5625 1.52083 7 1.5C6.4375 1.52083 5.96875 1.71875 5.59375 2.09375C5.21875 2.46875 5.02083 2.9375 5 3.5V5ZM1.5 6.5V13C1.52083 13.4167 1.66667 13.7708 1.9375 14.0625C2.22917 14.3333 2.58333 14.4792 3 14.5H11C11.4167 14.4792 11.7708 14.3333 12.0625 14.0625C12.3333 13.7708 12.4792 13.4167 12.5 13V6.5H10.5V8.25C10.4583 8.70833 10.2083 8.95833 9.75 9C9.29167 8.95833 9.04167 8.70833 9 8.25V6.5H5V8.25C4.95833 8.70833 4.70833 8.95833 4.25 9C3.79167 8.95833 3.54167 8.70833 3.5 8.25V6.5H1.5Z" fill="#0E0804"/>
            </svg>

          </button>
        </div>

        {/* Mobile Actions: Search, Cart, Burger Menu */}
        {/* Show only on mobile (flex), hide on md and up (md:hidden) */}
        <div className="flex md:hidden justify-end items-center space-x-1 col-span-8">
           {/* Search Icon Mobile */}
           <button
            className="text-black hover:text-gray-600 transition-colors p-2"
            aria-label="Search"
            onClick={() => openAside('search')}
           >
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M16.375 14.7188C16.6875 15.0729 16.6979 15.4271 16.4062 15.7812C16.2604 15.9271 16.0833 16 15.875 16C15.6875 16 15.5 15.9271 15.3125 15.7812L11.125 11.5938C10 12.5104 8.65625 12.9792 7.09375 13C5.26042 12.9583 3.73958 12.3229 2.53125 11.0938C1.30208 9.86458 0.666667 8.33333 0.625 6.5C0.666667 4.66667 1.29167 3.13542 2.5 1.90625C3.72917 0.677083 5.26042 0.0416667 7.09375 0C8.92708 0.0416667 10.4583 0.677083 11.6875 1.90625C12.9167 3.13542 13.5521 4.66667 13.5938 6.5C13.5729 8.04167 13.1042 9.38542 12.1875 10.5312L16.375 14.7188ZM2.125 6.5C2.16667 7.91667 2.65625 9.09375 3.59375 10.0312C4.53125 10.9688 5.70833 11.4583 7.125 11.5C8.54167 11.4583 9.71875 10.9688 10.6562 10.0312C11.5938 9.09375 12.0833 7.91667 12.125 6.5C12.0833 5.08333 11.5938 3.90625 10.6562 2.96875C9.71875 2.03125 8.54167 1.54167 7.125 1.5C5.70833 1.54167 4.53125 2.03125 3.59375 2.96875C2.65625 3.90625 2.16667 5.08333 2.125 6.5Z" fill="#0E0804"/>
              </svg>
           </button>
            {/* Cart Icon Mobile */}
            <Link to='#' className='cursor-pointer'>
            <button
              className="text-black hover:text-gray-600 transition-colors p-2"
              aria-label="Cart"
              onClick={() => openAside('cart')}
            >
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 5V3.5C3.52083 2.5 3.86458 1.67708 4.53125 1.03125C5.17708 0.364583 6 0.0208333 7 0C8 0.0208333 8.82292 0.364583 9.46875 1.03125C10.1354 1.67708 10.4792 2.5 10.5 3.5V5H12.5C12.9167 5.02083 13.2708 5.16667 13.5625 5.4375C13.8333 5.72917 13.9792 6.08333 14 6.5V13C13.9792 13.8542 13.6875 14.5625 13.125 15.125C12.5625 15.6875 11.8542 15.9792 11 16H3C2.14583 15.9792 1.4375 15.6875 0.875 15.125C0.3125 14.5625 0.0208333 13.8542 0 13V6.5C0.0208333 6.08333 0.166667 5.72917 0.4375 5.4375C0.729167 5.16667 1.08333 5.02083 1.5 5H3.5ZM5 5H9V3.5C8.97917 2.9375 8.78125 2.46875 8.40625 2.09375C8.03125 1.71875 7.5625 1.52083 7 1.5C6.4375 1.52083 5.96875 1.71875 5.59375 2.09375C5.21875 2.46875 5.02083 2.9375 5 3.5V5ZM1.5 6.5V13C1.52083 13.4167 1.66667 13.7708 1.9375 14.0625C2.22917 14.3333 2.58333 14.4792 3 14.5H11C11.4167 14.4792 11.7708 14.3333 12.0625 14.0625C12.3333 13.7708 12.4792 13.4167 12.5 13V6.5H10.5V8.25C10.4583 8.70833 10.2083 8.95833 9.75 9C9.29167 8.95833 9.04167 8.70833 9 8.25V6.5H5V8.25C4.95833 8.70833 4.70833 8.95833 4.25 9C3.79167 8.95833 3.54167 8.70833 3.5 8.25V6.5H1.5Z" fill="#0E0804"/>
                </svg>
            </button>
            </Link>
            {/* Burger Menu Icon */}
            <button
             className="text-black hover:text-gray-600 transition-colors p-2 pr-0"
             onClick={() => openAside('mobile')}
             aria-label="Open menu"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
               </svg>
           </button>
        </div>
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Cart {count === null ? <span>&nbsp;</span> : count}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

