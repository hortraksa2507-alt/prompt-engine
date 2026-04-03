"use client";
import { useLocale } from "@/lib/locale-context";

export function useAccent() {
  const { locale } = useLocale();
  const isKm = locale === "km";
  return {
    text: isKm ? "text-amber-400" : "text-emerald-400",
    textMuted: isKm ? "text-amber-400/60" : "text-emerald-400/60",
    textBright: isKm ? "text-amber-300" : "text-emerald-300",
    textBrightHover: isKm ? "text-amber-200 hover:text-white" : "text-emerald-200 hover:text-white",
    badgeBg: isKm ? "bg-amber-500/15" : "bg-emerald-500/15",
    badgeText: isKm ? "text-amber-300" : "text-emerald-300",
    dot: isKm ? "bg-amber-400" : "bg-emerald-400",
    btnGradient: isKm
      ? "bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_4px_24px_rgba(201,162,39,0.35)] hover:shadow-[0_4px_32px_rgba(201,162,39,0.5)]"
      : "bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_4px_24px_rgba(40,200,140,0.3)] hover:shadow-[0_4px_32px_rgba(40,200,140,0.4)]",
  };
}
