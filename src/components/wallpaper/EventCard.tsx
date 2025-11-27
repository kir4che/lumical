import type { FC, CSSProperties } from "react";
import type { Theme, CalendarEvent, ScaleFn, TextStyleFn } from "@/types";

interface EventCardProps {
  event: CalendarEvent;
  index: number;
  theme: Theme;
  isMobile: boolean;
  viewMode: "month" | "week" | "2-week";
  accentColor: string;
  scale: ScaleFn;
  textStyle: TextStyleFn;
  formatTime: (date: Date) => string;
}

const EventCard: FC<EventCardProps> = ({
  event,
  index,
  theme,
  isMobile,
  viewMode,
  accentColor,
  scale,
  textStyle,
  formatTime,
}) => {
  const bauhausColors = ["#ef4444", "#3b82f6", "#eab308", "#18181b"];

  const variantMap: Record<Theme["cardStyle"], CSSProperties> = {
    "bauhaus-block": {
      backgroundColor: bauhausColors[index % bauhausColors.length],
      borderRadius: "0px",
      color: "#fff",
    },
    comic: {
      backgroundColor: "#fff",
      border: "2px solid #000",
      boxShadow: "3px 3px 0px #000",
      borderRadius: `${scale(2)}px`,
      color: "#000",
    },
    polaroid: {
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
      color: "#333",
    },
    glass: {
      backgroundColor: "rgba(255,255,255,0.4)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.6)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      borderRadius: `${scale(10)}px`,
      color: theme.id === "midnight-whisper" ? "#fff" : "#4c1d95",
    },
    neon: {
      backgroundColor: "rgba(0,0,0,0.6)",
      border: `1px solid ${accentColor}`,
      boxShadow: `0 0 5px ${accentColor}40`,
      color: "#fff",
    },
    solid: {
      backgroundColor: "#f4f4f5",
      color: "#27272a",
    },
    outline: {
      backgroundColor:
        theme.id === "lux-gold"
          ? "rgba(255,255,255,0.05)"
          : theme.id === "cyber-glitch"
          ? "rgba(0,255,0,0.05)"
          : "rgba(255,255,255,0.7)",
      border:
        theme.id === "vintage-news"
          ? "1px dashed rgba(0,0,0,0.2)"
          : `1px solid ${accentColor}40`,
      color: "currentColor",
    },
    sticker: {
      backgroundColor: "#fff",
      boxShadow: "2px 2px 0px rgba(0,0,0,0.05)",
      border: "2px solid #fff",
      borderRadius: `${scale(8)}px`,
      borderLeft: `${scale(5)}px solid ${accentColor}`,
    },
    "soft-shadow": {
      backgroundColor: "rgba(255,255,255,0.9)",
      boxShadow: `0 ${scale(1)}px ${scale(4)}px rgba(0,0,0,0.04)`,
    },
    marker: {
      backgroundColor: "#fff9db",
      borderLeft: `${scale(6)}px solid ${accentColor}`,
      boxShadow: `0 ${scale(1)}px ${scale(3)}px rgba(0,0,0,0.03)`,
    },
    plain: {
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
    },
  };

  const showDetails =
    (viewMode === "week" || viewMode === "2-week") && !isMobile;

  const timeStr = event.isAllDay ? "" : formatTime(event.start);

  return (
    <div
      className="relative w-full shrink-0 mb-3 px-4 pt-2 pb-2.5 overflow-hidden transition-transform duration-200"
      style={{
        borderRadius: `${scale(4)}px`,
        ...(variantMap[theme.cardStyle] ?? {
          backgroundColor: "#fafafa",
          borderLeft: `${scale(3)}px solid ${accentColor}`,
          borderRadius: `${scale(2)}px`,
        }),
      }}
    >
      <div className="flex items-baseline justify-between gap-1">
        <span className="truncate tracking-wide" style={textStyle(12, 600)}>
          {event.title}
        </span>
        {timeStr && (
          <span
            className="whitespace-nowrap opacity-80"
            style={textStyle(9, 400)}
          >
            {timeStr}
          </span>
        )}
      </div>
      {showDetails && event.location && (
        <div className="mt-1 truncate opacity-60" style={textStyle(9, 400)}>
          📍 {event.location}
        </div>
      )}
    </div>
  );
};

export default EventCard;
