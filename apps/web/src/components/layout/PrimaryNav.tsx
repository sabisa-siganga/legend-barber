import { NavLink } from "react-router";
import { primaryNavigation } from "./siteNavigation";

type PrimaryNavProps = {
  onNavigate?: () => void;
  className: string;
  linkClassName?: string;
};

export function PrimaryNav({
  onNavigate,
  className,
  linkClassName = "",
}: PrimaryNavProps) {
  return (
    <ul className={className}>
      {primaryNavigation.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "inline-flex text-sm tracking-[0.06em] underline decoration-1 underline-offset-[7px] transition-colors duration-200 motion-reduce:transition-none",
                linkClassName,
                isActive
                  ? "text-bone decoration-rust"
                  : "text-ash decoration-transparent hover:text-bone hover:decoration-bone",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
