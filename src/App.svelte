<script lang="ts">
  import Demo from './lib/components/Demo.svelte'
  import Hero from './lib/components/Hero.svelte'
  import Method from './lib/components/Method.svelte'
  import Nav from './lib/components/Nav.svelte'
  import Problem from './lib/components/Problem.svelte'
  import Publication from './lib/components/Publication.svelte'
  import Results from './lib/components/Results.svelte'
  import { i18n } from './lib/i18n.svelte'

  const m = $derived(i18n.m)

  $effect(() => {
    document.documentElement.lang = i18n.locale === 'pt' ? 'pt-BR' : 'en'
    document.title = m.brand
  })
</script>

<Nav />
<Hero />
<Problem />
<Method />
<Demo />
<Results />
<Publication />

<footer>
  <div class="wrap">{m.footer}</div>
</footer>

<style>
  footer {
    padding: 28px 0 48px;
    color: var(--ink-3);
    font-size: 0.85rem;
    border-top: 1px solid var(--line);
  }
</style>
