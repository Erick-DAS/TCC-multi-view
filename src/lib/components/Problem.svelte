<script lang="ts">
  import { i18n } from '../i18n.svelte'

  const m = $derived(i18n.m)
</script>

<section id="problema">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow">{m.problema.eyebrow}</div>
      <h2>{m.problema.title}</h2>
    </div>
    <div class="two">
      <div>
        {#each m.problema.paragraphs as paragraph (paragraph)}
          <p class="prose">{paragraph}</p>
        {/each}
      </div>
      <dl class="gloss">
        {#each m.problema.glossary as item (item.term)}
          <div>
            <dt>{item.term}</dt>
            <dd>{item.definition}</dd>
          </div>
        {/each}
      </dl>
    </div>
  </div>
</section>

<style>
  .two {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 32px;
    align-items: start;
  }

  .gloss {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
  }

  dt {
    font-family: Manrope, sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
  }

  dd {
    margin: 3px 0 0;
    font-size: 0.93rem;
    color: var(--ink-2);
  }

  @media (max-width: 900px) {
    .two {
      grid-template-columns: 1fr;
    }
  }
</style>
