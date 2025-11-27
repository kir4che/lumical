import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/utils/style";
import type { Theme, GridAlignContext, ScaleFn, TextStyleFn } from "@/types";

interface DayHeaderProps {
  theme: Theme;
  layout: Theme["dateLayout"];
  dateNum: string;
  weekdayDisplay: string;
  isToday: boolean;
  dayAccentColor: string;
  accentColor: string;
  align: GridAlignContext;
  scale: ScaleFn;
  textStyle: TextStyleFn;
  containerStyle?: CSSProperties;
  className?: string;
}

const DayHeader: React.FC<DayHeaderProps> = ({
  theme,
  layout,
  dateNum,
  weekdayDisplay,
  isToday,
  dayAccentColor,
  accentColor,
  align,
  scale,
  textStyle,
  containerStyle,
  className,
}) => {
  const { rowJustify, colAlign, txtAlign, isCenter, isRight } = align;

  const flexContainer = (
    extraClassName?: string,
    extraStyle?: CSSProperties,
    children?: ReactNode
  ) => (
    <div
      className={cn(
        "relative flex w-full shrink-0",
        rowJustify,
        extraClassName,
        className
      )}
      style={{ ...containerStyle, ...extraStyle }}
    >
      {children}
    </div>
  );

  const renderers: Record<string, () => ReactNode> = {
    "comic-box": () =>
      flexContainer(
        undefined,
        undefined,
        <div className="border-2 border-black shadow-[2px_2px_0px_#000]">
          <span
            className={cn("inline-block", isToday && "text-white")}
            style={{
              ...textStyle(16, 800),
              backgroundColor: isToday ? accentColor : "#fff",
              padding: `${scale(2)}px ${scale(6)}px`,
            }}
          >
            {dateNum}
          </span>
        </div>
      ),
    "neon-sign": () =>
      flexContainer(
        "items-baseline",
        undefined,
        <span
          style={{
            ...textStyle(24, 700),
            color: isToday ? "#fff" : accentColor,
            textShadow: `0 0 ${isToday ? "15px" : "5px"} ${accentColor}`,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          {dateNum}
        </span>
      ),
    "big-left": () =>
      flexContainer(
        cn("items-baseline", txtAlign, theme.fontHeading),
        undefined,
        <>
          <span
            className="leading-[0.8]"
            style={{
              ...textStyle(36, 700),
              color: dayAccentColor,
            }}
          >
            {dateNum}
          </span>
          <span
            className="rotate-180 opacity-40 [writing-mode:vertical-rl]"
            style={{
              ...textStyle(10, 600, 0.1),
              marginLeft: scale(4),
            }}
          >
            {weekdayDisplay}
          </span>
        </>
      ),
    "badge-top": () =>
      flexContainer(
        undefined,
        { paddingTop: scale(4) },
        <div
          className={cn(
            "inline-flex items-center rounded-full shadow-sm",
            isToday ? "text-white" : "text-current border border-black/10"
          )}
          style={{
            gap: scale(4),
            padding: `${scale(2)}px ${scale(10)}px`,
            backgroundColor: isToday ? accentColor : "rgba(255,255,255,0.6)",
          }}
        >
          <span
            className={isToday ? "opacity-90" : "opacity-50"}
            style={textStyle(10, 700)}
          >
            {weekdayDisplay}
          </span>
          <span style={textStyle(12, 700)}>{dateNum}</span>
        </div>
      ),
    inline: () =>
      flexContainer(
        cn("items-baseline border-b border-black/5", txtAlign),
        { paddingBottom: scale(6) },
        <>
          <span
            className="opacity-50"
            style={{
              ...textStyle(10, 600, 0.1),
              marginRight: scale(6),
            }}
          >
            {weekdayDisplay}
          </span>
          <span
            style={{
              ...textStyle(20, 600),
              color: dayAccentColor,
            }}
          >
            {dateNum}
          </span>
        </>
      ),
    stacked: () =>
      flexContainer(
        cn("flex-col", colAlign),
        { gap: 0 },
        <>
          <span
            className="opacity-40"
            style={{
              ...textStyle(9, 600, 0.2),
              marginBottom: scale(2),
            }}
          >
            {weekdayDisplay}
          </span>
          <span
            className={cn("leading-1", theme.fontHeading)}
            style={{
              ...textStyle(28, 700),
              color: dayAccentColor,
            }}
          >
            {dateNum}
          </span>
        </>
      ),
    "background-ghost": () => {
      const ghostStyle: CSSProperties = {
        position: "absolute",
        top: scale(-10),
        ...textStyle(80, 800),
        color: dayAccentColor,
        opacity: 0.025,
        pointerEvents: "none",
        lineHeight: 1,
        zIndex: 0,
      };

      if (isCenter) {
        ghostStyle.left = "50%";
        ghostStyle.transform = "translateX(-50%)";
      } else if (isRight) {
        ghostStyle.right = scale(-4);
      } else {
        ghostStyle.left = scale(-4);
      }

      return (
        <div
          className={cn("relative w-full shrink-0", className)}
          style={{
            ...containerStyle,
            height: scale(40),
            marginBottom: scale(6),
          }}
        >
          <div style={ghostStyle}>{dateNum}</div>
          <div
            className={cn("relative z-10 flex", rowJustify, txtAlign)}
            style={{
              paddingTop: scale(8),
              paddingLeft: scale(8),
              paddingRight: scale(8),
            }}
          >
            <span style={textStyle(20, 700)}>{dateNum}</span>
            <span
              className="opacity-50"
              style={{
                ...textStyle(9, 500, 0.1),
                marginLeft: scale(4),
              }}
            >
              {weekdayDisplay}
            </span>
          </div>
        </div>
      );
    },
    "minimal-corner": () =>
      flexContainer(
        cn("flex-col items-start", txtAlign),
        { paddingTop: scale(2) },
        <>
          <span
            style={{
              ...textStyle(20, 700, 0.05),
              color: dayAccentColor,
            }}
          >
            {dateNum}
          </span>
          <span className="opacity-50" style={textStyle(8, 600, 0.3)}>
            {weekdayDisplay}
          </span>
        </>
      ),
    "tag-right": () => {
      const posStyle: CSSProperties = { top: 0 };

      if (isCenter) {
        posStyle.left = "50%";
        posStyle.transform = "translateX(-50%)";
      } else if (isRight) {
        posStyle.right = 0;
      } else {
        posStyle.left = 0;
      }

      const borderRadius: CSSProperties = isCenter
        ? {
            borderBottomLeftRadius: scale(10),
            borderBottomRightRadius: scale(10),
          }
        : isRight
        ? { borderBottomLeftRadius: scale(10) }
        : { borderBottomRightRadius: scale(10) };

      return (
        <div
          className={cn("pointer-events-none absolute z-20", className)}
          style={posStyle}
        >
          <div
            className="flex flex-col items-center bg-white border border-black/10 shadow-sm"
            style={{
              borderTop: `${scale(4)}px solid ${
                isToday ? accentColor : "transparent"
              }`,
              padding: `${scale(6)}px ${scale(8)}px`,
              ...borderRadius,
            }}
          >
            <span
              style={{
                ...textStyle(8, 700),
                opacity: 0.5,
              }}
            >
              {weekdayDisplay}
            </span>
            <span className="text-gray-900" style={textStyle(18, 800)}>
              {dateNum}
            </span>
          </div>
        </div>
      );
    },
    "circle-floating": () =>
      flexContainer(
        undefined,
        {
          paddingTop: scale(4),
          marginBottom: scale(4),
        },
        <div className="flex items-center justify-center rounded-full font-bold">
          <span
            className={cn(isToday && "text-white")}
            style={{
              ...textStyle(14, 700),
              width: scale(30),
              height: scale(30),
              backgroundColor: isToday ? accentColor : "transparent",
              boxShadow: isToday
                ? `0 ${scale(2)}px ${scale(8)}px ${accentColor}66`
                : "none",
              border: isToday
                ? "none"
                : `1px solid ${
                    theme.id === "bubble-dream"
                      ? `${accentColor}40`
                      : `${accentColor}20`
                  }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {dateNum}
          </span>
        </div>
      ),
    default: () =>
      flexContainer(
        txtAlign,
        undefined,
        <span
          style={{
            ...textStyle(20, 700),
            color: dayAccentColor,
          }}
        >
          {dateNum}
        </span>
      ),
  };

  const renderer = renderers[layout] ?? renderers.default;
  return renderer();
};

export default DayHeader;
