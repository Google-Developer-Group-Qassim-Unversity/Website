import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Award, TrendingUp, Users, BookOpen, Sparkle } from "lucide-react"
import Link from "next/link"
import { fetchMemberById } from "@/lib/api/api"

const HISTORY_ROW_CLICKABLE =
  "flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:border-slate-300 dark:hover:border-gray-600 transition-all duration-200 active:scale-[0.99] group cursor-pointer"
const HISTORY_ROW_PLAIN =
  "flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg transition-all duration-200"
const HISTORY_ROW_NAME =
  "font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors"
import { NotFoundError } from "@/lib/api/errors"
import { notFound } from "next/navigation"
import { getTranslation } from "@/lib/server-i18n"
import { isSameDayOrOvernight, getEffectiveEndDate } from "@/lib/event-utils"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import type { ApiPointsHistoryItem } from "@/lib/api/types"
import type { Language } from "@/lib/translations"

function resolveHistoryItems(
  history: ApiPointsHistoryItem[] | undefined,
  events: Array<{
    event_name: string
    event_id: number
    start_datetime: string
    end_datetime: string
    points: number
    action_name: string
    ar_action_name: string | null
    location_type: "online" | "on-site" | "none"
    bonus_row?: boolean
  }>,
): ApiPointsHistoryItem[] {
  if (history) return history
  return events.map((event, idx) => ({
    kind: event.bonus_row ? "bonus" : "event",
    id: `${event.bonus_row ? "bonus" : "event"}:${event.event_id}:${idx}`,
    title: event.event_name,
    label_en: event.action_name,
    label_ar: event.ar_action_name,
    points: event.points,
    occurred_at: event.start_datetime,
    end_datetime: event.end_datetime,
    event_id: event.location_type === "online" || event.location_type === "on-site" ? event.event_id : null,
    bonus_id: null,
    location_type: event.location_type === "online" || event.location_type === "on-site" ? event.location_type : null,
  }))
}

export async function MemberDetailContent({ id, lang }: { id: string; lang: Language }) {
  const t = (key: string) => getTranslation(lang, key)

  let memberData
  try {
    memberData = await fetchMemberById(id)
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound()
    }
    throw error
  }

  return (
    <>
      <PageBreadcrumb
        className="mb-6"
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.members"), href: "/members" },
          { label: memberData.member.member_name },
        ]}
      />
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{memberData.member.member_name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t("memberDetail.detailedLog")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Member Info */}
        <div className="lg:col-span-1">
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                {t("memberDetail.memberProfile")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{memberData.member.member_name}</h2>
                <p className="text-gray-500">{t("memberDetail.member")}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("memberDetail.totalPoints")}</span>
                  <span className="font-bold text-blue-600 text-lg">{memberData.member.total_points ?? 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Points History */}
        <div className="lg:col-span-2">
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                {t("memberDetail.pointsHistory")}
              </CardTitle>
              <CardDescription>{t("memberDetail.detailedLog")}</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const items = resolveHistoryItems(memberData.history, memberData.events)
                if (items.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t("memberDetail.noHistory")}</p>
                    </div>
                  )
                }
                return (
                  <div className="space-y-3">
                    {items.map((item) => {
                      const isBonus = item.kind === "bonus"
                      const isClickable = item.event_id !== null
                      const subtitle =
                        lang === "ar"
                          ? item.label_ar || item.label_en || (isBonus ? (item.points < 0 ? "خصم" : "مكافأة") : "")
                          : item.label_en || item.label_ar || (isBonus ? (item.points < 0 ? "Discount" : "Bonus") : "")
                      const startDate = new Date(item.occurred_at)
                      const endDate = item.end_datetime ? new Date(item.end_datetime) : startDate
                      const isSameDay = isSameDayOrOvernight(startDate, endDate)
                      const effectiveEndDate = getEffectiveEndDate(startDate, endDate)
                      const dateText = isSameDay
                        ? startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                        : `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} - ${effectiveEndDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                      const pointsText = item.points > 0 ? `+${item.points}` : `${item.points}`
                      const pointsColor = item.points < 0 ? "text-red-600" : "text-green-600"

                      const inner = (
                        <>
                          <div className="flex items-center gap-3">
                            {isBonus ? (
                              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Sparkle className="h-5 w-5 text-blue-600" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-orange-600" />
                              </div>
                            )}
                            <div>
                              <p className={HISTORY_ROW_NAME}>{item.title}</p>
                              {subtitle ? (
                                <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
                              ) : null}
                              <p className="text-sm text-gray-500">{dateText}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${pointsColor}`} dir="ltr">
                              {pointsText}
                            </p>
                            <p className="text-xs text-gray-500">{t("memberDetail.points")}</p>
                          </div>
                        </>
                      )

                      return isClickable ? (
                        <Link key={item.id} href={`/events/${item.event_id}`} className={HISTORY_ROW_CLICKABLE}>
                          {inner}
                        </Link>
                      ) : (
                        <div key={item.id} className={HISTORY_ROW_PLAIN}>
                          {inner}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
