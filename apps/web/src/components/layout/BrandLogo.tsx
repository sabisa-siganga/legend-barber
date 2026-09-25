import { Link } from "react-router";
import logoLight from "../../assets/brand/crown-and-blade-logo-light.svg";
import markLight from "../../assets/brand/crown-and-blade-mark-light.svg";

type BrandLogoProps = {
  compactOnMobile?: boolean;
};

export function BrandLogo({ compactOnMobile = false }: BrandLogoProps) {
  return (
    <Link
      to="/"
      aria-label="Crown and Blade, home"
      className="inline-flex shrink-0 items-center"
    >
      {compactOnMobile ? (
        <img
          src={markLight}
          alt=""
          width={160}
          height={160}
          className="h-8 w-8 sm:hidden"
        />
      ) : null}
      <img
        src={logoLight}
        alt=""
        width={760}
        height={160}
        className={
          compactOnMobile ? "hidden h-10 w-auto sm:block" : "h-10 w-auto"
        }
      />
    </Link>
  );
}
