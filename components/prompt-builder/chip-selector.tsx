"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale-context";
import { TranslationKey } from "@/lib/i18n";
import { glassChip, glassChipActive } from "@/lib/glass";
import { hapticLight } from "@/lib/haptics";
import { Check } from "lucide-react";

interface ChipSelectorProps<T extends string> {
  labelKey: TranslationKey;
  options: readonly T[];
  selected: T | null;
  onSelect: (value: T | null) => void;
  hint?: "pickOne" | "pickMany";
}

export function ChipSelector<T extends string>({
  labelKey,
  options,
  selected,
  onSelect,
  hint,
}: ChipSelectorProps<T>) {
  const { t } = useLocale();

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">{t(labelKey)}</span>
        {hint && (
          <span className="text-[10px] text-white/20 font-medium">{t(hint)}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = selected === opt;
          return (
            <button
              key={opt}
              onClick={async () => { await hapticLight(); onSelect(isActive ? null : opt); }}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 active:scale-[0.95]",
                isActive ? "text-white" : "text-white/50 hover:text-white/70"
              )}
              style={isActive ? glassChipActive : glassChip}
            >
              {isActive && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                  style={{ background: "rgba(var(--accent-rgb), 0.9)" }}
                />
              )}
              {t(opt as TranslationKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface MultiChipSelectorProps<T extends string> {
  labelKey: TranslationKey;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
  hint?: "pickOne" | "pickMany";
}

export function MultiChipSelector<T extends string>({
  labelKey,
  options,
  selected,
  onToggle,
  hint,
}: MultiChipSelectorProps<T>) {
  const { t } = useLocale();

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">{t(labelKey)}</span>
        {hint && (
          <span className="text-[10px] text-white/20 font-medium">{t(hint)}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={async () => { await hapticLight(); onToggle(opt); }}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 flex items-center gap-1 active:scale-[0.95]",
                isActive ? "text-white" : "text-white/50 hover:text-white/70"
              )}
              style={isActive ? glassChipActive : glassChip}
            >
              {isActive && (
                <Check
                  className="w-3 h-3"
                  style={{ color: "rgba(var(--accent-rgb), 0.85)" }}
                  strokeWidth={2.5}
                />
              )}
              {t(opt as TranslationKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
