"use client";

import { useState, useCallback, useEffect } from "react";
import {
  BuilderState,
  TaskMode,
  Tone,
  OutputFormat,
  Length,
  Audience,
  ExtraInstruction,
  HistoryItem,
  Template,
} from "@/lib/types";
import { generatePrompt } from "@/lib/prompt-generator";
import {
  getHistory,
  addToHistory,
  deleteHistoryItem,
  clearHistory,
  toggleStarHistoryItem,
  getTemplates,
  saveTemplate,
  deleteTemplate,
} from "@/lib/storage";
import { hapticMedium, hapticSuccess } from "@/lib/haptics";
import { presetTemplates } from "@/lib/templates";

const initialState: BuilderState = {
  taskMode: null,
  role: "",
  taskDescription: "",
  context: "",
  tone: null,
  outputFormat: null,
  length: null,
  audience: null,
  extras: [],
  avoid: "",
};

export function usePromptBuilder() {
  const [state, setState] = useState<BuilderState>(initialState);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setTemplates(getTemplates());
  }, []);

  const allTemplates = [...presetTemplates, ...templates];

  const setTaskMode = useCallback((mode: TaskMode | null) => {
    setState((s) => ({ ...s, taskMode: mode }));
  }, []);

  const setTaskDescription = useCallback((v: string) => {
    setState((s) => ({ ...s, taskDescription: v }));
  }, []);

  const setRole = useCallback((v: string) => {
    setState((s) => ({ ...s, role: v }));
  }, []);

  const setContext = useCallback((v: string) => {
    setState((s) => ({ ...s, context: v }));
  }, []);

  const setTone = useCallback((v: Tone | null) => {
    setState((s) => ({ ...s, tone: v }));
  }, []);

  const setOutputFormat = useCallback((v: OutputFormat | null) => {
    setState((s) => ({ ...s, outputFormat: v }));
  }, []);

  const setLength = useCallback((v: Length | null) => {
    setState((s) => ({ ...s, length: v }));
  }, []);

  const setAudience = useCallback((v: Audience | null) => {
    setState((s) => ({ ...s, audience: v }));
  }, []);

  const toggleExtra = useCallback((extra: ExtraInstruction) => {
    setState((s) => ({
      ...s,
      extras: s.extras.includes(extra)
        ? s.extras.filter((e) => e !== extra)
        : [...s.extras, extra],
    }));
  }, []);

  const setAvoid = useCallback((v: string) => {
    setState((s) => ({ ...s, avoid: v }));
  }, []);

  const canGenerate = state.taskMode !== null && state.taskDescription.trim().length > 0;

  const generate = useCallback((): void => {
    if (isGenerating) return;
    if (!state.taskMode || !state.taskDescription.trim()) return;
    setIsGenerating(true);
    hapticMedium();
    try {
      const prompt = generatePrompt(state);
      setGeneratedPrompt(prompt);

      const item: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        taskMode: state.taskMode,
        taskDescription: state.taskDescription,
        generatedPrompt: prompt,
      };
      addToHistory(item);
      setHistory(getHistory());
      hapticSuccess();
    } catch (err) {
      console.error("Prompt generation failed:", err);
      // Don't crash — just leave the existing prompt or empty
    }
    setTimeout(() => setIsGenerating(false), 50);
  }, [state, isGenerating]);

  const loadFromHistory = useCallback((item: HistoryItem) => {
    setGeneratedPrompt(item.generatedPrompt);
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  }, []);

  const toggleStar = useCallback((id: string) => {
    toggleStarHistoryItem(id);
    setHistory(getHistory());
  }, []);

  const sharePrompt = useCallback(async (prompt: string) => {
    try {
      const { Share } = await import("@capacitor/share");
      await Share.share({ title: "Prompt", text: prompt, dialogTitle: "Share Prompt" });
    } catch {
      try {
        await navigator.clipboard.writeText(prompt);
        // Dynamically import toast since we're in a hook
        const { toast } = await import("sonner");
        toast.success("Copied to clipboard");
      } catch {
        const { toast } = await import("sonner");
        toast.error("Could not share — please copy manually");
      }
    }
  }, []);

  const clearAllHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const loadTemplate = useCallback((template: Template) => {
    setState({
      ...template.state,
      role: state.role || template.state.role || "",
      taskDescription: state.taskDescription || template.state.taskDescription,
      context: state.context || template.state.context,
    });
  }, [state.role, state.taskDescription, state.context]);

  const saveAsTemplate = useCallback(
    (name: string) => {
      const template: Template = {
        id: crypto.randomUUID(),
        name,
        state: { ...state },
        isPreset: false,
      };
      saveTemplate(template);
      setTemplates(getTemplates());
    },
    [state]
  );

  const removeTemplate = useCallback((id: string) => {
    deleteTemplate(id);
    setTemplates(getTemplates());
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    setGeneratedPrompt("");
  }, []);

  return {
    state,
    generatedPrompt,
    history,
    allTemplates,
    canGenerate,
    isGenerating,
    setTaskMode,
    setRole,
    setTaskDescription,
    setContext,
    setTone,
    setOutputFormat,
    setLength,
    setAudience,
    toggleExtra,
    setAvoid,
    generate,
    loadFromHistory,
    removeHistoryItem,
    clearAllHistory,
    toggleStar,
    sharePrompt,
    loadTemplate,
    saveAsTemplate,
    removeTemplate,
    reset,
  };
}
