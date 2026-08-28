import { useCallback, useEffect, useState } from "react";

export type ActivityTool = "email" | "meeting" | "research" | "task";

export interface ActivityItem {
  id: string;
  tool: ActivityTool;
  label: string;
  at: number;
}

const KEY = "awpa.activity";
const MAX = 12;

type Listener = () => void;
const listeners = new Set<Listener>();

function read(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ActivityItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: ActivityItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable — activity is non-critical */
  }
  listeners.forEach((listener) => listener());
}

export function logActivity(tool: ActivityTool, label: string) {
  if (typeof window === "undefined") return;
  const item: ActivityItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tool,
    label,
    at: Date.now(),
  };
  write([item, ...read()].slice(0, MAX));
}

export function clearActivity() {
  write([]);
}

export function useActivity() {
  const [items, setItems] = useState<ActivityItem[]>([]);

  const sync = useCallback(() => setItems(read()), []);

  useEffect(() => {
    sync();
    listeners.add(sync);
    window.addEventListener("storage", sync);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return items;
}

export function timeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
