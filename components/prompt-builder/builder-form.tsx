"use client";

import { useState, useCallback } from "react";
import { TaskModeGrid } from "./task-mode-grid";
import { ChipSelector, MultiChipSelector } from "./chip-selector";
import { PromptOutput } from "./prompt-output";
import {
  Tone,
  OutputFormat,
  Length,
  Audience,
  ExtraInstruction,
  TaskMode,
} from "@/lib/types";
import { usePromptBuilder } from "@/hooks/use-prompt-builder";
import { useLocale } from "@/lib/locale-context";
import { TemplateSelector } from "@/components/templates/template-selector";
import { cn } from "@/lib/utils";
import { glass, glassSubtle, glassInput } from "@/lib/glass";
import { useEffect } from "react";
import { Sparkles, RotateCcw, ChevronDown, Settings2, Loader2 } from "lucide-react";
import { hapticLight, hapticMedium } from "@/lib/haptics";
import { setStorageErrorHandler } from "@/lib/storage";
import { toast } from "sonner";

const tones: Tone[] = ["Professional", "Casual", "Academic", "Friendly", "Direct", "Creative", "Technical"];
const formats: OutputFormat[] = ["Paragraphs", "Bullet Points", "Step-by-Step", "Table", "Code Block", "JSON", "Markdown", "XML"];
const lengths: Length[] = ["Brief", "Medium", "Detailed", "Comprehensive", "As needed"];
const audiences: Audience[] = ["Expert", "Intermediate", "Beginner", "Non-technical", "Mixed"];
const extras: ExtraInstruction[] = [
  "Include examples",
  "Suggest alternatives",
  "Think step-by-step",
  "Pros & cons",
  "Cite sources",
  "No filler / no fluff",
  "Be critical / honest",
  "Actionable output",
  "Include code snippets",
  "Compare approaches",
  "Include example format",
];

interface BuilderFormProps {
  builder: ReturnType<typeof usePromptBuilder>;
}

