import { Link } from "react-router";

type TextActionProps = {
  to: string;
  children: string;
  tone?: "dark" | "light";
};

export function TextAction({ to, children, tone = "dark" }: TextActionProps) {
  const textClassName = tone === "dark" ? "text-bone" : "text-ink";
  const underlineClassName =
    tone === "dark"
      ? "border-rust group-hover:border-bone"
      : "border-rust group-hover:border-ink";

  return (
    <Link to={to} className={`group inline-flex ${textClassName}`}>
      <span
        className={`border-b pb-1 text-sm tracking-[0.03em] transition-colors duration-200 motion-reduce:transition-none ${underlineClassName}`}
      >
        {children}
      </span>
    </Link>
  );
}
