
    export { default } from "../../dist/server/server.js";

    export const config = {
      name: "Remix server handler",
      generator: "@netlify/remix-edge-adapter@3.4.3",
      cache: "manual",
      path: "/*",
      excludedPath: ["/.netlify/*","/.gitkeep","/.vite/*","/assets/*","/fonts/*","/images/*","/oxygen.json","/videos/*"],
    };