import { HistoryItem, Template } from "./types";

const HISTORY_KEY = "prompt-engine-history";
const TEMPLATES_KEY = "prompt-engine-templates";

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

export function getHistory(): HistoryItem[] {
  return safeGet<HistoryItem[]>(HISTORY_KEY, []);
}

export function addToHistory(item: HistoryItem): void {
  const history = getHistory();
  history.unshift(item);
  safeSet(HISTORY_KEY, history);
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory().filter((h) => h.id !== id);
  safeSet(HISTORY_KEY, history);
}

export function clearHistory(): void {
  safeSet(HISTORY_KEY, []);
}

export function exportHistory(): string {
  return JSON.stringify(getHistory(), null, 2);
}

export function getTemplates(): Template[] {
  return safeGet<Template[]>(TEMPLATES_KEY, []);
}

export function saveTemplate(template: Template): void {
  const templates = getTemplates();
  templates.push(template);
  safeSet(TEMPLATES_KEY, templates);
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter((t) => t.id !== id);
  safeSet(TEMPLATES_KEY, templates);
}
