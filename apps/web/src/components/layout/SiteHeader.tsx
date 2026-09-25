import { useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router";
import { BrandLogo } from "./BrandLogo";
import { PrimaryNav } from "./PrimaryNav";
import { SiteButton } from "./SiteButton";
import { SiteContainer } from "./SiteContainer";

export function SiteHeader() {
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const isMenuOpen = openPath === pathname;

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setOpenPath(null);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setOpenPath(null);
  };

  return (
    <header className="border-b border-bone/15 bg-ink">
      <SiteContainer className="flex items-center justify-between gap-4 py-3">
        <BrandLogo compactOnMobile />
        <div className="flex items-center gap-6 sm:gap-8">
          <nav aria-label="Primary" className="hidden md:block">
            <PrimaryNav className="flex items-center gap-7" />
          </nav>
          <SiteButton to="/services" variant="outline">
            Book Now
          </SiteButton>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-bone/30 md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            onClick={() => {
              setOpenPath((currentPath) =>
                currentPath === pathname ? null : pathname,
              );
            }}
          >
            <span className="sr-only">
              {isMenuOpen ? "Close menu" : "Open menu"}
            </span>
            <span className="flex w-4 flex-col gap-1.5" aria-hidden="true">
              <span
                className={`block h-px w-full bg-bone transition-transform duration-200 motion-reduce:transition-none ${isMenuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-full bg-bone transition-transform duration-200 motion-reduce:transition-none ${isMenuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </SiteContainer>
      <div hidden={!isMenuOpen} className="border-t border-bone/15 md:hidden">
        <SiteContainer className="py-3">
          <nav id={menuId} aria-label="Primary">
            <PrimaryNav
              onNavigate={closeMenu}
              className="flex flex-col"
              linkClassName="w-full py-3"
            />
          </nav>
        </SiteContainer>
      </div>
    </header>
  );
}
