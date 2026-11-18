export type Scenario = 'original' | 'pca' | 'uniform' | 'adaptive'

export interface Meta {
  dataset: string
  seed: number
  device: string
  config: {
    k: number
    norm: string
    jl_eps: number
    rp_frac: number
    hidden: number
    n_epochs: number
    batch_size: number
    lr: number
    temperature: number
    lambda_ent: number
  }
  top_k: number
  scenarios: Scenario[]
  views: string[]
  view_dims: number[]
  pca_components: number
  random_dim: number
  svd_dim: number
  classes: string[]
  talent_labels: string[]
  class_counts: number[]
  splits: { train: number; val: number; test: number }
  n_features: number
  accuracy: Record<Scenario, number>
  final_loss: number
  environment: Record<string, string>
}

export interface Points {
  x: number[]
  y: number[]
  class: number[]
}

export interface DemoData {
  meta: Meta
  train: Points
  test: Points
  neighbors: Record<Scenario, number[][]>
  alpha: number[][]
}

/** Vizinhança de uma consulta em um cenário, para o k corrente. */
export interface Neighborhood {
  idx: number[]
  votes: number[]
  pred: number
  correct: boolean
  pure: number
}
