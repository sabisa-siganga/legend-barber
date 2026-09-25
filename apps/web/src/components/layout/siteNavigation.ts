export const primaryNavigation = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services", end: false },
  { to: "/about", label: "About", end: false },
  { to: "/contact", label: "Contact", end: false },
] as const;

export const termsLink = {
  to: "/terms",
  label: "Terms & Conditions",
} as const;
