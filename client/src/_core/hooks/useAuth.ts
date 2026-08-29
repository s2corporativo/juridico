import { trpc } from "@/lib/trpc";
export function useAuth(){const query=trpc.auth.me.useQuery(undefined,{retry:false}); return {user:query.data??null,loading:query.isLoading,error:query.error,isAuthenticated:Boolean(query.data),logout:async()=>{await fetch("/api/auth/logout",{method:"POST"});window.location.assign("/");},login:()=>window.location.assign("/api/auth/login")};}
