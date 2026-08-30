import{describe,expect,it}from"vitest";import{activeModuleRoute,ATLAS_MODULES,ATLAS_ROUTE_ALIASES,ATLAS_ROUTES}from"@shared/atlas-modules";describe("atlas modules",()=>{it("possui rotas únicas e canônicas",()=>{expect(new Set(ATLAS_MODULES.map(x=>x.route)).size).toBe(ATLAS_MODULES.length);expect(ATLAS_ROUTES.jurimetryJec).toBe("/jurimetria/jec");expect(ATLAS_ROUTES.thesisCuration).toBe("/controle/teses")});it("mantém controle administrativo separado",()=>{expect(ATLAS_MODULES.filter(x=>x.access==="admin").length).toBeGreaterThanOrEqual(3)})});

describe("activeModuleRoute",()=>{
 it("escolhe a rota mais específica em vez do primeiro prefixo que bater",()=>{
  // Antes, location.startsWith(route+"/") sozinho marcava /controle e
  // /controle/evidencias como ativos ao mesmo tempo.
  expect(activeModuleRoute("/controle/evidencias",ATLAS_MODULES)).toBe(ATLAS_ROUTES.evidenceControl);
  expect(activeModuleRoute("/controle/teses",ATLAS_MODULES)).toBe(ATLAS_ROUTES.thesisCuration);
  expect(activeModuleRoute("/controle",ATLAS_MODULES)).toBe(ATLAS_ROUTES.control);
 });
 it("resolve aliases de compatibilidade para o módulo canônico",()=>{
  for(const[alias,moduleKey]of Object.entries(ATLAS_ROUTE_ALIASES)){
   const module=ATLAS_MODULES.find(m=>m.key===moduleKey)!;
   expect(activeModuleRoute(alias,ATLAS_MODULES)).toBe(module.route);
  }
 });
 it("marca a Home ativa somente na raiz exata",()=>{
  expect(activeModuleRoute("/",ATLAS_MODULES)).toBe(ATLAS_ROUTES.home);
  expect(activeModuleRoute("/compendio",ATLAS_MODULES)).not.toBe(ATLAS_ROUTES.home);
 });
 it("não marca nada ativo para uma rota paramétrica sem módulo",()=>{
  expect(activeModuleRoute("/teses/ATLAS-T-000001",ATLAS_MODULES)).toBe(ATLAS_ROUTES.theses);
  expect(activeModuleRoute("/dossie/abc",ATLAS_MODULES)).toBeNull();
 });
});
