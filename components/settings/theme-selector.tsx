"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale-context";
import { useTheme } from "@/lib/theme-context";
import { THEMES, ThemeDef } from "@/lib/themes";
import { hapticLight } from "@/lib/haptics";
import { Check } from "lucide-react";

function ThemeSwatch({ theme, active, onSelect }: {
  theme: ThemeDef;
  active: boolean;
  onSelect: () => void;
}) {
  const { locale } = useLocale();
  const name = locale === "km" ? theme.nameKm : theme.nameEn;
  const [c1, c2, c3] = theme.swatch;

  return (
    <button
      onClick={onSelect}
      aria-label={name}
      aria-pressed={active}
      className="flex flex-col items-center gap-1.5 flex-shrink-0"
    >
      {/* Swatch circle */}
      <div
        className={cn(
          "w-12 h-12 rounded-2xl relative transition-all duration-200 active:scale-95",
          active ? "ring-2 ring-white/50 ring-offset-1 ring-offset-transparent scale-105" : "opacity-80 hover:opacity-100"
        )}
        style={{
          background: `conic-gradient(${c1} 0deg 120deg, ${c2} 120deg 240deg, ${c3} 240deg 360deg)`,
          boxShadow: active
            ? `0 4px 16px ${c1}55, 0 0 0 1px ${c1}40`
            : "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        {active && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        )}
      </div>
      {/* Label */}
      <span className={cn(
        "text-[10px] font-medium text-center leading-tight max-w-[52px] line-clamp-2",
        active ? "text-white/90" : "text-white/40"
      )}>
        {name}
      </span>
    </button>
  );
}

export function ThemeSelector() {
  const { locale } = useLocale();
  const { themeId, setTheme } = useTheme();

  const kmThemes = THEMES.filter((t) => t.locale === "km");
  const enThemes = THEMES.filter((t) => t.locale === "en");

  const groupLabel = locale === "km"
    ? { km: "រចនាប័ទ្មខ្មែរ", en: "រចនាប័ទ្មអង់គ្លេស" }
    : { km: "Khmer Themes", en: "English Themes" };

  const renderGroup = (themes: ThemeDef[], label: string) => (
    <div className="px-5 pb-2 space-y-2">
      <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">
        {label}
      </span>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {themes.map((theme) => (
          <ThemeSwatch
            key={theme.id}
            theme={theme}
            active={themeId === theme.id}
            onSelect={async () => {
              await hapticLight();
              setTheme(theme.id);
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pt-1">
      {renderGroup(kmThemes, groupLabel.km)}
      {renderGroup(enThemes, groupLabel.en)}
    </div>
  );
}
