import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DashboardEmbed from "@/components/DashboardEmbed";
import JsonLd from "@/components/JsonLd";
import { getAll, getOne, renderMarkdown } from "@/lib/content";
import { absoluteUrl, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

export const dynamicParams = true;

export function generateStaticParams() {
  return getAll("reports").map((report) => ({ slug: report.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const report = getOne("reports", slug);
  if (!report || report.draft) return {};
  return pageMetadata({
    title: report.title,
    description: report.description,
    path: `/reports/${report.slug}`,
    image: report.thumbnail,
    type: "article",
  });
}

export default async function ReportPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const report = getOne("reports", slug);
  if (!report || report.draft) notFound();

  const path = `/reports/${report.slug}`;
  const html = await renderMarkdown(report.content);
  const reportSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    headline: report.title,
    description: report.description,
    datePublished: report.date,
    inLanguage: "ko-KR",
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(report.thumbnail ? { image: absoluteUrl(report.thumbnail) } : {}),
  };
  const breadcrumbSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "실적 보고", item: absoluteUrl("/reports") },
      { "@type": "ListItem", position: 3, name: report.title, item: absoluteUrl(path) },
    ],
  };

  return (
    <>
      <article className="reading py-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-xs">
            {report.period && (
              <span className="rounded-ui bg-primary px-2 py-0.5 font-bold text-card">{report.period}</span>
            )}
            <time className="text-ink-muted" dateTime={report.date}>{report.date}</time>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-snug text-primary sm:text-4xl">{report.title}</h1>
          <p className="mt-4 text-lg text-ink-sub">{report.description}</p>
        </header>
        {report.dashboardUrl && <DashboardEmbed url={report.dashboardUrl} title={`${report.title} 대시보드`} />}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <JsonLd data={[reportSchema, breadcrumbSchema]} />
    </>
  );
}
