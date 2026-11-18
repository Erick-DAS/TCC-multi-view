import { messages, type Locale, type Messages } from './messages'

const STORAGE_KEY = 'locale'

function initial(): Locale {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'pt' || fromUrl === 'en') return fromUrl

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'pt' || stored === 'en') return stored
  } catch {
    // Armazenamento bloqueado pelo navegador: o idioma do navegador decide.
  }

  return window.navigator.language.startsWith('pt') ? 'pt' : 'en'
}

let locale = $state<Locale>(initial())

export const i18n = {
  get locale(): Locale {
    return locale
  },
  get m(): Messages {
    return messages[locale]
  },
  get tag(): string {
    return locale === 'pt' ? 'pt-BR' : 'en-US'
  },
  set(next: Locale) {
    locale = next
    document.documentElement.lang = next === 'pt' ? 'pt-BR' : 'en'
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Sem armazenamento, a escolha vale apenas para esta visita.
    }
  },
}

/** Numero formatado no padrao do idioma corrente. */
export function num(value: number, digits = 2): string {
  return value.toLocaleString(i18n.tag, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}
