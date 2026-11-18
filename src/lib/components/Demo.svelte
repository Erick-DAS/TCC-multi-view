<script lang="ts">
  import { K_DEFAULT, K_MAX, K_MIN, data, globalStats, meta } from '../demo'
  import { i18n, num } from '../i18n.svelte'
  import { CLASS_COLORS, markerPath } from '../svg'
  import type { Scenario } from '../types'
  import DemoMap from './DemoMap.svelte'
  import ScenarioCards from './ScenarioCards.svelte'
  import Weights from './Weights.svelte'

  const m = $derived(i18n.m)

  const firstFix = globalStats(K_DEFAULT).effect.indexOf('fix')

  let k = $state(K_DEFAULT)
  let query = $state(firstFix >= 0 ? firstFix : 0)
  let reference = $state<Scenario>('original')
  let colorMode = $state<'class' | 'diff'>('class')

  const stats = $derived(globalStats(k))
  const trueClass = $derived(data.test.class[query])
  const hexagon = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i
    return `${8 + 6 * Math.cos(angle)},${8 + 6 * Math.sin(angle)}`
  }).join(' ')
</script>

<section id="demo">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow">{m.demo.eyebrow}</div>
      <h2>{m.demo.title}</h2>
      <p class="prose">{m.demo.lead}</p>
    </div>

    <div class="demo-bar">
      <div class="field">
        <label for="k">{m.demo.kLabel} <span class="mono kval">{k}</span></label>
        <input id="k" type="range" min={K_MIN} max={K_MAX} bind:value={k} />
      </div>
      <div class="field">
        <span>{m.demo.colorLabel}</span>
        <div class="seg">
          <button type="button" aria-pressed={colorMode === 'class'} onclick={() => (colorMode = 'class')}>
            {m.demo.colorByClass}
          </button>
          <button type="button" aria-pressed={colorMode === 'diff'} onclick={() => (colorMode = 'diff')}>
            {m.demo.colorByDiff}
          </button>
        </div>
        <span class="hint">{m.demo.colorHint}</span>
      </div>
    </div>

    <div class="demo-grid">
      <div class="panel">
        <div class="ph">
          <h3>{m.demo.mapTitle} <span class="sub">{m.demo.mapSub}</span></h3>
          <span class="lines">
            {m.demo.mapLines}
            <b class="adaptive">{m.scenarios.adaptive.toLowerCase()}</b> ·
            <b>{m.scenarios[reference].toLowerCase()}</b>
            {m.demo.mapDashed}
          </span>
        </div>

        <DemoMap {query} {k} {reference} {colorMode} onselect={(q) => (query = q)} />

        <div class="legend">
          {#if colorMode === 'class'}
            {#each meta.classes as label, cls (label)}
              <span>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d={markerPath(cls, 8, 8, 5)} fill={CLASS_COLORS[cls]} />
                </svg>
                {m.className(cls)} <span class="sub">({label})</span>
              </span>
            {/each}
            <span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <polygon points={hexagon} fill="var(--ink-3)" />
              </svg>
              {m.demo.legendTrain}
            </span>
            <span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <polygon points={hexagon} fill="none" stroke="var(--ink-3)" stroke-width="2" />
              </svg>
              {m.demo.legendTest}
            </span>
            <span>{m.demo.legendQuery}</span>
          {:else}
            <span><i class="dot" style:background="var(--good)"></i>{m.demo.legendFix}</span>
            <span><i class="dot" style:background="var(--bad)"></i>{m.demo.legendBreak}</span>
            <span><i class="dot" style:background="var(--line-strong)"></i>{m.demo.legendSame}</span>
          {/if}
        </div>

        <div class="stats">
          <div class="stat good">
            <div class="n">+{stats.fixes}</div>
            <div class="l">{m.demo.statFixes}</div>
          </div>
          <div class="stat bad">
            <div class="n">&minus;{stats.breaks}</div>
            <div class="l">{m.demo.statBreaks}</div>
          </div>
          <div class="stat">
            <div class="n">
              {num(stats.purityAdaptive * 100, 0)}%
              <small>vs {num(stats.purityOriginal * 100, 0)}%</small>
            </div>
            <div class="l">{m.demo.statPurity}</div>
          </div>
        </div>

        <p class="note">{m.demo.note}</p>
      </div>

      <div class="side">
        <div class="panel">
          <div class="ph">
            <h3>{m.demo.queryTitle} <span class="mono sub">{query}</span></h3>
            <span class="sub">
              {m.demo.trueClass}
              <b>{m.className(trueClass)}</b>
              ({meta.classes[trueClass]})
            </span>
          </div>
          <ScenarioCards {query} {k} {reference} onreference={(s) => (reference = s)} />
        </div>

        <div class="panel">
          <div class="ph">
            <h3>{m.demo.weightsTitle}</h3>
            <span class="sub">{m.demo.weightsSub}</span>
          </div>
          <Weights {query} />
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .demo-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 14px 28px;
    align-items: end;
    padding: 14px 18px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 12px;
    margin-bottom: 18px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 0.8rem;
    color: var(--ink-3);
    font-family: Manrope, sans-serif;
    font-weight: 600;
  }

  .field input[type='range'] {
    width: 160px;
    accent-color: var(--accent);
  }

  .kval {
    color: var(--ink);
  }

  .hint {
    font-weight: 400;
  }

  .seg {
    display: inline-flex;
    border: 1px solid var(--line-strong);
    border-radius: 7px;
    overflow: hidden;
    width: fit-content;
  }

  .seg button {
    border: 0;
    background: var(--surface);
    color: var(--ink-2);
    padding: 7px 12px;
    font: inherit;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .seg button[aria-pressed='true'] {
    background: var(--accent);
    color: var(--accent-ink);
  }

  .demo-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 18px;
  }

  .side {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
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
    font-weight: 400;
  }

  .lines {
    font-size: 0.82rem;
    color: var(--ink-3);
  }

  .lines b {
    color: var(--ink);
  }

  .lines b.adaptive {
    color: var(--accent);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
    font-size: 0.85rem;
    color: var(--ink-2);
    margin-top: 10px;
  }

  .legend span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .legend svg {
    width: 14px;
    height: 14px;
  }

  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    display: inline-block;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 14px;
  }

  .stat {
    padding: 12px 14px;
    border-radius: 10px;
    background: var(--surface-2);
  }

  .stat .n {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.1;
  }

  .stat .n small {
    font-size: 0.8rem;
    color: var(--ink-3);
  }

  .stat .l {
    font-size: 0.8rem;
    color: var(--ink-3);
    margin-top: 3px;
  }

  .stat.good .n {
    color: var(--good);
  }

  .stat.bad .n {
    color: var(--bad);
  }

  .note {
    font-size: 0.85rem;
    color: var(--ink-3);
    margin-top: 10px;
  }

  @media (max-width: 900px) {
    .demo-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 560px) {
    .stats {
      grid-template-columns: 1fr;
    }
  }
</style>
