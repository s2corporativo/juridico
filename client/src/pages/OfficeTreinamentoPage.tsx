import { useEffect, useState } from "react";
import {
  BadgeCheck,
  BellRing,
  BookOpenCheck,
  CircleAlert,
  Database,
  GraduationCap,
  Landmark,
  ScrollText,
  Scale,
  ShieldCheck,
  Timer,
  Users,
  Workflow,
} from "lucide-react";

const MODULOS = [
  { icone: Landmark, titulo: "Atlas Forense (Home)", texto: "Jurimetria pública do JEC em Belo Horizonte e Betim: censo, amostra concreta e tempo médio observado por unidade julgadora." },
  { icone: Users, titulo: "Clientes", texto: "Cadastro e dossiê do cliente: matérias, CNJs, atendimentos e histórico — base operacional do escritório." },
  { icone: BellRing, titulo: "Comunicações", texto: "Caixa única alimentada pelo Conector DJEN (OAB/UF) e por registros manuais, com sanitização LGPD e motor de prazos." },
  { icone: BookOpenCheck, titulo: "Jurisprudência", texto: "Acervo do escritório: provedores oficiais (STJ Dados Abertos, LexML) e registro manual auditável de julgados." },
  { icone: Database, titulo: "Fontes", texto: "Catálogo das fontes P0 obrigatórias (CNJ, DJEN, STJ, LexML, TJMG) com estado de integração e notas de uso." },
  { icone: GraduationCap, titulo: "Treinamento", texto: "Esta página: módulos, fluxo recomendado, regras do motor, LGPD, checklist e quiz de verificação." },
];

const FLUXO = [
  "Configure o Conector DJEN em Comunicações: informe nome do advogado, inscrição OAB e UF, e salve a configuração.",
  "Clique em \"Sincronizar agora\" (ou aguarde o ciclo automático): as comunicações entram na caixa com teor sanitizado conforme LGPD.",
  "Concentre a caixa: marque como lidas as ciências registradas e arquive o que não gera prazo.",
  "Use \"Calcular pelo teor\" em cada comunicação relevante: o motor extrai o prazo declarado ou aplica o padrão do escritório — leia o badge de origem antes de confiar no número.",
  "Registre clientes, matérias e atendimentos: o dossiê mantém o rastro do caso do primeiro contato ao encerramento.",
  "Vincule jurisprudência às matérias: sincronize os provedores oficiais ou registre o julgado manualmente com a fonte declarada.",
];

const REGRAS = [
  { base: "CPC, art. 219", texto: "Na esfera cível a contagem é em dias úteis; feriados forenses e locais informados pelo usuário suspendem a contagem." },
  { base: "CPC, art. 220", texto: "Suspende-se o curso dos prazos entre 20 de dezembro e 20 de janeiro, inclusive — configurável por calendário do tribunal." },
  { base: "CPC, art. 224", texto: "Exclui-se o dia do começo e inclui-se o do vencimento; no DJe a publicação conta-se na disponibilização e o prazo corre a partir do primeiro dia útil seguinte." },
  { base: "CPC, art. 229", texto: "Litisconsortes com procuradores distintos têm prazo em dobro — mas a dobra não incide em autos eletrônicos (§ 2º); o motor registra o alerta." },
  { base: "Lei 11.419/2006, art. 5º", texto: "Intimação eletrônica: o prazo inicia no primeiro dia útil seguinte à expedição e a consulta ao portal até 24h do último dia é tempestiva." },
  { base: "CPP, art. 798", texto: "Prazos penais contam em dias corridos; vencendo em domingo ou feriado, prorroga-se para o primeiro dia útil seguinte (§ 3º)." },
];

