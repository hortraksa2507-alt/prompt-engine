export type ThemeId =
  | "aba-gold" | "angkor" | "mekong" | "lotus" | "night-sky"
  | "ocean" | "forest" | "aurora" | "sunset" | "midnight";

export interface ThemeDef {
  id: ThemeId;
  nameEn: string;
  nameKm: string;
  /** Which locale this theme is grouped under in the picker */
  locale: "km" | "en";
  /** Three CSS color values shown as swatch preview */
  swatch: [string, string, string];
}

export const THEMES: ThemeDef[] = [
  // ── Khmer themes ──────────────────────────────────────────────
  {
    id: "aba-gold",
    nameEn: "ABA Gold",
    nameKm: "មាស ABA",
    locale: "km",
    swatch: ["#C9A227", "#0b0804", "#D4AF37"],
  },
  {
    id: "angkor",
    nameEn: "Angkor Sunset",
    nameKm: "ព្រះអាទិត្យអង្គរ",
    locale: "km",
    swatch: ["#DC8228", "#0d0814", "#A050C8"],
  },
  {
    id: "mekong",
    nameEn: "Mekong Jade",
    nameKm: "មណីស្ទឹងមេគង្គ",
    locale: "km",
    swatch: ["#28B496", "#030f0d", "#BE961E"],
  },
  {
    id: "lotus",
    nameEn: "Lotus",
    nameKm: "ផ្កាឈូក",
    locale: "km",
    swatch: ["#DC508C", "#0f030b", "#B43CC8"],
  },
  {
    id: "night-sky",
    nameEn: "Night Sky",
    nameKm: "មេឃយប់",
    locale: "km",
    swatch: ["#64A0F0", "#03060f", "#8CB4FF"],
  },
  // ── English themes ────────────────────────────────────────────
  {
    id: "ocean",
    nameEn: "Ocean",
    nameKm: "មហាសមុទ្រ",
    locale: "en",
    swatch: ["#28C88C", "#060a0d", "#28B4DC"],
  },
  {
    id: "forest",
    nameEn: "Forest",
    nameKm: "ព្រៃឈើ",
    locale: "en",
    swatch: ["#34D364", "#030d06", "#10B981"],
  },
  {
    id: "aurora",
    nameEn: "Aurora",
    nameKm: "អូរ៉ូរ៉ា",
    locale: "en",
    swatch: ["#A064F0", "#07030f", "#C850DC"],
  },
  {
    id: "sunset",
    nameEn: "Sunset",
    nameKm: "ថ្ងៃអស្តង្គត",
    locale: "en",
    swatch: ["#FB923C", "#0f0703", "#FBBF24"],
  },
  {
    id: "midnight",
    nameEn: "Midnight",
    nameKm: "អធ្រាត្រ",
    locale: "en",
    swatch: ["#3B82F6", "#020408", "#6366F1"],
  },
];

export const DEFAULT_THEME: Record<"en" | "km", ThemeId> = {
  en: "ocean",
  km: "aba-gold",
};

export function getTheme(id: ThemeId): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
