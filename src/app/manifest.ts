import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amar Taka - Personal Finance Tracker",
    short_name: "Amar Taka",
    description:
      "Offline-first personal finance tracker with Neobrutalist design.",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/icons/amartaka-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/amartaka-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
