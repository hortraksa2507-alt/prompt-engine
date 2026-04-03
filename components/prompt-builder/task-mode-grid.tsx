"use client";

import { TaskMode } from "@/lib/types";
import { useLocale } from "@/lib/locale-context";
import { TranslationKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { glassSubtle, glassActive } from "@/lib/glass";
import {
  PenLine,
  Code2,
  BarChart3,
  Bug,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface ModeConfig {
  id: TaskMode;
  labelKey: TranslationKey;
  subKey: TranslationKey;
  icon: LucideIcon;
  color: string;
  activeColor: string;
  glowColor: string;
}

const modes: ModeConfig[] = [
  { id: "write", labelKey: "write", subKey: "writeSub", icon: PenLine, color: "text-emerald-400/60", activeColor: "text-emerald-300", glowColor: "rgba(52,211,153,0.15)" },
  { id: "code", labelKey: "code", subKey: "codeSub", icon: Code2, color: "text-cyan-400/60", activeColor: "text-cyan-300", glowColor: "rgba(34,211,238,0.15)" },
  { id: "analyze", labelKey: "analyze", subKey: "analyzeSub", icon: BarChart3, color: "text-amber-400/60", activeColor: "text-amber-300", glowColor: "rgba(251,191,36,0.15)" },
  { id: "debug", labelKey: "debug", subKey: "debugSub", icon: Bug, color: "text-rose-400/60", activeColor: "text-rose-300", glowColor: "rgba(251,113,133,0.15)" },
  { id: "learn", labelKey: "learn", subKey: "learnSub", icon: GraduationCap, color: "text-violet-400/60", activeColor: "text-violet-300", glowColor: "rgba(167,139,250,0.15)" },
  { id: "brainstorm", labelKey: "brainstorm", subKey: "brainstormSub", icon: Lightbulb, color: "text-orange-400/60", activeColor: "text-orange-300", glowColor: "rgba(251,146,60,0.15)" },
];

interface TaskModeGridProps {
  selected: TaskMode | null;
  onSelect: (mode: TaskMode | null) => void;
}

export function TaskModeGrid({ selected, onSelect }: TaskModeGridProps) {
  const { t } = useLocale();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {modes.map((mode, i) => {
        const isActive = selected === mode.id;
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            onClick={() => onSelect(isActive ? null : mode.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl px-4 py-5 min-h-[100px]",
              "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96]",
              "animate-stagger",
              i === 0 && "animate-stagger-1",
              i === 1 && "animate-stagger-2",
              i === 2 && "animate-stagger-3",
              i === 3 && "animate-stagger-1",
              i === 4 && "animate-stagger-2",
              i === 5 && "animate-stagger-3",
            )}
            style={{
              ...(isActive ? glassActive : glassSubtle),
              ...(isActive ? { boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 24px ${mode.glowColor}, 0 0 40px ${mode.glowColor}` } : {}),
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
              style={isActive ? { background: mode.glowColor } : { background: "rgba(255,255,255,0.06)" }}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isActive ? mode.activeColor : mode.color
                )}
                strokeWidth={1.8}
              />
            </div>
            <span
              className={cn(
                "text-[13px] font-semibold transition-colors duration-300",
                isActive ? "text-white" : "text-white/60"
              )}
            >
              {t(mode.labelKey)}
            </span>
            <span className={cn(
              "text-[11px] leading-tight text-center transition-colors",
              isActive ? "text-white/50" : "text-white/25"
            )}>
              {t(mode.subKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
