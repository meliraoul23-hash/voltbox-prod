import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/data/products";

const staticRoutes = [
  "",
  "/tableaux-photovoltaiques",
  "/tableaux-electriques",
  "/materiel-photovoltaique",
  "/materiel-electrique",
  "/borne-de-recharge",
  "/sur-mesure",
  "/configurateur",
  "/devis",
  "/livraison",
  "/a-propos",
  "/seo/tableau-photovoltaique-precable-luxembourg",
  "/seo/coffret-photovoltaique-precable",
  "/seo/tableau-electrique-luxembourg",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://voltbox-demo.lu";
  const products = await getAllProducts();
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })),
    ...products.map((p) => ({ url: `${base}/produit/${p.slug}`, lastModified: p.updatedAt ?? new Date() })),
  ];
}
