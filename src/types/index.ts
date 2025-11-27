import type { CSSProperties } from "react";
import { THEMES } from "@/constants";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  location?: string;
  description?: string;
  color?: string;
  timezone?: string;
  sourceEventId?: string;
  calendarId?: string;
  source?: "google" | "apple" | "manual";
}

export interface CalendarDateField {
  date?: string;
  dateTime?: string;
}

export interface DateFormatSettings {
  gridWeekday: "long" | "short" | "narrow";
  gridDay: "number" | "padded";
}

export type WeekStartOption = "sunday" | "monday";

export type Theme = (typeof THEMES)[number];

export type ThemeStyle =
  | "bauhaus-mod"
  | "botanical-art"
  | "bubble-dream"
  | "clean-nude"
  | "cozy-mocha"
  | "cyber-glitch"
  | "editorial-chic"
  | "floral-journal"
  | "kawaii-notes"
  | "lux-gold"
  | "macaron-pop"
  | "midnight-whisper"
  | "minimal"
  | "pastel-diary"
  | "pop-art"
  | "retro-vapor"
  | "sakura-breeze"
  | "scrapbook-memory"
  | "serene-sky"
  | "vintage-news";

type DateLayout =
  | "standard"
  | "big-left"
  | "badge-top"
  | "inline"
  | "stacked"
  | "background-ghost"
  | "tag-right"
  | "circle-floating"
  | "minimal-corner"
  | "neon-sign"
  | "comic-box";

export type Align = "left" | "center" | "right";

export interface ThemeDefinition {
  id: ThemeStyle;
  name: string;
  description: string;
  bgClass: string;
  textClass: string;
  accentClass: string;
  defaultAccent: string;
  fontHeading: string;
  fontBody: string;
  headerAlign: Align;
  dateLayout: DateLayout;
  dateAlign: Align;
  weekdayCase?: "uppercase" | "capitalized" | "lowercase";
  weekendStyle:
    | "default"
    | "soft-bg"
    | "tint-text"
    | "highlight"
    | "dot-indicator";
  cardStyle:
    | "glass"
    | "solid"
    | "outline"
    | "soft-shadow"
    | "marker"
    | "sticker"
    | "plain"
    | "neon"
    | "comic"
    | "polaroid"
    | "bauhaus-block";
  decorator?:
    | "none"
    | "gradient-blobs"
    | "grid-lines"
    | "noise"
    | "circles"
    | "dots"
    | "soft-gradient"
    | "bubble-gradient"
    | "neon-grid"
    | "ivy-leaves"
    | "lux-frame"
    | "halftone"
    | "paper-texture"
    | "doodles"
    | "scanlines"
    | "geometric-shapes";
  customCSS?: CSSProperties;
}

export interface WallpaperConfig {
  resolution: "desktop" | "mobile";
  width: number;
  height: number;
  theme: ThemeStyle;
  customTitle: string;
  targetDate: Date;
  viewMode: "month" | "week" | "2-week";
  showMonthMiniature: boolean;
  fontScale: number;
  accentColor: string;
  locale: string;
  weekStart: WeekStartOption;
  dateFormat: DateFormatSettings;
  headerAlign: Align;
  gridAlign: Align;
  weekdayAlign: Align;
}

export type ScaleFn = (px: number) => number;

export type TextStyleFn = (
  size: number,
  weight?: number,
  spacing?: number
) => CSSProperties;

export interface GridAlignContext {
  rowJustify: string;
  colAlign: string;
  txtAlign: string;
  isCenter: boolean;
  isRight: boolean;
}
