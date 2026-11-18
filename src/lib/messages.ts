import type { Scenario } from './types'

export type Locale = 'pt' | 'en'

const pt = {
  brand: 'Vizinhos Multi-view',
  nav: {
    problema: 'O problema',
    metodo: 'Como funciona',
    demo: 'Demonstração',
    resultados: 'Resultados',
    publicacao: 'Publicação',
  },
  localeLabel: 'Idioma',
  scenarios: {
    original: 'Espaço original',
    pca: 'PCA',
    uniform: 'Multi-view uniforme',
    adaptive: 'Multi-view adaptativo',
  } as Record<Scenario, string>,
  views: ['Original', 'PCA', 'LDA', 'Aleatória', 'SVD'],
  className: (index: number) => `Classe ${index + 1}`,
  hero: {
    eyebrow: 'Trabalho de Conclusão de Curso · Engenharia de Computação · Poli-USP',
    title: 'Em que espaço procurar os vizinhos mais próximos?',
    lead:
      'Modelos baseados em recuperação fazem inferência a partir das instâncias mais próximas da consulta. ' +
      'Mas quem está mais próximo muda quando os dados são projetados em outro espaço. ' +
      'Este trabalho busca os vizinhos em vários espaços ao mesmo tempo, com pesos que se ajustam a cada consulta.',
    ctaDemo: 'Experimente a busca',
    ctaResults: 'Ver resultados',
    purity: (pure: number, k: number) => `${pure}/${k} vizinhos da classe da consulta`,
    caption: (k: number) =>
      `A mesma consulta (★) e os ${k} vizinhos encontrados pela busca no espaço original e pela busca ` +
      'multi-view adaptativa, no conjunto car-evaluation. Os dois quadros usam as mesmas coordenadas de exibição.',
  },
  problema: {
    eyebrow: 'O problema',
    title: 'Um único espaço não serve para todas as consultas',
    paragraphs: [
      'O kNN infere o rótulo de uma consulta pela votação dos seus k vizinhos mais próximos. A qualidade da predição depende inteiramente de quem são esses vizinhos.',
      'A distância usada é sempre a euclidiana. O que muda é onde os pontos estão: uma projeção como PCA ou LDA reposiciona todos os dados, e com isso muda quem está perto de quem. Cada espaço gera uma vizinhança diferente para a mesma consulta, e nenhum deles é o melhor em todas as regiões dos dados.',
      'A pergunta do trabalho é se a busca pode combinar vários espaços e, mais que isso, se essa combinação precisa mudar de consulta para consulta.',
    ],
    glossary: [
      { term: 'Espaço original', definition: 'Os atributos da tabela, padronizados. É onde o kNN clássico busca.' },
      {
        term: 'Projeção',
        definition:
          'Uma transformação linear dos atributos (PCA, LDA, projeção aleatória, SVD). Gera um novo espaço, com os mesmos pontos em outras posições.',
      },
      {
        term: 'Multi-view',
        definition: 'Nome do método. Cada espaço é uma visão dos dados, e a busca combina as distâncias de todas elas.',
      },
    ],
  },
  metodo: {
    eyebrow: 'Como funciona',
    title: 'Uma distância combinada, com pesos por consulta',
    lead:
      'A busca mede a distância da consulta a cada ponto de treino em cinco espaços, normaliza essas distâncias ' +
      'e as combina em uma só. A diferença entre as duas versões do método está nos pesos da combinação.',
    steps: [
      {
        title: '1. Cinco espaços para os mesmos dados',
        body:
          'O espaço original e quatro projeções: PCA, LDA, projeção aleatória gaussiana e SVD truncada. ' +
          'A distância é euclidiana em todos; o que muda é a posição dos pontos.',
      },
      {
        title: '2. Multi-view uniforme',
        body:
          'As distâncias de cada espaço passam por z-score e são somadas com o mesmo peso. ' +
          'Toda consulta usa a mesma combinação.',
      },
      {
        title: '3. Multi-view adaptativo',
        body:
          'Uma rede neural pequena lê a consulta e escolhe os pesos. ' +
          'Duas consultas em regiões diferentes recebem combinações diferentes.',
      },
    ],
  },
  demo: {
    eyebrow: 'Demonstração interativa',
    title: 'Clique em uma consulta e compare as vizinhanças',
    lead:
      'Cada ponto vazado do mapa é uma consulta de teste. Ao selecionar uma, os quatro cenários de busca mostram ' +
      'os k vizinhos que encontraram, a votação, quantos vizinhos têm a classe correta e os pesos que a rede ' +
      'escolheu para aquela consulta.',
    kLabel: 'Vizinhos k =',
    colorLabel: 'Colorir as consultas por',
    colorByClass: 'Classe',
    colorByDiff: 'Onde o adaptativo ajuda',
    colorHint: 'compara o Multi-view adaptativo com o espaço original, para o k atual',
    mapTitle: 'Mapa dos dados',
    mapSub: '(projeção 2D só para exibição)',
    mapLines: 'linhas:',
    mapDashed: '(tracejado)',
    note:
      'A projeção 2D serve só para exibir os pontos. Os vizinhos são escolhidos nos espaços de busca, ' +
      'que têm mais dimensões, por isso nem sempre são os pontos visualmente mais próximos no mapa.',
    queryTitle: 'Consulta',
    trueClass: 'classe real:',
    verdictOk: 'acerta',
    verdictNo: 'erra',
    purity: (pure: number, k: number) => `${pure}/${k} da classe correta`,
    predicts: 'prediz',
    compareOnMap: 'comparar no mapa',
    alwaysOnMap: 'sempre no mapa',
    weightsTitle: 'Pesos escolhidos pela rede',
    weightsSub: 'para esta consulta',
    statFixes: 'consultas que o adaptativo corrige em relação ao espaço original',
    statBreaks: 'consultas que o adaptativo piora',
    statPurity: 'vizinhos da classe correta, em média (adaptativo vs espaço original)',
    legendTrain: 'preenchido: treino',
    legendTest: 'vazado: consulta de teste',
    legendQuery: '★ consulta selecionada',
    legendFix: 'adaptativo acerta, espaço original erra',
    legendBreak: 'espaço original acerta, adaptativo erra',
    legendSame: 'mesmo resultado',
  },
  resultados: {
    eyebrow: 'Resultados',
    title: 'A busca multi-view adaptativa melhora o kNN em todos os conjuntos avaliados',
    lead:
      'Nos oito conjuntos de classificação do benchmark TALENT, a versão adaptativa supera a busca no espaço ' +
      'original em todos eles e obtém a melhor acurácia entre os cenários em sete. O ganho chega a 6,36 pontos ' +
      'percentuais em car-evaluation, um salto raro para um método tão simples quanto o kNN.',
    colDataset: 'Conjunto',
    note:
      'Acurácia (%) no conjunto de teste, k = 10, distância euclidiana. Em negrito, o melhor cenário por conjunto. ' +
      'Fonte: Maia et al. (2026).',
    gainsTitle: 'Ganho do Multi-view adaptativo sobre o espaço original',
    gainsSub: 'pontos percentuais',
    largeTitle: 'Em larga escala',
    largeSub: (n: number) => `${n} conjuntos do TALENT`,
    largeWdl: (wins: number, ties: number, losses: number) =>
      `${wins} vitórias · ${ties} empates · ${losses} derrotas`,
    largeLeft: 'multi-view uniforme contra o espaço original',
    largeRight: (median: string) => `ganho mediano de ${median} p.p.`,
    largeBody:
      'Mesmo sem a ponderação adaptativa, a combinação de espaços vence em dois de cada três conjuntos.',
  },
  publicacao: {
    eyebrow: 'Publicação',
    title:
      'Beyond Single-Space Representation: Adaptive Multi-View Neighborhood Retrieval for Tabular Learning',
    body: 'Aceito no S+SSPR 2026 (workshop internacional da IAPR), a ser publicado na série LNCS (Springer).',
    codeButton: 'Código do método',
    creditsEyebrow: 'Créditos',
    credits: [
      'Autor: Erick Diogo de Almeida Sousa',
      'Orientadora: Profa. Dra. Anna Helena Reali Costa',
      'Coorientador: Prof. Dr. Artur Jordão Lima Correia',
      'Projeto DeepTab, Centro de Ciência de Dados (C2D), Escola Politécnica da USP',
    ],
  },
  footer: 'Inferência com recuperação de instâncias vizinhas e projeção de atributos em dados tabulares · 2026',
}

