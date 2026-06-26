import { createFileRoute, notFound } from "@tanstack/react-router";
import { competitors } from "@/lib/competitor-data";

export const Route = createFileRoute("/competitors/$competitorId")({
  head: ({ params }) => {
    const c = competitors.find((x) => x.id === params.competitorId);
    return {
      meta: [{ title: c ? `Competitor ${c.number} — ${c.name}` : "Competitor" }],
    };
  },
  loader: ({ params }) => {
    const c = competitors.find((x) => x.id === params.competitorId);
    if (!c) throw notFound();
    return c;
  },
  component: CompetitorDetail,
});

function Divider() {
  return <div className="h-px w-full bg-[#e5e7eb]" />;
}

function BulletList({
  items,
}: {
  items: { text: string; href?: string; linkText?: string }[];
}) {
  return (
    <div className="flex flex-col gap-2 text-sm w-full">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2.5 items-start">
          <span className="shrink-0 text-[#6b7280] leading-none mt-[3px]">•</span>
          <span className="leading-[1.5] text-[#374151]">
            {item.text}
            {item.href && item.linkText && (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#374151]"
              >
                {item.linkText}
              </a>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function SimpleBulletList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-2 text-sm w-full">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2.5 items-start">
          <span className="shrink-0 text-[#6b7280] leading-none mt-[3px]">•</span>
          <span className="leading-[1.5] text-[#374151]">{item}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[18px] font-bold text-[#111827] leading-normal"
       style={{ fontFamily: "Roboto, sans-serif" }}>
      {children}
    </p>
  );
}

function CompetitorDetail() {
  const c = Route.useLoaderData();
  const { sections } = c;

  return (
    <div
      className="min-h-screen bg-[#f9fafb] px-16 pt-12 pb-16"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-2.5 mb-6">
        <h1 className="text-[28px] font-bold text-[#111827] whitespace-nowrap leading-normal">
          Competitor {c.number} — {c.name}
        </h1>
        <p className="text-[14px] text-[#6b7280] leading-normal">{c.subtitle}</p>
      </div>

      {/* Content card */}
      <div className="w-full rounded-2xl border border-[#e5e7eb] bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.05)] p-8 flex flex-col gap-6">

        {/* Product Overview */}
        <div className="flex flex-col gap-3 w-full">
          <SectionHeading>Product Overview</SectionHeading>
          {sections.overview.paragraphs.map((p, i) => (
            <p key={i} className="text-[14px] text-[#374151] leading-[1.5]">{p}</p>
          ))}
          <p className="text-[13px] text-[#6b7280]">
            Source:{" "}
            <a
              href={sections.overview.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {sections.overview.source.text}
            </a>
          </p>
        </div>

        <Divider />

        {/* Target Users */}
        <div className="flex flex-col gap-3 w-full">
          <SectionHeading>Target Users</SectionHeading>
          {sections.targetUsers.paragraphs.map((p, i) => (
            <p key={i} className="text-[14px] text-[#374151] leading-[1.5]">{p}</p>
          ))}
        </div>

        <Divider />

        {/* AI Capabilities */}
        <div className="flex flex-col gap-3 w-full">
          <SectionHeading>AI Capabilities</SectionHeading>
          {/* Metrics */}
          <div className="flex gap-3 w-full">
            {sections.aiCapabilities.metrics.map((m, i) => (
              <div
                key={i}
                className="flex-1 min-w-0 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-3 flex flex-col gap-1.5"
              >
                <p className="text-[12px] font-semibold text-[#6b7280] whitespace-nowrap">{m.label}</p>
                <p className="text-[18px] font-bold text-[#111827] whitespace-nowrap">{m.value}</p>
                <p className="text-[12px] text-[#6b7280] leading-[1.4]">{m.description}</p>
              </div>
            ))}
          </div>
          <BulletList items={sections.aiCapabilities.bullets} />
        </div>

        <Divider />

        {/* Entry Points & Conversation Patterns */}
        <div className="flex flex-col gap-3 w-full">
          <SectionHeading>Entry Points &amp; Conversation Patterns</SectionHeading>
          {sections.entryPoints.paragraphs.map((p, i) => (
            <p key={i} className="text-[14px] text-[#374151] leading-[1.5]">{p}</p>
          ))}
        </div>

        <Divider />

        {/* Dashboard vs AI Balance */}
        <div className="flex flex-col gap-3 w-full">
          <SectionHeading>Dashboard vs AI Balance</SectionHeading>
          {sections.dashboardBalance.paragraphs.map((p, i) => (
            <p key={i} className="text-[14px] text-[#374151] leading-[1.5]">{p}</p>
          ))}
        </div>

        <Divider />

        {/* UX Strengths */}
        <div className="flex flex-col gap-3 w-full">
          <SectionHeading>UX Strengths</SectionHeading>
          <BulletList items={sections.uxStrengths.bullets} />
        </div>

        <Divider />

        {/* UX Weaknesses */}
        <div className="flex flex-col gap-3 w-full">
          <SectionHeading>UX Weaknesses</SectionHeading>
          <SimpleBulletList items={sections.uxWeaknesses.bullets} />
        </div>

        <Divider />

        {/* Key Missed Opportunities */}
        <div className="flex flex-col gap-3 w-full">
          <SectionHeading>Key Missed Opportunities</SectionHeading>
          <SimpleBulletList items={sections.missedOpportunities.bullets} />
        </div>

        <Divider />

        {/* Design Patterns Worth Studying */}
        <div className="flex flex-col gap-3 w-full">
          <SectionHeading>Design Patterns Worth Studying</SectionHeading>
          <SimpleBulletList items={sections.designPatterns.bullets} />
        </div>

      </div>
    </div>
  );
}
