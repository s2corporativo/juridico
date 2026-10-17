import { describe, it, expect } from 'vitest'
import { analyticsConfig } from '../shared/analytics-config'
describe('Analytics opcional Atlas',()=>{
 it('não injeta script se variáveis não configuradas',()=>{
  expect(analyticsConfig(undefined,undefined)).toBeNull()
  expect(analyticsConfig('https://analytics.example','')).toBeNull()
 })
 it('aceita HTTPS válido com ID conhecido',()=>{
  expect(analyticsConfig('https://analytics.example/','abc12345')).toEqual({
   src:'https://analytics.example/umami',websiteId:'abc12345',
  })
 })
 it('rejeita protocolo HTTP, script, credenciais ou queries',()=>{
  for(const url of ['javascript:alert(1)','http://analytics.example','https://a:b@analytics.example','https://analytics.example/?x=1']) {
   expect(analyticsConfig(url,'abc12345')).toBeNull()
  }
 })
})
