import type { Metadata } from "next";

export const SITE_URL = "https://www.eurachoachoa.com";
export const SITE_NAME = "MAGMA";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      locale: "ko_KR",
      title,
      description,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function jsonLd(data: Record<string, unknown> | Array<Record<string, unknown>>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
