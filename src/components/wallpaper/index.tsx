import { useMemo, useCallback } from "react";
import { eachDayOfInterval, addDays } from "date-fns";
import type { CalendarEvent, WallpaperConfig } from "@/types";
import { THEMES } from "@/constants";
import useDateFormatters from "@/hooks/useDateFormatters";
import { startOfWeek } from "@/utils/date";
import { cn, getGridBorderStyle, normalizeHex } from "@/utils/style";
import DayCell from "./DayCell";
import Decorators from "./Decorators";
import Header from "./Header";
import Weekdays from "./Weekdays";

interface WallpaperPreviewProps {
  id: string;
  events: CalendarEvent[];
  config: WallpaperConfig;
}

const WallpaperPreview: React.FC<WallpaperPreviewProps> = ({
  id,
  events,
  config,
}) => {
  // 依設定取得主題與重點色
  const theme = useMemo(
    () => THEMES.find((t) => t.id === config.theme) || THEMES[0],
    [config.theme]
  );
  const accentColor = useMemo(
    () => normalizeHex(config.accentColor, "#4f46e5"),
    [config.accentColor]
  );

  const { formatMonth, formatYear, formatWeekday, formatDay, formatTime } =
    useDateFormatters(config);

  // 避免尺寸為 0 造成 layout 跑掉
  const safeWidth = Math.max(config.width, 1);
  const safeHeight = Math.max(config.height, 1);
  const isMobile = safeWidth < safeHeight;

  // 以 1080 為準縮放，確保不同螢幕大小顯示一致性。
  const baseRef = 1080;
  const scaleFactor = useMemo(
    () => Math.min(safeWidth / baseRef, safeHeight / baseRef),
    [safeWidth, safeHeight]
  );

  // 將原始 px 依比例縮放
  const scale = useCallback(
    (px: number) => Math.round(px * scaleFactor * config.fontScale),
    [scaleFactor, config.fontScale]
  );

  // 產生文字 style
  const textStyle = useCallback(
    (
      size: number,
      weight: number = 400,
      spacing: number = 0
    ): React.CSSProperties => ({
      fontSize: `${scale(size)}px`,
      fontWeight: weight,
      letterSpacing: `${spacing}em`,
      lineHeight: 1.2,
    }),
    [scale]
  );

  // 依視圖型態取得日期範圍
  const displayDays = useMemo(() => {
    const buildRange = () => {
      switch (config.viewMode) {
        case "month": {
          const year = config.targetDate.getFullYear();
          const month = config.targetDate.getMonth();
          const monthStart = new Date(year, month, 1);
          const start = startOfWeek(monthStart, config.weekStart);
          const daysInView = 42;
          let end = addDays(start, daysInView - 1);
          const fifthWeekStart = addDays(start, 35);
          if (fifthWeekStart.getMonth() !== month) end = addDays(start, 34);
          return { start, end };
        }
        case "2-week": {
          const start = startOfWeek(config.targetDate, config.weekStart);
          return { start, end: addDays(start, 13) };
        }
        default: {
          const start = startOfWeek(config.targetDate, config.weekStart);
          return { start, end: addDays(start, 6) };
        }
      }
    };

    const { start, end } = buildRange();
    return eachDayOfInterval({ start, end });
  }, [config.targetDate, config.viewMode, config.weekStart]);

  // 依日期將事件分類
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = event.start.toDateString();
      const list = map.get(key);
      if (list) list.push(event);
      else map.set(key, [event]);
    }
    return map;
  }, [events]);

  // 取得指定日期的事件列表
  const getEventsForDay = useCallback(
    (date: Date) => eventsByDay.get(date.toDateString()) ?? [],
    [eventsByDay]
  );

  // 計算 layout 相關數值
  const layoutMetrics = useMemo(() => {
    const paddingPage = scale(isMobile ? 30 : 50);
    const paddingHeader = scale(isMobile ? 30 : 50);
    const gapGrid = scale(isMobile ? 4 : 10);
    return { paddingPage, paddingHeader, gapGrid };
  }, [scale, isMobile]);

  const { paddingPage, paddingHeader, gapGrid } = layoutMetrics;

  // 計算格線樣式
  const gridBorder = useMemo(
    () => getGridBorderStyle(theme, accentColor),
    [theme, accentColor]
  );

  // 計算需要的列數（天數 / 7）
  const rowCount = useMemo(
    () => Math.ceil(displayDays.length / 7),
    [displayDays.length]
  );

  return (
    <div
      id={id}
      className={cn(
        "relative overflow-hidden",
        !theme.bgClass.startsWith("#") ? theme.bgClass : "",
        theme.textClass
      )}
      style={{
        width: safeWidth,
        height: safeHeight,
        backgroundColor: theme.bgClass.startsWith("#")
          ? theme.bgClass
          : undefined,
      }}
    >
      <div className="absolute inset-0 z-0" style={{ ...theme.customCSS }}>
        <Decorators theme={theme} accentColor={accentColor} scale={scale} />
      </div>
      <div className="relative flex flex-col size-full z-10">
        {/* 標題 */}
        <Header
          theme={theme}
          config={config}
          accentColor={accentColor}
          paddingPage={paddingPage}
          paddingHeader={paddingHeader}
          scale={scale}
          textStyle={textStyle}
          formatMonth={formatMonth}
          formatYear={formatYear}
        />
        {/* 星期列 */}
        <Weekdays
          theme={theme}
          config={config}
          accentColor={accentColor}
          paddingPage={paddingPage}
          gapGrid={gapGrid}
          gridBorder={gridBorder}
          scale={scale}
          textStyle={textStyle}
          formatWeekday={formatWeekday}
        />
        {/* 日期格子 */}
        <div
          className="flex-1 overflow-hidden min-h-0"
          style={{ padding: `0 ${paddingPage}px ${paddingPage}px` }}
        >
          <div
            className="grid grid-cols-7 size-full"
            style={{
              gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
              borderLeft: gridBorder,
              borderBottom: gridBorder,
            }}
          >
            {displayDays.map((day) => (
              <DayCell
                key={day.toISOString()}
                day={day}
                theme={theme}
                config={config}
                events={getEventsForDay(day)}
                accentColor={accentColor}
                gridBorder={gridBorder}
                isMobile={isMobile}
                scale={scale}
                textStyle={textStyle}
                formatDay={formatDay}
                formatWeekday={formatWeekday}
                formatTime={formatTime}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperPreview;
