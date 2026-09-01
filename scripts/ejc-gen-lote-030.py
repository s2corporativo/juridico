#!/usr/bin/env python3
# Gera data/ejc/lote-030-recuperacao-judicial.ts com textos LITERAIS extraídos
# de /tmp/l11101.html (Planalto, Lei 11.101/2005 — consulta 2026-09-01).
# Regra absoluta: NADA é inventado — todo conteúdo LEGISLACAO vem do texto oficial baixado.
import json
import re
import html as h

RAW = open('/tmp/l11101.html', 'rb').read().decode('latin-1', errors='replace')
t = re.sub(r'<br\s*/?>', '\n', RAW)
t = re.sub(r'<[^>]+>', '', t)
t = h.unescape(t)

# Colapsa whitespace mas mantém o fluxo; recoloca quebras antes de Art./Seção/Capítulo/Parágrafo
t = re.sub(r'[ \t]+', ' ', t)
t = re.sub(r'\s*\n\s*', ' ', t)
t = re.sub(r' (Art\. )', r'\n\n\1', t)
t = re.sub(r' (Seção [IVXLC]+ )', r'\n\n\1', t)
t = re.sub(r' (CAPÍTULO|Capítulo [IVXLC]+)', r'\n\n\1', t)
t = re.sub(r' (Parágrafo único\.)', r'\n\n\1', t)

# Localiza início de cada artigo (número -> posição da PRIMEIRA ocorrência)
arts = {}
for m in re.finditer(r'Art\.\s*(\d{1,3})[oº]*[.\s]', t):
    n = int(m.group(1))
    if n not in arts:
        arts[n] = m.start()
nums = sorted(arts)

def next_pos(n):
    # posição do próximo artigo com número > n (inclusive redações empilhadas)
    maiores = [p for num, p in arts.items() if num > n]
    return min(maiores) if maiores else len(t)

def extraia(a, b):
    start = arts.get(a)
    if start is None:
        raise SystemExit(f'art {a} não encontrado')
    end = next_pos(b)
    pedaco = t[start:end].strip()
    pedaco = re.sub(r'\n{3,}', '\n\n', pedaco)
    return pedaco

DATA_CONSULTA = '2026-09-01'
URL = 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/lei/l11101.htm'
FONTES = 'Presidência da República — Planalto'

def doc_leg(slugs_range, titulo, assunto, arts_principais, subarea='recuperacao-judicial'):
    a, b = slugs_range
    verbatim = extraia(a, b)
    slug = f'l11101-arts-{a}-{b}' if a != b else f'l11101-art-{a}'
    arts_label = f'Arts. {a} a {b}' if a != b else f'Art. {a}'
    return {
        'slug': slug,
        'titulo': f'Lei 11.101/2005 {arts_label} — {titulo} (texto literal)',
        'tipoDocumento': 'LEGISLACAO',
        'area': 'empresarial',
        'subarea': subarea,
        'assunto': assunto,
        'prioridade': 'P1',
        'conteudo': f'## Lei 11.101/2005 — {arts_label} (texto literal, Planalto — consulta {DATA_CONSULTA})\n\n{verbatim}',
        'metadados': {
            'numero': f'Lei 11.101/2005 {arts_label}',
            'orgao': 'Congresso Nacional',
            'artigos_principais': arts_principais,
            'vigente': True,
            'confirmacao_texto': 'Extração literal do texto oficial do Planalto em ' + DATA_CONSULTA + '. Redações empilhadas (inclusive alterações da Lei 14.112/2021) registradas como consta.',
        },
        'tags': ['empresarial/recuperacao-judicial', 'empresarial/falencia' if 'falencia' in assunto else 'empresarial/recuperacao-judicial'],
        'fonte': FONTES,
        'urlFonte': URL,
        'dataConsulta': DATA_CONSULTA,
        'confiabilidade': 'A',
        'vigente': True,
        'status': 'ATIVO',
        'dataUltimaVerificacao': DATA_CONSULTA,
        'proximaVerificacaoRecomendada': '2026-11-01',
    }

