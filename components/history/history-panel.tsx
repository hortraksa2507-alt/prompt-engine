"use client";

import { useState } from "react";
import { HistoryItem } from "@/lib/types";
import { HistoryItemCard } from "./history-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocale } from "@/lib/locale-context";
import { exportHistory } from "@/lib/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { glassInput, glassSubtle, glassChip } from "@/lib/glass";
import { Search, Download, Trash2, Clock, Star } from "lucide-react";
import { hapticLight } from "@/lib/haptics";

type FilterTab = "all" | "starred";

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onToggleStar: (id: string) => void;
}

export function HistoryPanel({ history, onLoad, onDelete, onClearAll, onToggleStar }: HistoryPanelProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const { t, locale } = useLocale();

  const byFilter = filter === "starred" ? history.filter((h) => h.starred) : history;

  const filtered = search.trim()
    ? byFilter.filter(
        (h) =>
          h.taskDescription.toLowerCase().includes(search.toLowerCase()) ||
          h.taskMode.toLowerCase().includes(search.toLowerCase())
      )
    : byFilter;

  const handleExport = () => {
    const json = exportHistory();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt-engine-history.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("export"));
  };

  const starredEmptyText = locale === "km"
    ? "មិនទាន់មានប្រអប់ស្ទីមមួយទេ។ ចុច ★ ដើម្បីរក្សាទុកចំណូលចិត្ត។"
    : "No starred prompts yet. Tap ★ to save favorites.";

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
        <input
          type="text"
          placeholder={t("searchHistory")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl text-[14px] text-white placeholder:text-white/20 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20"
          style={glassInput}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "text-[12px] px-3 py-1.5 rounded-xl transition-colors",
            filter === "all"
              ? "text-white/70 bg-white/10"
              : "text-white/35 hover:text-white/55"
          )}
          style={filter !== "all" ? glassChip : undefined}
        >
          {locale === "km" ? "ទាំងអស់" : "All"}
        </button>
        <button
          onClick={() => setFilter("starred")}
          className={cn(
            "flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-xl transition-colors",
            filter === "starred"
              ? "text-amber-300/80 bg-amber-500/10"
              : "text-white/35 hover:text-white/55"
          )}
          style={filter !== "starred" ? glassChip : undefined}
        >
          <Star className="w-3 h-3" />
          {locale === "km" ? "បានដាក់ផ្កាយ" : "Starred"}
        </button>
      </div>

      {history.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-[12px] text-white/35 hover:text-white/60 transition-colors px-3 py-1.5 rounded-xl"
            style={glassChip}
          >
            <Download className="w-3 h-3" />
            {t("export")}
          </button>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-[12px] text-white/35 hover:text-red-400 transition-colors px-3 py-1.5 rounded-xl"
            style={glassChip}
          >
            <Trash2 className="w-3 h-3" />
            {t("clearAll")}
          </button>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-360px)] sm:h-[calc(100vh-320px)]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={glassSubtle}
            >
              {filter === "starred" ? (
                <Star className="w-6 h-6 text-white/15" strokeWidth={1.5} />
              ) : (
                <Clock className="w-6 h-6 text-white/15" strokeWidth={1.5} />
              )}
            </div>
            <p className="text-white/20 text-sm font-medium">
              {filter === "starred" && history.filter((h) => h.starred).length === 0
                ? starredEmptyText
                : history.length === 0
                ? t("noPromptsYet")
                : t("noMatching")}
            </p>
          </div>
        ) : (
          <div className="space-y-2 pr-2">
            {filtered.map((item) => (
              <div key={item.id} className="relative group">
                <HistoryItemCard item={item} onLoad={onLoad} onDelete={onDelete} />
                <button
                  aria-label={item.starred
                    ? (locale === "km" ? "លប់ចេញពីផ្កាយ" : "Unstar prompt")
                    : (locale === "km" ? "ដាក់ផ្កាយ" : "Star prompt")}
                  onClick={async () => { await hapticLight(); onToggleStar(item.id); }}
                  className={cn(
                    "absolute top-2 right-10 p-1.5 rounded-lg transition-all",
                    item.starred
                      ? "text-amber-400 opacity-100"
                      : "text-white/20 opacity-0 group-hover:opacity-100 hover:text-amber-400"
                  )}
                >
                  <Star
                    className="w-3.5 h-3.5"
                    fill={item.starred ? "currentColor" : "none"}
                    strokeWidth={2}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
