// src/queries/collection-products.ts
export const COLLECTION_PRODUCTS_QUERY = `#graphql
  query CollectionProducts($id: ID!) {
    collection(id: $id) {
      products(first: 8) {
        nodes {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            nodes {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
` as const;
