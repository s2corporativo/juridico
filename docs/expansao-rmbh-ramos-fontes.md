# Expansão RMBH e ramos do Direito — fontes e escopo inicial

**Data de pesquisa:** 28/08/2026  
**Estado:** definição de recorte e fontes; sem nova coleta ou inferência estatística.

## Recorte territorial

A Assembleia Legislativa de Minas Gerais informa que a **Região Metropolitana de Belo Horizonte (RMBH) é composta por 34 municípios**; a fonte normativa é a Lei Complementar estadual nº 89, de 12/01/2006. A relação legal inclui, entre outros, Baldim, Belo Horizonte, Betim, Brumadinho, Caeté, Capim Branco, Confins, Contagem, Esmeraldas, Florestal, Ibirité, Igarapé, Itaguara, Itatiaiuçu, Jaboticatubas, Juatuba, Lagoa Santa, Mário Campos, Mateus Leme, Matozinhos, Nova Lima, Nova União, Pedro Leopoldo, Raposos, Ribeirão das Neves, Rio Acima, Rio Manso, Sabará, Santa Luzia, São Joaquim de Bicas, São José da Lapa, Sarzedo, Taquaraçu de Minas e Vespasiano.[1]

> O Colar Metropolitano possui 14 municípios adicionais, mas não será incorporado automaticamente ao filtro RMBH. Qualquer extensão exigirá indicação distinta de “Colar Metropolitano”, para não confundir os recortes jurídicos e territoriais.

## Ramos jurídicos de expansão

As Tabelas Processuais Unificadas do CNJ são a referência para classes, assuntos e movimentos. A consulta pública de assuntos, atualizada em 15/04/2026, apresenta raízes nacionais que sustentam a navegação temática do Atlas, como Direito Civil (`899`), Direito do Consumidor (`1156`), Direito Administrativo e outras matérias de Direito Público (`9985`), Direito Ambiental (`10110`), Direito da Saúde (`12480`), Direito Tributário (`14`), Direito Penal (`287`), Direito do Trabalho (`864`) e Direito Previdenciário (`195`).[2]

A expansão inicial deve diferenciar a **matéria** (assunto TPU), a **competência** (Justiça Estadual, Federal ou do Trabalho), a **classe processual** e a **fonte**. Assim, um assunto trabalhista poderá ser catalogado como ramo, mas não será consultado no alias TJMG como se fosse competência estadual; a camada correspondente só será ativada quando houver fonte e tribunal competente mapeados.[2]

| Grupo inicial | Raiz TPU | Fonte/competência a mapear | Regra de exibição |
| --- | ---: | --- | --- |
| Cível e consumidor | 899 / 1156 | TJMG, JEC ou Justiça comum | Exibir após confirmar classe e órgão. |
| Família, sucessões e registros | Subárvores de Civil / 7724 | TJMG, Justiça comum | Não misturar com JEC sem confirmação da classe. |
| Fazenda pública, tributário, saúde e administrativo | 9985 / 14 / 12480 | TJMG e JEFazenda, conforme competência | Manter a unidade competente declarada. |
| Penal e JECRIM | 287 | TJMG/JECRIM | Separar movimentos de decisão e inteiro teor. |
| Ambiental | 10110 | TJMG ou Justiça Federal, conforme caso | Tratar assunto e competência em camadas distintas. |
| Trabalho e previdenciário | 864 / 195 | TRT e Justiça Federal, respectivamente | Planejar como conectores futuros; não simular dados no Atlas atual. |

## Limites de dados e publicação

Nesta fase, a ampliação territorial e temática será construída a partir de **fontes públicas, códigos oficiais e métricas agregadas**. A existência de um município na RMBH não implica que haja órgão, série ou acervo confirmado para ele. Processos concretos, PDFs, partes, CPF, endereços, respostas brutas e credenciais permanecem fora da camada pública por padrão.

## Piloto Cível/Consumidor — filtro oficial provisório

O primeiro piloto agregado selecionado pelo usuário será limitado às raízes TPU **Direito Civil (`899`)** e **Direito do Consumidor (`1156`)**, ambas presentes na consulta pública de assuntos do CNJ. A consulta piloto deverá confirmar, com `size: 0`, o modo como `assuntos.codigo` é indexado no DataJud/TJMG antes de produzir qualquer métrica. Não será usado código de órgão extraído de levantamento orientativo como filtro de coleta sem confirmação no retorno agregado do alias `tjmg`.

