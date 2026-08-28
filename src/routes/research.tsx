import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CopyButton,
  EditableOutput,
  EmptyState,
  GeneratingState,
  OutputDisclaimer,
  PageHeader,
  Panel,
  PromptTemplate,
  ResponsibleAiBanner,
} from "@/components/tool-ui";
import { researchTopic } from "@/lib/mock-ai";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Get a structured research brief on any workplace question: overview, key findings, important points and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Structured research briefs for workplace questions, with sources to verify.",
      },
    ],
  }),
  component: ResearchPage,
});

const examples = [
  "How can we improve async communication across time zones?",
  "Best practices for running effective retrospectives",
  "What should a hybrid work policy cover?",
];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate(value = topic) {
    if (value.trim().length < 4) {
      toast.error("Describe your topic or question in a few more words.");
      return;
    }
    setLoading(true);
    try {
      const brief = await researchTopic(value);
      setOutput(brief);
      logActivity("research", `Researched "${value.trim().slice(0, 60)}"`);
      toast.success("Research brief generated");
    } catch {
      toast.error("We couldn't build that brief. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="AI Tool"
        title="AI Research Assistant"
        description="Ask a workplace question or name a topic. The assistant returns a structured brief you can use as a starting point — then verify the details against real sources."
      />
      <ResponsibleAiBanner />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Panel title="Research question" description="Be as specific as you can.">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or workplace question</Label>
                <Textarea
                  id="topic"
                  rows={5}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. How do we reduce meeting overload without losing alignment?"
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Try an example</p>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => {
                        setTopic(example);
                        void handleGenerate(example);
                      }}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary hover:bg-primary-soft"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => handleGenerate()} disabled={loading}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  {loading ? "Researching…" : "Generate brief"}
                </Button>
                <Button
                  variant="ghost"
                  disabled={loading}
                  onClick={() => {
                    setTopic("");
                    setOutput("");
                    toast("Cleared");
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Clear
                </Button>
              </div>
            </div>
          </Panel>

          <PromptTemplate
            you={["A research topic or workplace question", "Any context that narrows the scope"]}
            ai={[
              "Overview",
              "Key findings",
              "Important points to watch",
              "Suggested next steps",
              "Sources / references placeholder",
            ]}
          />
        </div>

        <Panel title="Research brief" description="Always verify findings before acting on them.">
          {loading ? (
            <GeneratingState message="Pulling together a research brief…" />
          ) : output ? (
            <>
              <EditableOutput label="Research brief" value={output} onChange={setOutput} rows={24} />
              <div className="mt-4 flex flex-wrap gap-3">
                <CopyButton value={output} label="Copy brief" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setOutput("");
                    toast("Output cleared");
                  }}
                >
                  Clear output
                </Button>
              </div>
              <OutputDisclaimer />
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="No brief yet"
              description="Enter a topic or pick an example, then select Generate brief."
            />
          )}
        </Panel>
      </div>
    </>
  );
}
