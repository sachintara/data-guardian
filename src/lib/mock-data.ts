export type Health = "healthy" | "warning" | "critical";
export type Severity = "critical" | "high" | "medium" | "low";
export type StageKey = "receiving" | "validation" | "quality" | "output";

export interface StageMetrics {
  key: StageKey;
  label: string;
  total: number;
  success: number;
  failed: number;
  pending: number;
  avgMs: number;
  status: Health;
}

export interface Program {
  id: string;
  name: string;
  clientId: string;
  status: Health;
  volume: number;
  successRate: number;
  failureRate: number;
  slaStatus: Health;
  currentStage: StageKey;
  processingMs: number;
  stages: StageMetrics[];
  trend: { t: string; success: number; failed: number; volume: number }[];
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  health: Health;
  healthScore: number;
  programs: number;
  healthy: number;
  atRisk: number;
  slaBreaches: number;
  rejectionTrend: number; // % delta
  owner: string;
}

export type AlertType =
  | "Missing Data"
  | "Validation Failure Spike"
  | "Quality Check Failure Spike"
  | "SLA Breach"
  | "Delayed Processing"
  | "Pipeline Stalled"
  | "Abnormal Volume"
  | "Data Refresh Failure"
  | "Duplicate Records";

export interface Alert {
  id: string;
  type: AlertType;
  severity: Severity;
  title: string;
  description: string;
  impact: string;
  clientId: string;
  programId: string;
  stage: StageKey;
  openedAt: string;
  status: "open" | "investigating" | "resolved";
  owner?: string;
  recommended: string;
}

const CLIENT_NAMES = [
  ["acme-health", "Acme Health Systems", "Healthcare"],
  ["northwind-bank", "Northwind Bank", "Financial Services"],
  ["umbra-retail", "Umbra Retail Group", "Retail"],
  ["fabrikam-ins", "Fabrikam Insurance", "Insurance"],
  ["contoso-pharma", "Contoso Pharma", "Pharma"],
  ["initech-logistics", "Initech Logistics", "Logistics"],
  ["wayne-energy", "Wayne Energy", "Utilities"],
  ["stark-aero", "Stark Aerospace", "Aerospace"],
  ["pied-piper", "Pied Piper Data", "Technology"],
  ["hooli-cloud", "Hooli Cloud", "Technology"],
  ["dunder-mifflin", "Dunder Mifflin", "Manufacturing"],
  ["soylent-foods", "Soylent Foods", "CPG"],
  ["oscorp-bio", "Oscorp Biotech", "Pharma"],
  ["lexcorp-media", "LexCorp Media", "Media"],
  ["tyrell-systems", "Tyrell Systems", "Technology"],
  ["weyland-mining", "Weyland Mining", "Industrial"],
  ["cyberdyne-it", "Cyberdyne IT", "Technology"],
  ["massive-dyn", "Massive Dynamic", "R&D"],
  ["vandelay", "Vandelay Imports", "Trade"],
  ["bluth-cos", "Bluth Companies", "Real Estate"],
] as const;

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pickHealth(r: () => number, bias = 0): Health {
  const v = r() + bias;
  if (v > 0.85) return "critical";
  if (v > 0.65) return "warning";
  return "healthy";
}

const PROGRAM_TYPES = ["Claims Intake", "Eligibility Sync", "Risk Scoring", "Billing Feed", "Member Update"];

export const clients: Client[] = CLIENT_NAMES.map(([id, name, industry], i) => {
  const r = rand(i + 7);
  const programs = 5;
  const atRisk = Math.floor(r() * 3);
  const slaBreaches = Math.floor(r() * 4);
  const score = Math.round(95 - atRisk * 8 - slaBreaches * 4 - r() * 5);
  const health: Health = score < 70 ? "critical" : score < 85 ? "warning" : "healthy";
  return {
    id,
    name,
    industry,
    health,
    healthScore: Math.max(45, score),
    programs,
    healthy: programs - atRisk,
    atRisk,
    slaBreaches,
    rejectionTrend: Math.round((r() - 0.4) * 30),
    owner: ["Mira Patel", "Jonas Lee", "Priya Rao", "Sam Okafor", "Lin Chen"][i % 5],
  };
});

