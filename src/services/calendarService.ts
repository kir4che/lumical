import { addHours } from "date-fns";
import type { CalendarDateField, CalendarEvent } from "@/types";
import {
  createTempId,
  getDefaultTimeRange,
  getLineValue,
  parseCalendarDateField,
  parseICSDate,
} from "@/utils/date";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_CALENDAR_ENDPOINT =
  "https://www.googleapis.com/calendar/v3/calendars";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

const isBrowser = typeof window !== "undefined";
let googleScriptPromise: Promise<void> | null = null;
let tokenClient: GoogleTokenClient | null = null;

/**
 * 確保 Google Identity Services (GIS) 的 script 已經載入。
 * 已載入直接返回；否則建立 <script> 並動態加入。
 */
const ensureGoogleScript = async () => {
  if (!isBrowser)
    throw new Error("Google import is only available in the browser.");

  // 若 GIS 已存在，跳過載入
  if (window.google?.accounts?.oauth2) return;

  // 避免重複建立 script：只建立一次 Promise
  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        googleScriptPromise = null;
        reject(new Error("Failed to load Google Identity Services script."));
      };
      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
};

/** 取得 Vite 的 Google Client ID，若沒設定就拋錯 */
const getGoogleClientId = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId)
    throw new Error(
      "Missing VITE_GOOGLE_CLIENT_ID. Please set it in your environment file."
    );
  return clientId;
};

// 建立 Google Token Client 用於請求 access_token
const ensureTokenClient = async () => {
  await ensureGoogleScript();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) throw new Error("Google Identity Services is not available.");

  // 只初始化一次
  if (!tokenClient)
    tokenClient = oauth2.initTokenClient({
      client_id: getGoogleClientId(),
      scope: GOOGLE_SCOPE,
      callback: () => {}, // 真正 callback 會在 requestGoogleAccessToken 裡覆蓋
    });

  return tokenClient;
};

// 透過 TokenClient 觸發 Google 授權視窗，並取得 access_token。
const requestGoogleAccessToken = async () => {
  const client = await ensureTokenClient();

  return new Promise<string>((resolve, reject) => {
    // 授權成功
    client.callback = (res) => {
      if (res.error || !res.access_token) {
        reject(
          new Error(
            res.error_description ||
              res.error ||
              "Failed to retrieve Google access token."
          )
        );
        return;
      }
      resolve(res.access_token);
    };

    // 授權失敗或取消
    client.error_callback = (err) => {
      reject(
        new Error(
          err.error_description ||
            err.error ||
            "Google authorization was cancelled."
        )
      );
    };

    // 觸發登入 / 授權
    client.requestAccessToken();
  });
};

interface GoogleCalendarEventDate extends CalendarDateField {
  timeZone?: string;
}

interface GoogleCalendarEvent {
  id?: string;
  summary?: string;
  description?: string;
  location?: string;
  colorId?: string;
  organizer?: { email?: string };
  start?: GoogleCalendarEventDate;
  end?: GoogleCalendarEventDate;
}

interface GoogleCalendarResponse {
  items?: GoogleCalendarEvent[];
}

// 將 Google Calendar API 回傳的事件轉成 CalendarEvent
const mapGoogleEvent = (
  raw: GoogleCalendarEvent,
  fallbackCalendarId: string
): CalendarEvent | null => {
  const start = parseCalendarDateField(raw.start);
  if (!start || Number.isNaN(start.getTime())) return null;

  const end = parseCalendarDateField(raw.end) ?? addHours(start, 1);
  const title = (raw.summary || "Untitled Event").trim();

  return {
    id: raw.id || createTempId(),
    title: title || "Untitled Event",
    start,
    end,
    isAllDay: Boolean(raw.start?.date && !raw.start?.dateTime),
    location: raw.location || undefined,
    description: raw.description || undefined,
    color: raw.colorId,
    timezone: raw.start?.timeZone || raw.end?.timeZone,
    sourceEventId: raw.id,
    calendarId: raw.organizer?.email || fallbackCalendarId,
    source: "google",
  };
};

interface GoogleImportOptions {
  calendarId?: string; // 預設 primary
  timeMin?: Date;
  timeMax?: Date;
  maxResults?: number;
}

// 解析 iCalendar (.ics) 格式，轉換成 CalendarEvent[]。
export const parseICS = (icsContent: string): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const lines = icsContent.split(/\r\n|\n|\r/);

  let currEvent: Partial<CalendarEvent> | null = null;

  // 依行解析 .ics
  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      // 新事件
      currEvent = {
        id: createTempId(),
        isAllDay: false,
        source: "manual",
      };
    } else if (line.startsWith("END:VEVENT")) {
      // 結束事件 → 推入結果
      if (currEvent && currEvent.title && currEvent.start) {
        if (!currEvent.end) currEvent.end = addHours(currEvent.start, 1);
        events.push(currEvent as CalendarEvent);
      }
      currEvent = null;
    } else if (currEvent) {
      if (line.startsWith("SUMMARY"))
        currEvent.title = getLineValue(line) || "Untitled Event";
      else if (line.startsWith("DTSTART")) {
        currEvent.start = parseICSDate(line);
        if (!line.includes("T")) currEvent.isAllDay = true;
      } else if (line.startsWith("DTEND")) currEvent.end = parseICSDate(line);
      else if (line.startsWith("LOCATION")) {
        const location = getLineValue(line);
        if (location) currEvent.location = location;
      }
    }
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
};

// 使用 Google Calendar API 匯入事件
export const importGoogleCalendarEvents = async (
  options: GoogleImportOptions = {}
): Promise<CalendarEvent[]> => {
  const accessToken = await requestGoogleAccessToken();
  const calendarId = options.calendarId ?? "primary";

  const { start, end } = getDefaultTimeRange();
  const timeMin = options.timeMin ?? start;
  const timeMax = options.timeMax ?? end;
  const maxResults = options.maxResults ?? 2500;

  const params = new URLSearchParams({
    singleEvents: "true",
    orderBy: "startTime",
    timeMin: timeMin.toISOString(),
    maxResults: String(maxResults),
  });
  if (timeMax) params.set("timeMax", timeMax.toISOString());

  const res = await fetch(
    `${GOOGLE_CALENDAR_ENDPOINT}/${encodeURIComponent(
      calendarId
    )}/events?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const payload = (await res.json()) as GoogleCalendarResponse & {
    error?: { message?: string };
  };

  if (!res.ok)
    throw new Error(
      payload.error?.message ||
        "Failed to fetch Google Calendar events. Please try again."
    );

  // 轉換成內部事件格式
  const parsed = (payload.items ?? [])
    .map((event) => mapGoogleEvent(event, calendarId))
    .filter((event): event is CalendarEvent => Boolean(event));

  return parsed.sort((a, b) => a.start.getTime() - b.start.getTime());
};
