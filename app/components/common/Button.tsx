import { ReactNode, MouseEvent } from "react";
import { Button as ShadcnButton } from "../ui/button";

interface ButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
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
  // Map legacy variants to shadcn variants
  const mappedVariant = variant === "primary" ? "default" : "outline";

  return (
    <ShadcnButton
      onClick={onClick}
      disabled={disabled}
      variant={mappedVariant as any}
      className={className}
    >
      {children}
    </ShadcnButton>
  );
}
