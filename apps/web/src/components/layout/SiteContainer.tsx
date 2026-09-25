import type { ReactNode } from "react";

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
};

export function SiteContainer({
  children,
  className = "",
}: SiteContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}
