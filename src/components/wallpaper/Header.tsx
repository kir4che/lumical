import type {
  ThemeDefinition,
  WallpaperConfig,
  ScaleFn,
  TextStyleFn,
} from "@/types";
import { cn } from "@/utils/style";

const HEADER_ALIGN_CLASS: Record<WallpaperConfig["headerAlign"], string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

interface HeaderProfile {
  isEditorial: boolean;
  isKawaii: boolean;
  isCyber: boolean;
  isVapor: boolean;
  titleSize: number;
  subSize: number;
  titleWeight: number;
}

const getHeaderProfile = (theme: ThemeDefinition): HeaderProfile => {
  const isEditorial =
    theme.id === "editorial-chic" || theme.id === "vintage-news";
  const isVapor = theme.id === "retro-vapor";
  const isKawaii = theme.id === "kawaii-notes";
  const isCyber = theme.id === "cyber-glitch";

  const titleSize = isEditorial ? 120 : isVapor ? 90 : 80;
  const subSize = isEditorial ? 20 : 18;
  const titleWeight =
    isEditorial || theme.fontHeading.includes("sans") ? 700 : 400;

  return {
    isEditorial,
    isKawaii,
    isCyber,
    isVapor,
    titleSize,
    subSize,
    titleWeight,
  };
};

const getHeaderTextShadow = (
  theme: ThemeDefinition,
  accentColor: string,
  profile: HeaderProfile
): string | undefined => {
  if (profile.isVapor) return `0 0 10px ${accentColor}`;
  if (theme.id === "pop-art") return "3px 3px 0px #000";
  if (profile.isKawaii) return "2px 2px 0px #fff";
  if (profile.isCyber)
    return [
      "2px 0px 0px rgba(255,0,0,0.5)",
      "-2px 0px 0px rgba(0,255,255,0.5)",
    ].join(", ");

  return undefined;
};

interface HeaderProps {
  theme: ThemeDefinition;
  config: WallpaperConfig;
  accentColor: string;
  paddingPage: number;
  paddingHeader: number;
  scale: ScaleFn;
  textStyle: TextStyleFn;
  formatMonth: (date: Date) => string;
  formatYear: (date: Date) => string;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  config,
  accentColor,
  paddingPage,
  paddingHeader,
  scale,
  textStyle,
  formatMonth,
  formatYear,
}) => {
  const alignClass = HEADER_ALIGN_CLASS[config.headerAlign];

  const titleString = formatMonth(config.targetDate);
  const yearString = formatYear(config.targetDate);

  const profile = getHeaderProfile(theme);
  const textShadow = getHeaderTextShadow(theme, accentColor, profile);

  const isVintageNews = theme.id === "vintage-news";

  return (
    <div
      className={cn("relative z-10 flex flex-col w-full", alignClass)}
      style={{
        padding: `${paddingHeader}px ${paddingPage}px ${scale(10)}px`,
      }}
    >
      {!profile.isEditorial && (
        <h2
          className={cn("uppercase opacity-60 mb-[0.2em]", theme.fontBody)}
          style={textStyle(profile.subSize, 500, 0.2)}
        >
          {yearString}
        </h2>
      )}

      <h1
        className={cn("leading-none", theme.fontHeading)}
        style={{
          ...textStyle(
            profile.titleSize,
            profile.titleWeight,
            profile.isEditorial ? -0.05 : -0.02
          ),
          color: accentColor,
          textShadow,
          borderBottom: isVintageNews ? `3px double ${accentColor}` : "none",
          paddingBottom: isVintageNews ? `${scale(10)}px` : 0,
        }}
      >
        {config.customTitle || titleString}
      </h1>

      {profile.isEditorial && (
        <div className="flex items-center gap-4 mt-4 w-full">
          <div className="h-0.5 bg-current grow opacity-20" />
          <h2
            className={cn("uppercase", theme.fontBody)}
            style={textStyle(profile.subSize * 1.5, 300, 0.3)}
          >
            {yearString}
          </h2>
          <div className="h-0.5 bg-current grow opacity-20" />
        </div>
      )}
    </div>
  );
};

export default Header;
