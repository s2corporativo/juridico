/**
 * Resgate OIDC de uso único.
 *
 * A transição used=false -> true deve ocorrer no MESMO UPDATE condicional.
 * Um findUnique() seguido de update({ where: { code } }) não impede que
 * duas requisições concorrentes resgatem o mesmo authorization code.
 *
 * A assinatura reduzida permite testar o contrato sem tocar no banco real.
 */
export interface OidcCodeStore {
  updateMany(args: {
    where: {
      code: string;
      used: false;
      clientId: string;
      redirectUri: string;
      codeChallengeMethod: "S256";
      codeChallenge: string;
      expiresAt: { gt: Date };
    };
    data: { used: true };
  }): PromiseLike<{ count: number }>;
}

export interface OidcCodeClaim {
  code: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  now: Date;
}

/**
 * Só a primeira requisição que corresponder a TODAS as condições
 * poderá consumir o código. As tentativas seguintes retornam false.
 */
export async function consumeOidcCodeOnce(store: OidcCodeStore, claim: OidcCodeClaim): Promise<boolean> {
  const result = await store.updateMany({
    where: {
      code: claim.code,
      used: false,
      clientId: claim.clientId,
      redirectUri: claim.redirectUri,
      codeChallengeMethod: "S256",
      codeChallenge: claim.codeChallenge,
      expiresAt: { gt: claim.now },
    },
    data: { used: true },
  });
  return result.count === 1;
}
