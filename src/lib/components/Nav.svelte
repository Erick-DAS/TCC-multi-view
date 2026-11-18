<script lang="ts">
  import { i18n } from '../i18n.svelte'

  const m = $derived(i18n.m)
  const links = $derived([
    { id: 'problema', label: m.nav.problema },
    { id: 'metodo', label: m.nav.metodo },
    { id: 'demo', label: m.nav.demo },
    { id: 'resultados', label: m.nav.resultados },
    { id: 'publicacao', label: m.nav.publicacao },
  ])
</script>

<nav>
  <div class="wrap">
    <a class="brand" href="#topo">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <circle cx="4" cy="6" r="2" fill="var(--c1)" />
        <circle cx="20" cy="7" r="2" fill="var(--c2)" />
        <circle cx="18" cy="19" r="2" fill="var(--c3)" />
        <circle cx="6" cy="18" r="2" fill="var(--c4)" />
        <path d="M12 12 4 6M12 12l8-5M12 12l6 7M12 12l-6 6" stroke="currentColor" stroke-width="1.2" opacity=".5" />
      </svg>
      {m.brand}
    </a>
    <ul>
      {#each links as link (link.id)}
        <li><a href={`#${link.id}`}>{link.label}</a></li>
      {/each}
    </ul>
    <div class="locale" role="group" aria-label={m.localeLabel}>
      <button type="button" aria-pressed={i18n.locale === 'pt'} onclick={() => i18n.set('pt')}>PT</button>
      <button type="button" aria-pressed={i18n.locale === 'en'} onclick={() => i18n.set('en')}>EN</button>
    </div>
  </div>
</nav>

<style>
  nav {
    position: sticky;
    top: env(safe-area-inset-top, 0px);
    z-index: 19;
    background: color-mix(in srgb, var(--bg) 85%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--line);
  }

  nav :global(.wrap) {
    display: flex;
    align-items: center;
    gap: 20px;
    height: 54px;
  }

  .brand {
    font-family: Manrope, sans-serif;
    font-weight: 800;
    font-size: 1rem;
    color: var(--ink);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
  }

  .brand svg {
    width: 22px;
    height: 22px;
  }

  ul {
    display: flex;
    gap: 18px;
    list-style: none;
    margin: 0 0 0 auto;
    padding: 0;
    font-size: 0.9rem;
    overflow-x: auto;
  }

  ul a {
    color: var(--ink-2);
    text-decoration: none;
    white-space: nowrap;
  }

  ul a:hover {
    color: var(--ink);
  }

  .locale {
    display: inline-flex;
    border: 1px solid var(--line-strong);
    border-radius: 7px;
    overflow: hidden;
    flex: none;
  }

  .locale button {
    border: 0;
    background: var(--surface);
    color: var(--ink-2);
    padding: 5px 9px;
    font: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }

  .locale button[aria-pressed='true'] {
    background: var(--accent);
    color: var(--accent-ink);
  }

  @media (max-width: 700px) {
    ul {
      display: none;
    }

    .locale {
      margin-left: auto;
    }
  }
</style>
