/**
 * Redireciona o Authorization Code Flow de volta à origem pública do IdP.
 * Nunca usar req.nextUrl.origin atrás de Nginx/Caddy: pode apontar para
 * localhost e omitir o basePath do Next, invalidando a autenticação.
 */
export function oidcLoginRedirect(issuer: string, searchParams: URLSearchParams): URL {
  const publicIssuer = new URL(issuer);
  const continueUrl = new URL(publicIssuer.href.replace(/\/$/, "") + "/authorize");
  continueUrl.search = searchParams.toString();
  const loginUrl = new URL("/juridia/login", publicIssuer.origin);
  loginUrl.searchParams.set("next", continueUrl.toString());
  return loginUrl;
}
