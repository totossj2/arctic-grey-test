import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
// Assuming COLLECTION_PRODUCTS_QUERY is correctly exported from Bundles or a shared location
import { COLLECTION_PRODUCTS_QUERY } from '~/querys/collection-products';

export async function loader({ params, context }: LoaderFunctionArgs) {
    const { storefront } = context;
    const { id } = params;

    if (!id) {
        throw new Response('Collection ID is required', { status: 400 });
    }

    // Ensure the ID is the full Shopify GID
    const collectionId = id.startsWith('gid://') ? id : `gid://shopify/Collection/${id}`;

    try {
        // Fetch data using the imported query
        const { collection } = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
            variables: {
                id: collectionId,
                // country: storefront.i18n.country, // Comentado o eliminado
                // language: storefront.i18n.language, // Comentado o eliminado
            },
            // Add caching if desired: cache: storefront.CacheShort()
        });

        if (!collection) {
            throw new Response(`Collection with ID ${collectionId} not found`, { status: 404 });
        }

        // Return only the collection data (including products)
        return json(collection);

    } catch (error) {
        console.error(`Failed to fetch collection ${collectionId}:`, error);
        // Provide a more specific error message if possible
        const status = error instanceof Response ? error.status : 500;
        throw new Response('Error fetching collection data', { status });
    }
}
