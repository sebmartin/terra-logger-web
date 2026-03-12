import { ReactNode, MouseEvent } from "react";

interface IconButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  title: string;
  icon: ReactNode;
  variant?: "default" | "action" | "delete";
  className?: string;
}

export function IconButton({
  onClick,
  title,
  icon,
  variant = "default",
  className = "",
}: IconButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variantClasses = {
    default: "text-slate-600 hover:text-slate-800 hover:bg-slate-100 focus:ring-slate-400",
    action: "text-blue-600 hover:text-blue-700 hover:bg-blue-100 focus:ring-blue-400",
    delete: "text-red-500 hover:text-red-700 hover:bg-red-50 focus:ring-red-400",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      onClick={onClick ?? (() => {})}
      title={title}
    >
      {icon}
    </button>
  );
}
