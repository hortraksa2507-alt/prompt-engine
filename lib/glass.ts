import { CSSProperties } from "react";

export const glass: CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)",
  backdropFilter: "blur(40px) saturate(1.6)",
  WebkitBackdropFilter: "blur(40px) saturate(1.6)",
  border: "1px solid var(--accent-border)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(255,255,255,0.02), 0 4px 24px rgba(0,0,0,0.2)",
};

export const glassCard: CSSProperties = {
  background: "var(--card-bg)",
  backdropFilter: "blur(40px) saturate(1.6)",
  WebkitBackdropFilter: "blur(40px) saturate(1.6)",
  border: "1px solid var(--accent-border-mid)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.2), 0 0 40px var(--accent-glow-soft)",
};

export const glassSubtle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(20px) saturate(1.3)",
  WebkitBackdropFilter: "blur(20px) saturate(1.3)",
  border: "1px solid var(--accent-border)",
  boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 12px rgba(0,0,0,0.15)",
};

export const glassActive: CSSProperties = {
  background: "var(--active-bg)",
  backdropFilter: "blur(40px) saturate(1.8)",
  WebkitBackdropFilter: "blur(40px) saturate(1.8)",
  border: "1px solid var(--accent-border-strong)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 24px var(--accent-glow), 0 0 40px var(--accent-glow-soft)",
};

export const glassChip: CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.06)",
};

export const glassChipActive: CSSProperties = {
  background: "var(--chip-active-bg)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid var(--accent-border-strong)",
  boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.12), 0 2px 12px var(--accent-glow-soft)",
};

export const glassInput: CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--accent-border)",
  boxShadow: "inset 0 1px 4px rgba(0,0,0,0.2)",
};

export const glassAccent: CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,180,40,0.2) 0%, rgba(255,140,50,0.15) 100%)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,180,40,0.35)",
  boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.1), 0 2px 12px rgba(255,180,40,0.1)",
};
