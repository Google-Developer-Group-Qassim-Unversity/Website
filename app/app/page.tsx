import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import QRCode from "qrcode"
import { Smartphone } from "lucide-react"
import { LegalPage } from "@/components/legal-page"
import { APP_STORE_URL, GOOGLE_PLAY_URL, STORE_URL, storeForUserAgent } from "@/lib/app-stores"
import { config } from "@/lib/config"
import { getLanguageFromCookies, getTranslation } from "@/lib/server-i18n"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageFromCookies()
  return {
    title: getTranslation(lang, "app.title"),
    description: getTranslation(lang, "app.description"),
    alternates: {
      canonical: "/app",
    },
  }
}

/**
 * `gdg-q.com/app`, the one link to share for the member app: a phone goes straight to its store (a temporary
 * redirect, decided on the server from the User-Agent); anything else gets both store links and a QR code of this
 * page to scan with a phone.
 */
export default async function AppPage() {
  const store = storeForUserAgent((await headers()).get("user-agent"))
  if (store) redirect(STORE_URL[store])

  const lang = await getLanguageFromCookies()
  const qr = await QRCode.toString(`${config.thisAppUrl}/app`, { type: "svg", margin: 1 })

  return (
    <LegalPage lang={lang} icon={Smartphone} title={getTranslation(lang, "app.title")}>
      <p>{getTranslation(lang, "app.lead")}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <StoreLink href={APP_STORE_URL} label={getTranslation(lang, "app.appStore")} />
        <StoreLink href={GOOGLE_PLAY_URL} label={getTranslation(lang, "app.googlePlay")} />
      </div>
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(qr)}`}
          alt={getTranslation(lang, "app.qrAlt")}
          width={112}
          height={112}
          className="shrink-0 rounded-lg bg-white"
        />
        <p className="text-sm text-slate-600">{getTranslation(lang, "app.scan")}</p>
      </div>
    </LegalPage>
  )
}

function StoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
    >
      {label}
    </a>
  )
}