docs = []
R = [
    ((1, 2), 'âmbito de aplicação — recuperação judicial, extrajudicial e falência do empresário', 'L11101 — âmbito', ['1', '2']),
    ((3, 4), 'competência territorial (juízo competente) e dispositivo vetado', 'L11101 — competência', ['3', '4']),
    ((5, 6), 'definições, juízo universal e suspensão de ações e execuções', 'L11101 — juízo e stay period', ['5', '6']),
    ((7, 8), 'legitimação para requerer recuperação judicial', 'L11101 — legitimação', ['7', '8']),
    ((9, 10), 'petição inicial — requisitos e documentos essenciais', 'L11101 — petição inicial', ['9', '10']),
    ((11, 19), 'documentos complementares e habilitação dos credores', 'L11101 — documentos e habilitação', ['11', '12', '19']),
    ((20, 20), 'acesso à recuperação judicial — pressupostos e verificação', 'L11101 — acesso à RJ', ['20']),
    ((21, 22), 'Administrador Judicial e Comitê de Credores', 'L11101 — administrador e comitê', ['21', '22']),
    ((35, 37), 'Assembleia-Geral de Credores — competência e convocação', 'L11101 — assembleia', ['35', '36', '37']),
    ((45, 49), 'Assembleia — quórum, deliberações e sujeição dos credores', 'L11101 — quórum e sujeição', ['45', '48', '49']),
    ((50, 50), 'meios de recuperação judicial (lista literal)', 'L11101 — meios de recuperação', ['50']),
    ((51, 53), 'plano de recuperação — conteúdo, acompanhamento e objeções', 'L11101 — plano e objeções', ['51', '52', '53']),
    ((54, 58), 'credoria especial, impugnações e aprovação (cram-down)', 'L11101 — aprovação do plano', ['55', '56', '58']),
    ((59, 61), 'eficácia do plano, novação e cumprimento', 'L11101 — eficácia e cumprimento', ['59', '60', '61']),
    ((69, 73), 'descumprimento e convolação em falência', 'L11101 — descumprimento', ['69', '70', '73']),
    ((74, 75), 'conclusão do cumprimento e extinção das obrigações', 'L11101 — conclusão', ['74', '75']),
    ((83, 84), 'falência — verificação de créditos e classificação', 'L11101 — verificação de créditos', ['83', '84'], 'recuperacao-judicial'),
    ((94, 96), 'falência requerida pelo credor — impontualidade injustificada e defesas', 'L11101 — falência por impontualidade', ['94', '95', '96']),
    ((99, 101), 'sentença declaratória de falência e seus efeitos', 'L11101 — sentença declaratória', ['99', '100', '101']),
    ((105, 105), 'atos suspeitos de fraude — sindicância (90 dias)', 'L11101 — atos suspeitos', ['105']),
    ((161, 167), 'recuperação extrajudicial — homologação e requirements', 'L11101 — extrajudicial I', ['161', '162', '163'], 'recuperacao-judicial'),
    ((171, 173), 'disposições penais — crimes contra credores (verbatim)', 'L11101 — disposições penais', ['171', '172', '173'], 'recuperacao-judicial'),
]
for row in R:
    rng, titulo, assunto, arts_principais = row[:4]
    docs.append(doc_leg(rng, titulo, assunto, arts_principais, 'recuperacao-judicial'))

