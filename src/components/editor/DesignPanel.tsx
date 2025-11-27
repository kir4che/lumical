import { useMemo } from "react";
import {
  ChevronLeft,
  Palette,
  Smartphone,
  Monitor,
  Clock,
  Layout,
  Languages,
} from "lucide-react";

import type { ThemeStyle, WallpaperConfig, WeekStartOption } from "@/types";
import {
  LOCALES,
  THEMES,
  ACCENT_COLORS,
  VIEW_MODES,
  WEEK_START_OPTIONS,
  MONTHS,
} from "@/constants";
import {
  getMonthLabels,
  getWeekOptions,
  getYearRange,
  startOfWeek,
  toDate,
} from "@/utils/date";
import { cn, getContrastColor } from "@/utils/style";
import AlignToggleBtn from "@/components/editor/AlignToggleBtn";
import Button from "@/components/ui/Button";
import SelectField from "@/components/ui/SelectField";

interface DesignPanelProps {
  config: WallpaperConfig;
  updateConfig: (partial: Partial<WallpaperConfig>) => void;
  setResolution: (resolution: "desktop" | "mobile") => void;
  setTheme: (theme: ThemeStyle) => void;
  onBack: () => void;
}

const DesignPanel: React.FC<DesignPanelProps> = ({
  config,
  updateConfig,
  setResolution,
  setTheme,
  onBack,
}) => {
  const {
    dateFormat,
    resolution,
    viewMode,
    weekStart,
    locale,
    headerAlign,
    gridAlign,
    weekdayAlign,
    customTitle,
    accentColor,
  } = config;

  const targetDate = useMemo(
    () => toDate(config.targetDate as Date | string),
    [config.targetDate]
  );

  const years = useMemo(
    () => getYearRange(targetDate.getFullYear(), 11),
    [targetDate]
  );

  const monthLabels = useMemo(() => getMonthLabels(locale, MONTHS), [locale]);

  const weekOptions = useMemo(
    () => getWeekOptions(targetDate, locale, weekStart),
    [targetDate, locale, weekStart]
  );

  const updateTargetMonth = (monthIndex: number) => {
    const newDate = new Date(targetDate);
    newDate.setDate(1);
    newDate.setMonth(monthIndex);
    updateConfig({ targetDate: newDate });
  };

  const updateTargetYear = (year: number) => {
    const newDate = new Date(targetDate);
    newDate.setFullYear(year, newDate.getMonth(), 1);
    updateConfig({ targetDate: newDate });
  };

  const updateTargetWeek = (weekStartMs: string) => {
    const ms = Number(weekStartMs);
    if (Number.isNaN(ms)) return;
    updateConfig({ targetDate: new Date(ms) });
  };

  return (
    <div className="space-y-6">
      <div className="flex-between-center">
        <h2 className="text-2xl font-bold">Editor</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={18} />
          Back
        </Button>
      </div>
      <div className="space-y-6">
        <section className="space-y-4">
          <label className="section-label">
            <Layout size={12} /> Device
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setResolution("desktop")}
              className={cn(
                "p-2 rounded-lg border text-xs font-medium flex-center gap-2 transition-all",
                resolution === "desktop"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
              aria-pressed={resolution === "desktop"}
            >
              <Monitor size={12} /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setResolution("mobile")}
              className={cn(
                "p-2 rounded-lg border text-xs font-medium flex-center gap-2 transition-all",
                resolution === "mobile"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
              aria-pressed={resolution === "mobile"}
            >
              <Smartphone size={12} /> Mobile
            </button>
          </div>
        </section>
        <section className="space-y-4">
          <label className="section-label">
            <Clock size={12} /> Timeframe
          </label>

          <div className="grid grid-cols-2 gap-2">
            <SelectField
              value={targetDate.getFullYear()}
              onChange={(e) => updateTargetYear(parseInt(e.target.value, 10))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </SelectField>
            <SelectField
              value={targetDate.getMonth()}
              onChange={(e) => updateTargetMonth(parseInt(e.target.value, 10))}
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {monthLabels[m]}
                </option>
              ))}
            </SelectField>
          </div>
          <div className="space-y-2">
            <div className="flex bg-white p-1 rounded-md">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateConfig({ viewMode: mode })}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-medium rounded-md capitalize",
                    viewMode === mode
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  aria-pressed={viewMode === mode}
                >
                  {mode.replace("-", " ")}
                </button>
              ))}
            </div>
            <SelectField
              label="Week starts on"
              value={weekStart}
              onChange={(e) =>
                updateConfig({ weekStart: e.target.value as WeekStartOption })
              }
            >
              {WEEK_START_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SelectField>
          </div>
          {viewMode !== "month" && (
            <SelectField
              label="Week of"
              value={startOfWeek(targetDate, weekStart).getTime().toString()}
              onChange={(e) => updateTargetWeek(e.target.value)}
            >
              {weekOptions.map((w) => (
                <option
                  key={w.date.getTime()}
                  value={w.date.getTime().toString()}
                >
                  {w.label}
                </option>
              ))}
            </SelectField>
          )}
        </section>
        <section className="space-y-4">
          <label className="section-label">
            <Palette size={12} /> Style
          </label>
          <div className="space-y-3">
            <div>
              <div className="flex-between-center gap-2">
                <span className="flex items-center gap-2 text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                  <Languages size={12} />
                  Language &amp; Format
                </span>
              </div>
              <SelectField
                value={locale}
                onChange={(e) => updateConfig({ locale: e.target.value })}
              >
                {LOCALES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </SelectField>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="sub-label">Weekday label</label>
                <select
                  className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white"
                  value={dateFormat.gridWeekday}
                  onChange={(e) =>
                    updateConfig({
                      dateFormat: {
                        ...dateFormat,
                        gridWeekday: e.target
                          .value as typeof dateFormat.gridWeekday,
                      },
                    })
                  }
                >
                  <option value="long">Full (Monday)</option>
                  <option value="short">Short (Mon)</option>
                  <option value="narrow">Narrow (M)</option>
                </select>
              </div>
              <div>
                <label className="sub-label">Date number</label>
                <select
                  className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white"
                  value={dateFormat.gridDay}
                  onChange={(e) =>
                    updateConfig({
                      dateFormat: {
                        ...dateFormat,
                        gridDay: e.target.value as typeof dateFormat.gridDay,
                      },
                    })
                  }
                >
                  <option value="number">1</option>
                  <option value="padded">01</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">
              Theme
            </span>
            <div className="flex flex-wrap gap-2 w-fit">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-2",
                    config.theme === t.id
                      ? "bg-gray-100 border-gray-900 shadow transform scale-105"
                      : "bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  )}
                  aria-pressed={config.theme === t.id}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor: t.defaultAccent ?? "#B6B6B6",
                    }}
                  />
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <AlignToggleBtn
              label="Title Align"
              value={headerAlign}
              onChange={(v) => updateConfig({ headerAlign: v })}
            />
            <AlignToggleBtn
              label="Grid Align"
              value={gridAlign}
              onChange={(v) => updateConfig({ gridAlign: v })}
            />
            <AlignToggleBtn
              label="Wkday Align"
              value={weekdayAlign}
              onChange={(v) => updateConfig({ weekdayAlign: v })}
            />
          </div>
          <div>
            <input
              type="text"
              value={customTitle}
              placeholder="Custom Title"
              onChange={(e) => updateConfig({ customTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => updateConfig({ accentColor: color })}
                className={cn(
                  "size-5 rounded-full border border-gray-200 transition-transform hover:scale-110",
                  accentColor === color && "ring-2 ring-offset-2 ring-gray-900"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Accent color ${color}`}
                aria-pressed={accentColor === color}
              />
            ))}
            <label
              className="relative size-5 flex-center rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
              style={{
                backgroundColor: accentColor,
              }}
            >
              <span
                className="text-sm font-medium pointer-events-none select-none mb-0.5"
                style={{
                  color: getContrastColor(accentColor),
                }}
              >
                +
              </span>
              <input
                type="color"
                className="absolute inset-0 opacity-0 size-full cursor-pointer"
                value={accentColor}
                onChange={(e) => updateConfig({ accentColor: e.target.value })}
                aria-label="Custom accent color"
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignPanel;
