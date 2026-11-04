/**
 * The GDG Qassim member app in the stores, and which store a visitor's phone uses. `gdg-q.com/app`
 * (app/app/page.tsx) sends iPhones to the App Store and Android phones to Google Play, and shows both links (and a QR
 * code back to itself) everywhere else.
 */

export type AppStore = "ios" | "android"

export const APP_STORE_URL = "https://apps.apple.com/app/id6824663288"
export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.gdgq.app"

export const STORE_URL: Readonly<Record<AppStore, string>> = {
  ios: APP_STORE_URL,
  android: GOOGLE_PLAY_URL,
}

/**
 * The store for a User-Agent, or null when it is neither an iPhone/iPod/iPad nor Android (a computer, a bot, no
 * header). An iPad on iPadOS 13+ asks for the desktop site and says "Macintosh", so it gets the page with both links.
 */
export function storeForUserAgent(userAgent: string | null | undefined): AppStore | null {
  if (!userAgent) return null
  if (/\b(iPhone|iPod|iPad)\b/i.test(userAgent)) return "ios"
  if (/\bAndroid\b/i.test(userAgent)) return "android"
  return null
}