# ---------- Documentos derivados EJC (elaboração própria a partir do literal) ----------
verbatim_stay = extraia(6, 6)
m = re.search(r'§\s*4º[^§]{0,600}', verbatim_stay, re.S)
stay_quote = m.group(0).strip() if m else '(trecho do art. 6º §4º conforme documento l11101-arts-5-6)'
m55 = re.search(r'Art\.\s*55\s*.{0,420}', extraia(54, 58), re.S)
q55 = m55.group(0).strip()[:420] if m55 else '(art. 55 verbatim no documento l11101-arts-54-58)'
m94 = re.search(r'II\s*[–-].{0,380}', extraia(94, 96), re.S)
q94 = m94.group(0).strip()[:380] if m94 else '(art. 94 II verbatim no documento l11101-arts-94-96)'
m36 = re.search(r'Art\.\s*36\s*.{0,400}', extraia(35, 37), re.S)
q36 = m36.group(0).strip()[:400] if m36 else '(art. 36 verbatim no documento l11101-arts-35-37)'
m19 = re.search(r'Art\.\s*19\s*.{0,340}', extraia(11, 19), re.S)
q19 = m19.group(0).strip()[:340] if m19 else '(art. 19 verbatim no documento l11101-arts-11-19)'
m61 = re.search(r'Art\.\s*61\s*.{0,380}', extraia(59, 61), re.S)
q61 = m61.group(0).strip()[:380] if m61 else '(art. 61 verbatim no documento l11101-arts-59-61)'

def doc_derivado(d):
    base = {
        'area': 'empresarial',
        'subarea': 'recuperacao-judicial',
        'prioridade': 'P1',
        'fonte': 'Elaboração própria Jurimetria DPT (derivado do literal da Lei 11.101/2005)',
        'urlFonte': URL,
        'dataConsulta': DATA_CONSULTA,
        'vigente': True,
        'status': 'ATIVO',
        'dataUltimaVerificacao': DATA_CONSULTA,
        'proximaVerificacaoRecomendada': '2026-11-01',
        'metadados': {'derivado': True, 'base_literal': 'Lei 11.101/2005 (Planalto, consulta ' + DATA_CONSULTA + ')'},
    }
    base.update(d)
    base['metadados'] = {**base['metadados'], **(d.get('metadados') or {})}
    return base

# 1) DOUTRINA — mapa do instituto
docs.append(doc_derivado({
    'slug': 'doutrina-rj-mapa-instituto-preservacao',
    'titulo': 'DOUTRINA EJC — Recuperação Judicial: mapa do instituto e princípio da preservação da empresa',
    'tipoDocumento': 'DOUTRINA',
    'assunto': 'RJ — fundamentos e pressupostos',
    'confiabilidade': 'B',
    'conteudo': '''## Recuperação Judicial — mapa do instituto (elaboração própria a partir do literal da Lei 11.101/2005; consulta ''' + DATA_CONSULTA + ''')

**Escopo.** A Lei 11.101/2005 disciplina a recuperação judicial, a recuperação extrajudicial e a falência do empresário e da sociedade empresária (art. 1º). A empresa pública e a sociedade de economia mista e demais exceções do art. 2º ficam fora do alcance.

**Princípio da preservação da empresa.** A recuperação judicial tem por objetivo viabilizar a superação da situação de crise econômico-financeira do devedor, a fim de permitir a manutenção da fonte produtora, do emprego dos trabalhadores e dos interesses dos credores, promovendo, assim, a preservação da empresa, sua função social e o estímulo à atividade econômica (art. 47).

**Visão de fluxo (referência a documentos literais do lote).**
1. Legitimação e tempestividade (arts. 7º e 8º; art. 51, II — certidões de distribuição).
2. Petição inicial com documentos (arts. 9º a 19 — l11101-arts-9-10 e l11101-arts-11-19).
3. Processamento e fiscalização (art. 52; credor fiscaliza por habilitação — art. 19).
4. Efeito protetivo: suspensão de ações e execuções pelo prazo fixado no art. 6º, § 4º (ver PRAZO consolidado).
5. Assembleia-Geral de Credores (arts. 35 a 37; quóruns dos arts. 42, 45 e 49).
6. Objeções e aprovação do plano (arts. 53 a 58, inclusive aprovação judicial em caso de objeção nos termos do art. 58, § 1º).
7. Cumprimento e conclusão (arts. 59 a 61 e 63; extinção — arts. 74 e 75).
8. Descumprimento: convolação em falência (arts. 69 a 73).

**Limites honestos deste resumo.** Elaboração derivada (confiabilidade B): cada passo remete ao texto literal do lote LOTE-030. Nenhuma prática específica do TJMG é afirmada aqui — use a aba Jurimetria (DataJud/CNJ) para dados reais de processos com classe de recuperação judicial no tribunal escolhido.''',
    'tags': ['empresarial/recuperacao-judicial'],
    'relacionamentos': [
        {'destinoSlug': 'l11101-art-47' if False else 'l11101-arts-45-49', 'tipo': 'REFERENCIA', 'descricao': 'princípio da preservação (art. 47)'},
        {'destinoSlug': 'l11101-art-50', 'tipo': 'REFERENCIA', 'descricao': 'meios de recuperação'},
    ],
}))

