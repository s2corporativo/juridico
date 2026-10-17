import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");

describe("Atlas/JuridIA design regression guards", () => {
  test("workspace keeps real data, errors and useful primary actions", () => {
    const dashboard = read("../src/components/app/dashboard.tsx");
    expect(dashboard).toContain('fetch("/juridia/api/documents"');
    expect(dashboard).toContain('fetch("/juridia/api/skills"');
    expect(dashboard).toContain('setAppTab("generator")');
    expect(dashboard).toContain("documentsError");
    expect(dashboard).toContain("Revisão pelo profissional");
  });
  test("landing does not imply legal guarantees or depend on continuous motion", () => {
    const hero = read("../src/components/landing/hero.tsx");
    expect(hero).toContain("a revisão permanecem com o profissional");
    expect(hero).not.toContain("framer-motion");
    expect(hero).not.toContain("Conformidade LGPD");
  });
  test("tools are not clipped inside horizontally scrollable TabsList", () => {
    const shell = read("../src/components/app/index.tsx");
    expect(shell).toContain('className="juridia-tool-menu');
    expect(shell.indexOf("</TabsList>")).toBeLessThan(shell.indexOf('<details className="group relative'));
  });
  test("global styles support mobile and reduced motion", () => {
    const css = read("../src/app/globals.css");
    expect(css).toContain(".juridia-dashboard");
    expect(css).toContain("@media (max-width: 700px)");
    expect(css).toContain("(prefers-reduced-motion: reduce)");
    expect(css).toContain(":focus-visible");
  });
});
