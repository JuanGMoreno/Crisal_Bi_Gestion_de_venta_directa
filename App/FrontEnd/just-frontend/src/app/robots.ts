import type { MetadataRoute } from "next";
import { BRAND } from "@/shared/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/auth/signin", "/auth/signup"],
        disallow: ["/system/"],
      },
    ],
    sitemap: `${BRAND.url}/sitemap.xml`,
  };
}
