<script lang="ts">
  import { data, meta } from '../demo'
  import { i18n, num } from '../i18n.svelte'
  import { CLASS_COLORS, markerPath } from '../svg'

  const m = $derived(i18n.m)
  const nViews = meta.views.length
  const uniform = 1 / nViews

  /** Consulta em que a visão indicada recebeu o maior peso da rede. */
  function dominantQuery(view: number): number {
    let best = 0
    for (let q = 1; q < data.alpha.length; q += 1) {
      if (data.alpha[q][view] > data.alpha[best][view]) best = q
    }
    return best
  }

  // Duas consultas reais com combinações bem diferentes: uma em que a LDA domina
  // e outra em que o espaço original pesa mais.
  const examples = [dominantQuery(2), dominantQuery(0)].map((q) => data.alpha[q])

  // Pontos ilustrativos do primeiro passo, com gerador determinístico.
  const illustration = (() => {
    let seed = 7
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    const points = Array.from({ length: 36 }, () => ({
      x: rnd() * 72 + 4,
      y: rnd() * 80 + 6,
      cls: Math.floor(rnd() * 4),
    }))
    const spaces: { label: string; map: (p: { x: number; y: number; cls: number }) => [number, number] }[] = [
      { label: 'Original', map: (p) => [p.x, p.y] },
      { label: 'PCA', map: (p) => [p.x * 0.9 + p.y * 0.2, p.y * 0.5 + 20] },
      { label: 'LDA', map: (p) => [p.x * 0.5 + p.cls * 14, p.y * 0.8 + p.cls * 5] },
    ]
    return spaces.map((space, column) => ({
      label: space.label,
      x: 12 + column * 100,
      marks: points.map((p) => {
        const [x, y] = space.map(p)
        return { d: markerPath(p.cls, 12 + column * 100 + x, 8 + y * 0.9, 2.4), cls: p.cls }
      }),
    }))
  })()
</script>

<section id="metodo">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow">{m.metodo.eyebrow}</div>
      <h2>{m.metodo.title}</h2>
      <p class="prose">{m.metodo.lead}</p>
    </div>

    <div class="steps">
      <div class="step">
        <div class="fig">
          <svg viewBox="0 0 300 120" aria-hidden="true">
            {#each illustration as space (space.label)}
              {#each space.marks as mark, i (i)}
                <path d={mark.d} fill={CLASS_COLORS[mark.cls]} opacity="0.85" />
              {/each}
              <text x={space.x} y="112">{space.label}</text>
            {/each}
          </svg>
        </div>
        <h3>{m.metodo.steps[0].title}</h3>
        <p>{m.metodo.steps[0].body}</p>
      </div>

      <div class="step">
        <div class="fig">
          <div>
            <div class="chip-row">
              <span class="q">★</span>
              {#each m.views as view (view)}
                <span class="chip">{view}<small>{num(uniform)}</small></span>
              {/each}
            </div>
            <div class="formula">
              d = {m.views.map((_, i) => `${num(uniform)}·d${i + 1}`).join(' + ')}
            </div>
          </div>
        </div>
        <h3>{m.metodo.steps[1].title}</h3>
        <p>{m.metodo.steps[1].body}</p>
      </div>

      <div class="step">
        <div class="fig">
          <div class="rows">
            {#each examples as weights, row (row)}
              <div class="chip-row">
                <span class="q">★</span>
                {#each weights as weight, view (view)}
                  <span class="chip" style:opacity={0.3 + 0.7 * (weight / Math.max(...weights))}>
                    {m.views[view]}<small>{num(weight)}</small>
                  </span>
                {/each}
              </div>
            {/each}
          </div>
        </div>
        <h3>{m.metodo.steps[2].title}</h3>
        <p>{m.metodo.steps[2].body}</p>
      </div>
    </div>
  </div>
</section>

<style>
  .steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .step {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .fig {
    background: var(--surface-2);
    border-radius: 8px;
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }

  .fig svg {
    width: 100%;
    height: auto;
    display: block;
  }

  text {
    font-size: 10px;
    fill: var(--ink-3);
    font-family: Manrope, sans-serif;
    font-weight: 700;
  }

  .step h3 {
    font-size: 1rem;
  }

  .step p {
    font-size: 0.95rem;
    color: var(--ink-2);
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .chip-row {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: nowrap;
    justify-content: center;
  }

  .chip-row .q {
    font-size: 1rem;
    color: var(--query);
    width: 16px;
    text-align: center;
    flex: none;
  }

  .chip {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 4px 5px;
    border-radius: 6px;
    background: var(--accent);
    color: var(--accent-ink);
    min-width: 44px;
    line-height: 1.15;
    font-size: 0.72rem;
  }

  .chip small {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.76rem;
    opacity: 0.9;
  }

  .formula {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.74rem;
    color: var(--ink-2);
    margin-top: 6px;
    text-align: center;
  }

  @media (max-width: 900px) {
    .steps {
      grid-template-columns: 1fr;
    }
  }
</style>
