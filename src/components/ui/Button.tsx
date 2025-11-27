import React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/utils/style";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variants = {
  primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
  secondary: "bg-white hover:bg-gray-50 focus:ring-gray-300",
  outline:
    "border border-gray-200 hover:bg-gray-50 focus:ring-gray-300 bg-transparent",
  ghost: "bg-transparent hover:bg-gray-100 focus:ring-gray-300",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
      variants[variant] ?? variants.primary,
      sizes[size] ?? sizes.md,
      className
    )}
    disabled={isLoading || disabled}
    aria-busy={isLoading || undefined}
    {...props}
  >
    {isLoading ? (
      <Loader2
        className="mr-2 size-4 animate-spin opacity-75"
        aria-hidden="true"
      />
    ) : icon ? (
      <span className="mr-2">{icon}</span>
    ) : null}
    {children}
  </button>
);

export default Button;
