import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("national census print layout", () => {
  it("hides navigation and interactive filter controls in print media", () => {
    expect(styles).toContain("@media print { .national-rail, .national-topbar, .national-filter-bar, .national-rail-foot { display:none !important;");
    expect(styles).toContain(".national-shell, .national-main { display:block; background:#fff; }");
    expect(styles).toContain(".national-hero, .national-readiness, .national-distributions, .national-requirements, .national-limits { break-inside:avoid;");
  });
});