export function BuilderForm({ builder }: BuilderFormProps) {
  const { t, locale } = useLocale();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const {
    state,
    generatedPrompt,
    canGenerate,
    isGenerating,
    allTemplates,
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
    loadTemplate,
    saveAsTemplate,
    removeTemplate,
    reset,
    sharePrompt,
  } = builder;

  const handleSetMode = useCallback(async (mode: TaskMode | null) => {
    await hapticLight();
    setTaskMode(mode);
  }, [setTaskMode]);

  useEffect(() => {
    setStorageErrorHandler(() => {
      toast.error(locale === "km" ? "កន្លែងផ្ទុកពេញ — សូមសម្អាតប្រវត្តិ" : "Storage full — clear some history to free space");
    });
  }, [locale]);

  // Count how many advanced options are selected
  const advancedCount = [state.tone, state.outputFormat, state.length, state.audience].filter(Boolean).length + state.extras.length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "Enter") {
        e.preventDefault();
        if (canGenerate) generate();
      }
      if (e.metaKey && e.shiftKey && e.key === "c") {
        e.preventDefault();
        if (generatedPrompt) {
          navigator.clipboard.writeText(generatedPrompt);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canGenerate, generate, generatedPrompt]);

  return (
    <div className="space-y-6">
      {/* Template selector */}
      <TemplateSelector
        templates={allTemplates}
        onLoad={loadTemplate}
        onSave={saveAsTemplate}
        onDelete={removeTemplate}
        canSave={state.taskMode !== null}
      />

      {/* Task Mode */}
      <section className="space-y-3">
        <h2 className="text-[13px] font-semibold text-white/50">{t("whatDoYouNeed")}</h2>
        <TaskModeGrid selected={state.taskMode} onSelect={handleSetMode} />
      </section>

      {/* Role / Persona */}
      <section className="space-y-2">
        <label className="text-[13px] font-semibold text-white/50">
          {t("roleLabel")} <span className="text-white/20 font-normal">({t("optional")})</span>
        </label>
        <input
          type="text"
          inputMode="text"
          placeholder={t("rolePlaceholder")}
          value={state.role}
          onChange={(e) => setRole(e.target.value)}
          onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" })}
          className="w-full rounded-2xl text-[15px] text-white placeholder:text-white/20 px-4 py-3 outline-none focus:ring-2 focus:ring-white/10"
          style={glassInput}
        />
      </section>

      {/* Task Description */}
      <section className="space-y-2">
        <label className="text-[13px] font-semibold text-white/50">{t("describeTask")}</label>
        <textarea
          placeholder={t("taskPlaceholder")}
          value={state.taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" })}
          className="w-full min-h-[100px] rounded-2xl text-[15px] text-white placeholder:text-white/20 px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-white/10"
          style={glassInput}
        />
      </section>

      {/* Context */}
      <section className="space-y-2">
        <label className="text-[13px] font-semibold text-white/50">
          {t("context")} <span className="text-white/20 font-normal">({t("optional")})</span>
        </label>
        <textarea
          placeholder={t("contextPlaceholder")}
          value={state.context}
          onChange={(e) => setContext(e.target.value)}
          onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" })}
          className="w-full min-h-[80px] rounded-2xl text-[15px] text-white placeholder:text-white/20 px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-white/10"
          style={glassInput}
        />
      </section>

      {/* Fix 7: Collapsible Advanced Options */}
      <section className="rounded-2xl overflow-hidden" style={glass}>
        <button
          onClick={() => setAdvancedOpen(!advancedOpen)}
          aria-label={locale === "km" ? "ជម្រើសកម្រិតខ្ពស់" : "Advanced Options"}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
        >
          <div className="flex items-center gap-2">
            <Settings2 className={cn("w-4 h-4", locale === "km" ? "text-amber-400/60" : "text-emerald-400/60")} />
            <span className="text-[13px] font-semibold text-white/60">{t("advancedOptions")}</span>
            {advancedCount > 0 && (
              <span className={cn(
                "text-[11px] font-bold px-2 py-0.5 rounded-full",
                locale === "km" ? "text-amber-300 bg-amber-500/15" : "text-emerald-300 bg-emerald-500/15"
              )}>
                {advancedCount}
              </span>
            )}
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 text-white/30 transition-transform duration-300",
            advancedOpen && "rotate-180"
          )} />
        </button>

        <div className={cn(
          "grid transition-all duration-300 ease-in-out",
          advancedOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}>
          <div className="overflow-hidden">
            <div className="space-y-5 px-4 pb-4 pt-1">
              {/* Fix 5: Added "Pick one" / "Pick any" hint labels */}
              <ChipSelector labelKey="tone" options={tones} selected={state.tone} onSelect={setTone} hint="pickOne" />
              <ChipSelector labelKey="outputFormat" options={formats} selected={state.outputFormat} onSelect={setOutputFormat} hint="pickOne" />
              <ChipSelector labelKey="length" options={lengths} selected={state.length} onSelect={setLength} hint="pickOne" />
              <ChipSelector labelKey="audience" options={audiences} selected={state.audience} onSelect={setAudience} hint="pickOne" />
              <MultiChipSelector labelKey="extraInstructions" options={extras} selected={state.extras} onToggle={toggleExtra} hint="pickMany" />

              {/* Avoid */}
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-white/50">
                  {t("avoid")} <span className="text-white/20 font-normal">({t("optional")})</span>
                </label>
                <input
                  type="text"
                  inputMode="text"
                  placeholder={t("avoidPlaceholder")}
                  value={state.avoid}
                  onChange={(e) => setAvoid(e.target.value)}
                  onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className="w-full rounded-2xl text-[15px] text-white placeholder:text-white/20 px-4 py-3 outline-none focus:ring-2 focus:ring-white/10"
                  style={glassInput}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Output — spacer before sticky CTA */}
      <PromptOutput prompt={generatedPrompt} onShare={sharePrompt} />

      {/* Fix 3: Sticky floating Generate CTA — appears when canGenerate */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 safe-area-bottom",
          canGenerate ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="max-w-2xl mx-auto px-5 pb-5 pt-3"
          style={{
            background: locale === "km"
              ? "linear-gradient(to top, rgba(11,8,4,0.97) 60%, transparent)"
              : "linear-gradient(to top, rgba(6,10,13,0.95) 60%, transparent)",
          }}
        >
          <div className="flex gap-3">
            <button
              onClick={async () => { await hapticMedium(); if (canGenerate) generate(); }}
              disabled={isGenerating}
              className={cn(
                "flex-1 rounded-2xl py-4 text-[15px] font-semibold text-white active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2",
                isGenerating && "opacity-80",
                locale === "km"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_4px_24px_rgba(201,162,39,0.35)] hover:shadow-[0_4px_32px_rgba(201,162,39,0.5)]"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_4px_24px_rgba(40,200,140,0.3)] hover:shadow-[0_4px_32px_rgba(40,200,140,0.4)]"
              )}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              ) : (
                <Sparkles className="w-4 h-4" strokeWidth={2} />
              )}
              {isGenerating ? (locale === "km" ? "កំពុងបង្កើត..." : "Generating...") : t("generatePrompt")}
            </button>
            <button
              onClick={reset}
              aria-label={locale === "km" ? "កំណត់ឡើងវិញ" : "Reset"}
              className="rounded-2xl px-5 py-4 text-white/35 hover:text-white/60 transition-all active:scale-[0.96]"
              style={glassSubtle}
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <p className="text-center text-[10px] text-white/15 mt-1.5">
            {locale === "km" ? "⌘ + Enter ដើម្បីបង្កើត" : "⌘ Enter to generate · ⌘ ⇧ C to copy"}
          </p>
        </div>
      </div>
    </div>
  );
}