const QUIZ = [
  {
    enunciado: "A comunicação foi disponibilizada no DJe na sexta-feira, 06/11/2026. Quando começa a correr um prazo de dias úteis?",
    alternativas: [
      "No mesmo dia da disponibilização",
      "A partir do primeiro dia útil seguinte (CPC 224, § 2º; Lei 11.419/2006, art. 5º)",
      "Apenas no segundo dia útil seguinte",
      "Somente após a publicação no boletim impresso",
    ],
    correta: 1,
    explicacao: "No processo eletrônico considera-se realizada a publicação no dia da disponibilização, mas o prazo só começa no primeiro dia útil seguinte.",
  },
  {
    enunciado: "Qual é a regra do CPC, art. 224, para a contagem de prazos?",
    alternativas: [
      "Inclui o dia do começo e exclui o do vencimento",
      "Exclui o dia do começo e inclui o do vencimento",
      "Conta o prazo em horas",
      "Converte automaticamente úteis em corridos",
    ],
    correta: 1,
    explicacao: "A exclusão do dia do começo e a inclusão do do vencimento são a base da memória de cálculo do motor.",
  },
  {
    enunciado: "Na página de Comunicações, o badge âmbar \"Fallback — sem prazo no teor\" indica que:",
    alternativas: [
      "O prazo foi extraído do teor da comunicação",
      "O teor não trouxe prazo declarado e o motor aplicou o padrão do escritório — confira o despacho",
      "O prazo foi perdido e não pode ser recuperado",
      "O conector DJEN falhou na sincronização",
    ],
    correta: 1,
    explicacao: "O badge verde confirma extração do teor; o âmbar avisa que o número veio do padrão do escritório e exige conferência humana.",
  },
  {
    enunciado: "Prazo de 15 dias úteis com ciência em 15/12/2026. O que o motor faz com o recesso do art. 220?",
    alternativas: [
      "Ignora o recesso e vence em 07/01/2027",
      "Suspende a contagem entre 20/12 e 20/01 e vence em 05/02/2027",
      "Converte-se em dias corridos",
      "Fica prorrogado por 30 dias",
    ],
    correta: 1,
    explicacao: "O curso dos prazos processuais suspende-se entre 20 de dezembro e 20 de janeiro, inclusive; os dias desse período não são computados.",
  },
  {
    enunciado: "Dois litisconsortes com procuradores distintos, em autos ELETRÔNICOS, pedem prazo em dobro. O motor:",
    alternativas: [
      "Aplica a dobra, pois o art. 229 manda dobrar",
      "Não aplica a dobra, pelo art. 229, § 2º, e registra alerta",
      "Dobra e ignora o meio eletrônico",
      "Reduz o prazo pela metade",
    ],
    correta: 1,
    explicacao: "Em autos eletrônicos a dobra de litisconsortes não incide (art. 229, § 2º); o motor registra o alerta na memória de cálculo para auditoria.",
  },
  {
    enunciado: "\"Sincronizar agora\" devolveu \"Falha na consulta DJEN: fetch failed\". Conduta correta:",
    alternativas: [
      "Registrar imediatamente os prazos como perdidos",
      "Reintentar mais tarde — a falha é graciosa, o sistema permanece íntegro e guarda o diagnóstico",
      "Desativar o conector definitivamente",
      "Ignorar: comunicações nunca chegam por DJEN",
    ],
    correta: 1,
    explicacao: "Falhas de rede são tratadas de forma graciosa com diagnóstico auditável por provedor; o botão pode ser acionado novamente e o ciclo automático continua.",
  },
];

const CHECKLIST = [
  "Configurar o Conector DJEN com a inscrição OAB do escritório e salvar a configuração.",
  "Executar \"Sincronizar agora\" e interpretar corretamente o estado da sincronização (sucesso, parcial, falha graciosa).",
  "Concentrar a caixa de comunicações: marcar ciências como lidas e arquivar o que não gera prazo.",
  "Usar \"Calcular pelo teor\" e diferenciar os dois badges de origem do prazo (extraído × fallback).",
  "Calcular um prazo manualmente informando feriado local e ler a memória de cálculo completa.",
  "Cadastrar um cliente, abrir uma matéria e registrar um atendimento no dossiê.",
  "Buscar jurisprudência nos provedores oficiais e registrar um julgado manual com fonte declarada.",
  "Ler a política de dados e o catálogo de fontes em /fontes, entendendo as origens legítimas de dados.",
];

