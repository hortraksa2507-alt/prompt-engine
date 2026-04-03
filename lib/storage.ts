import { HistoryItem, Template } from "./types";

const HISTORY_KEY = "pe-history";
const TEMPLATES_KEY = "pe-templates";
const SETTINGS_KEY = "pe-settings";

type StorageErrorHandler = (error: unknown) => void;
let onStorageError: StorageErrorHandler | null = null;

export function setStorageErrorHandler(handler: StorageErrorHandler) {
  onStorageError = handler;
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (onStorageError) onStorageError(e);
    return false;
  }
}

// ─── History ─────────────────────────────────────────────────
export function getHistory(): HistoryItem[] {
  return safeGet<HistoryItem[]>(HISTORY_KEY, []);
}

export function addToHistory(item: HistoryItem): void {
  const history = getHistory();
  history.unshift(item);
  // Keep max 200 items to prevent storage bloat
  safeSet(HISTORY_KEY, history.slice(0, 200));
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory().filter((h) => h.id !== id);
  safeSet(HISTORY_KEY, history);
}

export function toggleStarHistoryItem(id: string): void {
  const history = getHistory().map((h) =>
    h.id === id ? { ...h, starred: !h.starred } : h
  );
  safeSet(HISTORY_KEY, history);
}

export function getStarredHistory(): HistoryItem[] {
  return getHistory().filter((h) => h.starred === true);
}

export function clearHistory(): void {
  safeSet(HISTORY_KEY, []);
}

export function exportHistory(): string {
  return JSON.stringify(getHistory(), null, 2);
}

// ─── Templates ───────────────────────────────────────────────
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

// ─── App Settings ─────────────────────────────────────────────
type Settings = Record<string, unknown>;

export function getSetting<T>(key: string, fallback: T): T {
  const settings = safeGet<Settings>(SETTINGS_KEY, {});
  return (key in settings ? settings[key] : fallback) as T;
}

export function setSetting(key: string, value: unknown): void {
  const settings = safeGet<Settings>(SETTINGS_KEY, {});
  settings[key] = value;
  safeSet(SETTINGS_KEY, settings);
}
