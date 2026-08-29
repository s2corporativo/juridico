/**
 * Ambiente mínimo dos testes de servidor.
 *
 * `ENV` é resolvido no import de `_core/env`, então o segredo precisa existir
 * antes de qualquer módulo do servidor ser carregado — daí um setup file em vez
 * de atribuição no topo do teste.
 */
process.env.JWT_SECRET ??= "atlas-forense-test-secret-".padEnd(64, "0");
process.env.NODE_ENV ??= "test";
