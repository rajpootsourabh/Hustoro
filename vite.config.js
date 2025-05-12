// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "/",
// })


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { resolve } from "path";

// const buildTarget = process.env.VITE_BUILD_TARGET || "website";

// export default defineConfig({
//   plugins: [react()],
//   base: "/",
//   define: {
//     __BUILD_TARGET__: JSON.stringify(buildTarget),
//   },
//   build: {
//     outDir: buildTarget === "dashboard" ? "dist-dashboard" : "dist-website",
//     rollupOptions: {
//       output: {
//         manualChunks: (id) => {
//           if (id.includes("node_modules")) {
//             if (buildTarget === "website" && id.includes("some-dashboard-only-dependency")) {
//               return "dashboard-only"; // Exclude dashboard-only dependencies from website build
//             }
//             if (buildTarget === "dashboard" && id.includes("some-website-only-dependency")) {
//               return "website-only"; // Exclude website-only dependencies from dashboard build
//             }
//             return "vendor";
//           }
//         },
//       },
//     },
//   },
// });



// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// const buildTarget = process.env.VITE_BUILD_TARGET || "website";

// export default defineConfig({
//   plugins: [react()],
//   base:"/",
//   define: {
//     __BUILD_TARGET__: JSON.stringify(buildTarget),
//   },
//   build: {
//     outDir: buildTarget === "dashboard" ? "dist-dashboard" : "dist-website",
//     rollupOptions: {
//       input: "src/main.jsx",
//       output: {
//         manualChunks: (id) => {
//           if (id.includes("node_modules")) {
//             if (buildTarget === "website" && id.includes("dashboard-only-dependency")) {
//               return "dashboard-only"; // Exclude from website build
//             }
//             if (buildTarget === "dashboard" && id.includes("website-only-dependency")) {
//               return "website-only"; // Exclude from dashboard build
//             }
//             return "vendor";
//           }
//         },
//       },
//     },
//   },
// });



import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const buildTarget = process.env.VITE_BUILD_TARGET || "website";

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_TARGET__: JSON.stringify(buildTarget),
  },
  root: ".", // Ensure Vite picks up index.html
  build: {
    outDir: buildTarget === "dashboard" ? "dist-dashboard" : "dist-website",
    emptyOutDir: true, // Ensures clean builds
  },
});
// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");

//   const buildTarget = env.VITE_BUILD_TARGET || "website";

//   return {
//     plugins: [react()],
//     define: {
//       __BUILD_TARGET__: JSON.stringify(buildTarget),
//     },
//     root: ".",
//     build: {
//       outDir: buildTarget === "dashboard" ? "dist-dashboard" : "dist-website",
//       emptyOutDir: true,
//     },
//   };
// });
