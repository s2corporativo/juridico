import{initTRPC,TRPCError}from"@trpc/server";import type{Request,Response}from"express";import{parseCookies,SESSION_COOKIE,verifySession,type SessionPayload}from"./session";
export type Context={req:Request;res:Response;session:SessionPayload|null;user:SessionPayload|null};
export async function createContext({req,res}:{req:Request;res:Response}):Promise<Context>{const token=parseCookies(req.headers.cookie)[SESSION_COOKIE];let session:SessionPayload|null=null;if(token)try{session=await verifySession(token)}catch{session=null}return{req,res,session,user:session}}
const t=initTRPC.context<Context>().create();export const router=t.router,publicProcedure=t.procedure;
export const protectedProcedure=t.procedure.use(async({ctx,next})=>{if(!ctx.user)throw new TRPCError({code:"UNAUTHORIZED",message:"Autenticação necessária."});return next({ctx:{...ctx,user:ctx.user}})});
export const adminProcedure=protectedProcedure.use(async({ctx,next})=>{if(ctx.user.role!=="admin")throw new TRPCError({code:"FORBIDDEN",message:"Perfil administrativo necessário."});return next({ctx})});
