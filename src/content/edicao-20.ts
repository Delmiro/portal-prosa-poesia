/**
 * Conteúdo baseado na Edição 20 (PDF) — março/2026, Fortaleza/CE, Volume 2.
 */

export const edicao20Meta = {
  numero: 20,
  volume: 2,
  mesAno: "Março 2026",
  local: "Fortaleza, CE",
  editores: ["Gilson Pónthes", "Pedro Blum"] as const,
} as const;

/** Nome e rodapé das páginas internas, como no PDF. */
export const edicao20Publicacao = {
  nomeRodape: "Revista Voz da Palavra",
  nomeCurto: "Voz da Palavra",
} as const;

/**
 * Capa 16:9. A URL antiga (photo-1526721942279…) devolvia 404 no Unsplash.
 * Para usar a capa real do PDF: exporte a página 1 em JPEG para `public/capa-edicao-20.jpg`
 * e troque `src` para `"/capa-edicao-20.jpg"`.
 */
export const capaEdicao20 = {
  src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&h=900&q=80",
  alt: "Livros em biblioteca — ilustração editorial até colocar a capa do PDF em public/",
} as const;

/**
 * Fotos: URLs públicas (Unsplash) como provisão. Substitua por arquivos em
 * `/public/autores/nome.jpg` quando tiver as fotos oficiais da revista.
 */
export const autoresEdicao20 = [
  {
    nome: "Bernivaldo Carneiro",
    destaque: "Conto",
    fotoSrc:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80",
    fotoAlt: "Retrato de Bernivaldo Carneiro",
  },
  {
    nome: "Gilson Pónthes",
    destaque: "Poesia e humor",
    fotoSrc:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80",
    fotoAlt: "Retrato de Gilson Pónthes",
  },
  {
    nome: "Pedro Blum",
    destaque: "Microconto e editorial",
    fotoSrc:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80",
    fotoAlt: "Retrato de Pedro Blum",
  },
  {
    nome: "Silvio Cayua",
    destaque: "Colaboração",
    fotoSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
    fotoAlt: "Retrato de Silvio Cayua",
  },
] as const;

/** Editores em destaque no PDF (pág. 3): Gilson e Pedro. */
export const editoresDestaqueEdicao20 = [autoresEdicao20[1], autoresEdicao20[2]] as const;

/** Textos alinhados ao PDF “Edição 20.pdf” (Fortaleza/CE, março 2026, Volume 2). */
export const chamadaAutoresPdf = {
  titulo: "Um Espaço Especial para Destacar os Autores",
  subtitulo: "Escritores e Poetas Nesta Revista",
  creditoEditores: "Gilson Pónthes · Pedro Blum",
} as const;

export const manifestoRevista = `Que esta revista seja pausa, presença e permanência.
Que cada texto convide a ler com calma, pensar com profundidade e sentir com verdade.
Que a palavra não apenas passe — fique.
E que algo em você continue depois da leitura.`;

export const expedienteEdicao20 = {
  presidente: "Gilson de Albuquerque Pontes",
  vicePresidente: "Pedro Blum de Moura",
  revista: "Voz da Palavra",
  editorChefe: "Gilson de Albuquerque Pontes",
  criadores: "Gilson de Albuquerque Pontes e Pedro Blum de Moura",
  revisao: "Emmanuela A. Amaral de Moura",
  designDiagramacao: "Gilson Ponthes",
  ilustracoes: "Gilson de Albuquerque Pontes",
  colaboradores: "—",
  redesSociais: "Site, Instagram, Facebook, Google e WhatsApp",
  notaLegal:
    "Todos os textos e imagens são de responsabilidade da revista; a reprodução só é permitida com autorização por escrito.",
} as const;

export const editorialEdicao20 = {
  titulo: "Editorial",
  tituloPrincipal: "A Literatura como Combustível da Memória",
  linhaEditores: "Editores: Gilson Pónthes & Pedro Blum",
  colunaEsquerda: `Esta revista vem a público com um propósito claro: valorizar seus autores e dar espaço às múltiplas vozes que encontram na literatura um território fértil de expressão. Cada colaborador que aqui escreve traz consigo uma visão de mundo, uma memória particular e uma forma própria de transformar a experiência humana em palavra escrita.

Reunimos, nestas páginas, textos para diferentes gostos e sensibilidades. Há reflexões, narrativas, poemas e pensamentos que dialogam com o cotidiano, com a cultura e com a imaginação. A diversidade de estilos e temas não é acaso: ela reflete a riqueza do olhar humano e a pluralidade de caminhos que a literatura pode percorrer.`,
  colunaDireita: `A literatura sempre foi, ao longo da história, um dos grandes combustíveis da memória. Por meio dela, lembranças individuais e coletivas ganham permanência. O que poderia se perder no tempo encontra abrigo nas páginas escritas, atravessando gerações e alcançando novos leitores.

Cada texto publicado nesta revista é também um gesto de partilha. O autor escreve, mas a obra só se completa quando encontra o leitor. É nesse encontro silencioso entre quem escreve e quem lê que a palavra ganha vida, provoca reflexão e desperta emoções que muitas vezes permanecem guardadas no íntimo de cada um.

Que esta publicação seja mais do que um conjunto de páginas. Que seja um espaço de encontro, de memória e de permanência. Que cada leitura ofereça uma pausa no ritmo apressado do mundo e permita ao leitor percorrer, com calma, os caminhos da imaginação, da sensibilidade e do pensamento.`,
};

