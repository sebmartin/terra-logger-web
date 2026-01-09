import { MouseEvent } from "react";
import { Lock } from "lucide-react";

interface ToggleButtonProps {
  isActive: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  title: string;
  ariaLabel: string;
  className?: string;
}

export default function ToggleButton({
  isActive,
  onClick,
  title,
  ariaLabel,
  className = "",
}: ToggleButtonProps) {
  const baseClasses = "relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const stateClasses = isActive
    ? "bg-blue-600 focus:ring-blue-500"
    : "bg-gray-200 focus:ring-gray-500";

  return (
    <button
      className={`${baseClasses} ${stateClasses} ${className}`.trim()}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      role="switch"
      aria-checked={isActive}
    >
      <span
        className={`inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          isActive ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {isActive && <Lock size={10} className="text-blue-600" />}
      </span>
    </button>
  );
}
