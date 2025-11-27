import { isSameDay, isSameMonth, isWeekend } from "date-fns";

import type {
  Theme,
  CalendarEvent,
  WallpaperConfig,
  ScaleFn,
  TextStyleFn,
} from "@/types";
import { formatWeekdayLabel } from "@/utils/date";
import { getAlignClasses } from "@/utils/style";

import EventCard from "./EventCard";
import DayHeader from "./DayHeader";

interface DayCellProps {
  day: Date;
  theme: Theme;
  config: WallpaperConfig;
  events: CalendarEvent[];
  accentColor: string;
  gridBorder: string | undefined;
  isMobile: boolean;
  scale: ScaleFn;
  textStyle: TextStyleFn;
  formatDay: (date: Date) => string;
  formatWeekday: (date: Date) => string;
  formatTime: (date: Date) => string;
}

interface WeekendVisualParams {
  theme: Theme;
  isWeekend: boolean;
  dimOutsideMonth: boolean;
}

interface WeekendVisualResult {
  backgroundColor?: string;
  textColor?: string;
}

const getWeekendVisuals = ({
  theme,
  isWeekend,
  dimOutsideMonth,
}: WeekendVisualParams): WeekendVisualResult => {
  if (!isWeekend || dimOutsideMonth) {
    return {};
  }

  switch (theme.weekendStyle) {
    case "soft-bg":
      return { backgroundColor: "rgba(0,0,0,0.02)" };
    case "tint-text":
      return {
        textColor: theme.accentClass.includes("rose") ? "#be123c" : "#854d0e",
      };
    case "highlight":
      return {
        backgroundColor:
          theme.id === "bubble-dream" || theme.id === "kawaii-notes"
            ? "rgba(255,255,255,0.4)"
            : "#fffbeb",
      };
    default:
      return {};
  }
};

const shouldShowWeekendDot = ({
  theme,
  isWeekend,
  dimOutsideMonth,
}: WeekendVisualParams) =>
  theme.weekendStyle === "dot-indicator" && isWeekend && !dimOutsideMonth;

const DayCell: React.FC<DayCellProps> = ({
  day,
  theme,
  config,
  events,
  accentColor,
  gridBorder,
  isMobile,
  scale,
  textStyle,
  formatDay,
  formatWeekday,
  formatTime,
}) => {
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, config.targetDate);
  const isWknd = isWeekend(day);

  // 是否淡化非本月的日期
  const dimOutsideMonth = config.viewMode === "month" && !isCurrentMonth;

  // 週末重點顯示
  const weekendVisuals = getWeekendVisuals({
    theme,
    isWeekend: isWknd,
    dimOutsideMonth,
  });

  // 週末是否顯示小圓點
  const showWeekdendDot = shouldShowWeekendDot({
    theme,
    isWeekend: isWknd,
    dimOutsideMonth,
  });

  return (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{
        padding: scale(6),
        borderTop: gridBorder,
        borderRight: gridBorder,
        opacity: dimOutsideMonth ? 0.3 : 1,
        backgroundColor: weekendVisuals.backgroundColor ?? "transparent",
        color: weekendVisuals.textColor,
      }}
    >
      <DayHeader
        theme={theme}
        layout={theme.dateLayout}
        dateNum={formatDay(day)}
        weekdayDisplay={formatWeekdayLabel(
          formatWeekday(day),
          config.locale,
          theme.weekdayCase
        )}
        isToday={isToday}
        dayAccentColor={isToday ? accentColor : "currentColor"}
        accentColor={accentColor}
        containerStyle={{ marginBottom: scale(8) }}
        align={getAlignClasses(config.gridAlign)}
        scale={scale}
        textStyle={textStyle}
      />
      {showWeekdendDot && (
        <span
          className="absolute rounded-full pointer-events-none z-20"
          style={{
            top: scale(6),
            right: scale(6),
            width: scale(6),
            height: scale(6),
            backgroundColor: accentColor,
            boxShadow: `0 0 ${scale(4)}px ${accentColor}33`,
          }}
        />
      )}
      <div
        className="flex-1 flex flex-col overflow-hidden relative z-10"
        style={{ marginTop: scale(2) }}
      >
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            index={index}
            theme={theme}
            isMobile={isMobile}
            viewMode={config.viewMode}
            accentColor={accentColor}
            scale={scale}
            textStyle={textStyle}
            formatTime={formatTime}
          />
        ))}
      </div>
    </div>
  );
};

export default DayCell;
