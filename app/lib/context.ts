// context.ts
import {
  createHydrogenContext,
  InMemoryCache,
  type HydrogenContext,
} from '@shopify/hydrogen';
import { AppSession } from '~/lib/session';
import { CART_QUERY_FRAGMENT } from '~/lib/fragments';

/**
 * Crea el contexto de carga para la app.
 */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
): Promise<HydrogenContext> {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const isProduction = process.env.NODE_ENV === 'production';
  let cache: any;
  let waitUntil: ExecutionContext['waitUntil'];
  let session: any;

  if (isProduction) {
    // Configuración para deploy
    cache = new InMemoryCache();
    waitUntil = executionContext.waitUntil;
    session = await AppSession.init(request, [env.SESSION_SECRET]);
  } else {
    // Configuración para desarrollo
    waitUntil = executionContext.waitUntil.bind(executionContext);
    const [cacheFromWorker, sessionFromWorker] = await Promise.all([
      caches.open('hydrogen'),
      AppSession.init(request, [env.SESSION_SECRET]),
    ]);
    cache = cacheFromWorker;
    session = sessionFromWorker;
  }

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: {
      language: 'EN',
      country: 'US',
    },
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  return {
    ...hydrogenContext,
    // Agrega aquí cualquier otro dato al contexto
  };
}
