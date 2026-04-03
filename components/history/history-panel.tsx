"use client";

import { useState } from "react";
import { HistoryItem } from "@/lib/types";
import { HistoryItemCard } from "./history-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocale } from "@/lib/locale-context";
import { exportHistory } from "@/lib/storage";
import { toast } from "sonner";
import { glassInput, glassSubtle, glassChip } from "@/lib/glass";
import { Search, Download, Trash2, Clock } from "lucide-react";

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryPanel({ history, onLoad, onDelete, onClearAll }: HistoryPanelProps) {
  const [search, setSearch] = useState("");
  const { t } = useLocale();

  const filtered = search.trim()
    ? history.filter(
        (h) =>
          h.taskDescription.toLowerCase().includes(search.toLowerCase()) ||
          h.taskMode.toLowerCase().includes(search.toLowerCase())
      )
    : history;

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

      <ScrollArea className="h-[calc(100vh-320px)] sm:h-[calc(100vh-280px)]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={glassSubtle}
            >
              <Clock className="w-6 h-6 text-white/15" strokeWidth={1.5} />
            </div>
            <p className="text-white/20 text-sm font-medium">
              {history.length === 0 ? t("noPromptsYet") : t("noMatching")}
            </p>
          </div>
        ) : (
          <div className="space-y-2 pr-2">
            {filtered.map((item) => (
              <HistoryItemCard key={item.id} item={item} onLoad={onLoad} onDelete={onDelete} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
