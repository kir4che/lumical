import type { ChangeEvent } from "react";
import { FilePlus } from "lucide-react";

import { cn } from "@/utils/style";
import Button from "@/components/ui/Button";
import type React from "react";

interface ImportPanelProps {
  isLoading: boolean;
  canUseGoogleImport: boolean;
  onGoogleImport: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onUseDemo: () => void;
}

const ImportPanel: React.FC<ImportPanelProps> = ({
  isLoading,
  canUseGoogleImport,
  onGoogleImport,
  onFileChange,
  onUseDemo,
}) => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Import your Schedule</h2>
      <p className="text-gray-500">
        Connect a calendar or upload a file to get started.
      </p>
    </section>
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={onGoogleImport}
        isLoading={isLoading}
        disabled={!canUseGoogleImport || isLoading}
        className="w-full justify-start h-12"
        icon={<span className="font-bold text-blue-500">G</span>}
      >
        {canUseGoogleImport
          ? "Connect Google Calendar"
          : "Google Calendar unavailable"}
      </Button>
      {!canUseGoogleImport && (
        <p className="text-xs text-amber-600">
          Set <code>VITE_GOOGLE_CLIENT_ID</code> in your env file to enable
          Google import.
        </p>
      )}
    </div>
    <div className="relative">
      <input
        id="schedule-file"
        type="file"
        accept=".ics"
        onChange={onFileChange}
        disabled={isLoading}
        className="sr-only"
      />
      <label
        htmlFor="schedule-file"
        className={cn(
          "block border-2 border-dashed rounded-xl p-8 text-center transition-colors bg-gray-50",
          isLoading
            ? "border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-gray-300 hover:border-gray-400 cursor-pointer"
        )}
      >
        <FilePlus size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm font-medium">Drop .ics file here</p>
        <p className="mt-1 text-xs text-gray-500">
          or click to select a .ics file
        </p>
      </label>
    </div>
    <button
      onClick={onUseDemo}
      disabled={isLoading}
      className="w-full text-sm underline text-center text-gray-400 hover:text-gray-500"
    >
      Try with demo data
    </button>
  </div>
);

export default ImportPanel;
