export type AtlasModuleGroup="intelligence"|"jurimetry"|"governance";
export type AtlasAccess="public"|"authenticated"|"admin";
export type AtlasModuleStatus="active"|"controlled"|"planned";
export const ATLAS_ROUTES={home:"/",compendium:"/compendio",theses:"/teses",jurimetryJec:"/jurimetria/jec",national:"/jurimetria/nacional",metropolitan:"/jurimetria/rmbh",sources:"/fontes",governance:"/governanca",control:"/controle",evidenceControl:"/controle/evidencias",thesisCuration:"/controle/teses"} as const;
export type AtlasModuleKey=keyof typeof ATLAS_ROUTES;
export type AtlasModule={key:AtlasModuleKey;route:string;label:string;shortLabel:string;description:string;group:AtlasModuleGroup;access:AtlasAccess;status:AtlasModuleStatus};
export const ATLAS_GROUP_LABELS:Record<AtlasModuleGroup,string>={intelligence:"Inteligência Jurídica",jurimetry:"Jurimetria",governance:"Governança"};
export const ATLAS_MODULES:readonly AtlasModule[]=[
{key:"home",route:ATLAS_ROUTES.home,label:"Visão Geral",shortLabel:"Início",description:"Saúde, cobertura e acesso aos módulos do Atlas.",group:"intelligence",access:"public",status:"active"},
{key:"compendium",route:ATLAS_ROUTES.compendium,label:"Compêndio Jurídico",shortLabel:"Compêndio",description:"Julgados, taxonomia, fontes e dossiês de citação.",group:"intelligence",access:"public",status:"active"},
{key:"theses",route:ATLAS_ROUTES.theses,label:"Banco Nacional de Teses",shortLabel:"Teses",description:"Teses de ataque/defesa com evidências, contrateses e score documentado.",group:"intelligence",access:"public",status:"active"},
{key:"jurimetryJec",route:ATLAS_ROUTES.jurimetryJec,label:"Jurimetria JEC",shortLabel:"JEC",description:"Painel de recortes JEC carregados como snapshots auditáveis.",group:"jurimetry",access:"public",status:"controlled"},
{key:"national",route:ATLAS_ROUTES.national,label:"Cobertura Nacional",shortLabel:"Nacional",description:"Distribuições, facetas e prontidão metodológica nacional.",group:"jurimetry",access:"public",status:"controlled"},
{key:"metropolitan",route:ATLAS_ROUTES.metropolitan,label:"Cobertura RMBH",shortLabel:"RMBH",description:"Cobertura territorial agregada e mapeamento de órgãos julgadores.",group:"jurimetry",access:"public",status:"controlled"},
{key:"sources",route:ATLAS_ROUTES.sources,label:"Fontes",shortLabel:"Fontes",description:"Catálogo de fontes públicas, APIs e status de verificação.",group:"governance",access:"public",status:"active"},
{key:"governance",route:ATLAS_ROUTES.governance,label:"Governança",shortLabel:"Método",description:"Metodologia, privacidade, versionamento, limites e expansão.",group:"governance",access:"public",status:"active"},
{key:"control",route:ATLAS_ROUTES.control,label:"Central de Controle",shortLabel:"Controle",description:"Hub administrativo do Atlas.",group:"governance",access:"admin",status:"active"},
{key:"evidenceControl",route:ATLAS_ROUTES.evidenceControl,label:"Evidências e DataJud",shortLabel:"Evidências",description:"Pré-validação, fila de revisão e consultas oficiais.",group:"governance",access:"admin",status:"active"},
{key:"thesisCuration",route:ATLAS_ROUTES.thesisCuration,label:"Curadoria de Teses",shortLabel:"Curadoria",description:"Workspace versionada de conteúdo, evidências, avaliação e revisão.",group:"governance",access:"admin",status:"active"}
] as const;
export function moduleByRoute(route:string){return ATLAS_MODULES.find(m=>m.route===route)??null}
