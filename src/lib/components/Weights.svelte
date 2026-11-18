<script lang="ts">
  import { data } from '../demo'
  import { i18n, num } from '../i18n.svelte'

  interface Props {
    query: number
  }

  let { query }: Props = $props()

  const m = $derived(i18n.m)
  const weights = $derived(data.alpha[query])
</script>

<div class="alpha">
  {#each weights as weight, view (view)}
    <div class="row">
      <span>{m.views[view]}</span>
      <div class="bar"><i style:width={`${weight * 100}%`}></i></div>
      <b>{num(weight)}</b>
    </div>
  {/each}
</div>

<style>
  .alpha {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-top: 4px;
  }

  .row {
    display: grid;
    grid-template-columns: 120px 1fr 44px;
    gap: 8px;
    align-items: center;
    font-size: 0.88rem;
  }

  .bar {
    height: 14px;
    background: var(--line);
    border-radius: 3px;
    overflow: hidden;
  }

  .bar i {
    display: block;
    height: 100%;
    background: var(--accent);
    border-radius: 3px;
    transition: width 0.35s ease;
  }

  .row b {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 400;
    text-align: right;
    color: var(--ink-2);
  }

  @media (max-width: 900px) {
    .row {
      grid-template-columns: 96px 1fr 44px;
    }
  }
</style>
