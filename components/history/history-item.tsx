"use client";

import { HistoryItem as HistoryItemType } from "@/lib/types";
import { useLocale } from "@/lib/locale-context";
import { TranslationKey } from "@/lib/i18n";
import { glassSubtle, glassChipActive } from "@/lib/glass";
import { X, PenLine, Code2, BarChart3, Bug, GraduationCap, Lightbulb } from "lucide-react";
import { type LucideIcon } from "lucide-react";

const modeConfig: Record<string, { labelKey: TranslationKey; icon: LucideIcon }> = {
  write: { labelKey: "write", icon: PenLine },
  code: { labelKey: "code", icon: Code2 },
  analyze: { labelKey: "analyze", icon: BarChart3 },
  debug: { labelKey: "debug", icon: Bug },
  learn: { labelKey: "learn", icon: GraduationCap },
  brainstorm: { labelKey: "brainstorm", icon: Lightbulb },
};

interface HistoryItemProps {
  item: HistoryItemType;
  onLoad: (item: HistoryItemType) => void;
  onDelete: (id: string) => void;
}

export function HistoryItemCard({ item, onLoad, onDelete }: HistoryItemProps) {
  const { t } = useLocale();
  const date = new Date(item.timestamp);
  const timeStr = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const config = modeConfig[item.taskMode] || { labelKey: "write" as TranslationKey, icon: PenLine };
  const Icon = config.icon;

  return (
    <div
      className="group rounded-2xl p-3.5 transition-all duration-200 hover:brightness-110"
      style={glassSubtle}
    >
      <div className="flex items-start justify-between gap-2">
        <button onClick={() => onLoad(item)} className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="flex items-center gap-1 text-[11px] font-medium text-emerald-300/80 px-2 py-0.5 rounded-full"
              style={glassChipActive}
            >
              <Icon className="w-3 h-3" strokeWidth={2} />
              {t(config.labelKey)}
            </span>
            <span className="text-[11px] text-white/20">{timeStr}</span>
          </div>
          <p className="text-[13px] text-white/55 line-clamp-2 leading-snug">
            {item.taskDescription}
          </p>
        </button>
        <button
          aria-label="Delete prompt"
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/[0.05] shrink-0 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