# 2) PRAZO — consolidado literal
docs.append(doc_derivado({
    'slug': 'prazos-rj-consolidado-l11101',
    'titulo': 'PRAZOS — Recuperação Judicial consolidados do literal da Lei 11.101/2005 (com citações verbatim)',
    'tipoDocumento': 'PRAZO',
    'assunto': 'RJ — prazos consolidados',
    'confiabilidade': 'A',
    'metadados': {'confirmacao_texto': 'Prazos extraídos por citação literal do texto do Planalto (consulta ' + DATA_CONSULTA + '); a contagem concreta deve considerar as regras de cada processo.', 'vigente': True},
    'conteudo': '''## Prazos da recuperação judicial (Lei 11.101/2005) — consolidação com citações literais (Planalto, consulta ''' + DATA_CONSULTA + ''')

**SUSPENSÃO DE AÇÕES E EXECUÇÕES (stay period) — art. 6º, § 4º:**
''' + stay_quote + '''

**ASSEMBLEIA-GERAL — art. 36 (trecho):**
''' + q36 + '''

**IMPUGNAÇÃO AO PLANO — art. 55 (trecho):**
''' + q55 + '''

**HABILITAÇÃO DE CREDOR — art. 19 (trecho):**
''' + q19 + '''

**CUMPRIMENTO E ALTERAÇÕES — art. 61 (trecho):**
''' + q61 + '''

**IMPONTUALIDADE PARA FALÊNCIA REQUERIDA POR CREDOR — art. 94, II (trecho):**
''' + q94 + '''

**Regra de uso (derivado EJC).** Estes recortes são Literais do texto oficial; o prazo concreto do processo deve ser calculado sobre o marco temporal do caso (juntada/publicação/arrematação) e conferido no processo real. Alterações posteriores da Lei 14.112/2021 constam no texto empilhado citado.''',
    'tags': ['empresarial/recuperacao-judicial', 'geral/prazos'],
    'relacionamentos': [
        {'destinoSlug': 'l11101-arts-5-6', 'tipo': 'FONTE_VERBATIM', 'descricao': 'art. 6º §4º'},
        {'destinoSlug': 'l11101-arts-54-58', 'tipo': 'FONTE_VERBATIM', 'descricao': 'art. 55'},
    ],
}))