export const citacaoVidaMuda = {
  linhas: [
    "A vida muda",
    "quando",
    "você decide",
    "não desistir",
    "de si.",
  ] as const,
  autor: "Gilson Pónthes",
} as const;

export const citacaoInvejoso = {
  texto: `Nunca dependa ou espere o aplauso de um invejoso, pois ele é fracassado de tanto desejar o insucesso dos vitoriosos.`,
  autor: "Pedro Blum",
} as const;

export const textoEntreEspumaEternidade = {
  titulo: "Entre a Espuma e a Eternidade",
  autor: "Bernivaldo Carneiro",
  corpo: `Há um exercício quase metafísico em equilibrar-se numa banheira escorregadia: entre a espuma que some e a eternidade que não avisa, o corpo aprende a medir o riso e o susto. Onde a água morna finge segurança, a pele descobre que todo apoio é provisório — e que a graça está em não confundir o instante com a promessa.

Entre o sabonete e o azulejo, entre o riso e o tropeço, ficamos nós: criaturas de espuma e desejo, tentando nomear o que escorre pelos dedos. E talvez a eternidade não seja mais que isto: lembrar, depois do susto, que ainda estamos inteiros — ou inteiros o bastante para rir de novo.`,
} as const;

export const licoesDoPensar = {
  titulo: "Lições do Pensar",
  autor: "Silvio Cayua",
  epigrafes: [
    "A construção de uma boa imagem demanda muito tempo.",
    "A desconstrução é num piscar de olhos.",
  ] as const,
  corpo: `Entre o tempo que edifica e o instante que desfaz, o pensamento aprende a pesar palavras. Não há vitrine que não pague o preço do cuidado — e não há queda que não ensine a ler o próprio chão.`,
} as const;

export const textoManhaCultural = {
  titulo: "Manhã Cultural — Revista Voz da Palavra",
  subtitulo: "Evento realizado em 28 de fevereiro — Sítio do escritor Bernivaldo Carneiro",
  corpo: `Realizou-se uma manhã dedicada à palavra e à convivência, com o lançamento da revista Voz da Palavra e a participação dos editores Gilson Pónthes e Pedro Blum. O encontro contou com momentos musicais conduzidos por João Ângelo, intervenções literárias e reflexões em torno da obra de Patativa do Assaré, além de uma roda de conversa sobre a LIEPE — Liga dos Ilustradores, Escritores e Poetas de Eusébio.`,
} as const;

/** Entradas do sumário (páginas 7–20 do PDF). */
export const itensSumarioPdf = [
  { titulo: "O Gigante Brasileiro — Microconto (Pedro Blum)", pdfPage: 7 },
  { titulo: "A vida muda quando você decide não desistir de si (Gilson Pónthes)", pdfPage: 8 },
  { titulo: "Nunca dependa ou espere o aplauso de um invejoso (Pedro Blum)", pdfPage: 9 },
  { titulo: "Entre a Espuma e a Eternidade — Bernivaldo Carneiro", pdfPage: 10 },
  { titulo: "Papagaio Falante — Gilson Pónthes", pdfPage: 11 },
  { titulo: "Ler é o tempo silencioso em que a mente cria asas — Gilson Pónthes", pdfPage: 12 },
  { titulo: "Crescer dói, mas permanecer parado dói mais — Gilson Pónthes", pdfPage: 13 },
  { titulo: "Lições do Pensar — Silvio Cayua", pdfPage: 14 },
  { titulo: "8 de Março — Gilson Pónthes", pdfPage: 15 },
  { titulo: "Oh Nomezinho Safado! — Bernivaldo Carneiro", pdfPage: 16 },
  { titulo: "Manhã Cultural — Revista Voz da Palavra", pdfPage: 17 },
  { titulo: "Psiu! A rua soletra: Solidão — Gilson Pónthes", pdfPage: 18 },
  { titulo: "Psiu! A noite respira: Calma", pdfPage: 19 },
  { titulo: "Psiu! Silêncio — Gilson Pónthes", pdfPage: 20 },
] as const;

