import raw from './data/data.json'
import type { DemoData, Neighborhood, Scenario } from './types'

export const data = raw as unknown as DemoData
export const meta = data.meta

export const SCENARIOS = meta.scenarios
export const N_CLASSES = meta.classes.length
export const K_MIN = 3
export const K_MAX = meta.top_k
export const K_DEFAULT = meta.config.k

/** Em empate, vence a classe de menor índice, como o scipy.stats.mode do pipeline. */
function majority(votes: number[]): number {
  let best = 0
  for (let c = 1; c < votes.length; c += 1) {
    if (votes[c] > votes[best]) best = c
  }
  return best
}

export function neighborhood(scenario: Scenario, query: number, k: number): Neighborhood {
  const idx = data.neighbors[scenario][query].slice(0, k)
  const votes = new Array<number>(N_CLASSES).fill(0)
  for (const i of idx) votes[data.train.class[i]] += 1
  const trueClass = data.test.class[query]
  const pred = majority(votes)
  return { idx, votes, pred, correct: pred === trueClass, pure: votes[trueClass] }
}

export type QueryEffect = 'fix' | 'break' | 'same'

export interface GlobalStats {
  fixes: number
  breaks: number
  purityAdaptive: number
  purityOriginal: number
  effect: QueryEffect[]
}

const statsCache = new Map<number, GlobalStats>()

/** Compara o multi-view adaptativo com o espaco original em todas as consultas. */
export function globalStats(k: number): GlobalStats {
  const cached = statsCache.get(k)
  if (cached) return cached

  const n = data.test.class.length
  const effect: QueryEffect[] = []
  let fixes = 0
  let breaks = 0
  let pureAdaptive = 0
  let pureOriginal = 0

  for (let q = 0; q < n; q += 1) {
    const adaptive = neighborhood('adaptive', q, k)
    const original = neighborhood('original', q, k)
    pureAdaptive += adaptive.pure
    pureOriginal += original.pure
    if (adaptive.correct && !original.correct) {
      fixes += 1
      effect.push('fix')
    } else if (!adaptive.correct && original.correct) {
      breaks += 1
      effect.push('break')
    } else {
      effect.push('same')
    }
  }

  const stats: GlobalStats = {
    fixes,
    breaks,
    purityAdaptive: pureAdaptive / (n * k),
    purityOriginal: pureOriginal / (n * k),
    effect,
  }
  statsCache.set(k, stats)
  return stats
}

/** Consulta em que a vizinhanca adaptativa mais ganha pureza sobre o espaco original. */
export function showcaseQuery(k: number): number {
  let best = 0
  let bestGap = -Infinity
  for (let q = 0; q < data.test.class.length; q += 1) {
    const gap = neighborhood('adaptive', q, k).pure - neighborhood('original', q, k).pure
    if (gap > bestGap) {
      bestGap = gap
      best = q
    }
  }
  return best
}

export function extent(values: number[][]): [number, number] {
  let min = Infinity
  let max = -Infinity
  for (const list of values) {
    for (const v of list) {
      if (v < min) min = v
      if (v > max) max = v
    }
  }
  return [min, max]
}

export const bounds = {
  x: extent([data.train.x, data.test.x]),
  y: extent([data.train.y, data.test.y]),
}
