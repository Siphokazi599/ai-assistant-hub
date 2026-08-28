import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  ListTodo,
  Mail,
  NotebookPen,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { ResponsibleAiBanner } from "@/components/tool-ui";
import { timeAgo, useActivity, type ActivityTool } from "@/lib/activity";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A frontend AI productivity dashboard for drafting emails, summarising meetings, researching topics and planning tasks.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise meetings, research topics and plan your day — a polished AI productivity demo.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    name: "Smart Email Generator",
    blurb:
      "Turn a recipient, topic and a few bullet points into a polished email in a formal, friendly or persuasive tone.",
  },
  {
    to: "/meetings",
    icon: NotebookPen,
    name: "Meeting Notes Summarizer",
    blurb:
      "Paste raw notes and get a structured summary with discussion points, decisions, owners and deadlines.",
  },
  {
    to: "/research",
    icon: Search,
    name: "AI Research Assistant",
    blurb:
      "Ask a workplace question and receive an overview, key findings, watch-outs, next steps and source placeholders.",
  },
  {
    to: "/tasks",
    icon: ListTodo,
    name: "Task Planner",
    blurb:
      "Capture tasks and deadlines, then generate a prioritised schedule you can edit, complete and delete.",
  },
] as const;

const activityIcons: Record<ActivityTool, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  meeting: NotebookPen,
  research: Search,
  task: ListTodo,
};

function Dashboard() {
  const activity = useActivity();
  const [name, setName] = useState("");
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    try {
      const prefs = window.localStorage.getItem("awpa.settings");
      if (prefs) setName((JSON.parse(prefs).name as string) ?? "");
      const tasks = window.localStorage.getItem("awpa.tasks");
      if (tasks) setTaskCount((JSON.parse(tasks) as unknown[]).length);
    } catch {
      /* ignore */
    }
  }, []);

  const minutesSaved = activity.length * 12;

  const stats = [
    { label: "AI outputs generated", value: activity.length, icon: Sparkles },
    { label: "Tasks in your planner", value: taskCount, icon: ListTodo },
    { label: "Est. minutes saved", value: minutesSaved, icon: Clock },
    { label: "Tools available", value: 4, icon: TrendingUp },
  ];

  return (
    <>
      <section className="mb-8 overflow-hidden rounded-3xl gradient-hero p-8 shadow-lift sm:p-10">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">
          <Zap className="size-3.5" aria-hidden="true" />
          Demo mode · no login, no API key
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
          Welcome back{name ? `, ${name}` : ""} — let's get through the busywork.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
          Four AI-assisted tools for the tasks that eat your day: writing emails, summarising
          meetings, researching questions and planning your workload.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
          >
            Draft an email
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            to="/meetings"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Summarise a meeting
          </Link>
        </div>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Productivity statistics">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border gradient-surface p-5 shadow-soft">
            <span className="grid size-9 place-items-center rounded-xl bg-primary-soft">
              <Icon className="size-4.5 text-primary" aria-hidden="true" />
            </span>
            <p className="mt-4 text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <ResponsibleAiBanner />

      <section className="mb-8" aria-label="AI tools">
        <h2 className="mb-4 text-lg font-semibold">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map(({ to, icon: Icon, name: toolName, blurb }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
            >
              <span className="grid size-11 place-items-center rounded-xl gradient-primary">
                <Icon className="size-5 text-primary-foreground" aria-hidden="true" />
              </span>
              <h3 className="mt-4 flex items-center gap-2 text-base font-semibold">
                {toolName}
                <ArrowRight
                  className="size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Recent activity">
        <h2 className="mb-4 text-lg font-semibold">Recent activity</h2>
        <div className="rounded-2xl border border-border bg-card p-2 shadow-soft">
          {activity.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nothing here yet. Generate an email, summary, research brief or schedule and it will
              appear in this list.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((item) => {
                const Icon = activityIcons[item.tool];
                return (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft">
                      <Icon className="size-4 text-primary" />
                    </span>
                    <p className="min-w-0 flex-1 truncate text-sm">{item.label}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {timeAgo(item.at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
