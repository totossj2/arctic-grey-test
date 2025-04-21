# Arctic Grey Technical Test

This project is an implementation for the Arctic Grey technical test, developed using Remix, Hydrogen, and the Shopify Storefront API.

## Requirements

- Node.js version 18.0.0 or higher
- npm (or your preferred package manager)

## Project Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/totossj2/arctic-grey-test
    cd arctic-grey-test
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```


## Running in Development

To start the local development server:

```bash
npm run dev
```

This will start the application with hot-reloading and run GraphQL code generation if there are changes. The application will typically be available at `http://localhost:3000`.

## Available Scripts

-   `npm run build`: Compiles the application for production.
-   `npm run dev`: Starts the development server.
-   `npm run preview`: Serves the production build locally (useful after `npm run build`). Requires Netlify CLI setup if using `netlify serve`.
-   `npm run lint`: Runs ESLint to check code style.
-   `npm run typecheck`: Runs the TypeScript compiler to check types.
-   `npm run codegen`: Generates GraphQL types based on your schema and operations.

## Design Decisions

-   **Framework:** [Remix](https://remix.run/) was used as the full-stack framework due to its focus on web fundamentals, simplified data handling (loaders/actions), and excellent performance.
-   **Hydrogen:** [Hydrogen](https://shopify.dev/custom-storefronts/hydrogen), Shopify's stack for headless commerce, was integrated to facilitate interaction with the Shopify Storefront API and utilize e-commerce optimized components.
-   **TypeScript:** TypeScript was adopted to improve code maintainability, early error detection, and the development experience through static typing.
-   **TailwindCSS:** [TailwindCSS](https://tailwindcss.com/) was chosen for styling due to its utility-first approach, enabling rapid and consistent UI development.
-   **GraphQL:** GraphQL was used to interact with the Shopify Storefront API, allowing precise and efficient data queries. `graphql-codegen` is employed to automatically generate types from GraphQL operations.
-   **Netlify:** Configured for deployment on Netlify Edge Functions for optimized performance.

## Assumptions

*().*