| Camada | Regra do piloto | Vedação |
| --- | --- | --- |
| Assunto | `899` e `1156`, com confirmação de cobertura da subárvore no retorno agregado | Inferir que todo processo cível é consumerista ou vice-versa. |
| Tribunal e grau | Alias `tjmg`, Justiça Estadual, 1º grau | Consultar dados de Trabalho, Federal ou outro tribunal como se fossem TJMG. |
| Territorialidade | Município, comarca-sede e órgão serão mantidos separados | Atribuir à cidade-satélite a métrica da comarca-sede. |
| Resultado | Apenas contagens, buckets e manifesto sanitizado | Listar processos, partes, documentos, respostas brutas ou credenciais. |

> O mapeamento paralelo de comarcas é orientativo. O piloto só poderá incluir um município quando o órgão correspondente estiver comprovado por resposta agregada com proveniência `tjmg`, não apenas por rótulo institucional ou código de comarca.

## Mapeamento preliminar de jurisdição TJMG

Foi produzido um levantamento de orientação com 34 consultas institucionais do TJMG. Ele servirá apenas para organizar a próxima coleta e **não será publicado como métrica** até a validação individual das fontes e dos códigos de órgão na API DataJud. O mapeamento indica comarcas próprias nos quatro municípios prioritários: Belo Horizonte, Betim, Contagem e Igarapé. Também identifica municípios que dependem de comarca-sede, como Baldim (Sete Lagoas), Capim Branco (Matozinhos), Florestal (Juatuba), Mário Campos e Sarzedo (Ibirité), Nova União e Taquaraçu de Minas (Caeté), Raposos e Rio Acima (Nova Lima), Rio Manso (Bonfim), São Joaquim de Bicas (Igarapé) e São José da Lapa (Vespasiano).

> A vinculação de município a comarca não autoriza somar órgãos ou atribuir a uma cidade dados de outra. A próxima camada registrará separadamente: município IBGE, comarca-sede, código de órgão DataJud, alias do tribunal, tipo de unidade, fonte e nível de confirmação.

### Confirmações diretas prioritárias

As páginas do Guia Judiciário do TJMG consultadas diretamente em 28/08/2026 confirmaram Belo Horizonte (`0024`) como comarca de entrância especial, Contagem (`0079`) como comarca de entrância especial e Igarapé (`0301`) como comarca de segunda entrância. A lista institucional da 2ª Região da Corregedoria também relaciona Betim (`027`), Contagem (`079`) e Igarapé (`301`) entre as comarcas da região.[3]

Essas confirmações tratam de **existência e organização jurisdicional**, não de volume processual. Elas não autorizam exposição dos contatos e endereços presentes no Guia nem dispensam a identificação do código de órgão DataJud correspondente quando houver coleta de métricas.

## Referências

[1] [ALMG — Região Metropolitana: informações gerais](https://politicaspublicas.almg.gov.br/temas/regiao_metropolitana/entenda/informacoes_gerais.html?tagNivel1); [Lei Complementar nº 89, de 12/01/2006](https://www.almg.gov.br/legislacao-mineira/texto/LCP/89/2006/?cons=1).

[2] [CNJ — Consulta Pública de Assuntos TPU](https://www.cnj.jus.br/sgt/consulta_publica_assuntos.php); [CNJ — Consulta Pública de Classes TPU](https://www.cnj.jus.br/sgt/consulta_publica_classes.php).

[3] [TJMG — Guia Judiciário: Belo Horizonte](https://www8.tjmg.jus.br/servicos/gj/guia/primeira_instancia/consulta.do?linesByPage=10&codigoMunp=0024&codigoComposto=MG_0024&opcConsulta=1); [TJMG — Guia Judiciário: Contagem](https://www8.tjmg.jus.br/servicos/gj/guia/primeira_instancia/consulta.do?codigoComposto=MG_0079&opcConsulta=1); [TJMG — Guia Judiciário: Igarapé](https://www8.tjmg.jus.br/servicos/gj/guia/primeira_instancia/consulta.do?linesByPage=10&codigoMunp=0301&codigoComposto=MG_0301&opcConsulta=1); [TJMG — Comarcas integrantes da 2ª Região](https://www.tjmg.jus.br/portal-tjmg/institucional/corregedoria/comarcas-integrantes-da-2-regiao.htm).
