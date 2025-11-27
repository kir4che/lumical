import type { ReactElement } from "react";
import type { ThemeDefinition, ScaleFn } from "@/types";
import { hexWithAlpha } from "@/utils/style";

interface DecoratorsProps {
  theme: ThemeDefinition;
  accentColor: string;
  scale: ScaleFn;
}

const Decorators: React.FC<DecoratorsProps> = ({
  theme,
  accentColor,
  scale,
}) => {
  const decorator = theme.decorator ?? "none";
  if (decorator === "none") return null;

  const renderer = DECORATOR_RENDERERS[decorator];
  if (!renderer) return null;

  return renderer({
    baseClassName: "pointer-events-none absolute inset-0 size-full",
    accentColor,
    scale,
  });
};

export default Decorators;

interface DecoratorContext {
  baseClassName: string;
  accentColor: string;
  scale: ScaleFn;
}

type DecoratorRenderer = (ctx: DecoratorContext) => ReactElement | null;

const DECORATOR_RENDERERS: Partial<
  Record<NonNullable<ThemeDefinition["decorator"]>, DecoratorRenderer>
> = {
  "soft-gradient": ({ baseClassName, accentColor }) => (
    <div
      className={baseClassName}
      style={{
        background: `linear-gradient(135deg, ${hexWithAlpha(
          accentColor,
          0.3
        )}, transparent 70%)`,
      }}
    />
  ),
  "grid-lines": ({ baseClassName, accentColor, scale }) => (
    <div
      className={baseClassName}
      style={{
        backgroundImage: `linear-gradient(${hexWithAlpha(
          accentColor,
          0.12
        )} 1px, transparent 1px), linear-gradient(90deg, ${hexWithAlpha(
          accentColor,
          0.12
        )} 1px, transparent 1px)`,
        backgroundSize: `${scale(40)}px ${scale(40)}px`,
      }}
    />
  ),
  "bubble-gradient": ({ baseClassName }) => (
    <div className={baseClassName}>
      <div
        className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 114, 182, 0.25) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-[10%] -right-[10%] w-[80%] h-[60%] blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[40%] left-[30%] w-[50%] h-[50%] blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)",
        }}
      />
      <div
        className={`${baseClassName} opacity-30`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  ),
  "neon-grid": ({ baseClassName, accentColor, scale }) => (
    <div className={baseClassName}>
      <div
        className={baseClassName}
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${accentColor}10 100%)`,
        }}
      />
      <div
        className={baseClassName}
        style={{
          backgroundImage: `linear-gradient(${accentColor}15 1px, transparent 1px), linear-gradient(90deg, ${accentColor}15 1px, transparent 1px)`,
          backgroundSize: `${scale(40)}px ${scale(40)}px`,
          maskImage: "linear-gradient(to bottom, transparent 5%, black 100%)",
        }}
      />
    </div>
  ),
  "ivy-leaves": ({ baseClassName, accentColor, scale }) => (
    <div className={baseClassName}>
      <div
        className="absolute left-0 top-0 w-full"
        style={{
          height: `${scale(100)}px`,
          background: `linear-gradient(180deg, ${accentColor}20 0%, transparent 100%)`,
        }}
      />
      <div
        className={baseClassName}
        style={{
          backgroundImage:
            "radial-gradient(rgba(20, 83, 45, 0.05) 2px, transparent 2px)",
          backgroundSize: `${scale(30)}px ${scale(30)}px`,
        }}
      />
    </div>
  ),
  "lux-frame": ({ baseClassName, accentColor, scale }) => (
    <div
      className={baseClassName}
      style={{
        border: `${scale(20)}px double ${accentColor}40`,
      }}
    />
  ),
  halftone: ({ baseClassName, accentColor, scale }) => (
    <div
      className={`${baseClassName} opacity-30`}
      style={{
        backgroundImage: `radial-gradient(circle, ${accentColor}40 1px, transparent 1px)`,
        backgroundSize: `${scale(10)}px ${scale(10)}px`,
      }}
    />
  ),
  "paper-texture": ({ baseClassName }) => (
    <div className={baseClassName}>
      <div
        className={`${baseClassName} contrast-150 opacity-5`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className={baseClassName}
        style={{
          background:
            "linear-gradient(to bottom right, rgba(0,0,0,0.02), transparent)",
        }}
      />
    </div>
  ),
  doodles: ({ baseClassName, accentColor }) => {
    const color = accentColor.replace("#", "%23");
    const bg = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg' opacity='0.15'%3E%3Cpath d='M30 10L32 16L38 16L33 20L35 26L30 22L25 26L27 20L22 16L28 16Z' fill='${color}' opacity='0.6'/%3E%3Ccircle cx='10' cy='50' r='4' fill='${color}' opacity='0.5'/%3E%3Ccircle cx='50' cy='10' r='3' fill='${color}' opacity='0.5'/%3E%3C/svg%3E`;

    return (
      <div
        className={baseClassName}
        style={{ backgroundImage: `url("${bg}")` }}
      />
    );
  },
  scanlines: ({ baseClassName, accentColor }) => (
    <div className={baseClassName}>
      <div
        className={baseClassName}
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${accentColor}10 3px)`,
        }}
      />
      <div
        className={baseClassName}
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  ),
  "geometric-shapes": ({ baseClassName }) => (
    <div className={baseClassName}>
      <div
        className="absolute right-[-10%] top-[10%] h-[40%] w-[40%] rounded-full opacity-10"
        style={{ backgroundColor: "#ef4444" }}
      />
      <div
        className="absolute bottom-[-10%] left-[10%] h-[50%] w-[50%] opacity-10"
        style={{ backgroundColor: "#3b82f6", transform: "rotate(15deg)" }}
      />
      <div
        className="absolute top-[40%] left-[40%] h-[20%] w-[20%] opacity-15"
        style={{ backgroundColor: "#eab308" }}
      />
    </div>
  ),
  "gradient-blobs": ({ baseClassName, accentColor }) => (
    <div className={baseClassName}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${accentColor}60 0%, transparent 75%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 100% 100%, ${accentColor}40 0%, transparent 75%)`,
        }}
      />
    </div>
  ),
  dots: ({ baseClassName, scale }) => (
    <div
      className={baseClassName}
      style={{
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)",
        backgroundSize: `${scale(20)}px ${scale(20)}px`,
      }}
    />
  ),
  noise: ({ baseClassName }) => (
    <div
      className={`${baseClassName} contrast-300 brightness-100 opacity-5`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      }}
    />
  ),
};
