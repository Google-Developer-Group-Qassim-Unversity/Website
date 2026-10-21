import type React from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslation, isRTL, type Language } from "@/lib/i18n"

/**
 * The frame of the text pages (privacy, support): back link, icon and title, an optional "last updated" line, and
 * the body in one card. Same look as the terms page, in the visitor's language and direction.
 */
export function LegalPage({
  lang,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  lang: Language
  icon: LucideIcon
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  const rtl = isRTL(lang)
  const BackArrow = rtl ? ArrowRight : ArrowLeft

  return (
    <div dir={rtl ? "rtl" : "ltr"} lang={lang} className="min-h-screen bg-white text-slate-800">
      <div className="container max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8"
        >
          <BackArrow className="h-4 w-4" />
          {getTranslation(lang, "legal.backHome")}
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
        </div>
        {subtitle ? <p className="text-sm text-slate-500 mb-8">{subtitle}</p> : <div className="mb-8" />}

        <Card className="border-slate-200">
          <CardContent className="max-w-none pt-6 space-y-6 text-slate-700 leading-relaxed">{children}</CardContent>
        </Card>
      </div>
    </div>
  )
}

/** One titled part of a text page. */
export function LegalSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

/** A bulleted list that follows the text direction. */
export function LegalList({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc ps-5 space-y-1">{children}</ul>
}

/** A link inside the text: an internal page, a mailto or an outside site (opened in a new tab). */
export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "text-blue-600 hover:underline"
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      dir={href.startsWith("mailto:") ? "ltr" : undefined}
    >
      {children}
    </a>
  )
}
