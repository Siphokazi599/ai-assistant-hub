import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Check, ListTodo, Pencil, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EmptyState,
  GeneratingState,
  OutputDisclaimer,
  PageHeader,
  Panel,
  PromptTemplate,
  ResponsibleAiBanner,
} from "@/components/tool-ui";
import { planSchedule, prioritiseTask, type PlannerTask, type Priority } from "@/lib/mock-ai";
import { logActivity } from "@/lib/activity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Add tasks and deadlines, then generate a prioritised daily schedule with high, medium and low priority blocks.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Turn a task list into a prioritised, time-blocked schedule.",
      },
    ],
  }),
  component: TasksPage,
});

const STORAGE_KEY = "awpa.tasks";

const priorityStyles: Record<Priority, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-warning/15 text-warning-foreground border-warning/40",
  low: "bg-success/10 text-success border-success/30",
};

function TasksPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Priority | "auto">("auto");
  const [planning, setPlanning] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw) as PlannerTask[]);
    } catch {
      /* ignore unreadable storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* ignore full/blocked storage */
    }
  }, [tasks, hydrated]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      done: tasks.filter((t) => t.done).length,
      high: tasks.filter((t) => t.priority === "high" && !t.done).length,
    }),
    [tasks],
  );

  function addTask(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      toast.error("Give the task a short, clear name first.");
      return;
    }
    const task: PlannerTask = {
      id: `${Date.now()}`,
      title: title.trim(),
      deadline,
      priority: priority === "auto" ? prioritiseTask(title, deadline) : priority,
      slot: "",
      done: false,
    };
    setTasks((prev) => [...prev, task]);
    setTitle("");
    setDeadline("");
    setPriority("auto");
    toast.success("Task added");
  }

  async function generatePlan() {
    if (!tasks.length) {
      toast.error("Add at least one task before generating a schedule.");
      return;
    }
    setPlanning(true);
    try {
      const planned = await planSchedule(tasks);
      setTasks(planned);
      logActivity("task", `Planned a schedule for ${planned.length} task(s)`);
      toast.success("Schedule generated");
    } catch {
      toast.error("We couldn't build the schedule. Please try again.");
    } finally {
      setPlanning(false);
    }
  }

  function toggleDone(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Task deleted");
  }

  function saveEdit(id: string) {
    if (!editValue.trim()) {
      toast.error("Task name can't be empty.");
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title: editValue.trim() } : t)));
    setEditingId(null);
    toast.success("Task saved");
  }

  return (
    <>
      <PageHeader
        eyebrow="AI Tool"
        title="Task Planner"
        description="Capture your tasks with optional deadlines. The assistant prioritises them and lays out a suggested schedule you can edit, complete or delete."
      />
      <ResponsibleAiBanner />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <Panel title="Add a task" description="Priority is inferred automatically unless you set it.">
            <form onSubmit={addTask} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task</Label>
                <Input
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Send the client proposal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-deadline">Deadline (optional)</Label>
                <Input
                  id="task-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as Priority | "auto")}
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Let the assistant decide</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit">
                  <Plus className="size-4" aria-hidden="true" />
                  Add task
                </Button>
                <Button type="button" variant="outline" onClick={generatePlan} disabled={planning}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  {planning ? "Planning…" : "Generate schedule"}
                </Button>
              </div>
            </form>
          </Panel>

          <Panel title="Overview">
            <dl className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Tasks", value: stats.total },
                { label: "Completed", value: stats.done },
                { label: "High priority", value: stats.high },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-muted/60 p-3">
                  <dt className="text-[11px] font-medium text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-1 text-xl font-semibold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <PromptTemplate
            you={["Task names", "Optional deadlines", "Optional priority override"]}
            ai={["A priority for each task", "A suggested time block per task", "An ordered daily plan"]}
          />
        </div>

        <Panel title="Suggested schedule" description="Timeline order reflects priority and deadline.">
          {planning ? (
            <GeneratingState message="Prioritising your tasks…" />
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="No tasks yet"
              description="Add your first task on the left. Your list is saved in this browser only."
            />
          ) : (
            <>
              <ol className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={cn(
                      "rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-soft",
                      task.done && "opacity-60",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleDone(task.id)}
                        aria-label={task.done ? `Mark ${task.title} as not done` : `Complete ${task.title}`}
                        className={cn(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
                          task.done
                            ? "border-success bg-success text-success-foreground"
                            : "border-border hover:border-primary",
                        )}
                      >
                        {task.done && <Check className="size-3.5" aria-hidden="true" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        {editingId === task.id ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              aria-label="Edit task name"
                              className="h-9 flex-1"
                            />
                            <Button size="sm" onClick={() => saveEdit(task.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              <X className="size-4" aria-hidden="true" />
                            </Button>
                          </div>
                        ) : (
                          <p
                            className={cn(
                              "text-sm font-medium",
                              task.done && "line-through",
                            )}
                          >
                            {task.title}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 font-semibold capitalize",
                              priorityStyles[task.priority],
                            )}
                          >
                            {task.priority}
                          </span>
                          {task.deadline && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarClock className="size-3.5" aria-hidden="true" />
                              {task.deadline}
                            </span>
                          )}
                          {task.slot && <span>· {task.slot}</span>}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${task.title}`}
                          onClick={() => {
                            setEditingId(task.id);
                            setEditValue(task.title);
                          }}
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${task.title}`}
                          onClick={() => removeTask(task.id)}
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <OutputDisclaimer />
            </>
          )}
        </Panel>
      </div>
    </>
  );
}