const en: typeof pt = {
  brand: 'Multi-view Neighbors',
  nav: {
    problema: 'The problem',
    metodo: 'How it works',
    demo: 'Demonstration',
    resultados: 'Results',
    publicacao: 'Publication',
  },
  localeLabel: 'Language',
  scenarios: {
    original: 'Original space',
    pca: 'PCA',
    uniform: 'Uniform multi-view',
    adaptive: 'Adaptive multi-view',
  } as Record<Scenario, string>,
  views: ['Original', 'PCA', 'LDA', 'Random', 'SVD'],
  className: (index: number) => `Class ${index + 1}`,
  hero: {
    eyebrow: 'Undergraduate Thesis · Computer Engineering · Poli-USP',
    title: 'Which space should we search for the nearest neighbors in?',
    lead:
      'Retrieval-based models infer from the instances closest to the query. ' +
      'But which instances are closest changes once the data is projected into another space. ' +
      'This work searches for neighbors in several spaces at once, with weights that adapt to each query.',
    ctaDemo: 'Try the search',
    ctaResults: 'See the results',
    purity: (pure: number, k: number) => `${pure}/${k} neighbors of the query class`,
    caption: (k: number) =>
      `The same query (★) and the ${k} neighbors found by the search in the original space and by the adaptive ` +
      'multi-view search, on the car-evaluation dataset. Both frames use the same display coordinates.',
  },
  problema: {
    eyebrow: 'The problem',
    title: 'A single space does not serve every query',
    paragraphs: [
      'kNN infers the label of a query by the vote of its k nearest neighbors. The quality of the prediction depends entirely on which instances those neighbors are.',
      'The distance is always the Euclidean one. What changes is where the points lie: a projection such as PCA or LDA repositions all the data, and with that it changes which points are close to which. Each space yields a different neighborhood for the same query, and none of them is the best across every region of the data.',
      'The question of this work is whether the search can combine several spaces and, beyond that, whether that combination has to change from query to query.',
    ],
    glossary: [
      {
        term: 'Original space',
        definition: 'The standardized features of the table. This is where classic kNN searches.',
      },
      {
        term: 'Projection',
        definition:
          'A linear transformation of the features (PCA, LDA, random projection, SVD). It yields a new space, with the same points in other positions.',
      },
      {
        term: 'Multi-view',
        definition:
          'The name of the method. Each space is one view of the data, and the search combines the distances from all of them.',
      },
    ],
  },
  metodo: {
    eyebrow: 'How it works',
    title: 'One combined distance, with per-query weights',
    lead:
      'The search measures the distance from the query to every training point in five spaces, normalizes those ' +
      'distances and combines them into a single one. The two versions of the method differ in the weights of that combination.',
    steps: [
      {
        title: '1. Five spaces for the same data',
        body:
          'The original space and four projections: PCA, LDA, Gaussian random projection and truncated SVD. ' +
          'The distance is Euclidean in all of them; what changes is where the points lie.',
      },
      {
        title: '2. Uniform multi-view',
        body:
          'The distances from each space are z-scored and summed with equal weight. ' +
          'Every query uses the same combination.',
      },
      {
        title: '3. Adaptive multi-view',
        body:
          'A small neural network reads the query and picks the weights. ' +
          'Two queries in different regions get different combinations.',
      },
    ],
  },
  demo: {
    eyebrow: 'Interactive demonstration',
    title: 'Pick a query and compare the neighborhoods',
    lead:
      'Every hollow point on the map is a test query. Once you select one, the four search scenarios show the ' +
      'k neighbors they retrieved, the vote, how many neighbors carry the correct class and the weights the ' +
      'network chose for that query.',
    kLabel: 'Neighbors k =',
    colorLabel: 'Color the queries by',
    colorByClass: 'Class',
    colorByDiff: 'Where the adaptive version helps',
    colorHint: 'compares the adaptive multi-view with the original space, for the current k',
    mapTitle: 'Map of the data',
    mapSub: '(2D projection for display only)',
    mapLines: 'lines:',
    mapDashed: '(dashed)',
    note:
      'The 2D projection only displays the points. The neighbors are chosen in the search spaces, which have ' +
      'more dimensions, so they are not always the visually closest points on the map.',
    queryTitle: 'Query',
    trueClass: 'true class:',
    verdictOk: 'correct',
    verdictNo: 'wrong',
    purity: (pure: number, k: number) => `${pure}/${k} of the correct class`,
    predicts: 'predicts',
    compareOnMap: 'compare on the map',
    alwaysOnMap: 'always on the map',
    weightsTitle: 'Weights chosen by the network',
    weightsSub: 'for this query',
    statFixes: 'queries the adaptive version fixes with respect to the original space',
    statBreaks: 'queries the adaptive version breaks',
    statPurity: 'neighbors of the correct class, on average (adaptive vs original space)',
    legendTrain: 'filled: training',
    legendTest: 'hollow: test query',
    legendQuery: '★ selected query',
    legendFix: 'adaptive is right, original space is wrong',
    legendBreak: 'original space is right, adaptive is wrong',
    legendSame: 'same outcome',
  },
  resultados: {
    eyebrow: 'Results',
    title: 'The adaptive multi-view search improves kNN on every dataset evaluated',
    lead:
      'On the eight classification datasets of the TALENT benchmark, the adaptive version beats the search in the ' +
      'original space on all of them and reaches the best accuracy among the scenarios on seven. The gain reaches ' +
      '6.36 percentage points on car-evaluation, a rare jump for a method as simple as kNN.',
    colDataset: 'Dataset',
    note:
      'Accuracy (%) on the test set, k = 10, Euclidean distance. In bold, the best scenario per dataset. ' +
      'Source: Maia et al. (2026).',
    gainsTitle: 'Gain of the adaptive multi-view over the original space',
    gainsSub: 'percentage points',
    largeTitle: 'At scale',
    largeSub: (n: number) => `${n} TALENT datasets`,
    largeWdl: (wins: number, ties: number, losses: number) => `${wins} wins · ${ties} ties · ${losses} losses`,
    largeLeft: 'uniform multi-view against the original space',
    largeRight: (median: string) => `median gain of ${median} p.p.`,
    largeBody:
      'Even without the adaptive weighting, combining spaces wins on two out of every three datasets.',
  },
  publicacao: {
    eyebrow: 'Publication',
    title:
      'Beyond Single-Space Representation: Adaptive Multi-View Neighborhood Retrieval for Tabular Learning',
    body: 'Accepted at S+SSPR 2026 (international IAPR workshop), to appear in the LNCS series (Springer).',
    codeButton: 'Code of the method',
    creditsEyebrow: 'Credits',
    credits: [
      'Author: Erick Diogo de Almeida Sousa',
      'Advisor: Prof. Dr. Anna Helena Reali Costa',
      'Co-advisor: Prof. Dr. Artur Jordão Lima Correia',
      'DeepTab project, Center for Data Science (C2D), Polytechnic School of the University of São Paulo',
    ],
  },
  footer: 'Inference with neighbor instance retrieval and feature projection on tabular data · 2026',
}

export type Messages = typeof pt

export const messages: Record<Locale, Messages> = { pt, en }
