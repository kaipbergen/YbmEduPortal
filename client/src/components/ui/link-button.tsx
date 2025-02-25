import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type LinkButtonProps = {
  to: string;
  variant?: "default" | "link";
  className?: string;
  children: React.ReactNode;
};

export function LinkButton({
  to,
  variant = "default",
  className,
  children,
}: LinkButtonProps) {
  const baseClasses = "inline-block px-4 py-2 rounded transition";
  const defaultClasses = "bg-blue-600 hover:bg-blue-700 text-white";
  const linkClasses = "text-blue-600 hover:underline";

  const computedClass =
    variant === "default"
      ? cn(baseClasses, defaultClasses, className)
      : cn(baseClasses, linkClasses, className);

  return (
    <Link to={to} className={computedClass}>
      {children}
    </Link>
  );
}