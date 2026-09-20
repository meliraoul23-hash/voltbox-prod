import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL("https://voltbox-demo.lu"),
  title: {
    default: `${siteConfig.name} — Tableaux électriques et photovoltaïques précâblés`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "tableau photovoltaïque précâblé",
    "coffret photovoltaïque précâblé",
    "tableau PV prêt à poser",
    "coffret AC DC photovoltaïque",
    "tableau électrique précâblé",
    "coffret photovoltaïque triphasé",
    "tableau PV Luxembourg",
    "coffret photovoltaïque Luxembourg",
    "tableau électrique Luxembourg",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col font-sans text-ink antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
