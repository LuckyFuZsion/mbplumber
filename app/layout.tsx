import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Plumber in Grantham, Lincolnshire`,
    template: `%s | ${SITE.name} Grantham`,
  },
  description:
    "Grantham plumber with 20+ years experience. General plumbing, taps, sinks, bathrooms and some boiler work. Call 07830 001306 for a free quote.",
  openGraph: {
    title: `${SITE.name} | Plumber in Grantham`,
    description: SITE.tagline,
    images: ["/logo.png"],
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Plumber",
  name: SITE.name,
  telephone: SITE.phone,
  email: SITE.email,
  url: SITE.url,
  image: `${SITE.url}/logo.png`,
  areaServed: "Grantham, Lincolnshire",
  address: { "@type": "PostalAddress", addressLocality: "Grantham", addressRegion: "Lincolnshire", addressCountry: "GB" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
