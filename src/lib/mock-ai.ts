/**
 * Mock AI layer.
 *
 * This prototype has no backend and no API keys. Every "AI" response below is
 * generated locally from structured prompt templates so the demo still reacts
 * to what the user typed.
 */

export const AI_DISCLAIMER =
  "AI-generated content may contain mistakes, bias, or outdated information. Review and verify important information before using it in professional decisions or communications. Do not enter confidential, personal, or sensitive company information.";

export const AI_SHORT_DISCLAIMER =
  "AI-generated demo output — review and verify before sending or sharing.";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toBullets(raw: string, fallback: string[]): string[] {
  const items = raw
    .split(/\r?\n|[•;]|(?<=[.!?])\s+/)
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter((line) => line.length > 2);
  return items.length ? items : fallback;
}

/* ------------------------------ Email ------------------------------ */

export type EmailTone = "formal" | "friendly" | "persuasive";

export interface EmailInput {
  recipient: string;
  topic: string;
  keyPoints: string;
  tone: EmailTone;
}

const toneCopy: Record<
  EmailTone,
  { greeting: (r: string) => string; opener: (t: string) => string; closer: string; signoff: string }
> = {
  formal: {
    greeting: (r) => `Dear ${r},`,
    opener: (t) =>
      `I hope this message finds you well. I am writing to you regarding ${t}.`,
    closer:
      "Please let me know if you require any further detail, and I would be glad to arrange a time to discuss this further.",
    signoff: "Kind regards,",
  },
  friendly: {
    greeting: (r) => `Hi ${r},`,
    opener: (t) => `Hope you're having a good week! I wanted to touch base about ${t}.`,
    closer:
      "Let me know what you think — happy to jump on a quick call if that's easier.",
    signoff: "Thanks so much,",
  },
  persuasive: {
    greeting: (r) => `Hello ${r},`,
    opener: (t) =>
      `I'm reaching out about ${t}, because I believe there is a clear opportunity here worth your attention.`,
    closer:
      "If you're open to it, I'd love fifteen minutes this week to walk you through the impact and agree on next steps.",
    signoff: "Looking forward to your thoughts,",
  },
};

export async function generateEmail(input: EmailInput): Promise<string> {
  await wait(900);
  const tone = toneCopy[input.tone];
  const recipient = input.recipient.trim() || "there";
  const topic = input.topic.trim() || "our current project";
  const points = toBullets(input.keyPoints, [
    "Current status and progress to date",
    "What we need from your side",
    "Proposed timeline for the next milestone",
  ]);

  return [
    `Subject: ${titleCase(topic)}`,
    "",
    tone.greeting(recipient),
    "",
    tone.opener(topic),
    "",
    "A short summary of the main points:",
    ...points.map((point) => `• ${point}`),
    "",
    tone.closer,
    "",
    tone.signoff,
    "[Your name]",
  ].join("\n");
}

/* --------------------------- Meeting notes -------------------------- */

export async function summarizeMeeting(notes: string): Promise<string> {
  await wait(1100);
  const lines = toBullets(notes, [
    "Team reviewed progress since the last check-in",
    "Discussed blockers affecting delivery",
    "Agreed on priorities for the coming week",
  ]);

  const discussion = lines.slice(0, 5);
  const decisions = lines
    .filter((l) => /agree|decide|approv|confirm|sign off|go ahead/i.test(l))
    .slice(0, 4);
  const actions = lines
    .filter((l) => /will|action|todo|to-do|follow up|send|prepare|review|draft/i.test(l))
    .slice(0, 5);

  const owners = ["Alex M.", "Priya S.", "Jordan T.", "Sam K.", "Nomsa D."];
  const deadlines = [
    "End of this week",
    "Next Tuesday",
    "Within 3 working days",
    "Before the next check-in",
    "End of month",
  ];

  const fallbackDecisions = ["No formal decisions were captured in these notes."];
  const fallbackActions = discussion.slice(0, 3);

  return [
    "MEETING SUMMARY",
    `The team covered ${discussion.length} main topics. The discussion focused on progress, open risks and the actions needed to keep delivery on track.`,
    "",
    "KEY DISCUSSION POINTS",
    ...discussion.map((d, i) => `${i + 1}. ${d}`),
    "",
    "DECISIONS MADE",
    ...(decisions.length ? decisions : fallbackDecisions).map((d) => `• ${d}`),
    "",
    "ACTION ITEMS",
    ...(actions.length ? actions : fallbackActions).map(
      (a, i) =>
        `• ${a}\n    Responsible: ${owners[i % owners.length]}\n    Deadline: ${deadlines[i % deadlines.length]}`,
    ),
  ].join("\n");
}

