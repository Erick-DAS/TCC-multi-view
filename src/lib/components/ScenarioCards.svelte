<script lang="ts">
  import { SCENARIOS, meta, neighborhood } from '../demo'
  import { i18n } from '../i18n.svelte'
  import { CLASS_COLORS } from '../svg'
  import type { Scenario } from '../types'

  interface Props {
    query: number
    k: number
    reference: Scenario
    onreference: (scenario: Scenario) => void
  }

  let { query, k, reference, onreference }: Props = $props()

  const m = $derived(i18n.m)
  const cards = $derived(
    SCENARIOS.map((scenario) => ({ scenario, result: neighborhood(scenario, query, k) })),
  )
</script>

<div class="cards">
  {#each cards as card (card.scenario)}
    <div class="cmp" class:adapt={card.scenario === 'adaptive'}>
      <h4>
        {m.scenarios[card.scenario]}
        <span class="verdict" class:ok={card.result.correct} class:no={!card.result.correct}>
          {card.result.correct ? `✓ ${m.demo.verdictOk}` : `✗ ${m.demo.verdictNo}`}
        </span>
      </h4>

      <div class="vote">
        {#each card.result.votes as votes, cls (cls)}
          <div class="row">
            <span>{m.className(cls)}</span>
            <div class="bar"><i style:width={`${(votes / k) * 100}%`} style:background={CLASS_COLORS[cls]}></i></div>
            <span class="mono count">{votes}</span>
          </div>
        {/each}
      </div>

      <div class="purity">
        <b>{m.demo.purity(card.result.pure, k)}</b> · {m.demo.predicts}
        <b class="pred">{m.className(card.result.pred)}</b>
        <span class="label">({meta.classes[card.result.pred]})</span>
      </div>

      {#if card.scenario === 'adaptive'}
        <span class="onmap fixed">● {m.demo.alwaysOnMap}</span>
      {:else}
        <label class="onmap">
          <input
            type="radio"
            name="reference"
            value={card.scenario}
            checked={reference === card.scenario}
            onchange={() => onreference(card.scenario)}
          />
          {m.demo.compareOnMap}
        </label>
      {/if}
    </div>
  {/each}
</div>

<style>
  .cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .cmp {
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 12px;
    background: var(--surface-2);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cmp.adapt {
    border-color: var(--accent);
    box-shadow: inset 0 0 0 1px var(--accent);
  }

  h4 {
    font-family: Manrope, sans-serif;
    font-size: 0.86rem;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
  }

  .verdict {
    font-size: 0.74rem;
    padding: 2px 8px;
    border-radius: 999px;
    font-weight: 700;
    white-space: nowrap;
  }

  .verdict.ok {
    background: var(--good-soft);
    color: var(--good);
  }

  .verdict.no {
    background: var(--bad-soft);
    color: var(--bad);
  }

  .vote {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .row {
    display: grid;
    grid-template-columns: 64px 1fr 22px;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
  }

  .bar {
    height: 10px;
    background: var(--line);
    border-radius: 3px;
    overflow: hidden;
  }

  .bar i {
    display: block;
    height: 100%;
    border-radius: 3px;
  }

  .count {
    text-align: right;
  }

  .purity {
    font-size: 0.88rem;
    color: var(--ink-2);
  }

  .purity b {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.05rem;
    color: var(--ink);
  }

  .purity .pred {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.95rem;
  }

  .purity .label {
    color: var(--ink-3);
    font-size: 0.82rem;
  }

  .onmap {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    color: var(--ink-3);
    font-family: Manrope, sans-serif;
    font-weight: 600;
    cursor: pointer;
    margin-top: auto;
  }

  .onmap input {
    margin: 0;
    accent-color: var(--ink);
  }

  .onmap.fixed {
    cursor: default;
    color: var(--accent);
  }

  @media (max-width: 560px) {
    .cards {
      grid-template-columns: 1fr;
    }
  }
</style>
