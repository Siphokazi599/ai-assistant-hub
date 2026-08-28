import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { generateEmail, type EmailTone } from "@/lib/mock-ai";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in a formal, friendly or persuasive tone from a few key points.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn a purpose and a few bullet points into a polished, editable email draft.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<EmailTone>("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!topic.trim() && !keyPoints.trim()) {
      toast.error("Add a subject or a few key points so the draft has something to work with.");
      return;
    }
    setLoading(true);
    try {
      const draft = await generateEmail({ recipient, topic, keyPoints, tone });
      setOutput(draft);
      logActivity("email", `Generated a ${tone} email about "${topic.trim() || "your topic"}"`);
      toast.success("Email draft generated");
    } catch {
      toast.error("We couldn't generate the draft. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setRecipient("");
    setTopic("");
    setKeyPoints("");
    setTone("formal");
    setOutput("");
    toast("Form cleared");
  }

  return (
    <>
      <PageHeader
        eyebrow="AI Tool"
        title="Smart Email Generator"
        description="Describe who you're writing to and what matters, then pick a tone. The assistant drafts a complete, editable email you can adjust before sending."
      />
      <ResponsibleAiBanner />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Panel title="Email brief" description="All fields are optional except the topic.">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient / purpose</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Thandi, the client's project lead"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Subject or topic</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. rescheduling the Q3 review workshop"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Key points</Label>
                <Textarea
                  id="points"
                  rows={6}
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder={"One point per line, e.g.\nWorkshop moved to 14 March\nAgenda unchanged\nNeed confirmation by Friday"}
                />
                <p className="text-xs text-muted-foreground">
                  Put each point on its own line for the cleanest draft.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(value) => setTone(value as EmailTone)}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Choose a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleGenerate} disabled={loading}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  {loading ? "Generating…" : "Generate email"}
                </Button>
                <Button variant="ghost" onClick={handleClear} disabled={loading}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Clear
                </Button>
              </div>
            </div>
          </Panel>

          <PromptTemplate
            you={["Recipient and purpose", "Subject or topic", "Key points to cover", "Preferred tone"]}
            ai={[
              "A subject line",
              "A greeting matched to the tone",
              "A structured body covering your points",
              "A closing line and sign-off",
            ]}
          />
        </div>

        <Panel title="Generated email" description="Edit freely — the output is fully editable.">
          {loading ? (
            <GeneratingState message="Drafting your email…" />
          ) : output ? (
            <>
              <EditableOutput label="Generated email" value={output} onChange={setOutput} />
              <div className="mt-4 flex flex-wrap gap-3">
                <CopyButton value={output} label="Copy email" />
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
              icon={Mail}
              title="No draft yet"
              description="Fill in the brief on the left and select Generate email to see a complete draft here."
            />
          )}
        </Panel>
      </div>
    </>
  );
}
