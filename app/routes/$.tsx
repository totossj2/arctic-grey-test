import type { ActionFunctionArgs, LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { json } from '@shopify/remix-oxygen';
import { CartForm } from '@shopify/hydrogen';
// Asumo que usas @shopify/remix-oxygen, ajusta si usas @remix-run/node directamente para context
import type { AppLoadContext } from '@shopify/remix-oxygen';

export async function loader({ request }: LoaderFunctionArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export async function action(
  { request, context }: ActionFunctionArgs,
) {
  // Asegúrate de que el tipo de 'context' coincida con tu configuración.
  // Si usas el AppLoadContext de Oxygen, incluye 'cart'.
  const { cart } = context as AppLoadContext; // Ajusta el tipo si es necesario

  if (!cart) {
    console.error('Cart context is missing');
    return json({ errors: ['Cart context missing'] }, { status: 500 });
  }

  const formData = await request.formData();
  const { action, inputs } = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No cartAction defined in form data');
  }

  let status = 200;
  let result;

  try {
    switch (action) {
      case CartForm.ACTIONS.LinesAdd:
        if (!inputs.lines) {
          throw new Error('Missing lines to add');
        }
        result = await cart.addLines(inputs.lines);
        break;
      case CartForm.ACTIONS.LinesUpdate:
        if (!inputs.lines) {
          throw new Error('Missing lines to update');
        }
        result = await cart.updateLines(inputs.lines);
        break;
      case CartForm.ACTIONS.LinesRemove:
        if (!inputs.lineIds) {
          throw new Error('Missing lineIds to remove');
        }
        result = await cart.removeLines(inputs.lineIds);
        break;
      // Añade otros casos si usas más acciones del carrito
      default:
        throw new Error(`${action} cart action is not supported`);
    }

    if (result.errors) {
      status = 400;
      console.error('Cart operation errors:', result.errors);
    }

    // Obtener las cabeceras del carrito (importante para la sesión/cookies)
    // Asegurarse que el objeto 'cart' tenga el método getHeaders.
    // Si 'cart' viene directamente del AppLoadContext, puede que necesite una aserción de tipo
    // o accederlo a través de context.storefront.cart si la estructura es diferente.
    const headers = (cart as any).getHeaders ? (cart as any).getHeaders() : new Headers(); // Usar 'any' como último recurso o ajustar tipo

    return json(
      {
        cart: result.cart,
        errors: result.errors,
      },
      { status, headers },
    );

  } catch (error) {
    console.error('Error processing cart action:', error);
    status = 500;
    return json({ errors: [error instanceof Error ? error.message : 'Unknown cart error'] }, { status });
  }
}

export default function CatchAllPage() {
  return null;
}
