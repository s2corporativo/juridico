import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
const rootDir=path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root:path.resolve(rootDir,"client"),
  plugins:[react()],
  resolve:{alias:{"@":path.resolve(rootDir,"client/src"),"@shared":path.resolve(rootDir,"shared")}},
  build:{outDir:path.resolve(rootDir,"dist/client"),emptyOutDir:true},
  server:{port:5173,host:"127.0.0.1",proxy:{"/api":"http://127.0.0.1:3010","/manus-storage":"http://127.0.0.1:3010"}}
});
