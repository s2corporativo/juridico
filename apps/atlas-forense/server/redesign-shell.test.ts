import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");

describe("Atlas redesign and analytics hygiene", () => {
  it("keeps research, provenance and evidence cautions visible", () => {
    const home = read("../client/src/pages/Home.tsx");
    expect(home).toContain("origem verificável");
    expect(home).toContain("proveniência");
    expect(home).toContain("compendium-reference-grid");
    expect(home).toContain("atlas-quick-menu");
  });
  it("keeps optional analytics guarded by HTTPS configuration", () => {
    const html = read("../client/index.html");
    const main = read("../client/src/main.tsx");
    const config = read("../shared/analytics-config.ts");
    expect(html).not.toContain("%VITE_ANALYTICS_ENDPOINT%");
    expect(main).toContain("analyticsConfig(");
    expect(config).toContain("url.protocol !== 'https:'");
  });
  it("provides keyboard focus and motion reduction", () => {
    const css = read("../client/src/index.css");
    expect(css).toContain(".atlas-quick-menu-panel");
    expect(css).toContain(":focus-visible");
    expect(css).toContain("prefers-reduced-motion");
  });
});
