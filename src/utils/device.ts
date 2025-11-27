export const detectDeviceResolution = (): "desktop" | "mobile" =>
  typeof window !== "undefined" && window.innerWidth <= 768
    ? "mobile"
    : "desktop";