export const programs: Program[] = clients.flatMap((c, ci) => {
  const r = rand(ci * 13 + 3);
  return Array.from({ length: 5 }, (_, pi): Program => {
    const status = pickHealth(r, c.health === "critical" ? 0.2 : c.health === "warning" ? 0.1 : -0.1);
    const volume = Math.floor(2000 + r() * 18000);
    const failureRate = +(status === "critical" ? 8 + r() * 12 : status === "warning" ? 3 + r() * 4 : r() * 2).toFixed(1);
    const successRate = +(100 - failureRate).toFixed(1);
    const stages: StageMetrics[] = (["receiving", "validation", "quality", "output"] as StageKey[]).map((k, idx) => {
      const incoming = idx === 0 ? volume : 0;
      return { key: k, label: ["Receiving", "Validation", "Quality Check", "Final Output"][idx], total: incoming, success: 0, failed: 0, pending: 0, avgMs: 0, status: "healthy" };
    });
    let remaining = volume;
    stages.forEach((s, idx) => {
      s.total = remaining;
      const stageFailRate = idx === 0 ? r() * 0.02 : idx === 1 ? r() * (status === "critical" ? 0.15 : 0.04) : idx === 2 ? r() * (status === "critical" ? 0.12 : 0.05) : r() * 0.01;
      const failed = Math.floor(remaining * stageFailRate);
      const pending = Math.floor(remaining * (idx === 2 && status !== "healthy" ? 0.06 : 0.015));
      const success = remaining - failed - pending;
      s.failed = failed;
      s.pending = pending;
      s.success = success;
      s.avgMs = Math.floor(200 + idx * 350 + r() * 800);
      s.status = stageFailRate > 0.1 ? "critical" : stageFailRate > 0.04 ? "warning" : "healthy";
      remaining = success;
    });
    const currentStage: StageKey = stages.find(s => s.status !== "healthy")?.key ?? "output";
    const trend = Array.from({ length: 24 }, (_, h) => {
      const base = volume / 24;
      const noise = (r() - 0.5) * base * 0.4;
      const vol = Math.max(0, Math.floor(base + noise));
      const f = Math.floor(vol * (failureRate / 100) * (0.6 + r()));
      return { t: `${h}:00`, success: vol - f, failed: f, volume: vol };
    });
    return {
      id: `${c.id}-p${pi + 1}`,
      name: `${PROGRAM_TYPES[pi]} • ${c.name.split(" ")[0]}`,
      clientId: c.id,
      status,
      volume,
      successRate,
      failureRate,
      slaStatus: status,
      currentStage,
      processingMs: Math.floor(1500 + r() * 6000),
      stages,
      trend,
    };
  });
});

const ALERT_TYPES: AlertType[] = [
  "Missing Data", "Validation Failure Spike", "Quality Check Failure Spike",
  "SLA Breach", "Delayed Processing", "Pipeline Stalled", "Abnormal Volume",
  "Data Refresh Failure", "Duplicate Records",
];

export const alerts: Alert[] = programs
  .filter(p => p.status !== "healthy")
  .slice(0, 22)
  .map((p, i): Alert => {
    const r = rand(i + 21);
    const type = ALERT_TYPES[i % ALERT_TYPES.length];
    const severity: Severity = p.status === "critical" ? (r() > 0.4 ? "critical" : "high") : r() > 0.5 ? "medium" : "low";
    const stage: StageKey = p.currentStage;
    const minutesAgo = Math.floor(r() * 240) + 3;
    return {
      id: `ALR-${1000 + i}`,
      type,
      severity,
      title: `${type} on ${p.name}`,
      description: descFor(type, p),
      impact: impactFor(severity, p),
      clientId: p.clientId,
      programId: p.id,
      stage,
      openedAt: `${minutesAgo}m ago`,
      status: r() > 0.7 ? "investigating" : "open",
      owner: r() > 0.5 ? ["Mira Patel", "Jonas Lee", "Priya Rao"][i % 3] : undefined,
      recommended: recommendFor(type),
    };
  });

