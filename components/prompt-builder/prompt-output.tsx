"use client";

import { useState } from "react";
import { countWords } from "@/lib/prompt-generator";
import { useLocale } from "@/lib/locale-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { glassCard, glassSubtle, glassChipActive } from "@/lib/glass";
import { hapticSuccess, hapticLight } from "@/lib/haptics";
import { Copy, Check, ExternalLink, Sparkles, FileText, Share2 } from "lucide-react";

interface PromptOutputProps {
  prompt: string;
  onShare?: (prompt: string) => Promise<void>;
}

function highlightXml(text: string): React.ReactNode[] {
  const parts = text.split(/(<\/?[a-z_-]+>)/gi);
  return parts.map((part, i) => {
    if (/^<\/?[a-z_-]+>$/i.test(part)) {
      return (
        <span key={i} className="xml-tag-highlight">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function PromptOutput({ prompt, onShare }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);
  const { t, locale } = useLocale();

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={glassSubtle}
        >
          <Sparkles className="w-6 h-6 text-white/20" strokeWidth={1.5} />
        </div>
        <p className="text-white/25 text-sm font-medium">{t("promptWillAppear")}</p>
        <p className="text-white/15 text-xs mt-1.5">{t("selectModeToStart")}</p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      await hapticSuccess();
      setCopied(true);
      toast.success(t("copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(locale === "km" ? "មិនអាចចម្លងបានទេ" : "Failed to copy");
    }
  };

  const handleShare = async () => {
    await hapticLight();
    await onShare?.(prompt);
  };

  const words = countWords(prompt);
  const chars = prompt.length;

  return (
    <div className="rounded-2xl overflow-hidden" style={glassCard}>
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <FileText className={cn("w-4 h-4", locale === "km" ? "text-amber-400/60" : "text-emerald-400/60")} />
          <span className="text-[13px] font-semibold text-white/50">{t("generatedResult")}</span>
          <div className="flex gap-2 text-[11px] text-white/25 font-medium ml-2">
            <span>{words} {t("words")}</span>
            <span>·</span>
            <span>{chars} {t("chars")}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            aria-label={locale === "km" ? "បើក Claude" : "Open Claude"}
            className="flex items-center gap-1.5 text-[12px] text-white/35 hover:text-white/60 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/[0.05]"
            onClick={() => window.open("https://claude.ai/new", "_blank")}
          >
            <ExternalLink className="w-3 h-3" />
            {t("openClaude")}
          </button>
          {onShare && (
            <button
              aria-label={locale === "km" ? "ចែករំលែក" : "Share"}
              onClick={handleShare}
              className={cn(
                "flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-lg transition-colors hover:bg-white/[0.05]",
                locale === "km" ? "text-amber-300/60 hover:text-amber-200" : "text-emerald-300/60 hover:text-emerald-200"
              )}
            >
              <Share2 className="w-3 h-3" />
            </button>
          )}
          <button
            aria-label={locale === "km" ? "ចម្លង" : "Copy prompt"}
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 text-[12px] font-medium px-3.5 py-1.5 rounded-full transition-all duration-300",
              copied
                ? (locale === "km" ? "text-amber-200" : "text-green-300")
                : (locale === "km" ? "text-amber-200 hover:text-white" : "text-emerald-200 hover:text-white")
            )}
            style={glassChipActive}
          >
            {copied ? <Check className="w-3 h-3" strokeWidth={2.5} /> : <Copy className="w-3 h-3" />}
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 bg-black/20">
        <pre className="text-[13px] text-white/75 whitespace-pre-wrap font-mono leading-relaxed">
          {highlightXml(prompt)}
        </pre>
      </div>
    </div>
  );
}