const FAQ = [
  { pergunta: "O conector de jurisprudência retornou erro 403 no catálogo do STJ. É defeito?", resposta: "Não. O catálogo Dados Abertos do STJ pode aplicar bloqueio anti-automação (HTTP 403). O sistema degrada com elegância: registra o diagnóstico por provedor e segue operando com LexML e registro manual. Em ambiente sem acesso à rede judicial (DNS bloqueado), todas as coletas externas falham com \"fetch failed\" — comportamento esperado." },
  { pergunta: "A memória de cálculo pode substituir a conferência humana?", resposta: "Não. A memória é auditável e cita a base normativa de cada passo, mas feriados locais e portarias de suspensão do tribunal devem ser conferidos no calendário oficial (CPC, art. 216). O prazo calculado é apoio à decisão, não decisão." },
  { pergunta: "Posso editar o prazo calculado manualmente?", resposta: "O prazo declarado no teor tem prioridade e o padrão do escritório só entra como fallback. Ajustes de interpretação (por exemplo, prazo em dobro comprovado) são feitos na conferência humana e registrados nos atendimentos da matéria." },
  { pergunta: "Os dados de demonstração são de clientes reais?", resposta: "Não. Todo o acervo demo (clientes, matérias, comunicações e julgados com ementas) é fictício, marcado com isDemoData = 1 e gerado para treinamento. Dados reais só entram por cadastro próprio ou sincronização autenticada, sob política LGPD." },
];

const CHAVE_CHECKLIST = "atlas-treinamento-checklist-v1";

function carregarChecklist(): boolean[] {
  try {
    const bruto = localStorage.getItem(CHAVE_CHECKLIST);
    if (bruto) {
      const parsed = JSON.parse(bruto);
      if (Array.isArray(parsed) && parsed.length === CHECKLIST.length) return parsed;
    }
  } catch { /* estado corrompido: recomeça */ }
  return CHECKLIST.map(() => false);
}

