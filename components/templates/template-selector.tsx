"use client";

import { useState } from "react";
import { Template, TemplateCategory } from "@/lib/types";
import { CATEGORIES, CategoryDef } from "@/lib/templates";
import { useLocale } from "@/lib/locale-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { glassChip, glassSubtle, glassInput, glassChipActive } from "@/lib/glass";
import { LayoutGrid, Plus, X, ChevronRight } from "lucide-react";
import { hapticLight, hapticMedium } from "@/lib/haptics";

interface TemplateSelectorProps {
  templates: Template[];
  onLoad: (template: Template) => void;
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
  canSave: boolean;
}

export function TemplateSelector({ templates, onLoad, onSave, onDelete, canSave }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("");
  const [activeCat, setActiveCat] = useState<TemplateCategory | "all" | "custom">("all");
  const { t, locale } = useLocale();
  const isKm = locale === "km";

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    setSaveOpen(false);
    toast.success(t("saveTemplate"));
  };

  // Group templates
  const presets = templates.filter((t) => t.isPreset);
  const customs = templates.filter((t) => !t.isPreset);

  const filtered = activeCat === "all"
    ? presets
    : activeCat === "custom"
    ? customs
    : presets.filter((t) => t.category === activeCat);

  const catName = (cat: CategoryDef) => isKm ? cat.nameKm : cat.nameEn;

  return (
    <div className="flex gap-2 flex-wrap">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <button
              className="flex items-center gap-1.5 rounded-full text-[12px] font-medium text-white/45 px-3.5 min-h-[36px] hover:text-white/65 transition-all active:scale-[0.96]"
              style={glassChip}
            />
          }
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          {t("templates")}
        </DialogTrigger>
        <DialogContent className="text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-semibold">
              {isKm ? "គំរូប្រយោគ" : "Prompt Templates"}
            </DialogTitle>
          </DialogHeader>

          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {/* All tab */}
            <button
              onClick={() => setActiveCat("all")}
              className={cn(
                "flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all",
                activeCat === "all" ? "text-white" : "text-white/35"
              )}
              style={activeCat === "all" ? glassChipActive : glassChip}
            >
              {isKm ? "ទាំងអស់" : "All"}
            </button>

            {CATEGORIES.map((cat) => {
              const count = presets.filter((t) => t.category === cat.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={cn(
                    "flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1",
                    activeCat === cat.id ? "text-white" : "text-white/35"
                  )}
                  style={activeCat === cat.id ? glassChipActive : glassChip}
                >
                  <span>{cat.emoji}</span>
                  <span>{catName(cat)}</span>
                </button>
              );
            })}

            {/* Custom tab */}
            {customs.length > 0 && (
              <button
                onClick={() => setActiveCat("custom")}
                className={cn(
                  "flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all",
                  activeCat === "custom" ? "text-white" : "text-white/35"
                )}
                style={activeCat === "custom" ? glassChipActive : glassChip}
              >
                {isKm ? "ផ្ទាល់ខ្លួន" : "Custom"}
              </button>
            )}
          </div>

          {/* Template list */}
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <p className="text-center text-white/20 text-[13px] py-8">
                {isKm ? "មិនមានគំរូ" : "No templates in this category"}
              </p>
            ) : (
              filtered.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={async () => {
                    await hapticMedium();
                    onLoad(tmpl);
                    setOpen(false);
                    toast.success(isKm ? tmpl.nameKm || tmpl.name : tmpl.name);
                  }}
                  className="group w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-left hover:brightness-125 transition-all active:scale-[0.98]"
                  style={glassSubtle}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] text-white/75 font-medium block truncate">
                      {isKm ? (tmpl.nameKm || tmpl.name) : tmpl.name}
                    </span>
                    {tmpl.state.taskDescription && (
                      <span className="text-[11px] text-white/25 block truncate mt-0.5">
                        {tmpl.state.taskDescription.slice(0, 60)}...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {tmpl.state.taskMode && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: "rgba(var(--accent-rgb), 0.7)", background: "rgba(var(--accent-rgb), 0.1)" }}
                      >
                        {tmpl.state.taskMode}
                      </span>
                    )}
                    {!tmpl.isPreset && (
                      <button
                        aria-label={isKm ? "លុបគំរូ" : "Delete template"}
                        onClick={(e) => { e.stopPropagation(); onDelete(tmpl.id); }}
                        className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-red-400 p-1 rounded-lg transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-white/15" />
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogTrigger
          render={
            <button
              disabled={!canSave}
              className="flex items-center gap-1.5 rounded-full text-[12px] font-medium text-white/45 px-3.5 min-h-[36px] hover:text-white/65 transition-all disabled:opacity-25 disabled:cursor-not-allowed active:scale-[0.96]"
              style={glassChip}
            />
          }
        >
          <Plus className="w-3.5 h-3.5" />
          {t("saveTemplate")}
        </DialogTrigger>
        <DialogContent className="text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white font-semibold">{t("saveTemplate")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              id="pe-template-name"
              type="text"
              placeholder={t("templateName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="w-full rounded-2xl text-[15px] text-white placeholder:text-white/20 px-4 py-3.5 outline-none"
              style={glassInput}
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="w-full rounded-2xl py-3.5 text-white font-semibold text-[14px] disabled:opacity-30 transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, rgba(var(--accent-rgb), 0.85) 0%, rgba(var(--accent2-rgb), 0.75) 100%)",
              }}
            >
              {t("save")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
