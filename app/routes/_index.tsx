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
import VideoCarousel from '~/components/VideoCarousel';

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

  const videos = [
    {
      id: '1',
      videoUrl: '/videos/carrousel_videos/1.mp4',
      productLink: '/products/product-1',
      title: 'Video 1',
      price: '100',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      videoUrl: '/videos/carrousel_videos/2.mp4',
      productLink: '/products/product-2',
      title: 'Video 2',
      price: '200',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      videoUrl: '/videos/carrousel_videos/3.mp4',
      productLink: '/products/product-3',
      title: 'Video 3',
      price: '300',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '4',
      videoUrl: '/videos/carrousel_videos/4.mp4',
      productLink: '/products/product-4',
      title: 'Video 4',
      price: '400',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '5',
      videoUrl: '/videos/carrousel_videos/5.mp4',
      productLink: '/products/product-5',
      title: 'Video 5',
      price: '500',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div className="home">
      <Hero />
      <Testimonials />
      <Goals />
      <RecommendedProducts products={products} />
      <InformativeItems />
      <VideoCarousel videos={videos} />
    </div>
  );
}