export default function OfficeTreinamentoPage() {
  const [checklist, setChecklist] = useState<boolean[]>(() => carregarChecklist());
  const [respostas, setRespostas] = useState<(number | null)[]>(QUIZ.map(() => null));

  useEffect(() => {
    try { localStorage.setItem(CHAVE_CHECKLIST, JSON.stringify(checklist)); } catch { /* sem armazenamento */ }
  }, [checklist]);

  const concluidos = checklist.filter(Boolean).length;
  const respondidas = respostas.filter(r => r !== null).length;
  const acertos = respostas.filter((r, i) => r === QUIZ[i].correta).length;

  return (
    <main className="office-page">
      <header className="office-topbar">
        <div className="office-topbar-brand">
          <GraduationCap size={20} />
          <div>
            <h1>Treinamento do Escritório</h1>
            <p>Guia operacional do Atlas Forense: módulos, fluxo de trabalho, motor de prazos e verificação de aprendizado</p>
          </div>
        </div>
        <nav className="office-nav">
          <a href="/escritorio/clientes">Clientes</a>
          <a href="/escritorio/comunicacoes">Comunicações</a>
          <a href="/escritorio/jurisprudencia">Jurisprudência</a>
          <a href="/escritorio/treinamento" className="active">Treinamento</a>
          <a href="/">Atlas Forense</a>
        </nav>
      </header>

      <section className="office-panel">
        <h2><Landmark size={16} /> Como o Atlas Forense se organiza</h2>
        <p className="office-panel-sub">
          Plataforma de dados judiciais do JEC BH e Betim: uma camada pública de jurimetria
          (Atlas, Compêndio, RMBH, Nacional) e uma camada operacional do escritório
          (Clientes, Comunicações, Jurisprudência). Treine-se módulo a módulo:
        </p>
        <div className="trein-modulos">
          {MODULOS.map(m => (
            <article key={m.titulo} className="trein-modulo">
              <m.icone size={16} />
              <h3>{m.titulo}</h3>
              <p>{m.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="office-panel">
        <h2><Workflow size={16} /> Fluxo de trabalho recomendado</h2>
        <ol className="trein-fluxo">
          {FLUXO.map((passo, i) => (
            <li key={i}>
              <span className="trein-fluxo-num">{String(i + 1).padStart(2, "0")}</span>
              <p>{passo}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="office-panel">
        <h2><Timer size={16} /> Motor de prazos LexValida — regras implementadas</h2>
        <p className="office-panel-sub">
          O motor calcula com memória auditável e base normativa explícita. Regras implementadas
          e testadas por regressão a cada alteração do sistema:
        </p>
        <div className="trein-regras">
          {REGRAS.map(r => (
            <div key={r.base} className="trein-regra">
              <span className="trein-regra-base"><Scale size={12} /> {r.base}</span>
              <p>{r.texto}</p>
            </div>
          ))}
        </div>
        <div className="trein-badge-demo">
          <span className="office-teor-origem is-extraido"><BadgeCheck size={12} /> Extraído do teor — prazo declarado na comunicação (ex.: “quinze dias úteis”)</span>
          <span className="office-teor-origem is-padrao"><CircleAlert size={12} /> Fallback — sem prazo no teor: padrão do escritório aplicado; confira o despacho</span>
        </div>
      </section>

      <section className="office-panel">
        <h2><ShieldCheck size={16} /> LGPD e boas práticas</h2>
        <ul className="trein-lista">
          <li>Cadastre apenas dados necessários à finalidade (princípio da necessidade): documento, contato e notas essenciais.</li>
          <li>O sistema nunca transfere dados do escritório para as camadas públicas — jurisimetria e acervo público usam somente metadados públicos.</li>
          <li>Comunicações e clientes cadastrados podem ser arquivados; o histórico de atendimentos mantém rastro de quem orientou o quê.</li>
          <li>Dados de demonstração (isDemoData) são fictícios e seguros para treinamento — nunca use clientes reais em teste.</li>
        </ul>
      </section>

      <section className="office-panel">
        <h2><BadgeCheck size={16} /> Checklist de treinamento ({concluidos}/{CHECKLIST.length})</h2>
        <p className="office-panel-sub">Marque conforme avança. O progresso fica salvo neste navegador (nenhum dado sai do computador).</p>
        <div className="trein-progresso" role="progressbar" aria-valuenow={concluidos} aria-valuemin={0} aria-valuemax={CHECKLIST.length}>
          <div className="trein-progresso-barra" style={{ width: `${(concluidos / CHECKLIST.length) * 100}%` }} />
        </div>
        <ul className="trein-checklist">
          {CHECKLIST.map((item, i) => (
            <li key={i}>
              <label className="office-check">
                <input
                  type="checkbox"
                  checked={checklist[i]}
                  onChange={e => setChecklist(prev => prev.map((v, j) => (j === i ? e.target.checked : v)))}
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="office-panel">
        <h2><BookOpenCheck size={16} /> Quiz de verificação ({respondidas}/{QUIZ.length} respondidas · {acertos} acertos)</h2>
        <p className="office-panel-sub">Gabarito comentado imediato; a pontuação é autoavaliação — nada é gravado no servidor.</p>
        <div className="trein-quiz">
          {QUIZ.map((q, qi) => (
            <article key={qi} className="trein-questao">
              <h3>{qi + 1}. {q.enunciado}</h3>
              <div className="trein-alternativas">
                {q.alternativas.map((alt, ai) => {
                  const respondida = respostas[qi] !== null;
                  const classe = !respondida ? "" : ai === q.correta ? " is-correta" : respostas[qi] === ai ? " is-incorreta" : "";
                  return (
                    <label key={ai} className={`trein-alternativa${classe}`}>
                      <input type="radio" name={`quiz-${qi}`} checked={respostas[qi] === ai} disabled={respondida} onChange={() => setRespostas(prev => prev.map((v, j) => (j === qi ? ai : v)))} />
                      <span>{alt}</span>
                    </label>
                  );
                })}
              </div>
              {respostas[qi] !== null && (
                <p className="trein-explicacao"><Scale size={12} /> {q.explicacao}</p>
              )}
            </article>
          ))}
        </div>
        {respondidas === QUIZ.length && (
          <p className="trein-resultado" role="status">
            Pontuação final: {acertos}/{QUIZ.length}. {acertos === QUIZ.length ? "Excelente — equipe pronta para operar o Atlas Forense." : "Revise os módulos indicados e refaça o quiz."}
          </p>
        )}
      </section>

      <section className="office-panel">
        <h2><ScrollText size={16} /> Perguntas frequentes</h2>
        <div className="trein-faq">
          {FAQ.map((f, i) => (
            <details key={i} className="trein-faq-item">
              <summary>{f.pergunta}</summary>
              <p>{f.resposta}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
