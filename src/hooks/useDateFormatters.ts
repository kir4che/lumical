import { useMemo } from "react";
import type { WallpaperConfig } from "@/types";

const useDateFormatters = (config: WallpaperConfig) => {
  // 格式化月份
  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(config.locale, {
        month: "long",
      }),
    [config.locale]
  );

  // 格式化年份
  const yearFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(config.locale, {
        year: "numeric",
      }),
    [config.locale]
  );

  // 格式化星期
  const weekdayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(config.locale, {
        weekday: config.dateFormat.gridWeekday,
      }),
    [config.locale, config.dateFormat.gridWeekday]
  );

  // 格式化日期（天）
  const dayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(config.locale, {
        day: config.dateFormat.gridDay === "padded" ? "2-digit" : "numeric",
      }),
    [config.locale, config.dateFormat.gridDay]
  );

  // 格式化時間
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(config.locale, {
        hour: "numeric",
        minute: "numeric",
        hour12: false, // 使用 24 小時制
      }),
    [config.locale]
  );

  return {
    formatMonth: (date: Date) => monthFormatter.format(date),
    formatYear: (date: Date) => yearFormatter.format(date),
    formatWeekday: (date: Date) => weekdayFormatter.format(date),
    formatDay: (date: Date) => dayFormatter.format(date),
    formatTime: (date: Date) => timeFormatter.format(date),
  };
};

export default useDateFormatters;
