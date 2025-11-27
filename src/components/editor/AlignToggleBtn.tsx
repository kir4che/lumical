import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { cn } from "@/utils/style";

const ALIGN_OPTIONS = ["left", "center", "right"] as const;
type AlignValue = (typeof ALIGN_OPTIONS)[number];

interface AlignToggleBtnProps {
  label: string;
  value: AlignValue;
  onChange: (value: AlignValue) => void;
}

const AlignToggleBtn: React.FC<AlignToggleBtnProps> = ({
  label,
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-1">
    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider">
      {label}
    </label>
    <div className="flex bg-gray-100 rounded p-0.5">
      {ALIGN_OPTIONS.map((align) => (
        <button
          key={align}
          type="button"
          onClick={() => onChange(align)}
          className={cn(
            "flex-1 p-1.5 flex justify-center rounded-sm transition-all",
            value === align
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          {align === "left" && <AlignLeft className="size-3" />}
          {align === "center" && <AlignCenter className="size-3" />}
          {align === "right" && <AlignRight className="size-3" />}
        </button>
      ))}
    </div>
  </div>
);

export default AlignToggleBtn;
