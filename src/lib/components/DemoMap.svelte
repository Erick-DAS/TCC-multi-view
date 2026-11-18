<script lang="ts">
  import { bounds, data, globalStats, meta, neighborhood } from '../demo'
  import { i18n } from '../i18n.svelte'
  import { CLASS_COLORS, markerPath, scaler, starPoints } from '../svg'
  import type { Scenario } from '../types'

  interface Props {
    query: number
    k: number
    reference: Scenario
    colorMode: 'class' | 'diff'
    onselect: (query: number) => void
  }

  let { query, k, reference, colorMode, onselect }: Props = $props()

  const W = 640
  const H = 460
  const PAD = 18
  const sx = scaler(bounds.x, [PAD, W - PAD])
  const sy = scaler(bounds.y, [H - PAD, PAD])

  const EFFECT_COLORS = { fix: 'var(--good)', break: 'var(--bad)', same: 'var(--line-strong)' }

  const m = $derived(i18n.m)
  const adaptive = $derived(neighborhood('adaptive', query, k))
  const referenceSet = $derived(neighborhood(reference, query, k))
  const inAdaptive = $derived(new Set(adaptive.idx))
  const inReference = $derived(new Set(referenceSet.idx))
  const effect = $derived(globalStats(k).effect)

  const train = data.train.x.map((x, i) => ({
    i,
    cx: sx(x),
    cy: sy(data.train.y[i]),
    cls: data.train.class[i],
  }))

  const test = data.test.x.map((x, q) => ({
    q,
    cx: sx(x),
    cy: sy(data.test.y[q]),
    cls: data.test.class[q],
  }))

  function onkeydown(event: KeyboardEvent, q: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onselect(q)
    }
  }
</script>

<svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.demo.title}>
  <g>
    {#each referenceSet.idx as i (i)}
      <line
        x1={sx(data.test.x[query])}
        y1={sy(data.test.y[query])}
        x2={train[i].cx}
        y2={train[i].cy}
        stroke="var(--ink-2)"
        stroke-width="1"
        stroke-dasharray="3 3"
        opacity="0.8"
      />
    {/each}
    {#each adaptive.idx as i (i)}
      <line
        x1={sx(data.test.x[query])}
        y1={sy(data.test.y[query])}
        x2={train[i].cx}
        y2={train[i].cy}
        stroke="var(--accent)"
        stroke-width="1.4"
        opacity="0.9"
      />
    {/each}
  </g>

  <g>
    {#each train as point (point.i)}
      {@const picked = inAdaptive.has(point.i) || inReference.has(point.i)}
      <path
        d={markerPath(point.cls, point.cx, point.cy, picked ? 5 : 3.2)}
        fill={CLASS_COLORS[point.cls]}
        opacity={picked ? 1 : 0.35}
        stroke={inAdaptive.has(point.i) ? 'var(--accent)' : inReference.has(point.i) ? 'var(--ink)' : 'none'}
        stroke-width={inAdaptive.has(point.i) ? 2 : 1.5}
        stroke-dasharray={inReference.has(point.i) && !inAdaptive.has(point.i) ? '2 1.5' : 'none'}
      />
    {/each}
  </g>

  <g>
    {#each test as point (point.q)}
      <path
        class="query"
        d={markerPath(point.cls, point.cx, point.cy, 5)}
        fill="var(--surface)"
        stroke={colorMode === 'class' ? CLASS_COLORS[point.cls] : EFFECT_COLORS[effect[point.q]]}
        stroke-width="2"
        role="button"
        tabindex="0"
        aria-label={`${m.demo.queryTitle} ${point.q}, ${m.className(point.cls)}`}
        onclick={() => onselect(point.q)}
        onkeydown={(event) => onkeydown(event, point.q)}
      >
        <title>{`${m.demo.queryTitle} ${point.q} · ${m.className(point.cls)} (${meta.classes[point.cls]})`}</title>
      </path>
    {/each}
  </g>

  <polygon
    points={starPoints(sx(data.test.x[query]), sy(data.test.y[query]), 12)}
    fill="var(--query)"
    stroke="var(--surface)"
    stroke-width="1.5"
  />
</svg>

<style>
  svg {
    width: 100%;
    height: auto;
    display: block;
    touch-action: manipulation;
  }

  .query {
    cursor: pointer;
  }
</style>
