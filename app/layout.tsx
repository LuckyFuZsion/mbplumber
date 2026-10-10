import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContent, getLastUpdated } from "@/lib/content-server";
import { phoneHref } from "@/lib/content";
import { SITE } from "@/lib/site";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { business } = await getContent();
  return {
    metadataBase: new URL(SITE.url),
    // "./" resolves to each page's own address, so every page gets its own canonical tag.
    alternates: { canonical: "./" },
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    title: {
      default: `${SITE.name} | Plumber in Grantham, Lincolnshire`,
      template: `%s | ${SITE.name} Grantham`,
    },
    description: `Grantham plumber with ${business.yearsExperience} years experience. General plumbing, taps, sinks, bathrooms and some boiler work. Call ${business.phone} for a free quote.`,
    openGraph: {
      title: `${SITE.name} | Plumber in Grantham`,
      description: business.tagline,
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [{ business }, updated] = await Promise.all([getContent(), getLastUpdated()]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    description: business.tagline,
    sameAs: SITE.social,
    dateModified: updated,
    telephone: business.phone,
    email: business.email,
    url: SITE.url,
    image: `${SITE.url}/logo.png`,
    areaServed: "Grantham, Lincolnshire",
    address: { "@type": "PostalAddress", addressLocality: "Grantham", addressRegion: "Lincolnshire", addressCountry: "GB" },
  };
  return (
    <html lang="en-GB" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header phone={business.phone} phoneLink={phoneHref(business.phone)} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
