import type { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/utils/style";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  wrapperClassName,
  labelClassName,
  children,
  ...props
}) => (
  <div className={cn("relative", wrapperClassName)}>
    {label && (
      <label
        className={cn(
          "block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",
          labelClassName
        )}
      >
        {label}
      </label>
    )}
    <div className="relative">
      <select
        {...props}
        className={cn(
          "w-full appearance-none px-3 py-2 pr-8 rounded-md",
          "border border-gray-300 bg-white",
          "font-semibold text-sm",
          props.className
        )}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700 text-xs">
        ▼
      </div>
    </div>
  </div>
);

export default SelectField;