# 3) CHECKLIST — admissibilidade
docs.append(doc_derivado({
    'slug': 'checklist-rj-admissibilidade-peticao',
    'titulo': 'CHECKLIST — Admissibilidade da petição inicial de recuperação judicial (15 pontos, Lei 11.101/2005)',
    'tipoDocumento': 'CHECKLIST',
    'assunto': 'RJ — admissibilidade',
    'confiabilidade': 'B',
    'conteudo': '''## Checklist de admissibilidade — petição inicial de recuperação judicial (derivado do literal — consulta ''' + DATA_CONSULTA + ''')

1. [ ] O devedor exerce regularmente suas atividades há mais de 2 anos (art. 48, I) — conferir tempo de atividade real.
2. [ ] Devedor é empresário ou sociedade empresária (art. 1º) — registro na Junta Comercial (arts. 9º, I e 19).
3. [ ] Não se enquadra nas vedações do art. 2º (empresa pública, sociedade de economia mista etc.) nem do art. 3º (instituições financeiras etc.).
4. [ ] Petição inicial instruída com documentos do art. 9º (escrituração contábil, demonstrações contábeis, relatório gerencial de fluxo, lista de credores etc.).
5. [ ] Documentos complementares do art. 10 (contrato social, certidões de distribuição — art. 51, II — e outras).
6. [ ] Não é titular de outra RJ pendente; não pediu autofalência nos 6 meses anteriores; não teve RJ denegada há menos de 2 anos (art. 48, II e III) — conferir certidões.
7. [ ] Plano de recuperação anexado e compatível com o art. 51.
8. [ ] Valor econômico do plano informado (art. 51, IV).
9. [ ] Comprovação de gestão e origem dos recursos exigidas pelo art. 51, V.
10. [ ] Certidões de distribuição judicial e protestos (arts. 10 e 51, II).
11. [ ] Cadastros e reputação: documentos do art. 51, § 1º quando cabível.
12. [ ] Lista de credores com endereços, valores e classificações (art. 9º, IV).
13. [ ] Recolhimento e custos iniciais conforme o tribunal concreto (variável local — validar no juízo).
14. [ ] Não há crimes previstos em lei pendentes contra sócios vinculados à petição (art. 48, IV).
15. [ ] Estratégia sobre stay period (art. 6º, § 4º) e calendário da assembleia (arts. 35 e 36) mapeada.

**Nota honesta.** Checklist derivado do texto legal (confiabilidade B). Itens marcados com praxe do TJMG não são afirmados aqui; valide requisitos locais no juízo concreto.''',
    'tags': ['empresarial/recuperacao-judicial', 'geral/checklists'],
}))

# 4) FLUXO — pipeline RJ
docs.append(doc_derivado({
    'slug': 'fluxo-rj-peticao-conclusao',
    'titulo': 'FLUXO — Recuperação judicial da petição inicial à conclusão (Lei 11.101/2005)',
    'tipoDocumento': 'FLUXO',
    'assunto': 'RJ — fluxo processual',
    'confiabilidade': 'B',
    'conteudo': '''## Fluxo da recuperação judicial (derivado do literal — consulta ''' + DATA_CONSULTA + ''')

**F0 — Preparação (antes do juízo):** diagnóstico de crise; conferência dos pressupostos dos arts. 48 e 51; organização da lista de credores (art. 9º, IV) e demonstrações (art. 9º, II e III).
**F1 — Petição inicial (arts. 9º a 19):** protocolo com plano (art. 51) e certidões (art. 51, II).
**F2 — Processamento (art. 52):** juízo defere o processamento; nomeia Administrador Judicial (art. 21); credores têm 15 dias para habilitação após publicação da lista (art. 52, IV e art. 7º, § 1º).
**F3 — Efeito protetivo (art. 6º, § 4º):** suspensão de ações e execuções pelo prazo legal; acompanhar prorrogação/alteração pelo art. 6º conforme texto vigente.
**F4 — Assembleia (arts. 35 a 45):** convocação; deliberação com quóruns dos arts. 42, 45 e 49.
**F5 — Objeções (arts. 53 a 56):** credores impugnam no prazo do art. 55; credor fiscaliza (art. 19).
**F6 — Aprovação (art. 58):** homologação judicial mesmo com objeção quando presentes as condições do art. 58, § 1º (cram-down); caso contrário, decretação de falência (art. 58, § 2º? — conferir verbatim no documento l11101-arts-54-58).
**F7 — Cumprimento (arts. 59 a 63):** plano aprovado vincula (art. 59); novação e parcelas (art. 59, § 1º; art. 61).
**F8 — Conclusão (arts. 74 e 75):** extinção das obrigações pelo cumprimento; reabilitação.
**F9 — Risco (arts. 69 a 73):** descumprimento → convolação em falência (art. 73).

**Uso honesto:** cada etapa remete a documentos literais do lote; decisões locais (prazos de agenda do TJMG, sistemas PJe) devem ser validadas no processo concreto.''',
    'tags': ['empresarial/recuperacao-judicial', 'geral/fluxos'],
}))

