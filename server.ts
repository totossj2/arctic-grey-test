// server.ts
import * as remixBuild from 'virtual:remix/server-build';
import { storefrontRedirect } from '@shopify/hydrogen';
import { createAppLoadContext } from '~/lib/context';

const isProduction = process.env.NODE_ENV === 'production';

let handler: any;

if (isProduction) {
  // Configuración para deploy (Netlify)
  handler = async function (
    request: Request,
    netlifyContext: any
  ): Promise<Response | undefined> {
    try {
      // Importación dinámica del adapter para deploy
      const { createHydrogenAppLoadContext, createRequestHandler } =
        await import('@netlify/remix-edge-adapter');

      const appLoadContext = await createHydrogenAppLoadContext(
        request,
        netlifyContext,
        createAppLoadContext
      );

      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
      });

      const response = await handleRequest(request, appLoadContext);

      if (appLoadContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await appLoadContext.session.commit()
        );
      }

      if (response.status === 404) {
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', { status: 500 });
    }
  };
} else {
  // Configuración para desarrollo (Remix-Oxygen)
  handler = {
    async fetch(
      request: Request,
      env: Env,
      executionContext: ExecutionContext
    ): Promise<Response> {
      try {
        // Importación dinámica del adapter para desarrollo
        const { createRequestHandler } = await import('@shopify/remix-oxygen');

        const appLoadContext = await createAppLoadContext(
          request,
          env,
          executionContext
        );

        const handleRequest = createRequestHandler({
          build: remixBuild,
          mode: process.env.NODE_ENV,
          getLoadContext: () => appLoadContext,
        });

        const response = await handleRequest(request);

        if (appLoadContext.session.isPending) {
          response.headers.set(
            'Set-Cookie',
            await appLoadContext.session.commit()
          );
        }

        if (response.status === 404) {
          return storefrontRedirect({
            request,
            response,
            storefront: appLoadContext.storefront,
          });
        }

        return response;
      } catch (error) {
        console.error(error);
        return new Response('An unexpected error occurred', { status: 500 });
      }
    },
  };
}

export default handler;
