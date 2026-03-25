/**
 * Sumário da edição 20. `pageIndex` = folha no flipbook (0 = primeira imagem).
 * `pdfPage` = número da página no PDF (1–20), alinhado à ordem em `edicao-20-prints.ts`.
 */
export const sumarioEdicao20 = [
  { id: "capa", label: "Capa", pageIndex: 0, pdfPage: 1 },
  { id: "expediente", label: "Expediente", pageIndex: 1, pdfPage: 2 },
  { id: "autores", label: "Destaque dos autores", pageIndex: 2, pdfPage: 3 },
  { id: "editorial", label: "Editorial", pageIndex: 3, pdfPage: 4 },
  { id: "sumario", label: "Sumário", pageIndex: 4, pdfPage: 5 },
  { id: "p6", label: "Página 6", pageIndex: 5, pdfPage: 6 },
  { id: "gigante", label: "O Gigante Brasileiro — Pedro Blum", pageIndex: 6, pdfPage: 7 },
  { id: "vida", label: "A vida muda… — Gilson Pónthes", pageIndex: 7, pdfPage: 8 },
  { id: "invejoso", label: "Nunca dependa… — Pedro Blum", pageIndex: 8, pdfPage: 9 },
  { id: "espuma", label: "Entre a Espuma e a Eternidade — Bernivaldo Carneiro", pageIndex: 9, pdfPage: 10 },
  { id: "papagaio", label: "Papagaio Falante — Gilson Pónthes", pageIndex: 10, pdfPage: 11 },
  { id: "ler", label: "Ler — Gilson Pónthes", pageIndex: 11, pdfPage: 12 },
  { id: "crescer", label: "Crescer dói… — Gilson Pónthes", pageIndex: 12, pdfPage: 13 },
  { id: "licoes", label: "Lições do Pensar — Silvio Cayua", pageIndex: 13, pdfPage: 14 },
  { id: "8marco", label: "8 de Março — Gilson Pónthes", pageIndex: 14, pdfPage: 15 },
  { id: "nomezinho", label: "Oh Nomezinho Safado! — Bernivaldo Carneiro", pageIndex: 15, pdfPage: 16 },
  { id: "manha", label: "Manhã Cultural", pageIndex: 16, pdfPage: 17 },
  { id: "psiu1", label: "Psiu! Solidão — Gilson Pónthes", pageIndex: 17, pdfPage: 18 },
  { id: "psiu2", label: "Psiu! Calma", pageIndex: 18, pdfPage: 19 },
  { id: "psiu3", label: "Psiu! Silêncio — Gilson Pónthes", pageIndex: 19, pdfPage: 20 },
] as const;

export const FLIPBOOK_PAGE_COUNT = sumarioEdicao20.length;
