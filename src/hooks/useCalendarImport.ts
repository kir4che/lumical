import { useState } from "react";

import type { CalendarEvent } from "@/types";
import { MOCK_ICS_DATA } from "@/constants";
import {
  parseICS,
  importGoogleCalendarEvents,
} from "@/services/calendarService";

type UseCalendarImportParams = {
  onFocusEvents: (events: CalendarEvent[]) => void;
};

export const useCalendarImport = ({
  onFocusEvents,
}: UseCalendarImportParams) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [isImporting, setIsImporting] = useState(false);
  const canUseGoogleImport = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  // 套用 import 的事件
  const applyImportedEvents = (importedEvents: CalendarEvent[]) => {
    setEvents(importedEvents);
    onFocusEvents(importedEvents);
    setStep(2);
  };

  // 處理使用者選擇 .ics 檔
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;

      if (typeof result !== "string") {
        alert("Unsupported file content. Please upload a valid .ics file.");
        return;
      }

      try {
        const parsedEvents = parseICS(result); // 解析 ICS
        applyImportedEvents(parsedEvents);
      } catch (err: unknown) {
        console.error("Failed to parse ICS file", err);
        alert("Invalid calendar file. Please check the file and try again.");
      }
    };

    reader.onerror = () => {
      console.error("FileReader error", reader.error);
      alert("Failed to read the file. Please try again.");
    };

    // 開始讀取 .ics 檔案（純文字）
    reader.readAsText(file);
  };

  // 模擬 import Google Calendar
  const handleGoogleImport = async () => {
    if (!canUseGoogleImport) {
      alert(
        "Google Calendar import is not configured. Please set VITE_GOOGLE_CLIENT_ID first."
      );
      return;
    }

    setIsImporting(true);
    try {
      const importedEvents = await importGoogleCalendarEvents();
      if (importedEvents.length === 0)
        alert(
          "No events found in your Google Calendar for the selected window."
        );
      else applyImportedEvents(importedEvents);
    } catch (err: unknown) {
      console.error("Google import failed", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to import from Google Calendar."
      );
    } finally {
      setIsImporting(false);
    }
  };

  // 使用 Demo ICS
  const handleUseDemo = () => {
    try {
      const parsedEvents = parseICS(MOCK_ICS_DATA);
      applyImportedEvents(parsedEvents);
    } catch (err: unknown) {
      console.error("Failed to parse demo ICS data", err);
      alert("Demo data is invalid. Please contact support.");
    }
  };

  // 回到 import 畫面
  const goBack = () => setStep(1);

  return {
    events,
    step,
    isImporting,
    canUseGoogleImport,
    handleFileChange,
    handleGoogleImport,
    handleUseDemo,
    goBack,
  };
};
