import { useState, useCallback } from "react";

import type { ThemeStyle, WallpaperConfig } from "@/types";
import { RESOLUTIONS, THEMES } from "@/constants";
import { detectDeviceResolution } from "@/utils/device";

const getInitialConfig = (): WallpaperConfig => {
  const initialResolution = detectDeviceResolution();

  return {
    resolution: initialResolution,
    width: RESOLUTIONS[initialResolution].width,
    height: RESOLUTIONS[initialResolution].height,
    theme: "minimal",
    customTitle: "",
    targetDate: new Date(),
    viewMode: "month",
    showMonthMiniature: true,
    fontScale: 1,
    accentColor: "#18181b",
    locale: "en-US",
    weekStart: "sunday",
    dateFormat: {
      gridWeekday: "short",
      gridDay: "number",
    },
    headerAlign: "left",
    gridAlign: "left",
    weekdayAlign: "left",
  };
};

const useWallpaperConfig = () => {
  const [config, setConfig] = useState<WallpaperConfig>(() =>
    getInitialConfig()
  );

  const updateConfig = useCallback((partial: Partial<WallpaperConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const setResolution = useCallback(
    (res: "desktop" | "mobile") => {
      updateConfig({
        resolution: res,
        width: RESOLUTIONS[res].width,
        height: RESOLUTIONS[res].height,
      });
    },
    [updateConfig]
  );

  const setTheme = useCallback(
    (newTheme: ThemeStyle) => {
      const themeDef = THEMES.find((t) => t.id === newTheme);

      updateConfig({
        theme: newTheme,
        accentColor: themeDef?.defaultAccent,
        headerAlign: themeDef?.headerAlign ?? "left",
        gridAlign: themeDef?.dateAlign ?? "left",
        weekdayAlign: themeDef?.dateAlign ?? "center",
      });
    },
    [updateConfig]
  );

  return { config, updateConfig, setResolution, setTheme };
};

export default useWallpaperConfig;
