<script lang="ts">
  import { i18n, num } from '../i18n.svelte'
  import { LARGE_SCALE, PAPER_RESULTS } from '../results'
  import type { Scenario } from '../types'

  const m = $derived(i18n.m)
  const columns: Scenario[] = ['original', 'pca', 'uniform', 'adaptive']

  const rows = PAPER_RESULTS.map((row) => ({
    ...row,
    best: Math.max(row.original, row.pca, row.uniform, row.adaptive),
    gain: row.adaptive - row.original,
  }))

  const total = LARGE_SCALE.wins + LARGE_SCALE.ties + LARGE_SCALE.losses
  const share = (value: number) => (value / total) * 100

  // Grafico de ganhos
  const W = 560
  const H = 230
  const LEFT = 130
  const RIGHT = 70
  const maxGain = Math.ceil(Math.max(...rows.map((r) => r.gain)))
  const barHeight = (H - 16) / rows.length
</script>

<section id="resultados">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow">{m.resultados.eyebrow}</div>
      <h2>{m.resultados.title}</h2>
      <p class="prose">{m.resultados.lead}</p>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{m.resultados.colDataset}</th>
            {#each columns as column (column)}
              <th class:ours={column === 'uniform' || column === 'adaptive'}>{m.scenarios[column]}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each rows as row (row.dataset)}
            <tr>
              <td>{row.dataset}</td>
              {#each columns as column (column)}
                <td
                  class:best={row[column] === row.best}
                  class:ours={column === 'uniform' || column === 'adaptive'}
                >
                  {num(row[column])}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <p class="note">{m.resultados.note}</p>

    <div class="res-grid">
      <div class="panel">
        <div class="ph">
          <h3>{m.resultados.gainsTitle}</h3>
          <span class="sub">{m.resultados.gainsSub}</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.resultados.gainsTitle}>
          {#each rows as row, i (row.dataset)}
            {@const y = 8 + i * barHeight}
            {@const width = (row.gain / maxGain) * (W - LEFT - RIGHT)}
            <rect x={LEFT} y={y + 4} {width} height={barHeight - 8} rx="3" fill="var(--accent)" />
            <text class="label" x={LEFT - 8} y={y + barHeight / 2 + 4} text-anchor="end">{row.dataset}</text>
            <text class="value" x={LEFT + width + 6} y={y + barHeight / 2 + 4}>+{num(row.gain)}</text>
          {/each}
          <line x1={LEFT} y1="8" x2={LEFT} y2={H - 8} stroke="var(--line-strong)" />
        </svg>
      </div>

      <div class="panel">
        <div class="ph">
          <h3>{m.resultados.largeTitle}</h3>
          <span class="sub">{m.resultados.largeSub(LARGE_SCALE.datasets)}</span>
        </div>
        <div class="big">
          {LARGE_SCALE.wins}
          <small>{m.resultados.largeWdl(LARGE_SCALE.wins, LARGE_SCALE.ties, LARGE_SCALE.losses)}</small>
        </div>
        <div class="wdl" aria-hidden="true">
          <i style:width={`${share(LARGE_SCALE.wins)}%`} style:background="var(--good)"></i>
          <i style:width={`${share(LARGE_SCALE.ties)}%`} style:background="var(--line-strong)"></i>
          <i style:width={`${share(LARGE_SCALE.losses)}%`} style:background="var(--bad)"></i>
        </div>
        <div class="wdl-l">
          <span>{m.resultados.largeLeft}</span>
          <span>{m.resultados.largeRight(num(LARGE_SCALE.medianGain))}</span>
        </div>
        <p class="body">{m.resultados.largeBody}</p>
      </div>
    </div>
  </div>
</section>

<style>
  .table-wrap {
    overflow-x: auto;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 12px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.9rem;
    min-width: 620px;
  }

  th,
  td {
    padding: 9px 14px;
    text-align: right;
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
  }

  th {
    font-family: Manrope, sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ink-3);
    font-weight: 700;
  }

  td:first-child,
  th:first-child {
    text-align: left;
  }

  td {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.86rem;
  }

  td:first-child {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.92rem;
  }

  td.best {
    font-weight: 600;
    color: var(--accent);
  }

  th.ours,
  td.ours {
    background: color-mix(in srgb, var(--accent-soft) 55%, transparent);
  }

  .note {
    font-size: 0.85rem;
    color: var(--ink-3);
    margin-top: 10px;
  }

  .res-grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 18px;
    margin-top: 18px;
  }

  .ph {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .ph h3 {
    font-size: 1rem;
  }

  .sub {
    font-size: 0.82rem;
    color: var(--ink-3);
  }

  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  text.label {
    font-size: 12px;
    fill: var(--ink-2);
    font-family: 'Source Sans 3', sans-serif;
  }

  text.value {
    font-size: 12px;
    fill: var(--ink);
    font-family: 'JetBrains Mono', monospace;
  }

  .big {
    font-family: 'JetBrains Mono', monospace;
    font-size: 2.2rem;
    font-weight: 600;
    line-height: 1;
  }

  .big small {
    font-size: 1rem;
    color: var(--ink-3);
    font-weight: 400;
    font-family: 'Source Sans 3', sans-serif;
  }

  .wdl {
    display: flex;
    height: 16px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 12px;
    gap: 2px;
  }

  .wdl i {
    display: block;
    height: 100%;
  }

  .wdl-l {
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;
    color: var(--ink-2);
    margin-top: 6px;
    gap: 10px;
    flex-wrap: wrap;
  }

  .body {
    color: var(--ink-2);
    margin-top: 12px;
    font-size: 0.92rem;
  }

  @media (max-width: 900px) {
    .res-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
