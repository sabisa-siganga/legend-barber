import type { ReactNode } from "react";
import { Link } from "react-router";

type SiteButtonProps = {
  to: string;
  children: ReactNode;
  variant?: "solid" | "outline";
};

const variantClassName = {
  solid: "bg-rust text-bone hover:bg-transparent",
  outline: "bg-transparent text-bone hover:bg-rust",
} as const;

export function SiteButton({
  to,
  children,
  variant = "solid",
}: SiteButtonProps) {
  return (
    <Link
      to={to}
      data-emphasis={variant}
      className={`inline-flex items-center justify-center border border-rust px-5 py-3 text-sm tracking-[0.04em] whitespace-nowrap transition-colors duration-200 motion-reduce:transition-none ${variantClassName[variant]}`}
    >
      {children}
    </Link>
  );
}
