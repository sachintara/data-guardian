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

export function getClient(id: string) { return clients.find(c => c.id === id); }
export function getProgram(id: string) { return programs.find(p => p.id === id); }
export function getClientPrograms(id: string) { return programs.filter(p => p.clientId === id); }
export function getAlert(id: string) { return alerts.find(a => a.id === id); }
export function getProgramAlerts(id: string) { return alerts.filter(a => a.programId === id); }