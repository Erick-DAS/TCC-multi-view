<script lang="ts">
  import { i18n } from '../i18n.svelte'

  const m = $derived(i18n.m)
  const CODE_URL = 'https://github.com/c2d-usp/Adaptive-Multi-view-Neighborhood-Retrieval'
</script>

<section id="publicacao">
  <div class="wrap">
    <div class="eyebrow">{m.publicacao.eyebrow}</div>
    <h2>{m.publicacao.title}</h2>
    <p class="prose">{m.publicacao.body}</p>
    <div class="cta">
      <a class="btn" href={CODE_URL} target="_blank" rel="noreferrer">{m.publicacao.codeButton}</a>
    </div>
  </div>
</section>

<style>
  h2 {
    margin-top: 8px;
  }

  .prose {
    margin-top: 10px;
  }

  .cta {
    margin-top: 18px;
  }
</style>
