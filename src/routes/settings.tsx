import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, Panel, ResponsibleAiBanner } from "@/components/tool-ui";
import { clearActivity } from "@/lib/activity";
import type { EmailTone } from "@/lib/mock-ai";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Set your display name, default email tone and local data preferences for the AI productivity demo.",
      },
      { property: "og:title", content: "Settings" },
      {
        property: "og:description",
        content: "Personalise the AI workplace assistant demo. Everything stays in your browser.",
      },
    ],
  }),
  component: SettingsPage,
});

const KEY = "awpa.settings";

interface Prefs {
  name: string;
  role: string;
  tone: EmailTone;
  autoCopy: boolean;
  showDisclaimer: boolean;
}

const defaults: Prefs = {
  name: "",
  role: "",
  tone: "formal",
  autoCopy: false,
  showDisclaimer: true,
};

function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaults);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setPrefs({ ...defaults, ...(JSON.parse(raw) as Prefs) });
    } catch {
      /* ignore */
    }
  }, []);

  function save() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(prefs));
      toast.success("Preferences saved");
    } catch {
      toast.error("Your browser blocked local storage, so preferences weren't saved.");
    }
  }

  function resetAll() {
    try {
      window.localStorage.removeItem(KEY);
      window.localStorage.removeItem("awpa.tasks");
    } catch {
      /* ignore */
    }
    clearActivity();
    setPrefs(defaults);
    toast.success("All local data deleted");
  }

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="This prototype has no accounts and no server. Everything below is stored only in this browser and can be deleted at any time."
      />
      <ResponsibleAiBanner />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Your profile" description="Used only to personalise the dashboard greeting.">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={prefs.name}
                onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
                placeholder="e.g. Siphokazi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={prefs.role}
                onChange={(e) => setPrefs({ ...prefs, role: e.target.value })}
                placeholder="e.g. Operations Manager"
              />
            </div>
            <Button onClick={save}>Save preferences</Button>
          </div>
        </Panel>

        <Panel title="Assistant defaults" description="Applied the next time you open a tool.">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="default-tone">Default email tone</Label>
              <Select
                value={prefs.tone}
                onValueChange={(value) => setPrefs({ ...prefs, tone: value as EmailTone })}
              >
                <SelectTrigger id="default-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/60 p-4">
              <Label htmlFor="auto-copy" className="text-sm font-medium">
                Offer copy shortcut after generating
              </Label>
              <Switch
                id="auto-copy"
                checked={prefs.autoCopy}
                onCheckedChange={(checked) => setPrefs({ ...prefs, autoCopy: checked })}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/60 p-4">
              <Label htmlFor="show-disclaimer" className="text-sm font-medium">
                Always show the responsible AI notice
              </Label>
              <Switch
                id="show-disclaimer"
                checked={prefs.showDisclaimer}
                onCheckedChange={(checked) => setPrefs({ ...prefs, showDisclaimer: checked })}
              />
            </div>
          </div>
        </Panel>

        <Panel
          title="Local data"
          description="Tasks, activity and preferences never leave your device."
          className="lg:col-span-2"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => { clearActivity(); toast.success("Activity cleared"); }}>
              Clear recent activity
            </Button>
            <Button variant="destructive" onClick={resetAll}>
              Delete all local data
            </Button>
          </div>
        </Panel>
      </div>
    </>
  );
}
