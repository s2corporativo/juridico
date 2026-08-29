import{router,publicProcedure}from"./trpc";export const systemRouter=router({health:publicProcedure.query(()=>({ok:true,service:"atlas-forense",time:new Date().toISOString()}))});
