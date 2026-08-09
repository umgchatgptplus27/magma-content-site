import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseLoader from "@/components/AdSenseLoader";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.company.name} — ${siteConfig.company.tagline}`,
    template: `%s | ${siteConfig.company.name}`,
  },
  description: siteConfig.company.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "ko_KR",
    title: `${siteConfig.company.name} — ${siteConfig.company.tagline}`,
    description: siteConfig.company.description,
    images: [{ url: siteConfig.hero.poster, alt: `${siteConfig.company.name} 브랜드 이미지` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.company.name} — ${siteConfig.company.tagline}`,
    description: siteConfig.company.description,
    images: [siteConfig.hero.poster],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      email: "gitarsde@gmail.com",
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "ko-KR",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <JsonLd data={organizationSchema} />
        {process.env.NODE_ENV === "production" && (
          <script
            defer
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9723123826200643"
            crossOrigin="anonymous"
            fetchPriority="low"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        {process.env.NODE_ENV !== "production" && <AdSenseLoader />}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
