import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/wendclass-fyp", "/api/", "/dashboard/"],
    },
    sitemap: "https://foryou-fyp.vercel.app/sitemap.xml",
  };
}
