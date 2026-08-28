import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen, RotateCcw, Sparkles } from "lucide-react";
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
import { summarizeMeeting } from "@/lib/mock-ai";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a structured summary with discussion points, decisions, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into a structured, shareable summary.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (notes.trim().length < 15) {
      toast.error("Paste a little more of your notes — at least a couple of sentences.");
      return;
    }
    setLoading(true);
    try {
      const summary = await summarizeMeeting(notes);
      setOutput(summary);
      logActivity("meeting", "Summarised a set of meeting notes");
      toast.success("Summary generated");
    } catch {
      toast.error("We couldn't summarise those notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="AI Tool"
        title="Meeting Notes Summarizer"
        description="Paste the raw notes from your meeting. The assistant returns a structured summary with discussion points, decisions, action items, owners and deadlines."
      />
      <ResponsibleAiBanner />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Panel title="Meeting notes" description="Rough bullet points work perfectly.">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="notes">Paste your notes</Label>
                <Textarea
                  id="notes"
                  rows={16}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={"e.g.\nSprint review — 12 March\nAlex walked through the new onboarding flow\nWe agreed to ship the beta to 50 users\nPriya will prepare the support docs\nBlocker: analytics events still missing"}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleGenerate} disabled={loading}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  {loading ? "Summarising…" : "Generate summary"}
                </Button>
                <Button
                  variant="ghost"
                  disabled={loading}
                  onClick={() => {
                    setNotes("");
                    setOutput("");
                    toast("Notes cleared");
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Clear
                </Button>
              </div>
            </div>
          </Panel>

          <PromptTemplate
            you={["Raw meeting notes", "Names and dates as you wrote them"]}
            ai={[
              "Meeting summary",
              "Key discussion points",
              "Decisions made",
              "Action items with responsible person and deadline",
            ]}
          />
        </div>

        <Panel title="Structured summary" description="Editable before you share it.">
          {loading ? (
            <GeneratingState message="Reading your notes and structuring the summary…" />
          ) : output ? (
            <>
              <EditableOutput label="Meeting summary" value={output} onChange={setOutput} rows={22} />
              <div className="mt-4 flex flex-wrap gap-3">
                <CopyButton value={output} label="Copy summary" />
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
              icon={NotebookPen}
              title="No summary yet"
              description="Paste your meeting notes on the left, then select Generate summary."
            />
          )}
        </Panel>
      </div>
    </>
  );
}
