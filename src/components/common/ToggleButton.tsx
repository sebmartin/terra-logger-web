import { MouseEvent } from "react";

interface ToggleButtonProps {
  isActive: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  title: string;
  ariaLabel: string;
  icon?: string;
  className?: string;
}

export default function ToggleButton({
  isActive,
  onClick,
  title,
  ariaLabel,
  icon = "✏️",
  className = "",
}: ToggleButtonProps) {
  return (
    <button
      className={`toggle-lock ${isActive ? "locked" : ""} ${className}`.trim()}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
    >
      <span className="toggle-track">
        <span className="toggle-thumb">{icon}</span>
      </span>
    </button>
  );
}
