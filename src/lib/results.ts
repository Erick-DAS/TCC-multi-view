/**
 * Acuracia (%) dos cenarios de recuperacao do kNN nos oito conjuntos do TALENT,
 * com k = 10, publicada em Maia et al. (2026). Os baselines da literatura ficam
 * fora, como no artigo.
 */
export const PAPER_RESULTS = [
  { dataset: 'adult', original: 83.2, pca: 83.1, uniform: 83.63, adaptive: 83.75 },
  { dataset: 'Bank_Customer_Churn', original: 83.4, pca: 83.4, uniform: 83.5, adaptive: 83.85 },
  { dataset: 'California-Housing', original: 84.42, pca: 84.11, uniform: 86.19, adaptive: 85.73 },
  { dataset: 'electricity', original: 82.05, pca: 82.05, uniform: 82.03, adaptive: 82.26 },
  { dataset: 'house_16H', original: 84.4, pca: 84.25, uniform: 84.43, adaptive: 84.54 },
  { dataset: 'wine', original: 70.65, pca: 70.65, uniform: 71.23, adaptive: 72.02 },
  { dataset: 'car-evaluation', original: 86.99, pca: 86.99, uniform: 89.88, adaptive: 93.35 },
  { dataset: 'letter', original: 92.88, pca: 92.83, uniform: 92.68, adaptive: 94.15 },
] as const

/**
 * Testes iniciais da fusao uniforme contra o espaco original nos 186 conjuntos
 * do TALENT com acuracia registrada. Esses testes nao incluem a ponderacao
 * adaptativa e usam menos visoes que a configuracao do artigo.
 */
export const LARGE_SCALE = {
  datasets: 186,
  wins: 122,
  ties: 5,
  losses: 59,
  medianGain: 0.53,
}
