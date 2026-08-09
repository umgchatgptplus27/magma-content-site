import type { ReactNode } from "react";

type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  updatedAt: string;
  sections: LegalSection[];
};

export default function LegalPage({ eyebrow, title, summary, updatedAt, sections }: LegalPageProps) {
  return (
    <article className="reading py-20 sm:py-24">
      <header className="border-b border-line pb-10">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">{title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-sub">{summary}</p>
        <p className="mt-6 text-sm text-ink-muted">시행일 · {updatedAt}</p>
      </header>

      <div className="mt-12 space-y-12">
        {sections.map((section, index) => (
          <section key={section.title} aria-labelledby={`legal-section-${index + 1}`}>
            <h2 id={`legal-section-${index + 1}`} className="font-display text-xl font-bold text-primary">
              {index + 1}. {section.title}
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-ink-sub">{section.content}</div>
          </section>
        ))}
      </div>
    </article>
  );
}
