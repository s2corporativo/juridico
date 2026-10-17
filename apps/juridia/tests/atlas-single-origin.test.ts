import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const app=resolve(import.meta.dir,'..')
const atlas=resolve(app,'../atlas-forense')

describe('Atlas e Juridiá — um domínio, isolamento de APIs e cookie',()=>{
 test('Next reconhece o prefixo e mantém o backend Atlas separado',()=>{
  const config=readFileSync(resolve(app,'next.config.ts'),'utf8')
  expect(config).toContain('basePath: "/juridia"')
  const nav=readFileSync(resolve(atlas,'client/src/components/SiteNav.tsx'),'utf8')
  expect(nav).toContain('<a key={item.href} href="/juridia"')
 })
 test('API fetch não vaza para namespace raiz do Atlas',()=>{
  const fs=require('node:fs')
  let count=0
  function walk(folder:string){
   for(const entry of fs.readdirSync(folder,{withFileTypes:true})){
    const path=resolve(folder,entry.name)
    if(entry.isDirectory()){ if(entry.name!=='api')walk(path); continue }
    if(!/\.(tsx?|jsx?)$/.test(path)||path.endsWith('lib/atlas_client.ts'))continue
    const content=readFileSync(path,'utf8')
    // Marcadores literais de API root não podem persistir em componentes.
    expect(content).not.toMatch(/fetch\(\s*["'`]\/api\//)
    count++
   }
  }
  walk(resolve(app,'src'))
  expect(count).toBeGreaterThan(25)
 })
 test('cookie autenticação limitado à Juridiá e redirects com basePath',()=>{
  const auth=readFileSync(resolve(app,'src/lib/auth.ts'),'utf8')
  const logout=readFileSync(resolve(app,'src/app/api/auth/logout/route.ts'),'utf8')
  const oidc=readFileSync(resolve(app,'src/app/api/auth/oidc/authorize/route.ts'),'utf8')
  expect(auth).toContain('path: "/juridia"')
  expect(logout).toContain('path: "/juridia"')
  expect(oidc).toContain('new URL("/juridia/login", url.origin)')
  const login=readFileSync(resolve(app,'src/app/login/page.tsx'),'utf8')
  expect(login).toContain('window.location.assign(safeNext)')
  expect(login).not.toContain('router.push(safeNext)')
 })
})
