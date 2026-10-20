import type { Language } from "./translations"

/**
 * `?lang=ar` or `?lang=en` on a page link sets the site's language (the `lang` cookie the layout reads). The member
 * app opens the privacy and support pages with its own language this way, and a store listing can link to one
 * language. Anything else is ignored.
 */
export const LANGUAGE_PARAM = "lang"

export const LANGUAGE_COOKIE = "lang"

/** One year, like the language switchers in the navigation and the account menu. */
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function languageFromParam(searchParams: URLSearchParams): Language | null {
  const value = searchParams.get(LANGUAGE_PARAM)
  return value === "ar" || value === "en" ? value : null
}

/** The same address without the language parameter, so the visible URL stays clean after the redirect. */
export function withoutLanguageParam(url: URL | string): URL {
  const clean = new URL(url)
  clean.searchParams.delete(LANGUAGE_PARAM)
  return clean
}
