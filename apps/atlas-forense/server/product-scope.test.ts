import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const nav = readFileSync(new URL("../client/src/components/SiteNav.tsx", import.meta.url), "utf8");
const app = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");
const router = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");

describe("Atlas four-area legal update product boundary", () => {
  it("provides exactly four principal legal update links", () => {
    const menu = nav.slice(nav.indexOf("export const SITE_NAV_GROUPS"), nav.indexOf("export function SiteNav"));
    const hrefs = Array.from(menu.matchAll(/href: "(\/[^"]*)"/g), match => match[1]);
    expect(hrefs).toEqual(["/", "/compendio", "/fontes", "/controle"]);
  });
  it("never routes the legacy clients, office communication or training pages", () => {
    expect(app).toContain('Route path="/" component={DailyUpdatesPage}');
    expect(app).toContain('Route path="/controle" component={AtlasMonitoringPage}');
    expect(app).not.toContain("OfficeClientesPage");
    expect(app).not.toContain("OfficeComunicacoesPage");
    expect(app).not.toContain("OfficeTreinamentoPage");
    expect(nav).not.toContain('href: "/escritorio/');
  });
  it("requires admin authorization for operational scheduler health", () => {
    expect(router).toContain("health: adminProcedure.query(() => getDailyEditorialHealth())");
    expect(router).toContain("approved: publicProcedure.query(() => getPublicEditorialUpdates())");
  });
});
