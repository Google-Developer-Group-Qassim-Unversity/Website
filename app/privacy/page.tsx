import type { Metadata } from "next"
import { Shield } from "lucide-react"
import { LegalPage } from "@/components/legal-page"
import { getLanguageFromCookies, getTranslation } from "@/lib/server-i18n"
import { PrivacyArabic, PrivacyEnglish } from "./content"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageFromCookies()
  return {
    title: getTranslation(lang, "privacy.title"),
    description: getTranslation(lang, "privacy.description"),
    alternates: {
      canonical: "/privacy",
    },
  }
}

export default async function PrivacyPolicyPage() {
  const lang = await getLanguageFromCookies()
  const t = (key: string) => getTranslation(lang, key)

  return (
    <LegalPage lang={lang} icon={Shield} title={t("privacy.title")} subtitle={t("privacy.lastUpdated")}>
      {lang === "ar" ? <PrivacyArabic /> : <PrivacyEnglish />}
    </LegalPage>
  )
}
