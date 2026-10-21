import type { Metadata } from "next"
import { LifeBuoy } from "lucide-react"
import { LegalPage } from "@/components/legal-page"
import { getLanguageFromCookies, getTranslation } from "@/lib/server-i18n"
import { SupportArabic, SupportEnglish } from "./content"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageFromCookies()
  return {
    title: getTranslation(lang, "support.title"),
    description: getTranslation(lang, "support.description"),
    alternates: {
      canonical: "/support",
    },
  }
}

export default async function SupportPage() {
  const lang = await getLanguageFromCookies()

  return (
    <LegalPage lang={lang} icon={LifeBuoy} title={getTranslation(lang, "support.title")}>
      {lang === "ar" ? <SupportArabic /> : <SupportEnglish />}
    </LegalPage>
  )
}
