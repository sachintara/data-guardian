export interface CompetitorMetric {
  label: string;
  value: string;
  description: string;
}

export interface CompetitorSection {
  title: string;
  paragraphs?: string[];
  bullets?: { text: string; href?: string; linkText?: string }[];
  metrics?: CompetitorMetric[];
  capabilityBullets?: { text: string; href?: string; linkText?: string }[];
  source?: { text: string; href: string };
}

export interface Competitor {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  region: "UAE" | "Global";
  sections: {
    overview: { paragraphs: string[]; source: { text: string; href: string } };
    targetUsers: { paragraphs: string[] };
    aiCapabilities: {
      metrics: CompetitorMetric[];
      bullets: { text: string; href?: string; linkText?: string }[];
    };
    entryPoints: { paragraphs: string[] };
    dashboardBalance: { paragraphs: string[] };
    uxStrengths: { bullets: { text: string; href?: string; linkText?: string }[] };
    uxWeaknesses: { bullets: string[] };
    missedOpportunities: { bullets: string[] };
    designPatterns: { bullets: string[] };
  };
}

export const competitors: Competitor[] = [
  {
    id: "emirates-nbd",
    number: 1,
    name: "Emirates NBD (EVA + Generative AI Layer)",
    subtitle: "Product overview, target users, AI capabilities, and UX strengths/weaknesses for Emirates NBD's virtual assistant.",
    region: "UAE",
    sections: {
      overview: {
        paragraphs: [
          "Emirates NBD is the UAE's largest banking group by assets. EVA - Emirates NBD Virtual Assistant - launched in 2017 as the region's first voice-and-chat banking AI. EVA was conceptualised in 2015, launched in February 2017, and trained to handle 150 skills - the most common reasons why a customer calls in. It has since evolved from a phone IVR replacement into an in-app assistant, and more recently has had a generative AI layer applied on top.",
        ],
        source: {
          text: "The Asian Banker",
          href: "https://www.theasianbanker.com/updates-and-articles/emiratesnbd-leverages-on-virtual-assistant-for-phone-banking-optimisation",
        },
      },
      targetUsers: {
        paragraphs: [
          "Mass retail banking customers in UAE - Emirati nationals, expats across income segments. Also serves business banking clients. Very broad demographic, not specifically targeted at digital natives.",
        ],
      },
      aiCapabilities: {
        metrics: [
          { label: "Routing accuracy", value: "73% reduction", description: "Incorrect routing vs IVR" },
          { label: "Service time", value: "50% reduction", description: "Time to serve vs IVR" },
          { label: "Automated services", value: "47", description: "Fully automated (up from 20)" },
        ],
        bullets: [
          { text: "Balance inquiries and transaction history" },
          { text: "Card freeze/unfreeze" },
          { text: "Bill payments and transfers" },
          { text: "Loan inquiries and eligibility checks" },
          { text: "Merchant refund tracking" },
          { text: "Appointment scheduling" },
          {
            text: "Alerting clients which way balances are trending in the next 7 days ",
            linkText: "Bank of America",
            href: "https://newsroom.bankofamerica.com/content/newsroom/press-releases/2025/08/a-decade-of-ai-innovation--bofa-s-virtual-assistant-erica-surpas.html",
          },
          {
            text: "Highlighting BankAmeriDeals-equivalent cash back deals based on spending ",
            linkText: "Bank of America",
            href: "https://newsroom.bankofamerica.com/content/newsroom/press-releases/2025/08/a-decade-of-ai-innovation--bofa-s-virtual-assistant-erica-surpas.html",
          },
          {
            text: "Generative AI now being used to transform business operations and enhance productivity, supported by Microsoft ",
            linkText: "Emirates NBD",
            href: "https://www.emiratesnbd.com/en/media-center/emirates-nbd-to-transform-business-operations-and-enhance-productivity-with-generative-ai",
          },
        ],
      },
      entryPoints: {
        paragraphs: [
          "Accessible via the Emirates NBD mobile app as a floating chat icon. Also available via phone banking as voice assistant. Not the primary landing screen - it is supplementary to the dashboard.",
          "Primarily command-and-response. User says what they want, EVA executes or routes. Very limited proactive behavior. Conversations are short and transactional - not multi-turn or contextual.",
        ],
      },
      dashboardBalance: {
        paragraphs: [
          "Heavily dashboard-first. The landing experience is a traditional dashboard showing balances, accounts, cards, and recent transactions. EVA is accessible but not primary. This is a 90/10 split in favor of traditional UI.",
        ],
      },
      uxStrengths: {
        bullets: [
          {
            text: "High Arabic language accuracy - recognition accuracy of around 90% for English and 86% for Arabic ",
            linkText: "The Asian Banker",
            href: "https://www.theasianbanker.com/updates-and-articles/emiratesnbd-leverages-on-virtual-assistant-for-phone-banking-optimisation",
          },
          {
            text: "Proven operational efficiency at scale - handles around 500,000 customer calls per month ",
            linkText: "The Asian Banker",
            href: "https://www.theasianbanker.com/updates-and-articles/emiratesnbd-leverages-on-virtual-assistant-for-phone-banking-optimisation",
          },
          { text: "Seamless human handoff - the human agent knows the intent of the call before they even speak to the customer" },
          { text: "Broad task coverage - 47 fully automated services" },
        ],
      },
      uxWeaknesses: {
        bullets: [
          "EVA is fundamentally a support deflection tool, not a financial insight engine",
          "No meaningful spending visualization or insight delivery",
          "Conversation feels robotic - it's intent-matching, not genuine understanding",
          "No cultural awareness - Ramadan, Zakat, remittance patterns are completely absent",
          "No proactive insight surfacing - purely reactive",
          "Dashboard remains the primary interface - AI feels bolted on",
        ],
      },
      missedOpportunities: {
        bullets: [
          "The generative AI investment is backend-focused (productivity, operations) not user-facing insight",
          "Treating spending insight as a conversation hasn't been explored",
          "No monthly ritual mechanic - there's nothing to bring a user back by choice",
          "Cultural calendar integration is a complete blind spot",
        ],
      },
      designPatterns: {
        bullets: [
          "The seamless machine-to-human handoff is technically excellent - the agent knowing the user's intent before answering is a powerful UX moment worth learning from",
          "Arabic-English bilingual fluency is table stakes for the UAE market and EVA has proven it's achievable",
        ],
      },
    },
  },
  {
    id: "mashreq-neo",
    number: 2,
    name: "Mashreq NEO (Money Insights Feature)",
    subtitle: "Product overview, target users, AI capabilities, and UX strengths/weaknesses for Mashreq NEO's personal finance management tool.",
    region: "UAE",
    sections: {
      overview: {
        paragraphs: [
          "Mashreq NEO is a leading digital channel within the bank's retail strategy in the Middle East, delivering a full suite of services — current and savings accounts, payments, lending, and investments — entirely through mobile and online platforms. In May 2026, Mashreq launched Money Insights, a personal financial management tool integrated directly into the NEO app. Available to 1.5 million UAE customers, it automatically sorts transactions into 40+ categories, tracks month-on-month comparisons, detects duplicate charges, and consolidates all recurring payments into a subscription tracker. This is live competition, launched just weeks ago.",
        ],
        source: { text: "The Digital Banker, Fintechnews", href: "https://thedigitalbanker.com" },
      },
      targetUsers: {
        paragraphs: [
          "Digital-first UAE banking customers, skewed toward younger, urban, mobile-first users. NEO NXT extends the proposition to children and teenagers aged 8–18, with spending insights and savings goals built specifically for that segment.",
        ],
      },
      aiCapabilities: {
        metrics: [
          { label: "Customers reached", value: "1.5M", description: "UAE customer base" },
          { label: "Spending categories", value: "40+", description: "Auto-categorized" },
          { label: "Historical data", value: "6 months", description: "Month-on-month comparison" },
        ],
        bullets: [
          { text: "Automatic transaction categorization across 40+ spending categories" },
          { text: "Month-on-month spending comparison" },
          { text: "Duplicate charge detection" },
          { text: "Subscription tracker — all recurring payments consolidated in one view" },
          { text: "Income and cash flow monitoring" },
          { text: "AI-powered personalized recommendations based on transaction behaviour" },
        ],
      },
      entryPoints: {
        paragraphs: [
          "Money Insights sits as a dedicated section within the NEO app — it is not integrated into a chat flow. Users navigate to it like a feature, not ask for it like a conversation. There is no conversational entry point.",
          "Interaction is entirely dashboard-driven. The user browses static screens showing categorized data, historical comparisons, and subscription lists. There is no dialogue, no follow-up, and no proactive surfacing — insight is delivered as a visual layer, not a conversation.",
        ],
      },
      dashboardBalance: {
        paragraphs: [
          "Fully dashboard-first. Money Insights is a discrete section within a traditional mobile banking app. The user must navigate to it intentionally. There is no AI layer mediating the experience — it is data visualisation presented as a feature, not an assistant. Approximately 95/5 in favor of traditional UI.",
        ],
      },
      uxStrengths: {
        bullets: [
          { text: "Early testing with 30,000+ customers yielded an average rating of 4.6 / 5" },
          { text: "40+ categories is genuinely granular — most banking apps offer only 8–12" },
          { text: "6 months of historical data enables meaningful pattern recognition" },
          { text: "Subscription tracker is highly practical, especially for UAE users with many recurring international subscriptions" },
          { text: "Duplicate charge detection adds real trust value" },
        ],
      },
      uxWeaknesses: {
        bullets: [
          "It is a dashboard, not a conversation — the user must navigate to it, not ask for it",
          "No conversational interface — insight is delivered as static screens",
          "No cultural context — Ramadan, Eid, and Zakat are not first-class events in the system",
          "No proactive surfacing — the user must go looking for insight",
          "No \"what should I do about this?\" layer — it shows data but doesn't help with decisions",
          "Insight is siloed to Mashreq data only — no cross-account context",
          "No monthly ritual mechanic — no designed reason to return specifically for insight",
        ],
      },
      missedOpportunities: {
        bullets: [
          "The data infrastructure exists. The categorisation model exists. The conversational delivery layer is completely absent",
          "Mashreq has the fuel but isn't driving — they've built a tank and left it parked",
          "No Ramadan or Eid calendar integration despite serving a Muslim-majority customer base",
          "No \"what should I do?\" layer — purely descriptive, not prescriptive",
        ],
      },
      designPatterns: {
        bullets: [
          "40+ spending categories sets the market benchmark — under-categorization is the norm everywhere else",
          "Subscription tracker as a standalone insight module is worth replicating — UAE users carry many international recurring charges",
          "Month-on-month comparison as the primary time frame is the correct default for this use case",
        ],
      },
    },
  },
  {
    id: "adib",
    number: 3,
    name: "ADIB (Money Management Tracker)",
    subtitle: "Product overview, target users, AI capabilities, and UX strengths/weaknesses for Abu Dhabi Islamic Bank's PFM tool.",
    region: "UAE",
    sections: {
      overview: {
        paragraphs: [
          "Abu Dhabi Islamic Bank launched the ADIB Money Management Tracker in partnership with Lune — an Emirati fintech — in January 2025. Described as the region's first Islamic PFM tool, it enables users to track income and expenses, categorize spending, and gain insights into their financial activity. This is Mal's closest ideological peer in the UAE market — both are Shariah-compliant Islamic banks building financial insight tools for a Muslim-majority audience. What ADIB built is the nearest existing product to a PFM tool in the Islamic banking space in the UAE.",
        ],
        source: { text: "ADIB, Khaleej Times", href: "https://www.adib.ae" },
      },
      targetUsers: {
        paragraphs: [
          "ADIB's customer base is heavily UAE national and Muslim expat — a strong demographic overlap with Mal's target. The Money Management Tracker was developed as part of ADIB's 2035 Vision, the bank's long-term digital transformation strategy, signalling institutional commitment rather than a feature experiment.",
        ],
      },
      aiCapabilities: {
        metrics: [
          { label: "Launch", value: "Jan 2025", description: "First Islamic PFM in UAE" },
          { label: "Fintech partner", value: "Lune", description: "Emirati-native" },
          { label: "Chatbot availability", value: "24/7", description: "GenAI-driven service" },
        ],
        bullets: [
          { text: "GenAI-driven chatbot handling account balance, password reset, card settings, and transactions" },
          { text: "Spending categorisation across groceries, transport, entertainment, and more" },
          { text: "Interactive cash flow visualisation — charts and category breakdowns" },
          { text: "Income and expense tracking" },
          { text: "Short-term and long-term financial planning support" },
        ],
      },
      entryPoints: {
        paragraphs: [
          "The Money Management Tracker is a dedicated section within the ADIB mobile app, accessed via navigation — not via conversation. The GenAI chatbot and the tracker are completely separate tools with no integration between them. Users must switch contexts manually between insight and service.",
          "The chatbot handles service queries (balance, card settings, transactions). The tracker handles financial insight. They do not speak to each other, and the AI has no access to the tracker's data. This siloed architecture is the defining structural failure of the product.",
        ],
      },
      dashboardBalance: {
        paragraphs: [
          "Visualization-first and heavily dashboard-oriented. The tracker presents charts, category breakdowns, and cash flow graphs as static screens. The AI chatbot exists separately as a service tool. There is no unified experience — the ratio is approximately 90/10 in favor of traditional UI, with AI and insight operating in completely disconnected silos.",
        ],
      },
      uxStrengths: {
        bullets: [
          { text: "Shariah-compliance creates implicit trust alignment — users know the bank understands their financial context" },
          { text: "Lune partnership signals cultural authenticity — this is not a Western product retrofitted for the region" },
          { text: "Interactive cash flow visualisation is more advanced than most UAE competitors" },
          { text: "Category-based tracking enables spending pattern recognition" },
          { text: "Institutional backing from ADIB's 2035 Vision provides long-term commitment signal" },
        ],
      },
      uxWeaknesses: {
        bullets: [
          "The PFM tracker and the AI chatbot are completely disconnected silos — the most significant structural failure",
          "No conversational delivery of insight — navigation-dependent dashboard",
          "No Zakat-specific tracking or categorization despite being an Islamic bank",
          "No Ramadan or Eid financial context despite serving a Muslim-majority customer base",
          "The chatbot handles service tasks only — it has no awareness of the tracker's data",
          "No proactive alerts from the tracker — purely passive, not intelligent",
        ],
      },
      missedOpportunities: {
        bullets: [
          "An Islamic bank with a spending tracker that doesn't speak Islamic financial concepts — Zakat, Sadaqah, halal spending categories are entirely absent",
          "This is the most revealing gap in the UAE competitive landscape: the cultural intelligence opportunity is completely unaddressed",
          "Connecting the AI chatbot to the tracker data would create a fundamentally different product — this hasn't been done",
          "No proactive calendar-aware insight around Ramadan, Eid, or Hajj season",
        ],
      },
      designPatterns: {
        bullets: [
          "Interactive cash flow visualisation — flowing diagrams showing money moving in and out, not just bar charts",
          "The Lune partnership model — collaborating with a culturally native fintech to build a more authentic product is worth noting as a strategy",
        ],
      },
    },
  },
  {
    id: "cleo",
    number: 4,
    name: "Cleo (Global AI-First Money Assistant)",
    subtitle: "Product overview, target users, AI capabilities, and UX strengths/weaknesses for the world's most mature chat-first financial AI.",
    region: "Global",
    sections: {
      overview: {
        paragraphs: [
          "Cleo is the world's most mature chat-first AI money management app. It is not a bank — it connects to existing bank accounts via Plaid. Cleo 3.0, powered by OpenAI's o3 model, uses chain-of-thought reasoning to analyse transaction history and surface insights proactively, without waiting to be asked. It introduces agentic architecture, persistent memory across sessions, and real-time voice conversation. Cleo is the closest existing product to what Mal is building at the experience layer — and the benchmark for what conversational financial AI should feel like.",
        ],
        source: { text: "Cleo, The Penny Hoarder", href: "https://web.meetcleo.com" },
      },
      targetUsers: {
        paragraphs: [
          "Tech-savvy individuals aged 18 and above — heavily skewed toward millennials and Gen Z in the United States. Users who find traditional banking intimidating and respond better to a product with personality, humor, and informal language over formal financial tools.",
        ],
      },
      aiCapabilities: {
        metrics: [
          { label: "AI model", value: "OpenAI o3", description: "Chain-of-thought reasoning" },
          { label: "Session memory", value: "Persistent", description: "Remembers goals and stressors" },
          { label: "Proactive insights", value: "Agent-driven", description: "Surfaces without prompting" },
        ],
        bullets: [
          { text: "Proactive Smart Insights Agent — surfaces spending trends before user asks" },
          { text: "Multi-turn conversational finance — drills deeper without re-explaining context" },
          { text: "Persistent memory — remembers budgeting goals, financial stressors, and past conversations" },
          { text: "Real-time two-way voice conversation" },
          { text: "Category-level budgeting and alerts" },
          { text: "Round-up savings — sweeps spare change automatically" },
          { text: "Debt management and payoff planning" },
          { text: "Cash advance (subscription-gated)" },
          { text: "\"Roast mode\" — humorous, harsh financial breakdown" },
        ],
      },
      entryPoints: {
        paragraphs: [
          "The chat window is the app. There is no dashboard to navigate to first. The user opens Cleo and is immediately in conversation. This is the purest existing implementation of chat-as-primary-interface in financial services — not an overlay, not a feature, the entire product is the conversation.",
          "Highly personality-driven — bright, informal, emoji-rich, with a distinct voice that balances financial coach and sarcastic friend. Conversation flows include user-initiated questions, Cleo-proactive insight cards, multi-turn drill-downs, and quick-reply buttons that eliminate typing friction for common follow-ups. Notifications land users directly into pre-loaded conversation context.",
        ],
      },
      dashboardBalance: {
        paragraphs: [
          "Chat-first with no primary dashboard. Spending cards, category breakdowns, and budgeting visuals all appear inline within the chat thread. Settings and account management exist as a tab, but the vast majority of financial interaction stays in conversation. This is the only product in this analysis that fully inverts the traditional banking interface model — approximately 10/90 in favor of AI-first UI.",
        ],
      },
      uxStrengths: {
        bullets: [
          { text: "Genuinely AI-first architecture — not a bolted-on feature but a product built around conversational finance from the ground up" },
          { text: "Personality reduces financial anxiety — humor is a legitimate and effective UX strategy" },
          { text: "Proactive insight surfacing without prompting is the most differentiating capability in the market" },
          { text: "Persistent memory across sessions is a strong loyalty driver" },
          { text: "Round-up savings makes saving effortless through behavioral design" },
          { text: "Visual spending cards inline in chat solve the text-only problem elegantly" },
          { text: "Notification → chat experience pre-loads conversation context, eliminating re-orientation" },
        ],
      },
      uxWeaknesses: {
        bullets: [
          "Tone is too casual for users with serious financial stress — humor fails at the wrong moment",
          "US-only — no cultural or regional context for any other market",
          "No Ramadan, Eid, Zakat, or remittance intelligence — zero cultural awareness",
          "Cash advance features have created trust issues when amounts don't match what was advertised",
          "Limited integration with financial institutions and third-party apps beyond Plaid",
          "No investment guidance or complex financial planning capability",
        ],
      },
      missedOpportunities: {
        bullets: [
          "Zero cultural intelligence — the entire product assumes a secular, American financial context",
          "Cash advance structure involves interest — incompatible with Shariah compliance",
          "No calendar-aware proactivity — insight is data-driven but not life-context-aware",
          "Arabic language support is entirely absent",
        ],
      },
      designPatterns: {
        bullets: [
          "Proactive insight cards surfaced before the user asks — with clear visual hierarchy inline in chat",
          "Quick-reply buttons reducing typing friction for common follow-ups (\"Show me dining\", \"Set a budget\")",
          "Drill-down within chat — tapping a category stays in conversation, doesn't navigate away",
          "Memory between sessions — \"Last month you said you wanted to cut dining. You're already 60% through this month\"",
          "Notification → chat with pre-loaded context — no re-orientation required",
          "Round-up cross-sell surfaces naturally after a spending insight, not as a banner",
        ],
      },
    },
  },
  {
    id: "bank-of-america",
    number: 5,
    name: "Bank of America (Erica)",
    subtitle: "Product overview, target users, AI capabilities, and UX strengths/weaknesses for the world's most scaled AI banking assistant.",
    region: "Global",
    sections: {
      overview: {
        paragraphs: [
          "Erica is the most scaled AI banking assistant in the world and the benchmark for what AI can achieve inside a traditional banking app. Launched in 2018, Erica has surpassed 3.2 billion total client interactions. Last year alone, 20.6 million users interacted with Erica nearly 700 million times. What began as a beefed-up chatbot has evolved into a proactive financial intelligence layer — analysing what customers ask about and connecting to the bank's full digital architecture to eliminate friction. Erica is also a cautionary tale about the ceiling of this model: massive scale forces generic responses, and genuine financial insight remains surface-level.",
        ],
        source: { text: "Bank of America, The Financial Brand", href: "https://newsroom.bankofamerica.com" },
      },
      targetUsers: {
        paragraphs: [
          "Mass retail banking customers in the US across all age groups and income segments. Erica is designed to serve 50 million users — extreme breadth that prevents depth on any individual segment. The scale that makes Erica impressive is also what limits how personal it can be.",
        ],
      },
      aiCapabilities: {
        metrics: [
          { label: "Active users (last year)", value: "20.6M", description: "Retail banking customers" },
          { label: "Total interactions (since 2018)", value: "3.2B", description: "Across all channels" },
          { label: "Proactive insight share", value: "60%", description: "Of all Erica interactions" },
        ],
        bullets: [
          { text: "7-day cash flow forecast — predicts where the balance is going, not just where it's been" },
          { text: "Proactive 1.7 billion personalized insights delivered to date" },
          { text: "Subscription price increase alerts" },
          { text: "Duplicate charge detection" },
          { text: "Merchant refund tracking" },
          { text: "Weekly spending snapshots" },
          { text: "Balance trend alerts (up or down over 7 days)" },
          { text: "Investment guidance on nearly 50 topics (via Merrill integration)" },
          { text: "Appointment scheduling with seamless human handoff" },
          { text: "Full context preserved on human agent handoff — no re-authentication required" },
        ],
      },
      entryPoints: {
        paragraphs: [
          "Erica lives inside the BofA mobile app as a persistent floating button — not the primary interface. The dashboard is the home screen. Users access Erica by tapping the icon, not by default. 60% of interactions are now proactive — Erica pushes insights without being asked — which represents a fundamental shift from reactive assistant to proactive financial intelligence layer.",
          "Responses combine text with formatted cards. Bank of America's data scientists have trained Erica with a library of 700+ responses, updated more than 75,000 times since launch. Conversation is structured but increasingly naturalistic. Proactive alerts (subscription increase, refund posted, balance trend) tap through to the relevant Erica conversation with context already loaded.",
        ],
      },
      dashboardBalance: {
        paragraphs: [
          "Dashboard-first, AI-enhanced. Erica is a powerful assistant layer over a traditional banking dashboard — not a replacement for it. The ratio is approximately 70/30 in favor of traditional UI. The 60% proactive insight figure is significant — Erica now speaks to users more than users speak to Erica — but the primary surface remains the dashboard.",
        ],
      },
      uxStrengths: {
        bullets: [
          { text: "60% proactive interaction ratio — the AI speaks to users more than users speak to the AI" },
          { text: "More than 98% of users find the information they need through Erica" },
          { text: "7-day cash flow prediction is genuinely useful and not widely replicated in the market" },
          { text: "Subscription price increase alerts — highly practical, trust-building proactive behavior" },
          { text: "Seamless human handoff with full context preserved — agent knows why you called before you explain" },
          { text: "Notification → chat experience with pre-loaded context" },
          { text: "Platform architecture allows reuse across multiple banking products" },
        ],
      },
      uxWeaknesses: {
        bullets: [
          "Deeply embedded in a traditional banking app — cannot be the primary interface because the app was designed around a dashboard",
          "Conversation depth is limited — very good at answering questions, less good at proactively changing how users think about their finances",
          "No personality — Erica is helpful but not memorable",
          "No cultural intelligence — designed for the generic American user",
          "No Ramadan, Eid, Zakat, or remittance context",
          "Financial insight delivery is text-heavy — limited native visual patterns in conversation",
          "Scale forces generic responses — cannot feel like a relationship at 50 million users",
        ],
      },
      missedOpportunities: {
        bullets: [
          "Despite 700+ response types, actual insight quality remains surface-level",
          "No meaningful spending visualization inline in conversation",
          "Proactive moments are transactional (refund posted, subscription changed) — not insight-driven (\"you're spending 40% more this month, here's why\")",
          "No cultural or religious financial context despite the diversity of its customer base",
        ],
      },
      designPatterns: {
        bullets: [
          "7-day cash flow forecast — predicting where the balance is going, not just where it's been, is extremely useful and under-utilized market-wide",
          "Subscription price change alert — proactive alerting when something changes is strong trust behavior",
          "Context-preserved human handoff — the agent knowing why you called before you explain is a powerful UX moment",
          "60% proactive insight ratio — this is the target model: the AI should speak to the user more than the user speaks to the AI",
        ],
      },
    },
  },
  {
    id: "revolut",
    number: 6,
    name: "Revolut (AIR — AI by Revolut)",
    subtitle: "Product overview, target users, AI capabilities, and UX strengths/weaknesses for the industry's most aggressive recent move toward AI-as-primary-banking-interface.",
    region: "Global",
    sections: {
      overview: {
        paragraphs: [
          "AIR — AI by Revolut — is the most important global competitor to study because it launched just 10 weeks ago and represents the industry's most aggressive move toward AI-as-primary-banking-interface. Revolut began rolling out AIR to its 13 million UK customers on April 9, 2026. It replaces multi-step app navigation with a single conversational interface covering core day-to-day banking functions: spending insights, investment tracking, subscription management, card control, and travel support. AIR has direct read access to the user's own financial data and operates under a zero data retention policy with third-party AI providers.",
        ],
        source: { text: "FinTech News, Airstreet, Evermx", href: "https://fintech.global" },
      },
      targetUsers: {
        paragraphs: [
          "Revolut's 70+ million global users — digitally native, financially active, and comfortable with technology. Strong presence in UK, Europe, and internationally including the UAE. Users expect a product that moves at the speed of their financial life, not one that makes them navigate menus.",
        ],
      },
      aiCapabilities: {
        metrics: [
          { label: "Global users", value: "70M+", description: "Across all markets" },
          { label: "UK rollout date", value: "Apr 9, 2026", description: "Most recent competitor launch" },
          { label: "Support without human", value: "80%", description: "Up from 17% at AI journey start" },
        ],
        bullets: [
          { text: "Spending insight via conversation — analyze transaction history, identify trends, flag unusual patterns" },
          { text: "Investment tracking and live market context in chat" },
          { text: "Subscription management through conversation" },
          { text: "Card freeze/unfreeze via chat" },
          { text: "Travel planning within budget constraints computed from actual spending history" },
          { text: "eSIM purchase integrated into chat flow" },
          { text: "Zero data retention policy with third-party AI providers" },
          { text: "Access restricted to data the customer already sees in their own app" },
        ],
      },
      entryPoints: {
        paragraphs: [
          "Users open AIR by swiping down from the centre of the home screen, or via Profile → Chats → AIR. The swipe-down gesture mirrors the iOS Spotlight search pattern — highly discoverable without disrupting the primary experience. But it is still not the default landing screen.",
          "AIR evolved from Rita, Revolut's earlier intent-model chatbot — the \"slot machine era\" that frustrated as often as it helped. AIR pulls in transactional data directly: it can break down a customer's spending, propose hotels within a budget computed from their history, or explain why a stock is moving. Conversation is naturalistic and data-aware, though still primarily reactive — the user asks, AIR responds.",
        ],
      },
      dashboardBalance: {
        paragraphs: [
          "AIR is a layer over Revolut's feature-rich traditional dashboard — not a replacement for it. The home screen remains a dashboard: accounts, cards, crypto, analytics. AIR is accessed via gesture. Approximately 75/25 in favor of traditional UI — but the gesture-based access and depth of conversational capability make AIR feel more central than Erica feels within BofA.",
        ],
      },
      uxStrengths: {
        bullets: [
          { text: "Represents the industry's most comprehensive consumer-facing conversational AI deployment — unequivocally moves the needle toward AI-first UX" },
          { text: "Swipe-down gesture is highly discoverable without disrupting primary navigation" },
          { text: "Connecting spending insight to real-time action (freeze card, manage subscription) in one uninterrupted flow" },
          { text: "Zero data retention policy is a significant trust signal — users know the AI cannot see anything they can't see" },
          { text: "Budget-aware travel suggestions using actual spending history is genuinely novel" },
          { text: "Support resolution without human climbed from 17% to 80% across Revolut's full AI journey" },
        ],
      },
      uxWeaknesses: {
        bullets: [
          "AIR is still a layer over a dashboard — the full vision of chat-as-primary-interface has not been executed",
          "UK-only at launch — no cultural localization for UAE, MENA, or Islamic context",
          "No Shariah compliance context — Revolut is a secular product",
          "Primarily reactive — users must ask, AIR does not proactively surface insights yet",
          "No memory or continuity between sessions — each conversation starts fresh",
          "No calendar intelligence — spending context is purely data-driven, not life-context-aware",
          "No designed return mechanic — no monthly ritual to bring users back",
        ],
      },
      missedOpportunities: {
        bullets: [
          "The model is right but the interface philosophy stops short — AIR should be the primary screen, not a gesture away",
          "No proactive insight model — a product this capable should be speaking to users before they ask",
          "No cultural or religious financial context — zero awareness of Ramadan, Eid, Zakat, or remittance patterns for a global user base",
          "Memory is absent — continuity between sessions would transform the product from a tool into a relationship",
        ],
      },
      designPatterns: {
        bullets: [
          "Swipe-down access gesture — highly discoverable, borrows from established iOS muscle memory",
          "Zero data retention policy stated explicitly as a UX feature — reduces AI anxiety and builds trust",
          "Budget-aware contextual suggestions — \"Here's a hotel within your budget based on how you've been spending\" is a sophisticated use of financial data",
          "Subscription management through conversation — users should never need to leave chat to cancel or modify recurring payments",
        ],
      },
    },
  },
];
