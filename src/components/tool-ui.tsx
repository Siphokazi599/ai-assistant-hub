import { useState, type ReactNode } from "react";
import { AlertTriangle, Check, Copy, Info, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AI_DISCLAIMER, AI_SHORT_DISCLAIMER } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}

export function ResponsibleAiBanner() {
  return (
    <div className="mb-8 flex gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4">
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning-foreground" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-foreground">Responsible AI notice</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{AI_DISCLAIMER}</p>
      </div>
    </div>
  );
}

export function OutputDisclaimer() {
  return (
    <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden="true" />
      {AI_SHORT_DISCLAIMER}
    </p>
  );
}

export function PromptTemplate({ you, ai }: { you: string[]; ai: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Info className="size-4 text-primary" aria-hidden="true" />
        How this tool works
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            You provide
          </p>
          <ul className="mt-2 space-y-1.5">
            {you.map((item) => (
              <li key={item} className="text-xs leading-relaxed text-foreground/80">
                • {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            The assistant produces
          </p>
          <ul className="mt-2 space-y-1.5">
            {ai.map((item) => (
              <li key={item} className="text-xs leading-relaxed text-foreground/80">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-2xl border border-border bg-card p-6 shadow-soft", className)}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Your browser blocked clipboard access. Select the text and copy manually.");
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy} disabled={!value}>
      {copied ? (
        <Check className="size-4 text-success" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {label}
    </Button>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-14 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-primary-soft">
        <Icon className="size-6 text-primary" />
      </span>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

export function GeneratingState({ message }: { message: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-border bg-primary-soft/50 px-6 py-14 text-center">
      <Loader2 className="mb-4 size-7 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm font-medium">{message}</p>
      <div className="mt-5 w-full max-w-sm space-y-2" aria-hidden="true">
        <div className="h-2.5 w-full animate-pulse rounded-full bg-primary/20" />
        <div className="h-2.5 w-5/6 animate-pulse rounded-full bg-primary/15" />
        <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-primary/10" />
      </div>
      <span className="sr-only" role="status">
        {message}
      </span>
    </div>
  );
}

export function EditableOutput({
  value,
  onChange,
  rows = 18,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  label: string;
}) {
  return (
    <>
      <label htmlFor="ai-output" className="sr-only">
        {label}
      </label>
      <Textarea
        id="ai-output"
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="resize-y whitespace-pre-wrap font-sans text-sm leading-relaxed"
      />
    </>
  );
}
