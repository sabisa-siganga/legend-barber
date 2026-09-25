import { describe, expect, it } from "vitest";
import { normalizeViteBase, routerBasenameFromBaseUrl } from "./siteBase";

describe("site base path", () => {
  it("keeps local builds at the domain root when no pages path is set", () => {
    expect(normalizeViteBase(undefined)).toBe("/");
    expect(normalizeViteBase("")).toBe("/");
    expect(normalizeViteBase("/")).toBe("/");
    expect(normalizeViteBase("  /  ")).toBe("/");
  });

  it("normalizes a repository path so Vite can prefix built asset URLs", () => {
    expect(normalizeViteBase("legend-barber")).toBe("/legend-barber/");
    expect(normalizeViteBase("/legend-barber")).toBe("/legend-barber/");
    expect(normalizeViteBase("/legend-barber/")).toBe("/legend-barber/");
  });

  it("omits the router basename when the app is served from the domain root", () => {
    expect(routerBasenameFromBaseUrl("/")).toBeUndefined();
  });

  it("passes the repository path to the router without a trailing slash", () => {
    expect(routerBasenameFromBaseUrl("/legend-barber/")).toBe("/legend-barber");
  });
});
