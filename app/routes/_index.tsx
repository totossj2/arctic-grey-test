import {type LoaderFunctionArgs, json} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {Hero} from '~/components/Hero';
import {Testimonials} from '~/components/Testimonials';
import type { CollectionProductsQuery } from 'storefrontapi.generated';

import Goals from '~/components/Goals';
import RecommendedProducts, {COLLECTION_PRODUCTS_QUERY} from '~/components/RecommendedProducts';
import InformativeItems from '~/components/InformativeItems';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const data = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
    variables: {
      id: "gid://shopify/Collection/509271015700"
    },
  });

  return json({ products: data });
}

export default function Homepage() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div className="home">
      <Hero />
      <Testimonials />
      <Goals />
      <RecommendedProducts products={products} />
      <InformativeItems />
    </div>
  );
}