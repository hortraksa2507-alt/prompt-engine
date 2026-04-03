"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale-context";
import { getSetting, setSetting } from "@/lib/storage";
import { glassCard, glassSubtle, glassActive } from "@/lib/glass";
import {
  Zap,
  Code2,
  BarChart3,
  Bug,
  GraduationCap,
  Lightbulb,
  ChevronRight,
  Sparkles,
  Copy,
  Globe,
  PenLine,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

// ─── Slide Data ───────────────────────────────────────────────

interface ModeItem {
  icon: LucideIcon;
  label: string;
  labelKm: string;
  color: string;
  bg: string;
}

const modes: ModeItem[] = [
  { icon: PenLine,      label: "Write",      labelKm: "សរសេរ",    color: "text-emerald-300", bg: "rgba(52,211,153,0.15)" },
  { icon: Code2,        label: "Code",       labelKm: "កូដ",      color: "text-cyan-300",    bg: "rgba(34,211,238,0.15)" },
  { icon: BarChart3,    label: "Analyze",    labelKm: "វិភាគ",    color: "text-amber-300",   bg: "rgba(251,191,36,0.15)" },
  { icon: Bug,          label: "Debug",      labelKm: "កែកំហុស",  color: "text-rose-300",    bg: "rgba(251,113,133,0.15)" },
  { icon: GraduationCap,label: "Learn",      labelKm: "រៀន",      color: "text-violet-300",  bg: "rgba(167,139,250,0.15)" },
  { icon: Lightbulb,    label: "Brainstorm", labelKm: "គិតស្វែង", color: "text-orange-300",  bg: "rgba(251,146,60,0.15)" },
];

// ─── Slide Components ─────────────────────────────────────────

function Slide1({ isKm }: { isKm: boolean }) {
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: isKm ? "rgba(251,191,36,0.18)" : "rgba(52,211,153,0.18)", border: `1px solid ${isKm ? "rgba(251,191,36,0.3)" : "rgba(52,211,153,0.3)"}` }}
      >
        <Zap
          className={cn("w-9 h-9", isKm ? "text-amber-300" : "text-emerald-300")}
          strokeWidth={1.8}
          fill={isKm ? "rgba(251,191,36,0.3)" : "rgba(52,211,153,0.3)"}
        />
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white leading-tight">
          {isKm ? "សូមស្វាគមន៍មកកាន់" : "Welcome to"}
          <br />
          <span className={cn(isKm ? "text-amber-300" : "text-emerald-300")}>
            {isKm ? "ម៉ាស៊ីនប្រយោគ" : "Prompt Engine"}
          </span>
        </h2>
        <p className="text-white/50 text-[15px] leading-relaxed max-w-xs mx-auto">
          {isKm
            ? "បង្កើតប្រយោគ Claude ល្អឥតខ្ចោះ ក្នុងប៉ុន្មានវិនាទី"
            : "Craft perfect Claude prompts in seconds"}
        </p>
      </div>
    </div>
  );
}

function Slide2({ isKm }: { isKm: boolean }) {
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <h2 className="text-xl font-bold text-white">
        {isKm ? "ទម្រង់ ៦ ដ៏មានឥទ្ធិពល" : "6 Powerful Modes"}
      </h2>
      <div className="grid grid-cols-3 gap-2.5 w-full">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <div
              key={mode.label}
              className="flex flex-col items-center gap-2 rounded-2xl py-3.5 px-2"
              style={glassSubtle}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: mode.bg }}
              >
                <Icon className={cn("w-4.5 h-4.5", mode.color)} strokeWidth={1.8} size={18} />
              </div>
              <span className="text-[11px] font-semibold text-white/70 leading-tight">
                {isKm ? mode.labelKm : mode.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-white/40 text-[13px]">
        {isKm ? "ជ្រើសរើសទម្រង់ដែលត្រូវនឹងកិច្ចការរបស់អ្នក" : "Pick the mode that fits your task"}
      </p>
    </div>
  );
}

