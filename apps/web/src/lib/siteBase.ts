export const normalizeViteBase = (value: string | undefined): string => {
  if (value === undefined) {
    return "/";
  }

  const trimmed = value.trim();

  if (trimmed === "" || trimmed === "/") {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  if (withLeadingSlash.endsWith("/")) {
    return withLeadingSlash;
  }

  return `${withLeadingSlash}/`;
};

export const routerBasenameFromBaseUrl = (
  baseUrl: string,
): string | undefined => {
  const normalized = normalizeViteBase(baseUrl);

  if (normalized === "/") {
    return undefined;
  }

  return normalized.slice(0, -1);
};
