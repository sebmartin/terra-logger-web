import { ReactNode, MouseEvent } from "react";

interface IconButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  title: string;
  icon: ReactNode;
  variant?: "default" | "action" | "delete";
  className?: string;
}

export default function IconButton({
  onClick,
  title,
  icon,
  variant = "default",
  className = "",
}: IconButtonProps) {
  const variantClass =
    variant === "action"
      ? "btn-action"
      : variant === "delete"
        ? "btn-delete"
        : "btn-icon";

  return (
    <button
      className={`${variantClass} ${className}`.trim()}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  );
}
