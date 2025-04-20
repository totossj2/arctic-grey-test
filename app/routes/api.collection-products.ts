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

  console.log(`[API Loader] Request for collectionId: ${collectionId}`); // Log incoming request ID

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
      // Intenta deshabilitar el caché de Oxygen/Storefront para esta consulta específica
      cache: storefront.CacheNone(),
    });

    console.log('[API Loader] Data received from Storefront API:', JSON.stringify(data)); // Log data received

    if (!data.collection) {
      console.log('[API Loader] No collection found for this ID.');
      // Añadir cabeceras anti-cache
      const headers = new Headers({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      });
      return json({ collection: null }, { status: 200, headers });
    }

    console.log(`[API Loader] Returning collection title: ${data.collection.title}`); // Log title being returned

    // Añadir cabeceras anti-cache a la respuesta exitosa también
    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    return json(data, { headers });

  } catch (error) {
    console.error(`[API Loader] Error fetching collection products for ID ${collectionId}:`, error);
    // Añadir cabeceras anti-cache también en caso de error
    const headers = new Headers({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      });
    return json({ error: 'Failed to fetch products from Shopify API' }, { status: 500, headers });
  }
} 