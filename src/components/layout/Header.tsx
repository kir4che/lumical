import { CalendarDays } from "lucide-react";

interface HeaderProps {
  step: 1 | 2;
}

const Header: React.FC<HeaderProps> = ({ step }) => (
  <header className="sticky top-0 z-50 h-15 border-b border-gray-200 bg-white px-6 grid grid-cols-3 items-center">
    <a href="/" className="flex items-center gap-1 md:gap-2">
      <CalendarDays className="size-4.5 md:size-6" />
      <span className="font-bold md:text-xl">LumiCal</span>
    </a>
    <div className="flex-center gap-2 md:gap-4 text-xs md:text-sm font-medium text-gray-400">
      <span className={step === 1 ? "text-gray-900" : ""}>1. Import</span>
      <span className="text-gray-300">/</span>
      <span className={step === 2 ? "text-gray-900" : ""}>2. Design</span>
    </div>
  </header>
);

export default Header;
