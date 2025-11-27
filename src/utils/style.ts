import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  GridAlignContext,
  ThemeDefinition,
  WallpaperConfig,
} from "@/types";

export const cn = (...classes: ClassValue[]) => {
  return twMerge(clsx(classes));
};

export const getContrastColor = (hex: string) => {
  const c = hex.replace("#", "");
  if (c.length < 6) return "#333";

  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#333" : "#fff";
};

const parseHexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "").toLowerCase();
  if (!/^[0-9a-f]+$/.test(normalized)) return null;

  let fullHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (fullHex.length === 8) fullHex = fullHex.slice(0, 6);

  if (fullHex.length !== 6) return null;

  const intValue = parseInt(fullHex, 16);
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255,
  };
};

export const hexWithAlpha = (hex: string, alpha: number) => {
  const rgb = parseHexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

export const normalizeHex = (value: string, fallback = "#000000") => {
  const trimmed = value.trim();
  const match = /^#?[0-9a-fA-F]{3,6}$/.exec(trimmed);
  if (!match) return fallback;
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
};

export const getGridBorderStyle = (
  theme: ThemeDefinition,
  accentColor: string
) => {
  const c = accentColor;
  switch (theme.id) {
    case "pop-art":
      return `3px solid #000000`;
    case "scrapbook-memory":
      return `1px dashed #a8a29e`;
    case "vintage-news":
      return `1px solid #78716c`;
    case "cyber-glitch":
      return `1px solid ${c}30`;
    case "bauhaus-mod":
      return `2px solid #000000`;
    case "editorial-chic":
      return `1px solid ${c}30`;
    case "kawaii-notes":
      return `2px dotted ${c}60`;
    case "pastel-diary":
      return `1px dashed ${c}40`;
    case "clean-nude":
      return `1px solid ${c}15`;
    case "cozy-mocha":
      return `1px solid ${c}20`;
    case "midnight-whisper":
      return `1px solid rgba(255,255,255,0.10)`;
    case "bubble-dream":
      return `1px dashed rgba(255,255,255,0.4)`;
    case "floral-journal":
      return `1px dotted ${c}40`;
    case "sakura-breeze":
      return `1px solid ${c}10`;
    case "retro-vapor":
      return `1px solid ${c}40`;
    case "botanical-art":
      return `1px solid ${c}20`;
    case "lux-gold":
      return `1px solid ${c}30`;
    case "macaron-pop":
      return `2px dashed ${c}60`;
    case "minimal":
      return `1px solid ${c}10`;
    default:
      return `1px solid ${c}10`;
  }
};

export const getAlignClasses = (
  align: WallpaperConfig["gridAlign"]
): GridAlignContext => {
  const isCenter = align === "center";
  const isRight = align === "right";

  const rowJustify = isCenter
    ? "justify-center"
    : isRight
    ? "justify-end"
    : "justify-start";

  const colAlign = isCenter
    ? "items-center"
    : isRight
    ? "items-end"
    : "items-start";

  const txtAlign = isCenter
    ? "text-center"
    : isRight
    ? "text-right"
    : "text-left";

  return { rowJustify, colAlign, txtAlign, isCenter, isRight };
};
