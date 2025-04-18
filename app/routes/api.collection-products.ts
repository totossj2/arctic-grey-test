import { type LoaderFunctionArgs, json } from '@shopify/remix-oxygen';
import { PRODUCT_CARD_FRAGMENT } from '~/components/ProductCard'; // Asumiendo que ProductCard está en esta ruta

// Reutilizamos la consulta definida, asegurándonos que PRODUCT_CARD_FRAGMENT esté disponible.
// Si PRODUCT_CARD_FRAGMENT no es exportado desde ProductCard, necesitarás copiar su definición aquí o importarla correctamente.
export const COLLECTION_PRODUCTS_QUERY_API = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionProductsApi(
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

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const url = new URL(request.url);
  const collectionId = url.searchParams.get('collectionId');

  if (url.searchParams.get('clear') === 'true') {
    return json({ collection: null });
  }

  if (!collectionId) {
    return json({ error: 'Collection ID is required' }, { status: 400 });
  }

  try {
    const data = await storefront.query(COLLECTION_PRODUCTS_QUERY_API, {
      variables: {
        id: collectionId,
        // country: storefront.i18n.country, // Descomenta si necesitas localización
        // language: storefront.i18n.language, // Descomenta si necesitas localización
      },
    });

    if (!data.collection) {
      return json({ collection: null }, { status: 200 });
    }

    return json(data);

  } catch (error) {
    console.error(`Error fetching collection products for ID ${collectionId}:`, error);
    return json({ error: 'Failed to fetch products from Shopify API' }, { status: 500 });
  }
} 