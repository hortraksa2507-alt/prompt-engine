"use client";

import { useState } from "react";
import { Template } from "@/lib/types";
import { useLocale } from "@/lib/locale-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { glassChip, glassSubtle, glassInput } from "@/lib/glass";
import { LayoutGrid, Plus, X, Star } from "lucide-react";

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
  const { t } = useLocale();

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    setSaveOpen(false);
    toast.success(t("saveTemplate"));
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <button
              className="flex items-center gap-1.5 rounded-full text-[12px] font-medium text-white/45 px-3.5 py-2 hover:text-white/65 transition-all active:scale-[0.96]"
              style={glassChip}
            />
          }
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          {t("templates")}
        </DialogTrigger>
        <DialogContent className="text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-semibold">{t("templates")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="group flex items-center justify-between rounded-xl px-3.5 py-3 hover:brightness-125 transition-all"
                style={glassSubtle}
              >
                <button
                  onClick={() => {
                    onLoad(tmpl);
                    setOpen(false);
                    toast.success(`${tmpl.name}`);
                  }}
                  className="flex-1 text-left flex items-center gap-2"
                >
                  <span className="text-[14px] text-white/75">{tmpl.name}</span>
                  {tmpl.isPreset && (
                    <Star className="w-3 h-3 text-amber-400/50 fill-amber-400/30" />
                  )}
                </button>
                {!tmpl.isPreset && (
                  <button
                    onClick={() => onDelete(tmpl.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-red-400 p-1 rounded-lg transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogTrigger
          render={
            <button
              disabled={!canSave}
              className="flex items-center gap-1.5 rounded-full text-[12px] font-medium text-white/45 px-3.5 py-2 hover:text-white/65 transition-all disabled:opacity-25 disabled:cursor-not-allowed active:scale-[0.96]"
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
              type="text"
              placeholder={t("templateName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="w-full rounded-2xl text-[15px] text-white placeholder:text-white/20 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20"
              style={glassInput}
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="w-full rounded-2xl py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-[14px] disabled:opacity-30 transition-all active:scale-[0.98]"
            >
              {t("save")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
