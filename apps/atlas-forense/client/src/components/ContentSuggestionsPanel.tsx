import { ArrowRight, BookOpenCheck, Lightbulb, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { buildPautaJurUrl, rankContentIdeas } from "@/lib/editorial-content-suggestions";

/**
 * Somente recomenda temas genéricos. O envio para o Pauta.Jur é iniciado pelo
 * usuário e transfere APENAS uma chave permitida (pauta=...), nunca dados do
 * processo, da atualização, credenciais, resumo ou conteúdo sigiloso.
 */
export default function ContentSuggestionsPanel() {
  const approved = trpc.editorial.approved.useQuery(undefined, { retry: false });
  const suggestions = rankContentIdeas(approved.data ?? []);
  const related = suggestions.filter(item => item.matched).length;

  return (
    <section
      className="editorial-updates-panel"
      id="sugestoes-conteudo"
      aria-labelledby="sugestoes-conteudo-title"
    >
      <div className="editorial-updates-heading">
        <div>
          <span className="eyebrow">RADAR EDITORIAL · CONTEÚDO INFORMATIVO</span>
          <h2 id="sugestoes-conteudo-title">Sugestões para as redes sociais do escritório.</h2>
          <p>
            Assuntos cotidianos que ajudam o público a conhecer direitos pouco
            divulgados. A relevância temática é ordenada por correspondência
            de palavras com atualizações editoriais aprovadas, quando houver;
            não é previsão de êxito nem comprovação de tendência.
          </p>
        </div>
        <div className="editorial-updates-status">
          <Lightbulb size={16} />
          <span>{approved.isFetching ? "Consultando…" : related ? `${related} temas relacionados` : "Curadoria permanente"}</span>
        </div>
      </div>
      <div className="editorial-update-grid">
        {suggestions.map(idea => {
          const href = buildPautaJurUrl(idea.id, import.meta.env.VITE_PAUTAJUR_URL || undefined);
          return (
            <article className="editorial-update-card" key={idea.id}>
              <div className="editorial-update-meta">
                <span className="editorial-kind"><BookOpenCheck size={14} /> {idea.category}</span>
                <span>{idea.matched ? "Afinidade com atualização aprovada" : "Sugestão da curadoria"}</span>
              </div>
              <h3>{idea.question}</h3>
              <p>
                Tema para conteúdo educativo. Verifique legislação vigente,
                jurisprudência pertinente e ressalvas antes de elaborar o texto.
              </p>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  Criar no Pauta.Jur <ArrowRight size={14} />
                </a>
              ) : (
                <span>Estúdio indisponível: URL de integração inválida.</span>
              )}
            </article>
          );
        })}
      </div>
      {approved.isError && (
        <p className="editorial-empty">
          As atualizações aprovadas não puderam ser consultadas. As sugestões
          exibidas são apenas pautas permanentes, sem associação ao acervo atual.
        </p>
      )}
      <div className="editorial-updates-foot">
        <ShieldCheck size={15} />
        <span>
          Integração sem credenciais no navegador: o Pauta.Jur recebe somente o
          identificador da pauta. Não há publicação automática ou envio de dados pessoais.
        </span>
      </div>
    </section>
  );
}
