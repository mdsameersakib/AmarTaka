import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amar Taka",
    short_name: "Amar Taka",
    description:
      "Neo-brutalist personal finance experience for tracking income, expenses, wallets, and categories.",
    start_url: "/",
    display: "standalone",
    background_color: "#f0fdf4",
    theme_color: "#22c55e",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