export const seriePsiu = [
  {
    id: "solidao",
    titulo: "Psiu!",
    subtitulo: "A rua soletra: Solidão",
    autor: "Gilson Pónthes",
    verso: `A rua soletra em baixo calado
o que a gente foge de ouvir:
solidão, silábica, no asfalto molhado.`,
  },
  {
    id: "calma",
    titulo: "Psiu!",
    subtitulo: "A noite respira: Calma",
    autor: "Gilson Pónthes",
    verso: `A noite respira devagar,
e onde havia pressa nasce um lugar
para o silêncio se deitar.`,
  },
  {
    id: "silencio",
    titulo: "Psiu!",
    subtitulo: "Silêncio",
    autor: "Gilson Pónthes",
    verso: `Psiu: nem tudo precisa ser dito.
Às vezes o poema começa
onde a voz aprende a parar.`,
  },
] as const;

export const destaquesConteudo = [
  {
    titulo: "O gigante brasileiro",
    tipo: "Microconto",
    autor: "Pedro Blum",
    href: "/contos/o-gigante-brasileiro",
    resumo:
      "Em viagem ao Brasil, um jovem empresário português diante de um prédio imponente — e o que realmente o impressionou.",
    imagemSrc:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=675&q=80",
    imagemAlt: "Arranha-céus urbanos — microconto O gigante brasileiro",
  },
  {
    titulo: "Papagaio falante",
    tipo: "Humor",
    autor: "Gilson Pónthes",
    href: "/contos/papagaio-falante",
    resumo: "O papagaio que repete tudo… até agora sem dizer nada.",
    imagemSrc:
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&h=675&q=80",
    imagemAlt: "Papagaio colorido — humor Papagaio falante",
  },
  {
    titulo: "8 de março",
    tipo: "Poema",
    autor: "Gilson Pónthes",
    href: "/poemas/8-de-marco",
    resumo:
      "Versos sobre memória de luta, mulher como horizonte e igualdade em construção.",
    imagemSrc:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&h=675&q=80",
    imagemAlt: "Mulheres reunidas — poema 8 de março",
  },
] as const;

export const outrosTextos = [
  { titulo: "Oh Nomezinho Safado!", tipo: "Conto", autor: "Bernivaldo Carneiro" },
  { titulo: "Ler é o tempo silencioso…", tipo: "Poema", autor: "Gilson Pónthes" },
  { titulo: "Crescer dói…", tipo: "Poema", autor: "Gilson Pónthes" },
] as const;

export const microcontoGiganteBrasileiro = {
  titulo: "O gigante brasileiro",
  autor: "Pedro Blum",
  corpo: `Em viagem ao Brasil, um jovem empresário português parou diante de um prédio imponente e perguntou o que era.

— A casa de um gigante — responderam.

Ele ficou esperando para vê-lo. Cansado, observou apenas um caminhão descarregar enormes rolos de papel.

De volta à sua terra, perguntaram o que mais o impressionara.

Ele respondeu:

— O gigante eu não vi… mas vi descarregarem seu papel higiênico.`,
} as const;

export const humorPapagaio = {
  titulo: "Papagaio falante",
  autor: "Gilson Pónthes",
  corpo: `Um homem chega em casa com um papagaio que fala.

No dia seguinte, o vizinho pergunta:

— E aí, o papagaio é inteligente?

O homem responde:

— Muito! Tudo que eu falo ele repete.

— Que incrível! E o que ele já disse?

— Até agora… nada.`,
} as const;

export const contoOhNomezinho = {
  titulo: "Oh Nomezinho Safado!",
  autor: "Bernivaldo Carneiro",
  corpo: `Batizaram-na Leviana, não por vislumbrarem desvio de conduta ou afronta à moral doméstica, mas pela junção inocente e traiçoeira dos nomes dos pais: Levi e Ana.

Oh Nomezinho

Safado!`,
} as const;

export const poemaLer = {
  titulo: "Ler",
  autor: "Gilson Pónthes",
  corpo: `Ler
é o tempo
silencioso
em que a mente
cria asas.`,
} as const;

export const poemaCrescerDoi = {
  titulo: "Crescer dói",
  autor: "Gilson Pónthes",
  corpo: `Crescer dói,
mas permanecer parado
dói mais.`,
} as const;

export const poema8DeMarco = {
  titulo: "8 de março",
  autor: "Gilson Pónthes",
  corpo: `Não é flor que se entrega
e murcha na mesa da rotina.
É raiz que rompe o asfalto,
é verbo que não se inclina.
Oito de março não cabe
num gesto protocolar.
É memória de luta acesa
que insiste em continuar.
Ecoa desde as fábricas antigas,
dos passos firmes na multidão,
até o grito que hoje atravessa
ruas, telas e geração.
Mulher é chão e horizonte,
é cuidado e revolução.
É quem escreve a própria história
com tinta, sangue e convicção.
Que este dia não seja pausa,
mas permanência e direção:
igualdade não é concessão —
é direito em construção.`,
} as const;
