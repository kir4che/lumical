import { useState, useCallback, useEffect, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Calendar, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { format } from "date-fns";

import type { CalendarEvent } from "@/types";
import useWallpaperConfig from "@/hooks/useWallpaperConfig";
import { useCalendarImport } from "@/hooks/useCalendarImport";
import { cn } from "@/utils/style";
import Header from "@/components/layout/Header";
import DesignPanel from "@/components/editor/DesignPanel";
import ImportPanel from "@/components/editor/ImportPanel";
import WallpaperPreview from "@/components/wallpaper";
import Button from "@/components/ui/Button";

const App = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { config, updateConfig, setResolution, setTheme } =
    useWallpaperConfig();

  // 當匯入事件後，自動把 targetDate 設定成第一筆事件的月份。
  const focusOnEvents = (parsedEvents: CalendarEvent[]) => {
    if (parsedEvents.length === 0) return;

    const sortedEvents = [...parsedEvents].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    const targetDate = new Date(sortedEvents[0].start);
    if (Number.isNaN(targetDate.getTime())) return;

    updateConfig({ targetDate });
  };

  const {
    events,
    step,
    isImporting,
    canUseGoogleImport,
    handleFileChange,
    handleGoogleImport,
    handleUseDemo,
    goBack,
  } = useCalendarImport({ onFocusEvents: focusOnEvents });

  const [isExporting, setIsExporting] = useState(false);

  // 控制 Preview 縮放，讓可視寬度 / 高度不超過父層（扣掉 padding)。
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const container = previewContainerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      if (!containerWidth || !containerHeight) return;
      if (!config.width || !config.height) return;

      const widthScale = containerWidth / config.width;
      const heightScale = containerHeight / config.height;

      const scale = Math.min(widthScale, heightScale, 1) * 0.98;
      setPreviewScale(scale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [config.width, config.height]);

  const handleDownload = useCallback(async () => {
    const node = document.getElementById("preview-content");
    if (!node || !(node instanceof HTMLElement)) {
      alert("Preview is not ready yet. Please try again.");
      return;
    }

    setIsExporting(true);
    try {
      const dataUrl = await toPng(node, {
        quality: 1.0,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: config.width,
        height: config.height,
      });
      const link = document.createElement("a");
      link.download = `lumical-${format(config.targetDate, "yyyy-MM")}-${
        config.theme
      }.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert("Could not generate image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [config.width, config.height, config.theme, config.targetDate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header step={step} />
      <main className="flex flex-1 overflow-y-auto flex-col md:flex-row md:overflow-hidden">
        {/* Editor */}
        <div className="w-full md:max-w-md md:flex-none bg-white border-b border-gray-200 overflow-y-auto p-6 flex flex-col gap-8 shadow z-20 md:border-b-0 md:border-r">
          {step === 1 && (
            <ImportPanel
              isLoading={isImporting}
              canUseGoogleImport={canUseGoogleImport}
              onGoogleImport={handleGoogleImport}
              onFileChange={handleFileChange}
              onUseDemo={handleUseDemo}
            />
          )}
          {step === 2 && (
            <DesignPanel
              config={config}
              updateConfig={updateConfig}
              setResolution={setResolution}
              setTheme={setTheme}
              onBack={goBack}
            />
          )}
        </div>
        {/* Preview */}
        <div className="flex-1 min-w-0 bg-gray-100 relative p-6 md:p-8">
          <div ref={previewContainerRef} className="size-full flex-center">
            <div className="flex flex-col gap-4 items-start">
              {step === 2 && (
                <Button
                  onClick={handleDownload}
                  variant={isDesktop ? "secondary" : "primary"}
                  isLoading={isExporting}
                  size={isDesktop ? "sm" : "md"}
                  disabled={events.length === 0}
                  icon={<Download size={24} />}
                  className={cn(
                    "self-start",
                    isDesktop
                      ? "bg-white hover:bg-white hover:shadow"
                      : "w-full order-2 mt-4"
                  )}
                >
                  Export
                </Button>
              )}
              <div
                className={cn("relative", {
                  "bg-white rounded-sm": step === 2,
                })}
                style={{
                  width: config.width * previewScale,
                  height: config.height * previewScale,
                }}
              >
                <div
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top left",
                    width: config.width,
                    height: config.height,
                  }}
                >
                  {events.length === 0 ? (
                    <div className="flex-center flex-col h-full gap-20 opacity-30">
                      <Calendar size={240} />
                      <p className="text-7xl">
                        Import your schedule to preview
                      </p>
                    </div>
                  ) : (
                    <WallpaperPreview
                      id="preview-content"
                      events={events}
                      config={config}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
