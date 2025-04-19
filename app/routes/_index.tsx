import { type LoaderFunctionArgs, json } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link, type MetaFunction } from '@remix-run/react';
import { Suspense } from 'react';
import { Image, Money } from '@shopify/hydrogen';
import { Hero } from '~/components/Hero';
import { Testimonials } from '~/components/Testimonials';
import type { CollectionProductsQuery } from 'storefrontapi.generated';
import { COLLECTION_PRODUCTS_QUERY } from '~/components/RecommendedProducts';
import { PRODUCT_CARD_FRAGMENT } from '~/components/ProductCard';

import Goals from '~/components/Goals';
import RecommendedProducts from '~/components/RecommendedProducts';
import InformativeItems from '~/components/InformativeItems';
import VideoCarousel from '~/components/VideoCarousel';
import Bundles from '~/components/Bundles';
import FeaturedProducts from '~/components/FeaturedProducts';
import Video from '~/components/Video';
import Blogs from '~/components/Blogs';
import { InstagramFeed } from '~/components/InstagramFeed';

export const meta: MetaFunction = () => {
  return [{ title: 'UNCMFRT | Home - Arctic Grey Assesment' }];
};

const BUNDLES_COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query BundlesCollection(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      id
      title
      handle
      products(first: 8) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;


export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const recommendedCollectionData = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
    variables: {
      id: "gid://shopify/Collection/509271015700"
    },
  });

  const bundlesInitialData = await storefront.query(BUNDLES_COLLECTION_QUERY, {
    variables: {
      id: "gid://shopify/Collection/509335437588"
    },
  });

  const featuredProducts = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
    variables: {
      id: "gid://shopify/Collection/509341991188"
    },
  });

  return json({
    recommendedCollection: recommendedCollectionData,
    bundlesInitialCollection: bundlesInitialData,
    featuredProducts: featuredProducts,
  });
}

export default function Homepage() {
  const { recommendedCollection, bundlesInitialCollection, featuredProducts } = useLoaderData<typeof loader>();

  const videos = [
    {
      id: '1',
      videoUrl: '/videos/carrousel_videos/1.mp4',
      productLink: '/products/product-1',
      title: 'Magnesium L-Threonate',
      price: '$49.95',
      productImage: '/images/videoSlider/magnesium_mini.png',

    },
    {
      id: '2',
      videoUrl: '/videos/carrousel_videos/2.mp4',
      productLink: '/products/product-2',
      title: 'Magnesium L-Threonate',
      price: '$49.95',
      productImage: '/images/videoSlider/magnesium_mini.png',
    },
    {
      id: '3',
      videoUrl: '/videos/carrousel_videos/3.mp4',
      productLink: '/products/product-3',
      title: 'Magnesium L-Threonate',
      price: '$49.95',
      productImage: '/images/videoSlider/magnesium_mini.png',
    },
    {
      id: '4',
      videoUrl: '/videos/carrousel_videos/4.mp4',
      productLink: '/products/product-4',
      title: 'Magnesium L-Threonate',
      price: '$49.95',
      productImage: '/images/videoSlider/magnesium_mini.png',
    },
    {
      id: '5',
      videoUrl: '/videos/carrousel_videos/5.mp4',
      productLink: '/products/product-5',
      title: 'Magnesium L-Threonate',
      price: '$49.95',
      productImage: '/images/videoSlider/magnesium_mini.png',
    },
  ];

  return (
    <div className="home">
      <Hero />
      <Testimonials />
      <Goals />
      <RecommendedProducts products={recommendedCollection} />
      <InformativeItems />
      <VideoCarousel videos={videos} />
      <Bundles initialCollection={bundlesInitialCollection?.collection ?? null} />
      <FeaturedProducts products={featuredProducts}/>
      <Video />
      <Blogs />
      <InstagramFeed />
    </div>
  );
}
