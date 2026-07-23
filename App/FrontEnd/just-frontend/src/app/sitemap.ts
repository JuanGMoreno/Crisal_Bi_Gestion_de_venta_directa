import type { MetadataRoute } from "next";
import { BRAND } from "@/shared/config/brand";

const publicRoutes = ["/", "/auth/signin", "/auth/signup"];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${BRAND.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
