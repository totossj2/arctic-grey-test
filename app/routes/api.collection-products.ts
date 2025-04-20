import { type LoaderFunctionArgs, json } from '@shopify/remix-oxygen';
import { PRODUCT_CARD_FRAGMENT } from '~/components/ProductCard';

// --- Consultas GraphQL Específicas por Categoría ---
const SLEEP_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query SleepProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: "gid://shopify/Collection/509335437588") {
      id title handle products(first: 8) { nodes { ...ProductCard } }
    }
  }
` as const;

const COGNITIVE_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query CognitiveProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: "gid://shopify/Collection/509335503124") {
      id title handle products(first: 8) { nodes { ...ProductCard } }
    }
  }
` as const;

const FOUNDATIONAL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query FoundationalProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: "gid://shopify/Collection/509335535892") {
      id title handle products(first: 8) { nodes { ...ProductCard } }
    }
  }
` as const;

const ATHLETIC_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query AthleticProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: "gid://shopify/Collection/509340090644") {
      id title handle products(first: 8) { nodes { ...ProductCard } }
    }
  }
` as const;

const HORMONE_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query HormoneProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: "gid://shopify/Collection/509340123412") {
      id title handle products(first: 8) { nodes { ...ProductCard } }
    }
  }
` as const;
// --- Fin Consultas Específicas ---

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

  // Seleccionar la consulta basada en el collectionId
  let query;
  switch (collectionId) {
    case 'gid://shopify/Collection/509335437588':
      query = SLEEP_PRODUCTS_QUERY;
      break;
    case 'gid://shopify/Collection/509335503124':
      query = COGNITIVE_PRODUCTS_QUERY;
      break;
    case 'gid://shopify/Collection/509335535892':
      query = FOUNDATIONAL_PRODUCTS_QUERY;
      break;
    case 'gid://shopify/Collection/509340090644':
      query = ATHLETIC_PRODUCTS_QUERY;
      break;
    case 'gid://shopify/Collection/509340123412':
      query = HORMONE_PRODUCTS_QUERY;
      break;
    default:
      console.error(`[API Loader] Unknown or unsupported collectionId: ${collectionId}`);
      return json({ error: 'Unknown or unsupported Collection ID' }, { status: 400 });
  }

  try {
    // Ejecutar la consulta seleccionada (sin pasar ID en variables)
    const data = await storefront.query(query, {
      variables: {
        // country: storefront.i18n.country,
        // language: storefront.i18n.language,
      },
      cache: storefront.CacheNone(), // Mantener anti-cache por si acaso
    });

    console.log('[API Loader] Data received from Storefront API:', JSON.stringify(data)); // Log data received

    // Preparar cabeceras anti-cache
    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    if (!data.collection) {
       return json({ collection: null }, { status: 200, headers });
    }

    console.log(`[API Loader] Returning collection title: ${data.collection.title}`); // Log title being returned

    return json(data, { headers });

  } catch (error) {
    console.error(`[API Loader] Error fetching collection products for ID ${collectionId}:`, error);
    const headers = new Headers({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      });
    return json({ error: 'Failed to fetch products from Shopify API' }, { status: 500, headers });
  }
} 