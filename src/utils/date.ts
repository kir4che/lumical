import { addDays } from "date-fns";
import type {
  CalendarDateField,
  ThemeDefinition,
  WeekStartOption,
} from "@/types";

// 解析 `KEY:VALUE`，返回冒號後的內容
export const getLineValue = (line: string) => {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) return "";
  return line.slice(colonIndex + 1).trim();
};

// 產生臨時 ID
export const createTempId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return Math.random().toString(36).substring(2, 11);
};

// 將 Google/ICS 等 API 提供的日期欄位轉換成 Date
export const parseCalendarDateField = (
  input?: CalendarDateField
): Date | null => {
  if (!input) return null;
  if (input.dateTime) return new Date(input.dateTime);
  if (input.date) return new Date(input.date);
  return null;
};

// 預設抓「上個月 1 號」到「三個月後月底」的範圍
export const getDefaultTimeRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - 1, 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setMonth(end.getMonth() + 3, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// 解析 iCalendar 日期字串
export const parseICSDate = (line: string): Date => {
  if (!line) return new Date();
  const cleanStr = getLineValue(line);
  if (!cleanStr) return new Date();
  const year = parseInt(cleanStr.substring(0, 4));
  const month = parseInt(cleanStr.substring(4, 6)) - 1;
  const day = parseInt(cleanStr.substring(6, 8));

  if (cleanStr.includes("T")) {
    const timePart = cleanStr.split("T")[1];
    const hour = parseInt(timePart.substring(0, 2));
    const min = parseInt(timePart.substring(2, 4));
    const sec = parseInt(timePart.substring(4, 6));
    return new Date(year, month, day, hour, min, sec);
  }
  return new Date(year, month, day);
};

// 把 Date | string 正規化成 Date
export const toDate = (value: Date | string) => {
  return value instanceof Date ? value : new Date(value);
};

// 取得當週的起始日（日/一）
export const startOfWeek = (
  date: Date,
  weekStart: WeekStartOption = "sunday"
) => {
  const d = new Date(date);
  const day = d.getDay();
  const desiredStartIndex = weekStart === "sunday" ? 0 : 1;
  const diff = d.getDate() - ((day - desiredStartIndex + 7) % 7);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// 取得本月的第一天
export const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// 根據當前日期與語系產生每週的標籤
export const getWeekOptions = (
  date: Date,
  locale: string,
  weekStart: WeekStartOption = "sunday"
) => {
  const start = startOfMonth(date);
  const weeks = [];
  // 找到包含本月第一天的那一週的起始日
  let curr = startOfWeek(start, weekStart);

  // 最多跑 6 週（一般月曆最多顯示 6 週）
  for (let i = 0; i < 6; i++) {
    const end = addDays(curr, 6);

    const label = `${curr.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    })}`;

    weeks.push({ date: new Date(curr), label });
    curr = addDays(curr, 7);

    // 如果超出本月且已經顯示至少 4 週就結束
    if (curr.getMonth() !== date.getMonth() && i >= 3) break;
  }

  return weeks;
};

// 依 locale 產生月份名稱
export const getMonthLabels = (locale: string, months: readonly number[]) => {
  return months.map((m) =>
    new Date(2024, m, 1).toLocaleDateString(locale, {
      month: "long",
    })
  );
};

// 依給定年份產生年份範圍
export const getYearRange = (centerYear: number, range = 11) => {
  const half = Math.floor(range / 2);
  const startYear = centerYear - half;
  return Array.from({ length: range }, (_, i) => startYear + i);
};

// 快取 Intl.DateTimeFormat
const getCachedFormatter = (() => {
  const cache = new Map<string, Intl.DateTimeFormat>();

  return (locale: string, options: Intl.DateTimeFormatOptions) => {
    const key = `${locale}:${JSON.stringify(options)}`;
    let fmt = cache.get(key);
    if (!fmt) {
      fmt = new Intl.DateTimeFormat(locale, options);
      cache.set(key, fmt);
    }
    return fmt;
  };
})();

// 格式化日期字串
export const formatDate = (
  locale: string,
  date: Date,
  options: Intl.DateTimeFormatOptions
) => getCachedFormatter(locale, options).format(date);

// 格式化星期字串
export const formatWeekdayLabel = (
  value: string,
  locale: string,
  weekdayCase?: ThemeDefinition["weekdayCase"]
) => {
  const normalized = value.trim();
  if (!normalized) return normalized;

  switch (weekdayCase) {
    case "lowercase":
      return normalized.toLocaleLowerCase(locale);
    case "capitalized":
      return (
        normalized.charAt(0).toLocaleUpperCase(locale) +
        normalized.slice(1).toLocaleLowerCase(locale)
      );
    default:
      return normalized.toLocaleUpperCase(locale);
  }
};