function descFor(t: AlertType, p: Program) {
  switch (t) {
    case "Missing Data": return `Expected ~${p.volume.toLocaleString()} records, received 0 in the last interval.`;
    case "Validation Failure Spike": return `Validation failures at ${p.failureRate}% vs baseline 2.1% (+${(p.failureRate - 2).toFixed(1)} pts).`;
    case "Quality Check Failure Spike": return `QC rejections rose sharply after validation passed cleanly.`;
    case "SLA Breach": return `Stage processing exceeded SLA window of 30 min by ${Math.floor(p.processingMs / 60000)}m.`;
    case "Delayed Processing": return `Records sitting in queue longer than rolling 7d p95.`;
    case "Pipeline Stalled": return `No movement detected on ${p.currentStage} for 18 minutes.`;
    case "Abnormal Volume": return `Volume 3.2× higher than historical baseline for this hour.`;
    case "Data Refresh Failure": return `Source feed timestamp older than 2 refresh cycles.`;
    case "Duplicate Records": return `Detected ${Math.floor(p.volume * 0.03)} duplicate record IDs in ingest.`;
  }
}
function impactFor(s: Severity, p: Program) {
  const recs = Math.floor(p.volume * (s === "critical" ? 0.18 : s === "high" ? 0.08 : 0.03));
  return `~${recs.toLocaleString()} records affected • potential SLA risk in ${s === "critical" ? "15m" : "1h"}`;
}
function recommendFor(t: AlertType) {
  switch (t) {
    case "Missing Data": return "Verify upstream connector and re-trigger ingest job.";
    case "Validation Failure Spike": return "Inspect schema drift on top 3 failing fields.";
    case "Quality Check Failure Spike": return "Compare QC rule version vs last successful run.";
    case "SLA Breach": return "Scale worker pool and escalate to on-call.";
    case "Delayed Processing": return "Check queue depth and reprocess stuck batch.";
    case "Pipeline Stalled": return "Restart stage executor and notify program owner.";
    case "Abnormal Volume": return "Confirm with client; throttle if unexpected.";
    case "Data Refresh Failure": return "Rotate refresh token and re-run sync.";
    case "Duplicate Records": return "Apply dedupe by composite key and reprocess.";
  }
}

export const portfolio = {
  totalClients: clients.length,
  totalPrograms: programs.length,
  recordsProcessed: programs.reduce((a, p) => a + p.volume, 0),
  successRate: +(
    programs.reduce((a, p) => a + p.successRate, 0) / programs.length
  ).toFixed(1),
  rejectionRate: +(
    programs.reduce((a, p) => a + p.failureRate, 0) / programs.length
  ).toFixed(1),
  slaCompliance: +(
    (programs.filter(p => p.slaStatus === "healthy").length / programs.length) * 100
  ).toFixed(1),
  activeIncidents: alerts.filter(a => a.status !== "resolved").length,
  programsAtRisk: programs.filter(p => p.status !== "healthy").length,
};

export const portfolioTrend = Array.from({ length: 14 }, (_, i) => {
  const r = rand(i + 99);
  return {
    day: `D-${13 - i}`,
    success: 92 + Math.round(r() * 6),
    sla: 90 + Math.round(r() * 8),
    volume: 180000 + Math.floor(r() * 60000),
    rejections: 2 + Math.round(r() * 4),
  };
});

