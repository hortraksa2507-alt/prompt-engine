"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale-context";
import { PromptFramework } from "@/lib/types";
import { hapticLight } from "@/lib/haptics";

interface FrameworkDef {
  id: PromptFramework;
  letters: string[];   // acronym parts
  labelEn: string;
  labelKm: string;
  descEn: string;
  descKm: string;
}

const FRAMEWORKS: FrameworkDef[] = [
  {
    id: "TAG",
    letters: ["T", "A", "G"],
    labelEn: "T-A-G",
    labelKm: "T-A-G",
    descEn: "Task · Action · Goal",
    descKm: "ភារកិច្ច · សកម្មភាព · គោលដៅ",
  },
  {
    id: "BAB",
    letters: ["B", "A", "B"],
    labelEn: "B-A-B",
    labelKm: "B-A-B",
    descEn: "Before · After · Bridge",
    descKm: "មុន · ក្រោយ · ស្ពាន",
  },
  {
    id: "RTF",
    letters: ["R", "T", "F"],
    labelEn: "R-T-F",
    labelKm: "R-T-F",
    descEn: "Role · Task · Format",
    descKm: "តួនាទី · ភារកិច្ច · ទម្រង់",
  },
  {
    id: "CARE",
    letters: ["C", "A", "R", "E"],
    labelEn: "C-A-R-E",
    labelKm: "C-A-R-E",
    descEn: "Context · Action · Result · Example",
    descKm: "បរិបទ · សកម្មភាព · លទ្ធផល · ឧទាហរណ៍",
  },
  {
    id: "RISE",
    letters: ["R", "I", "S", "E"],
    labelEn: "R-I-S-E",
    labelKm: "R-I-S-E",
    descEn: "Role · Input · Steps · Expectation",
    descKm: "តួនាទី · ទិន្នន័យ · ជំហាន · ការរំពឹង",
  },
  {
    id: "AIM",
    letters: ["A", "I", "M"],
    labelEn: "A-I-M",
    labelKm: "A-I-M",
    descEn: "Action · Intent · Metric",
    descKm: "សកម្មភាព · គោលបំណង · ការវាស់",
  },
  {
    id: "GRO",
    letters: ["G", "R", "O"],
    labelEn: "G-R-O",
    labelKm: "G-R-O",
    descEn: "Goal · Reason · Output",
    descKm: "គោលដៅ · មូលហេតុ · លទ្ធផល",
  },
  {
    id: "FIT",
    letters: ["F", "I", "T"],
    labelEn: "F-I-T",
    labelKm: "F-I-T",
    descEn: "Format · Input · Task",
    descKm: "ទម្រង់ · ព័ត៌មាន · ភារកិច្ច",
  },
  {
    id: "LED",
    letters: ["L", "E", "D"],
    labelEn: "L-E-D",
    labelKm: "L-E-D",
    descEn: "Level · Expectation · Direction",
    descKm: "កម្រិត · ការរំពឹង · ទិសដៅ",
  },
];

interface FrameworkPickerProps {
  selected: PromptFramework | null;
  onSelect: (fw: PromptFramework | null) => void;
}

export function FrameworkPicker({ selected, onSelect }: FrameworkPickerProps) {
  const { locale } = useLocale();
  const isKm = locale === "km";

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
          {isKm ? "គំរូប្រព័ន្ធប្រយោគ" : "Prompt Framework"}
        </span>
        <span className="text-[10px] text-white/20 font-medium">
          {isKm ? "ស្រេចចិត្ត" : "optional"}
        </span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-hide">
        {FRAMEWORKS.map((fw) => {
          const isActive = selected === fw.id;
          return (
            <button
              key={fw.id}
              aria-pressed={isActive}
              aria-label={isKm ? fw.descKm : fw.descEn}
              onClick={async () => {
                await hapticLight();
                onSelect(isActive ? null : fw.id);
              }}
              className={cn(
                "flex-shrink-0 flex flex-col items-center gap-1.5 rounded-2xl px-3 py-2.5 transition-all duration-200 active:scale-95 min-w-[72px]",
                isActive
                  ? "bg-[var(--active-bg)] border border-[rgba(var(--accent-rgb),0.5)] shadow-[0_2px_16px_rgba(var(--accent-rgb),0.15)]"
                  : "bg-white/[0.05] border border-white/[0.07] hover:bg-white/[0.08]"
              )}
            >
              {/* Acronym letters */}
              <div className="flex gap-0.5 items-baseline">
                {fw.letters.map((letter, i) => (
                  <span
                    key={i}
                    className={cn(
                      "text-[15px] font-black leading-none",
                      isActive ? "text-[rgba(var(--accent-rgb),1)]" : "text-white/50"
                    )}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              {/* Separator */}
              <div className={cn(
                "w-6 h-px",
                isActive ? "bg-[rgba(var(--accent-rgb),0.4)]" : "bg-white/10"
              )} />
              {/* Description */}
              <span className={cn(
                "text-[9px] font-medium text-center leading-tight",
                isActive ? "text-white/70" : "text-white/25"
              )}>
                {isKm ? fw.descKm : fw.descEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
