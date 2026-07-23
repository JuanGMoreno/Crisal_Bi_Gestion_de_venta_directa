import type { MetadataRoute } from "next";
import { BRAND } from "@/shared/config/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.productName} | Gestion comercial`,
    short_name: BRAND.productName,
    description: BRAND.description,
    start_url: "/auth/signin",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#00509e",
    icons: [
      {
        src: BRAND.logo,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