export const aiInsights = [
  { id: "ai-1", text: "Validation failures across Healthcare clients rose 22% vs yesterday — concentrated in Acme Health Eligibility Sync.", metric: "+22% • last 24h", confidence: 0.86 },
  { id: "ai-2", text: "Northwind Bank Risk Scoring is projected to miss its 18:00 SLA based on current queue depth.", metric: "projected breach 17:42", confidence: 0.74 },
  { id: "ai-3", text: "Quality Check rejections show a slow upward trend (+3.1 pts over 14 days) — investigate rule v4.2 rollout.", metric: "+3.1 pts • 14d", confidence: 0.81 },
];

export type InsightKind = "anomaly" | "forecast" | "trend" | "pattern" | "improvement";

export interface InsightDetail {
  id: string;
  kind: InsightKind;
  headline: string;
  summary: string;
  metric: string;
  confidence: number;
  clientId?: string;
  programId?: string;
  validation: { label: string; status: "passed" | "failed" | "info"; detail: string }[];
  patterns: { label: string; detail: string; weight: number }[];
  series: { t: string; value: number; baseline: number }[];
  recommendation: string;
  evidence: string[];
}

export const insightDetails: InsightDetail[] = [
  {
    id: "ai-1",
    kind: "anomaly",
    headline: "Validation failures across Healthcare clients rose 22%",
    summary: "A coordinated spike in schema-mismatch errors started at 09:14 UTC, concentrated in Acme Health Eligibility Sync but bleeding into 3 adjacent programs.",
    metric: "+22% vs 7d baseline",
    confidence: 0.86,
    clientId: "acme-health",
    programId: "acme-health-p2",
    validation: [
      { label: "Statistical significance (z-score)", status: "passed", detail: "z = 4.7 (>3.0 threshold) — change is not noise." },
      { label: "Multi-source corroboration", status: "passed", detail: "Confirmed across 3 downstream consumers and the source connector log." },
      { label: "Schema fingerprint drift", status: "failed", detail: "Field `member_dob` changed type from STRING to DATE 47 min ago." },
      { label: "Volume baseline", status: "info", detail: "Volume itself is within ±8% of normal — failure rate, not throughput, is the driver." },
    ],
    patterns: [
      { label: "Schema-drift fingerprint", detail: "Matches incident pattern P-204 seen 3 times in the last 90 days.", weight: 0.84 },
      { label: "Time-of-day clustering", detail: "Failures cluster within the 09:00–10:00 UTC batch window.", weight: 0.62 },
      { label: "Connector-version correlation", detail: "Source connector upgraded to v3.11 within the last hour.", weight: 0.77 },
    ],
    series: Array.from({ length: 24 }, (_, i) => ({ t: `${i}:00`, value: i < 9 ? 2 + Math.random() * 1.5 : 12 + Math.random() * 6, baseline: 2.2 })),
    recommendation: "Pin source connector to v3.10 and re-run the 09:00 batch. Notify Acme Health data engineering of the schema regression.",
    evidence: [
      "Connector log: upgrade event at 09:11 UTC",
      "Schema registry diff: member_dob STRING → DATE",
      "Failure sample: 1,284 of 1,512 rejects cite 'Schema mismatch dob'",
    ],
  },
  {
    id: "ai-2",
    kind: "forecast",
    headline: "Northwind Bank Risk Scoring will miss its 18:00 SLA",
    summary: "Queue depth is growing 1.8× faster than worker drain rate. Linear projection breaches the 30-minute SLA window at 17:42.",
    metric: "Projected breach 17:42",
    confidence: 0.74,
    clientId: "northwind-bank",
    programId: "northwind-bank-p3",
    validation: [
      { label: "Queue growth model fit", status: "passed", detail: "R² = 0.91 across last 30 minutes of telemetry." },
      { label: "Worker saturation", status: "failed", detail: "All 8 workers at >95% CPU; no headroom to absorb spike." },
      { label: "Historical analog", status: "info", detail: "Similar pattern on 2026-05-22 led to a 22-minute breach." },
    ],
    patterns: [
      { label: "End-of-day surge", detail: "Volume routinely peaks 16:00–18:00; today is +34% vs the typical surge.", weight: 0.71 },
      { label: "Worker pool under-provisioned", detail: "Pool sized to p75 load, not p95.", weight: 0.66 },
    ],
    series: Array.from({ length: 24 }, (_, i) => ({ t: `${i}:00`, value: 100 + i * 14 + (i > 14 ? (i - 14) * 40 : 0), baseline: 100 + i * 12 })),
    recommendation: "Scale Risk Scoring worker pool from 8 → 14 for the next 2 hours. Page the on-call before 17:30.",
    evidence: [
      "Queue depth telemetry (live)",
      "Worker CPU saturation dashboard",
      "Prior SLA breach incident INC-0411 (2026-05-22)",
    ],
  },
  {
    id: "ai-3",
    kind: "trend",
    headline: "Quality Check rejections trending up across the portfolio",
    summary: "Slow upward drift (+3.1 pts over 14 days) tracks the rollout of QC rule v4.2. The rule appears overly strict for one specific field combination.",
    metric: "+3.1 pts over 14d",
    confidence: 0.81,
    validation: [
      { label: "Trend significance", status: "passed", detail: "Mann-Kendall test confirms monotonic upward trend (p < 0.01)." },
      { label: "Causal correlation", status: "passed", detail: "Onset aligns with QC v4.2 deploy on D-14." },
      { label: "Rollback simulation", status: "info", detail: "Replaying last 24h against QC v4.1 reduces rejection rate by 2.6 pts." },
    ],
    patterns: [
      { label: "Rule QC-117 overfires", detail: "61% of new rejects are QC-117 range check on amounts under $1.", weight: 0.88 },
      { label: "Industry concentration", detail: "Pharma and Insurance clients absorb 74% of the new failures.", weight: 0.58 },
    ],
    series: Array.from({ length: 14 }, (_, i) => ({ t: `D-${13 - i}`, value: 4 + i * 0.22 + Math.random() * 0.4, baseline: 4 })),
    recommendation: "Tighten QC-117 range check to amounts >= $0.01 and republish as v4.3. Backfill rejected records from the last 14 days.",
    evidence: [
      "QC rule changelog: v4.1 → v4.2 on D-14",
      "Rejection breakdown by rule ID",
      "Replay sandbox results (v4.1 vs v4.2)",
    ],
  },
  {
    id: "ai-4",
    kind: "pattern",
    headline: "Duplicate composite keys in Fabrikam Billing Feed",
    summary: "3.2% of ingested rows share a composite key with an earlier batch — consistent with connector retry replaying acknowledged batches.",
    metric: "3.2% duplicates",
    confidence: 0.79,
    clientId: "fabrikam-ins",
    validation: [
      { label: "Dedup key uniqueness", status: "failed", detail: "Composite key (account_id, period, line_id) collides on 3,418 rows." },
      { label: "Retry log correlation", status: "passed", detail: "Connector retry events match exactly the duplicated batch windows." },
    ],
    patterns: [
      { label: "At-least-once delivery without idempotency", detail: "Connector retries on transient 5xx without dedupe.", weight: 0.92 },
    ],
    series: Array.from({ length: 24 }, (_, i) => ({ t: `${i}:00`, value: i % 6 === 0 ? 3 + Math.random() * 2 : Math.random() * 0.4, baseline: 0.3 })),
    recommendation: "Apply idempotency on composite key at ingest. Reprocess the last 24h with dedupe enabled.",
    evidence: [
      "Connector retry log",
      "Composite-key collision sample (3,418 rows)",
    ],
  },
  {
    id: "ai-5",
    kind: "improvement",
    headline: "Cyberdyne IT improved success rate by 4.7 points",
    summary: "Following the QC v4.3 rollout, Cyberdyne's pipeline success climbed steadily over 7 days with no regressions in downstream metrics.",
    metric: "+4.7 pts over 7d",
    confidence: 0.91,
    clientId: "cyberdyne-it",
    validation: [
      { label: "Improvement significance", status: "passed", detail: "Welch t-test p < 0.001 vs the prior 14-day window." },
      { label: "No downstream regression", status: "passed", detail: "Processing time and SLA compliance held flat or improved." },
    ],
    patterns: [
      { label: "Rule-version uplift", detail: "Same pattern observed on 2 other clients post-v4.3 rollout.", weight: 0.74 },
    ],
    series: Array.from({ length: 14 }, (_, i) => ({ t: `D-${13 - i}`, value: 92 + (i > 6 ? (i - 6) * 0.7 : 0), baseline: 92 })),
    recommendation: "Promote QC v4.3 as the portfolio default and roll out to remaining 6 clients still on v4.2.",
    evidence: [
      "Success-rate series (14d)",
      "QC rule rollout audit log",
    ],
  },
  {
    id: "ai-6",
    kind: "pattern",
    headline: "Quality Check failures cluster in the 02:00–04:00 UTC window",
    summary: "Across Healthcare clients, QC failure density doubles during the overnight batch window — possibly a noisy upstream batch loader.",
    metric: "2× density 02:00–04:00 UTC",
    confidence: 0.68,
    validation: [
      { label: "Time-bucket significance", status: "passed", detail: "Chi-square test on 7d of failures confirms non-uniform distribution." },
      { label: "Cross-client consistency", status: "info", detail: "Pattern repeats in 4 of 5 Healthcare clients." },
    ],
    patterns: [
      { label: "Overnight batch noise", detail: "Source ETL runs unattended; bad rows accumulate until daytime triage.", weight: 0.69 },
    ],
    series: Array.from({ length: 24 }, (_, i) => ({ t: `${i}:00`, value: i >= 2 && i <= 4 ? 8 + Math.random() * 3 : 3 + Math.random() * 1.5, baseline: 3 })),
    recommendation: "Add a pre-validation gate to the 02:00 batch and route rejects to a quarantine queue instead of the main pipeline.",
    evidence: [
      "Hourly failure heatmap (7d)",
      "Upstream ETL schedule",
    ],
  },
];

