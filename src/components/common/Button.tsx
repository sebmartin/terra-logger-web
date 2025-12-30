import { ReactNode, MouseEvent } from "react";

interface ButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  variant?: "default" | "primary";
  disabled?: boolean;
  className?: string;
}

export default function Button({
  onClick,
  children,
  variant = "default",
  disabled = false,
  className = "",
}: ButtonProps) {
  const variantClass = variant === "primary" ? "btn-primary" : "";

  return (
    <button
      className={`${variantClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
