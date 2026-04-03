"use client";

import { useState, useEffect } from "react";
import { BuilderForm } from "@/components/prompt-builder/builder-form";
import { HistoryPanel } from "@/components/history/history-panel";
import { usePromptBuilder } from "@/hooks/use-prompt-builder";
import { useLocale } from "@/lib/locale-context";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { glass, glassSubtle, glassActive, glassAccent } from "@/lib/glass";
import { Zap, Clock, Globe, SlidersHorizontal } from "lucide-react";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import { SettingsModal } from "@/components/settings/settings-modal";

type Tab = "builder" | "history";

export default function Home() {
  const [tab, setTab] = useState<Tab>("builder");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const builder = usePromptBuilder();
  const { locale, toggleLocale, t } = useLocale();

  useEffect(() => {
    const handler = () => {
      // After onboarding, switch to builder tab and give a subtle visual cue
      setTab("builder");
      // Optional: auto-show templates after short delay
      setTimeout(() => {
        // show a one-time toast hint
        import("sonner").then(({ toast }) => {
          toast("Pick a template or select a mode to start ✨", {
            duration: 4000,
          });
        });
      }, 600);
    };
    window.addEventListener("onboarding-complete", handler);
    return () => window.removeEventListener("onboarding-complete", handler);
  }, []);

  return (
    <div className={cn("relative min-h-dvh safe-area-top safe-area-bottom", locale === "km" && "locale-km")}>
      <OnboardingModal />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--dialog-bg)",
            backdropFilter: "blur(40px) saturate(1.5)",
            WebkitBackdropFilter: "blur(40px) saturate(1.5)",
            border: "1px solid var(--accent-border-mid)",
            color: "#f5f5f7",
            borderRadius: "16px",
            fontSize: "13px",
            boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.05), 0 -4px 24px rgba(0,0,0,0.25)",
          },
        }}
      />

      {/* Header — Fix 1: will-change for compositing, no backdrop-filter conflict */}
      <header
        role="banner"
        className="sticky top-0 z-50 will-change-transform"
        style={{
          ...glass,
          borderRadius: 0,
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: "1px solid var(--accent-border)",
        }}
      >
        <div className="max-w-2xl mx-auto px-5 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={glassActive}
              >
                <Zap className="w-4 h-4" style={{ color: "rgba(var(--accent-rgb), 0.9)" }} />
              </div>
              <div>
                <h1 className={cn("text-[17px] font-bold text-white tracking-tight", locale === "km" && "km-app-name")}>{t("appName")}</h1>
                <p className={cn("text-[11px] text-white/35 font-medium", locale === "km" && "km-tagline")}>{t("appTagline")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Fix 6: Better language switcher with Globe icon + clear label */}
              <button
                onClick={toggleLocale}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all duration-300 active:scale-[0.95]",
                  locale === "km" ? "km-lang-active" : ""
                )}
                style={locale === "km" ? undefined : glassSubtle}
                title={t("language")}
              >
                <Globe className="w-4 h-4" />
                <span>{locale === "en" ? "ខ្មែរ" : "EN"}</span>
              </button>

              {/* Settings button */}
              <button
                onClick={() => setSettingsOpen(true)}
                aria-label={locale === "km" ? "ការកំណត់" : "Settings"}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-[0.95]"
                style={glassSubtle}
              >
                <SlidersHorizontal className="w-4 h-4 text-white/50" />
              </button>
            </div>
          </div>

          {/* Segmented control */}
          <div className="flex rounded-2xl p-1" style={glassSubtle} role="tablist">
            {(["builder", "history"] as const).map((tabKey) => (
              <button
                key={tabKey}
                role="tab"
                aria-selected={tab === tabKey}
                onClick={() => setTab(tabKey)}
                className={cn(
                  "flex-1 py-2 text-[13px] font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5",
                  tab === tabKey ? "text-white" : "text-white/35 hover:text-white/50"
                )}
                style={tab === tabKey ? glassActive : undefined}
              >
                {tabKey === "builder" ? (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    {t("builder")}
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    {t("history")} ({builder.history.length})
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Fix 1: Removed animate-fade-in-up from main — it creates a compositing layer
          that clips content below the fold when combined with sticky header backdrop-filter.
          Added pb-28 for sticky CTA clearance. */}
      <main role="main" className="relative z-10 max-w-2xl mx-auto px-5 py-6 pb-28">
        {tab === "builder" ? (
          <BuilderForm builder={builder} />
        ) : (
          <HistoryPanel
            history={builder.history}
            onLoad={(item) => {
              builder.loadFromHistory(item);
              setTab("builder");
            }}
            onDelete={builder.removeHistoryItem}
            onClearAll={builder.clearAllHistory}
            onToggleStar={builder.toggleStar}
          />
        )}
      </main>
    </div>
  );
}