function Slide3({ isKm }: { isKm: boolean }) {
  const chips = isKm
    ? ["វិជ្ជាជីវៈ", "ធម្មតា", "ច្នៃប្រឌិត", "ផ្ទាល់"]
    : ["Professional", "Casual", "Creative", "Direct"];

  const formatChips = isKm
    ? ["កថាខណ្ឌ", "ចំណុចគោល", "ជំហានម្ដងមួយ"]
    : ["Paragraphs", "Bullet Points", "Step-by-Step"];

  const extrasChips = isKm
    ? ["រួមបញ្ចូលឧទាហរណ៍", "គិតជំហានម្ដងមួយ"]
    : ["Include examples", "Think step-by-step"];

  return (
    <div className="flex flex-col items-center text-center gap-5">
      <h2 className="text-xl font-bold text-white">
        {isKm ? "ការគ្រប់គ្រងកម្រិតខ្ពស់" : "Advanced Controls"}
      </h2>
      <div className="w-full space-y-3 text-left">
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-1">
            {isKm ? "សម្លេង" : "Tone"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {chips.map((c, i) => (
              <span
                key={c}
                className={cn(
                  "rounded-full px-3 py-1 text-[12px] font-medium",
                  i === 0 ? "text-white" : "text-white/40"
                )}
                style={i === 0 ? { background: "var(--active-bg)", border: "1px solid var(--accent-border-strong)" } : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-1">
            {isKm ? "ទម្រង់លទ្ធផល" : "Format"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {formatChips.map((c, i) => (
              <span
                key={c}
                className={cn("rounded-full px-3 py-1 text-[12px] font-medium", i === 1 ? "text-white" : "text-white/40")}
                style={i === 1 ? { background: "var(--active-bg)", border: "1px solid var(--accent-border-strong)" } : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-1">
            {isKm ? "ការណែនាំបន្ថែម" : "Extras"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {extrasChips.map((c) => (
              <span
                key={c}
                className="rounded-full px-3 py-1 text-[12px] font-medium text-white"
                style={{ background: "var(--active-bg)", border: "1px solid var(--accent-border-strong)" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-white/40 text-[13px]">
        {isKm ? "កំណត់លក្ខណៈប្រយោគឱ្យត្រូវតាមតម្រូវការ" : "Fine-tune every aspect of your prompt"}
      </p>
    </div>
  );
}

function Slide4({ isKm }: { isKm: boolean }) {
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: isKm ? "rgba(251,191,36,0.18)" : "rgba(52,211,153,0.18)", border: `1px solid ${isKm ? "rgba(251,191,36,0.3)" : "rgba(52,211,153,0.3)"}` }}
      >
        <Sparkles
          className={cn("w-9 h-9", isKm ? "text-amber-300" : "text-emerald-300")}
          strokeWidth={1.8}
        />
      </div>
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white">
          {isKm ? "ចម្លង និងប្រើប្រាស់ក្នុង Claude" : "Copy & Use in Claude"}
        </h2>
        <p className="text-white/50 text-[15px] leading-relaxed max-w-xs mx-auto">
          {isKm
            ? "ចុចបង្កើត ហើយបិទភ្ជាប់ទៅ Claude.ai"
            : "Tap Generate then paste into Claude.ai"}
        </p>
      </div>
      {/* Mock generate button */}
      <div
        className="w-full rounded-2xl py-4 flex items-center justify-center gap-2.5 pointer-events-none select-none"
        style={{
          background: isKm
            ? "linear-gradient(135deg, rgba(251,191,36,0.35) 0%, rgba(245,158,11,0.25) 100%)"
            : "linear-gradient(135deg, rgba(52,211,153,0.35) 0%, rgba(16,185,129,0.25) 100%)",
          border: `1px solid ${isKm ? "rgba(251,191,36,0.4)" : "rgba(52,211,153,0.4)"}`,
          boxShadow: isKm ? "0 4px 20px rgba(251,191,36,0.15)" : "0 4px 20px rgba(52,211,153,0.15)",
        }}
      >
        <Sparkles className={cn("w-4.5 h-4.5", isKm ? "text-amber-300" : "text-emerald-300")} strokeWidth={2} size={18} />
        <span className={cn("text-[15px] font-semibold", isKm ? "text-amber-200" : "text-emerald-200")}>
          {isKm ? "បង្កើតប្រយោគ" : "Generate Prompt"}
        </span>
      </div>
      <div className="flex items-center gap-2 text-white/30 text-[12px]">
        <Copy className="w-3.5 h-3.5" strokeWidth={2} />
        <span>{isKm ? "ចម្លងទៅ clipboard ក្នុងមួយចុច" : "One tap to copy to clipboard"}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────

const TOTAL_SLIDES = 4;

export function OnboardingModal() {
  const { locale } = useLocale();
  const isKm = locale === "km";
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const done = getSetting("onboarding_done", false);
    if (!done) {
      setVisible(true);
    }
  }, []);

  const markDone = () => {
    setSetting("onboarding_done", true);
    setVisible(false);
  };

  const goToSlide = (next: number) => {
    setFading(true);
    setTimeout(() => {
      setSlide(next);
      setFading(false);
    }, 180);
  };

  const handleNext = () => {
    if (slide < TOTAL_SLIDES - 1) {
      goToSlide(slide + 1);
    } else {
      markDone();
    }
  };

  if (!visible) return null;

  const isLast = slide === TOTAL_SLIDES - 1;

  const accentFrom = isKm ? "rgba(251,191,36,0.9)" : "rgba(52,211,153,0.9)";
  const accentTo   = isKm ? "rgba(245,158,11,0.8)"  : "rgba(16,185,129,0.8)";
  const accentGlow = isKm ? "rgba(251,191,36,0.25)"  : "rgba(52,211,153,0.2)";
  const dotActive  = isKm ? "bg-amber-400" : "bg-emerald-400";

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-0"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      role="dialog"
      aria-modal="true"
      aria-label={isKm ? "ការណែនាំចាប់ផ្ដើម" : "Onboarding"}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm mx-6 rounded-3xl overflow-hidden flex flex-col"
        style={{
          ...glassCard,
          maxWidth: "min(calc(100vw - 3rem), 22rem)",
        }}
      >
        {/* Skip button */}
        <div className="flex justify-end px-5 pt-4">
          <button
            onClick={markDone}
            className="text-[13px] text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded-lg"
            aria-label={isKm ? "រំលង" : "Skip onboarding"}
          >
            {isKm ? "រំលង" : "Skip"}
          </button>
        </div>

        {/* Slide content */}
        <div
          className="px-6 pb-4 pt-2 transition-opacity duration-200"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {slide === 0 && <Slide1 isKm={isKm} />}
          {slide === 1 && <Slide2 isKm={isKm} />}
          {slide === 2 && <Slide3 isKm={isKm} />}
          {slide === 3 && <Slide4 isKm={isKm} />}
        </div>

        {/* Dots + Next button */}
        <div className="px-6 pb-6 pt-3 flex flex-col items-center gap-4">
          {/* Progress dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label={isKm ? "ជំហាន" : "Slide progress"}>
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === slide}
                aria-label={`${isKm ? "ជំហាន" : "Slide"} ${i + 1}`}
                onClick={() => goToSlide(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === slide
                    ? cn("w-5 h-2", dotActive)
                    : "w-2 h-2 bg-white/20 hover:bg-white/35"
                )}
              />
            ))}
          </div>

          {/* Next / Get Started button */}
          <button
            onClick={handleNext}
            className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold text-[15px] transition-all duration-200 active:scale-[0.97]"
            style={{
              background: `linear-gradient(135deg, ${accentFrom} 0%, ${accentTo} 100%)`,
              boxShadow: `0 4px 20px ${accentGlow}`,
              color: isKm ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.85)",
            }}
            aria-label={isLast
              ? (isKm ? "ចាប់ផ្ដើម" : "Get Started")
              : (isKm ? "បន្ទាប់" : "Next")}
          >
            {isLast ? (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={2} />
                {isKm ? "ចាប់ផ្ដើម" : "Get Started"}
              </>
            ) : (
              <>
                {isKm ? "បន្ទាប់" : "Next"}
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
