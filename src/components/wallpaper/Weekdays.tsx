import React from "react";
import { addDays } from "date-fns";
import { formatWeekdayLabel, startOfWeek } from "@/utils/date";
import type {
  ThemeDefinition,
  WallpaperConfig,
  ScaleFn,
  TextStyleFn,
} from "@/types";
import { cn } from "@/utils/style";

interface WeekdaysProps {
  theme: ThemeDefinition;
  config: WallpaperConfig;
  accentColor: string;
  paddingPage: number;
  gapGrid: number;
  gridBorder: string;
  scale: ScaleFn;
  textStyle: TextStyleFn;
  formatWeekday: (date: Date) => string;
}

const WEEKDAY_ALIGN_CLASS: Record<WallpaperConfig["weekdayAlign"], string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const Weekdays: React.FC<WeekdaysProps> = ({
  theme,
  config,
  accentColor,
  paddingPage,
  gapGrid,
  gridBorder,
  scale,
  textStyle,
  formatWeekday,
}) => {
  const start = startOfWeek(config.targetDate, config.weekStart);
  const weekSample = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div
      className="grid grid-cols-7 mb-2 shrink-0"
      style={{
        padding: `0 ${paddingPage}px`,
        gap: `${gapGrid}px`,
        marginBottom: `${scale(5)}px`,
        borderBottom: gridBorder,
        paddingBottom: `${scale(10)}px`,
      }}
    >
      {weekSample.map((date, index) => (
        <div
          key={index}
          className={cn(
            "opacity-60",
            `${WEEKDAY_ALIGN_CLASS[config.weekdayAlign]}`,
            theme.fontBody
          )}
          style={{
            ...textStyle(12, theme.id === "pop-art" ? 800 : 700, 0.1),
            color:
              theme.id === "retro-vapor"
                ? accentColor
                : theme.id === "pop-art"
                ? "#000"
                : undefined,
          }}
        >
          {formatWeekdayLabel(
            formatWeekday(date),
            config.locale,
            theme.weekdayCase
          )}
        </div>
      ))}
    </div>
  );
};

export default Weekdays;
