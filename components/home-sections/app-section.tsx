import Image from "next/image"
import QRCode from "qrcode"
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/app-stores"
import { config } from "@/lib/config"
import { getTranslation } from "@/lib/server-i18n"
import type { Language } from "@/lib/translations"

export async function AppSection({ lang }: { lang: Language }) {
  const t = (key: string) => getTranslation(lang, key)
  const qr = await QRCode.toString(new URL("/app", config.thisAppUrl).href, {
    type: "svg",
    margin: 1,
  })
  const downloadClass = "inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"

  return (
    <section aria-labelledby="app-promotion-title" className="container mx-auto px-4 pt-8 pb-4 sm:pt-12">
      <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-white p-6 shadow-lg sm:p-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          <div className="flex-1 space-y-5 text-center md:text-start">
            <Image src="/gdg.png" alt="GDG Qassim" width={64} height={64} className="mx-auto object-contain md:mx-0" />
            <h2 id="app-promotion-title" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t("app.title")}</h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 md:mx-0">{t("app.lead")}</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <a href={APP_STORE_URL} className={downloadClass}>{t("app.appStore")}</a>
              <a href={GOOGLE_PLAY_URL} className={downloadClass}>{t("app.googlePlay")}</a>
            </div>
          </div>
          <div className="hidden w-48 shrink-0 space-y-3 text-center md:block">
            <img src={`data:image/svg+xml;utf8,${encodeURIComponent(qr)}`} alt={t("app.qrAlt")} width={176} height={176} className="mx-auto rounded-xl bg-white p-2" />
            <p className="text-sm leading-relaxed text-slate-600">{t("app.scan")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