/* --------------------------- Research ------------------------------- */

export async function researchTopic(topic: string): Promise<string> {
  await wait(1200);
  const subject = topic.trim() || "the requested workplace topic";
  const label = titleCase(subject);

  return [
    `RESEARCH BRIEF: ${label}`,
    "",
    "OVERVIEW",
    `${label} is an area where organisations are actively looking for practical, measurable improvements. This brief outlines the current picture, the factors that matter most, and a realistic path forward for a workplace team.`,
    "",
    "KEY FINDINGS",
    `1. Teams that document their approach to ${subject} report noticeably fewer misunderstandings and rework cycles.`,
    `2. The biggest constraint is rarely tooling — it is unclear ownership and inconsistent process around ${subject}.`,
    "3. Small, incremental pilots outperform large rollouts, because feedback arrives while change is still cheap.",
    "4. Measurement matters: without a baseline, improvements are difficult to defend to stakeholders.",
    "",
    "IMPORTANT POINTS",
    "• Align on a single definition of success before making changes.",
    "• Involve the people doing the work when designing the process.",
    "• Watch for compliance, privacy and data-handling obligations in your industry.",
    "• Budget time for training and adoption, not just implementation.",
    "",
    "SUGGESTED NEXT STEPS",
    "1. Run a short internal audit of how this is handled today.",
    "2. Identify two or three measurable indicators to track.",
    "3. Pilot a change with one willing team for 4–6 weeks.",
    "4. Review results and decide whether to scale, adjust or stop.",
    "",
    "SOURCES / REFERENCES",
    "[Placeholder] Industry report — add a verified source here.",
    "[Placeholder] Internal company documentation or policy.",
    "[Placeholder] Peer-reviewed or reputable trade publication.",
    "",
    "Note: this is a demo response generated in the browser. Verify all claims against real sources before use.",
  ].join("\n");
}

/* ---------------------------- Tasks --------------------------------- */

export type Priority = "high" | "medium" | "low";

export interface PlannerTask {
  id: string;
  title: string;
  deadline: string;
  priority: Priority;
  slot: string;
  done: boolean;
}

const HIGH = /urgent|asap|today|deadline|client|launch|critical|board|present|fix|blocker/i;
const LOW = /someday|maybe|explore|read|tidy|nice to have|backlog|research/i;

const slots = [
  "Morning · Deep focus (09:00 – 11:00)",
  "Late morning (11:00 – 13:00)",
  "Early afternoon (13:30 – 15:30)",
  "Late afternoon (15:30 – 17:00)",
  "Overflow · Next available block",
];

export function prioritiseTask(title: string, deadline: string): Priority {
  if (HIGH.test(title)) return "high";
  if (deadline) {
    const days = (new Date(deadline).getTime() - Date.now()) / 86_400_000;
    if (!Number.isNaN(days) && days <= 2) return "high";
    if (!Number.isNaN(days) && days <= 7) return "medium";
  }
  if (LOW.test(title)) return "low";
  return "medium";
}

const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export async function planSchedule(tasks: PlannerTask[]): Promise<PlannerTask[]> {
  await wait(800);
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
    if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
    return 0;
  });
  return sorted.map((task, index) => ({ ...task, slot: slots[Math.min(index, slots.length - 1)] }));
}