export function getInsight(id: string) { return insightDetails.find(i => i.id === id); }

export interface SearchHit { kind: "client" | "program" | "alert"; id: string; label: string; sub: string; to: string; params: Record<string, string> }
export function searchAll(q: string, limit = 8): SearchHit[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const hits: SearchHit[] = [];
  for (const c of clients) {
    if (c.name.toLowerCase().includes(s) || c.id.includes(s) || c.industry.toLowerCase().includes(s)) {
      hits.push({ kind: "client", id: c.id, label: c.name, sub: `${c.industry} · ${c.programs} programs · score ${c.healthScore}`, to: "/clients/$clientId", params: { clientId: c.id } });
    }
  }
  for (const p of programs) {
    if (p.name.toLowerCase().includes(s) || p.id.includes(s)) {
      hits.push({ kind: "program", id: p.id, label: p.name, sub: `Program · ${p.status} · ${p.successRate}% success`, to: "/programs/$programId", params: { programId: p.id } });
    }
  }
  for (const a of alerts) {
    if (a.title.toLowerCase().includes(s) || a.id.toLowerCase().includes(s) || a.type.toLowerCase().includes(s)) {
      hits.push({ kind: "alert", id: a.id, label: a.title, sub: `${a.id} · ${a.severity} · ${a.openedAt}`, to: "/alerts/$alertId", params: { alertId: a.id } });
    }
  }
  return hits.slice(0, limit);
}

export function getClient(id: string) { return clients.find(c => c.id === id); }
export function getProgram(id: string) { return programs.find(p => p.id === id); }
export function getClientPrograms(id: string) { return programs.filter(p => p.clientId === id); }
export function getAlert(id: string) { return alerts.find(a => a.id === id); }
export function getProgramAlerts(id: string) { return alerts.filter(a => a.programId === id); }