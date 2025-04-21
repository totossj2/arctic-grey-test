import {Await, Link, NavLink} from '@remix-run/react';
import {Suspense, useId} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
  CollectionProductsQuery
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {useAside} from '~/components/Aside';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  recommendedProducts?: Promise<CollectionProductsQuery | null>;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  recommendedProducts,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} recommendedProducts={recommendedProducts} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} isLoggedIn={isLoggedIn} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart, recommendedProducts}: {
  cart: PageLayoutProps['cart'],
  recommendedProducts: PageLayoutProps['recommendedProducts']
}) {
  return (
    <Suspense fallback={<Aside type="cart" heading="Your Bag" />}>
      <Await resolve={cart}>
        {(cart) => {
          const itemCount = cart?.totalQuantity || 0;
          return (
            <Aside type="cart" heading="Your Bag" count={itemCount}>
              <Suspense fallback={<p>Cargando carrito...</p>}>
                <CartMain cart={cart} layout="aside" recommendedProducts={recommendedProducts} />
              </Suspense>
            </Aside>
          );
        }}
      </Await>
    </Suspense>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button onClick={goToSearch}>Search</button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
  isLoggedIn,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
  isLoggedIn: PageLayoutProps['isLoggedIn'];
}) {
  const {close, open: openAside} = useAside();
  const navigation = [
    { name: 'Shop', href: '/shop' },
    { name: 'Science', href: '/science' },
    { name: 'Podcasts', href: '/podcasts' },
    { name: 'Trainers', href: '/trainers' },
    { name: 'Blog', href: '/blog' },
  ];

  const mobileNavLinkClass = "block py-2 text-gray-700 hover:text-black";
  const mobileButtonClass = "block w-full text-left py-2 text-gray-700 hover:text-black";

  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <div className="flex flex-col space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({isActive}) => `${mobileNavLinkClass} ${isActive ? 'font-semibold' : ''}`}
            >
              {item.name}
            </NavLink>
          ))}

          <hr className="my-4"/>

          <NavLink to="/men" className={({isActive}) => `${mobileNavLinkClass} ${isActive ? 'font-semibold' : ''}`}>
            Men
          </NavLink>
          <NavLink to="/quiz" className={({isActive}) => `${mobileNavLinkClass} ${isActive ? 'font-semibold' : ''}`}>
            Take The Quiz
          </NavLink>
          <NavLink to="/account" className={({isActive}) => `${mobileNavLinkClass} ${isActive ? 'font-semibold' : ''}`}>
            <Suspense fallback={<span>Sign in</span>}>
              <Await resolve={isLoggedIn} errorElement={<span>Sign in</span>}>
                {(loggedIn) => <>{loggedIn ? 'Account' : 'Sign in'}</>}
              </Await>
            </Suspense>
          </NavLink>

          <hr className="my-4"/>

          <button
            className={mobileButtonClass}
            onClick={() => {
              openAside('search');
            }}
          >
            Search
          </button>
          <button
            className={mobileButtonClass}
            onClick={() => {
              openAside('cart');
            }}
          >
            Cart
          </button>
        </div>
      </Aside>
    )
  );
}