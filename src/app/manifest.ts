import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amar Taka - Personal Finance Tracker",
    short_name: "Amar Taka",
    description:
      "Offline-first personal finance tracker with Neobrutalist design.",
    start_url: "/",
    display: "standalone",
    background_color: "#f0fdf4",
    theme_color: "#16a34a",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
