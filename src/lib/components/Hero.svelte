<script lang="ts">
  import { data, neighborhood, showcaseQuery } from '../demo'
  import { i18n } from '../i18n.svelte'
  import { CLASS_COLORS, boxAround, markerPath, scaler, starPoints } from '../svg'

  const K = 8
  const W = 440
  const H = 290
  const PAD = 18
  const PERIOD = 3400

  const m = $derived(i18n.m)

  const query = showcaseQuery(K)
  const frames = [
    { scenario: 'original' as const, result: neighborhood('original', query, K) },
    { scenario: 'adaptive' as const, result: neighborhood('adaptive', query, K) },
  ]

  const qx = data.test.x[query]
  const qy = data.test.y[query]
  const highlighted = frames.flatMap((f) => f.result.idx)

  // Os dois quadros compartilham a mesma caixa, para que a comparação seja direta.
  const box = boxAround(
    [qx, ...highlighted.map((i) => data.train.x[i])],
    [qy, ...highlighted.map((i) => data.train.y[i])],
    0.5,
  )
  const sx = scaler(box.x, [PAD, W - PAD])
  const sy = scaler(box.y, [H - PAD, PAD])

  const visible = data.train.x
    .map((x, i) => ({ i, x, y: data.train.y[i], cls: data.train.class[i] }))
    .filter((p) => p.x >= box.x[0] && p.x <= box.x[1] && p.y >= box.y[0] && p.y <= box.y[1])

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let index = $state(0)
  let progress = $state(0)

  const frame = $derived(frames[index])
  const current = $derived(new Set(frame.result.idx))

  $effect(() => {
    if (reduced) return

    let start = performance.now()
    let raf = requestAnimationFrame(function tick(now: number) {
      const ratio = (now - start) / PERIOD
      if (ratio >= 1) {
        start = now
        index = (index + 1) % frames.length
        progress = 0
      } else {
        progress = ratio
      }
      raf = requestAnimationFrame(tick)
    })

    return () => cancelAnimationFrame(raf)
  })
</script>

<header class="hero" id="topo">
  <div class="wrap">
    <div>
      <div class="eyebrow">{m.hero.eyebrow}</div>
      <h1>{m.hero.title}</h1>
      <p class="lead">{m.hero.lead}</p>
      <div class="cta">
        <a class="btn primary" href="#demo">{m.hero.ctaDemo}</a>
        <a class="btn" href="#resultados">{m.hero.ctaResults}</a>
      </div>
    </div>

    <figure class="hero-fig">
      <div class="hf-head">
        <span>{m.scenarios[frame.scenario]}</span>
        <span class="mono">{m.hero.purity(frame.result.pure, K)}</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.hero.caption(K)}>
        {#each frame.result.idx as i (i)}
          <line
            x1={sx(qx)}
            y1={sy(qy)}
            x2={sx(data.train.x[i])}
            y2={sy(data.train.y[i])}
            stroke="var(--accent)"
            stroke-width="1.6"
            opacity="0.85"
          />
        {/each}
        {#each visible as p (p.i)}
          <path
            d={markerPath(p.cls, sx(p.x), sy(p.y), current.has(p.i) ? 6 : 2)}
            fill={CLASS_COLORS[p.cls]}
            opacity={current.has(p.i) ? 1 : 0.16}
            stroke={current.has(p.i) ? 'var(--surface)' : 'none'}
            stroke-width="1.8"
          />
        {/each}
        <polygon
          points={starPoints(sx(qx), sy(qy), 11)}
          fill="var(--query)"
          stroke="var(--surface)"
          stroke-width="1.5"
        />
      </svg>

      {#if reduced}
        <div class="switch">
          {#each frames as f, i (f.scenario)}
            <button type="button" aria-pressed={index === i} onclick={() => (index = i)}>
              {m.scenarios[f.scenario]}
            </button>
          {/each}
        </div>
      {:else}
        <div class="progress" aria-hidden="true"><i style:width={`${progress * 100}%`}></i></div>
      {/if}

      <figcaption>{m.hero.caption(K)}</figcaption>
    </figure>
  </div>
</header>

<style>
  .hero {
    padding-block: 72px 56px;
  }

  .hero :global(.wrap) {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 48px;
    align-items: center;
  }

  h1 {
    margin-top: 14px;
  }

  .lead {
    font-size: 1.2rem;
    color: var(--ink-2);
    margin-top: 20px;
    max-width: 50ch;
  }

  .cta {
    display: flex;
    gap: 12px;
    margin-top: 28px;
    flex-wrap: wrap;
  }

  .hero-fig {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 16px;
    box-shadow: var(--shadow);
    margin: 0;
  }

  .hf-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
    font-family: Manrope, sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
  }

  .hf-head .mono {
    font-weight: 400;
    color: var(--ink-3);
    font-size: 0.82rem;
  }

  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .progress {
    height: 4px;
    background: var(--line);
    border-radius: 2px;
    overflow: hidden;
    margin: 10px 0 2px;
  }

  .progress i {
    display: block;
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
  }

  .switch {
    display: flex;
    gap: 8px;
    margin: 10px 0 2px;
  }

  .switch button {
    flex: 1;
    border: 1px solid var(--line-strong);
    border-radius: 7px;
    background: var(--surface);
    color: var(--ink-2);
    padding: 5px 8px;
    font: inherit;
    font-size: 0.82rem;
    cursor: pointer;
  }

  .switch button[aria-pressed='true'] {
    background: var(--accent);
    color: var(--accent-ink);
    border-color: var(--accent);
  }

  figcaption {
    font-size: 0.85rem;
    color: var(--ink-3);
    margin-top: 8px;
  }

  @media (max-width: 900px) {
    .hero :global(.wrap) {
      grid-template-columns: 1fr;
    }
  }
</style>
