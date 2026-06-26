import { createFileRoute, Link } from "@tanstack/react-router";
import { competitors } from "@/lib/competitor-data";

export const Route = createFileRoute("/competitors/")({
  head: () => ({
    meta: [{ title: "Competitor Analysis · Pulse OPS" }],
  }),
  component: CompetitorsIndex,
});

const regionLabel: Record<string, string> = {
  UAE: "UAE",
  Global: "Global",
};

function CompetitorsIndex() {
  const uae = competitors.filter((c) => c.region === "UAE");
  const global = competitors.filter((c) => c.region === "Global");

  return (
    <div
      className="min-h-screen bg-[#f9fafb] px-16 pt-12 pb-16"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <div className="flex flex-col gap-2.5 mb-8">
        <h1 className="text-[28px] font-bold text-[#111827]">Competitor Analysis</h1>
        <p className="text-[14px] text-[#6b7280]">
          UAE and global competitors benchmarked against Mal Bank's design opportunity.
        </p>
      </div>

      {[
        { label: "UAE Competitors", items: uae },
        { label: "Global Competitors", items: global },
      ].map(({ label, items }) => (
        <div key={label} className="mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280] mb-3">
            {label}
          </p>
          <div className="flex flex-col gap-3">
            {items.map((c) => (
              <Link
                key={c.id}
                to="/competitors/$competitorId"
                params={{ competitorId: c.id }}
                className="block w-full rounded-2xl border border-[#e5e7eb] bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.05)] p-6 hover:border-[#9ca3af] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[#6b7280] mb-1">
                      Competitor {c.number} · {regionLabel[c.region]}
                    </p>
                    <p className="text-[18px] font-bold text-[#111827]">{c.name}</p>
                    <p className="text-[13px] text-[#6b7280] mt-1 leading-[1.5]">{c.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-[#6b7280] text-lg">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