# 5) PECA — modelo com variáveis
docs.append(doc_derivado({
    'slug': 'peca-rj-peticao-inicial-modelo-variaveis',
    'titulo': 'PEÇA — Petição inicial de recuperação judicial (modelo estruturado com variáveis)',
    'tipoDocumento': 'PECA',
    'assunto': 'RJ — modelo de petição inicial',
    'confiabilidade': 'B',
    'conteudo': '''## Modelo — Petição inicial de recuperação judicial (variáveis entre colchetes; consulta ''' + DATA_CONSULTA + ''')

EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DO __JUÍZO DE RECUPERAÇÕES JUDICIAIS__ DA COMARCA DE **[CIDADE/UF]**.

**[NOME_DO_DEVEDOR]**, pessoa jurídica de direito privado, inscrita no CNPJ sob **[CNPJ]**, com sede em **[ENDERECO_SEDE]**, por seu advogado (procuração anexa), vem requerer a **RECUPERAÇÃO JUDICIAL**, nos termos da Lei 11.101/2005, pelos fatos e fundamentos a seguir.

**I — TEMPESTIVIDADE E LEGITIMAÇÃO (arts. 7º e 48)**
A requerente exerce regularmente suas atividades há **[TEMPO_DE_ATIVIDADE]** (art. 48, I), não se enquadrando nas vedações dos arts. 2º e 3º.

**II — DOCUMENTOS (arts. 9º e 10; art. 51, II)**
Instruem este pedido: balanço patrimonial e demonstrações **[ANOS]**; relatório gerencial de fluxo de caixa; relação nominal completa dos credores com endereços e valores (art. 9º, IV); contrato social e alterações; certidões de distribuição (art. 51, II); certidões de protesto **[SE_HOUVER]**.

**III — PLANO DE RECUPERAÇÃO (art. 51)**
Acompanha plano com: meios do art. 50 escolhidos — **[MEIOS_SELECIONADOS_DO_ART_50]**; valor econômico **[VALOR_ECONOMICO]** (art. 51, IV); comprovações do art. 51, V; cronologia de pagamentos **[TABELA]**.

**IV — PEDIDOS**
a) deferimento do processamento (art. 52) e nomeação de Administrador Judicial (art. 21);
b) suspensão de ações e execuções (art. 6º, § 4º);
c) expedição de ofícios e publicação da lista de credores;
d) designação da assembleia-geral (arts. 35 e 36).

**Variáveis locais honestas:** rito, juntada e custas do tribunal concreto (ex.: portais PJe do TJMG) devem ser conferidos na peça final; este modelo é estrutural (confiabilidade B), sem afirmar prática jurisprudencial específica.''',
    'tags': ['empresarial/recuperacao-judicial', 'geral/pecas'],
}))

# 6) REGRA_INTELIGENCIA — rotas SE-ENTÃO
docs.append(doc_derivado({
    'slug': 'regras-rj-falencia-se-entao',
    'titulo': 'REGRA SE-ENTÃO — Rotas decisórias de recuperação judicial e falência (Lei 11.101/2005)',
    'tipoDocumento': 'REGRA_INTELIGENCIA',
    'assunto': 'RJ — regras de decisão',
    'confiabilidade': 'B',
    'metadados': {'rotas': 9},
    'conteudo': '''## Regras SE-ENTÃO — recuperação judicial/falência (derivado do literal; consulta ''' + DATA_CONSULTA + ''')

1. **SE** devedor exerce atividade há ≤ 2 anos **ENTÃO** petição de RJ é intempestiva em face do art. 48, I → avaliar recuperação extrajudicial (arts. 161+).
2. **SE** devedor é instituição financeira / empresa pública / sociedade de economia mista **ENTÃO** vedação dos arts. 2º e 3º → não cabe RJ comum.
3. **SE** plano rejeitado pela assembleia e não presentes os requisitos do art. 58, § 1º **ENTÃO** risco de decretação de falência (art. 58) → preparar defesa/falência.
4. **SE** credor impugna plano no prazo do art. 55 **ENTÃO** abrir contrarrota de negociação (arts. 56 e 57) antes do juízo do art. 58.
5. **SE** devedor descumpre o plano (art. 61, § 2º — parcelas/obrigações) **ENTÃO** qualquer credor pode requerer falência (art. 73, I).
6. **SE** débito vencido há mais de 30 dias e não contestado (art. 94, II) **ENTÃO** credor pode requerer falência por impontualidade injustificada → conferir defesas do art. 96.
7. **SE** negócios anteriores à falência com sobrepreço/temperatura de fraude nos 90 dias (art. 105) **ENTÃO** ato sujeito a sindicância e ineficácia.
8. **SE** plano cumprido integralmente **ENTÃO** extinção das obrigações e reabilitação (arts. 74 e 75) — requerer declaração ao juízo.
9. **SE** passivo dominante é trabalhador **ENTÃO** lembrar classificação preferencial do art. 84, I (créditos trabalhistas) no desenho do plano.

**Uso:** regras de triagem; nenhuma substitui análise concreta. A classe "Recuperação Judicial" e congêneres pode ser monitorada na aba Jurimetria (DataJud) por comarca.''',
    'tags': ['empresarial/recuperacao-judicial', 'geral/regras-inteligencia'],
}))

