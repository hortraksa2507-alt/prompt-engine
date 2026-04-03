"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale-context";
import { glass, glassSubtle, glassActive, glassCard } from "@/lib/glass";
import { exportHistory, clearHistory } from "@/lib/storage";
import { Globe, Trash2, Download, Info, Shield, X, Palette, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ThemeSelector } from "./theme-selector";

// ─── Types ────────────────────────────────────────────────────

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

// ─── Section Header ───────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-5 pt-5 pb-1">
      <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────

interface RowProps {
  left: React.ReactNode;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  ariaLabel?: string;
}

function Row({ left, right, onClick, danger = false, ariaLabel }: RowProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      className={cn(
        "flex items-center justify-between px-5 py-4 w-full transition-colors duration-150",
        onClick && "hover:bg-white/[0.03] active:bg-white/[0.06] cursor-pointer"
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <div className={cn("flex items-center gap-3", danger ? "text-rose-400" : "text-white/80")}>
        {left}
      </div>
      {right && (
        <div className="flex items-center gap-1.5 text-white/30">
          {right}
        </div>
      )}
    </Tag>
  );
}

// ─── Divider ──────────────────────────────────────────────────

function Divider() {
  return <div className="mx-5 h-px bg-white/[0.06]" />;
}

// ─── Main Component ───────────────────────────────────────────

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { locale, toggleLocale } = useLocale();
  const isKm = locale === "km";
  const [confirmClear, setConfirmClear] = useState(false);

  // ── Labels ────────────────────────────────────────────────
  const lbl = {
    theme:         isKm ? "រចនាប័ទ្ម"                    : "Theme",
    language:      isKm ? "ភាសា"                         : "Language",
    exportHistory: isKm ? "នាំចេញប្រវត្តិ"               : "Export History",
    clearHistory:  isKm ? "សម្អាតប្រវត្តិទាំងអស់"        : "Clear All History",
    areYouSure:    isKm ? "តើអ្នកប្រាកដទេ?"              : "Are you sure?",
    cancel:        isKm ? "បោះបង់"                       : "Cancel",
    confirm:       isKm ? "បញ្ជាក់"                      : "Confirm",
    version:       isKm ? "កំណែ"                         : "Version",
    privacy:       isKm ? "គោលនយោបាយឯកជនភាព"            : "Privacy Policy",
    about:         isKm ? "អំពី"                         : "About",
    data:          isKm ? "ទិន្នន័យ"                     : "Data",
    exported:      isKm ? "បានបញ្ចេញ!"                   : "Exported!",
    cleared:       isKm ? "បានសម្អាតប្រវត្តិ"            : "History cleared",
    settings:      isKm ? "ការកំណត់"                     : "Settings",
  };

  // ── Handlers ─────────────────────────────────────────────

  const handleExport = () => {
    const json = exportHistory();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-engine-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(lbl.exported);
  };

  const handleClearConfirm = () => {
    clearHistory();
    setConfirmClear(false);
    toast.success(lbl.cleared);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ── Derived ───────────────────────────────────────────────

  const accentStyle = { color: "rgba(var(--accent-rgb), 0.85)" };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
        style={glassCard}
        role="dialog"
        aria-modal="true"
        aria-label={lbl.settings}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-[17px] font-semibold text-white">{lbl.settings}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
            style={{ background: "rgba(255,255,255,0.07)" }}
            aria-label={isKm ? "បិទ" : "Close settings"}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <Divider />

        {/* ── Theme ────────────────────────────────────────── */}
        <SectionHeader label={lbl.theme} />
        <ThemeSelector />

        <Divider />

        {/* ── Language ─────────────────────────────────────── */}
        <SectionHeader label={lbl.language} />
        <Row
          ariaLabel={isKm ? "ប្តូរភាសា" : "Toggle language"}
          onClick={toggleLocale}
          left={
            <>
              <Globe className="w-4.5 h-4.5" strokeWidth={1.8} size={18} style={accentStyle} />
              <span className="text-[15px] font-medium">{lbl.language}</span>
            </>
          }
          right={
            <>
              <span className="text-[13px] font-medium" style={accentStyle}>
                {locale === "en" ? "English" : "ខ្មែរ"}
              </span>
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
            </>
          }
        />

        <Divider />

        {/* ── Data ─────────────────────────────────────────── */}
        <SectionHeader label={lbl.data} />

        <Row
          ariaLabel={isKm ? "នាំចេញប្រវត្តិ" : "Export history as JSON"}
          onClick={handleExport}
          left={
            <>
              <Download className="w-4.5 h-4.5 text-white/50" strokeWidth={1.8} size={18} />
              <span className="text-[15px] font-medium">{lbl.exportHistory}</span>
            </>
          }
          right={<ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />}
        />

        <Divider />

        {/* Clear history row — or confirm step */}
        {!confirmClear ? (
          <Row
            ariaLabel={isKm ? "សម្អាតប្រវត្តិទាំងអស់" : "Clear all prompt history"}
            onClick={() => setConfirmClear(true)}
            danger
            left={
              <>
                <Trash2 className="w-4.5 h-4.5" strokeWidth={1.8} size={18} />
                <span className="text-[15px] font-medium">{lbl.clearHistory}</span>
              </>
            }
            right={<ChevronRight className="w-3.5 h-3.5 text-rose-400/40" strokeWidth={2} />}
          />
        ) : (
          <div className="px-5 py-4 space-y-3">
            <p className="text-[14px] text-rose-300 font-medium">{lbl.areYouSure}</p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold text-white/60 transition-colors hover:text-white/80"
                style={glassSubtle}
                aria-label={isKm ? "បោះបង់ការសម្អាត" : "Cancel clearing history"}
              >
                {lbl.cancel}
              </button>
              <button
                onClick={handleClearConfirm}
                className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-colors"
                style={{
                  background: "linear-gradient(135deg, rgba(239,68,68,0.35) 0%, rgba(220,38,38,0.25) 100%)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  boxShadow: "0 2px 12px rgba(239,68,68,0.12)",
                }}
                aria-label={isKm ? "បញ្ជាក់ការសម្អាត" : "Confirm clearing history"}
              >
                {lbl.confirm}
              </button>
            </div>
          </div>
        )}

        <Divider />

        {/* ── About ────────────────────────────────────────── */}
        <SectionHeader label={lbl.about} />

        <Row
          left={
            <>
              <Info className="w-4.5 h-4.5 text-white/40" strokeWidth={1.8} size={18} />
              <span className="text-[15px] font-medium">{lbl.version}</span>
            </>
          }
          right={
            <span className="text-[13px] text-white/30 font-medium">1.0.0</span>
          }
        />

        <Divider />

        <Row
          ariaLabel={isKm ? "បើកគោលនយោបាយឯកជនភាព" : "Open Privacy Policy"}
          onClick={() => window.open("https://prompt-engine-eight.vercel.app/privacy", "_blank", "noopener,noreferrer")}
          left={
            <>
              <Shield className="w-4.5 h-4.5 text-white/40" strokeWidth={1.8} size={18} />
              <span className="text-[15px] font-medium">{lbl.privacy}</span>
            </>
          }
          right={<ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />}
        />

        {/* Safe-area bottom padding for iOS */}
        <div className="h-8" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
      </div>
    </>
  );
}