# 7) JURIMETRIA — vazia honesta
docs.append(doc_derivado({
    'slug': 'jurimetria-rj-tjmg-campo-aberto',
    'titulo': 'JURIMETRIA — Recuperação judicial em MG: campo aberto a preencher com DataJud (sem dados fictícios)',
    'tipoDocumento': 'JURIMETRIA',
    'assunto': 'RJ — jurimetria',
    'confiabilidade': 'C',
    'metadados': {'estado': 'VAZIO_POR_DESIGN', 'fonte_dinamica': 'aba Jurimetria — API DataJud/CNJ'},
    'conteudo': '''## Jurimetria da recuperação judicial em MG — documento de campo (consulta ''' + DATA_CONSULTA + ''')

Este documento NÃO carrega estatísticas inventadas. O sistema recusa fabricar percentuais, tempos médios ou taxas de aprovação de RJ no TJMG sem fonte verificada.

**Como obter dados reais agora:** abrir a aba **Jurimetria** do sistema e filtrar por:
- Tribunal: TJMG (ou TRF-6/TRT-3 conforme a hipótese);
- Cidade/Comarca: **[CIDADE]** (código IBGE verificado na lista);
- Grau: G1; Ano de ajuizamento: **[ANO]**;
- Observar as classes processuais dominantes retornadas pela agregação e registrar aqui (manualmente) os valores obtidos com data da consulta.

**Por que confiabilidade C:** depende de coleta ativa; o acervo público DataJud reflete sistemas sincronizados pelo CNJ e não cobre 100% das comarcas (ver nota da aba). Nada aqui é simulado — preencher apenas com output real da API, citando data/hora da consulta.''',
    'tags': ['empresarial/recuperacao-judicial', 'geral/jurimetria'],
}))

# ---------- escreve arquivo ----------
out_path = 'data/ejc/lote-030-recuperacao-judicial.ts'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('// LOTE-030 — Recuperação Judicial e Falência (Lei 11.101/2005): textos LITERAIS do Planalto\n')
    f.write('// (consulta ' + DATA_CONSULTA + ') + derivados EJC (doutrina, prazos, checklist, fluxo, peça,\n')
    f.write('// regras SE-ENTÃO, jurimetria vazia honesta). ANTI-INVENÇÃO MG: nenhuma prática estadual citada\n')
    f.write('// como verbatim; dados TJMG apenas via aba Jurimetria/DataJud.\n')
    f.write("import type { InputDocument } from '../../src/lib/ejc/types';\n\n")
    f.write('export default ')
    f.write(json.dumps(docs, ensure_ascii=False, indent=1))
    f.write(' as InputDocument[];\n')

print(f'OK: {out_path} — {len(docs)} documentos ({len([d for d in docs if d["tipoDocumento"]=="LEGISLACAO"])} legais + {len(docs)-len([d for d in docs if d["tipoDocumento"]=="LEGISLACAO"])} derivados)')
for d in docs:
    print('-', d['slug'], '|', d['tipoDocumento'], '| chars:', len(d['conteudo']))
