import Link from "next/link"
import { BookOpen, Calendar, Sparkle } from "lucide-react"
import { isSameDayOrOvernight, getEffectiveEndDate } from "@/lib/event-utils"
import type { ApiPointsEvent, ApiPointsHistoryItem } from "@/lib/api/types"
import type { Language } from "@/lib/translations"

const HISTORY_ROW_CLICKABLE =
  "flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:border-slate-300 dark:hover:border-gray-600 transition-all duration-200 active:scale-[0.99] group cursor-pointer"
const HISTORY_ROW_PLAIN =
  "flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg transition-all duration-200"
const HISTORY_ROW_NAME =
  "font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors"

export function resolveHistoryItems(
  history: ApiPointsHistoryItem[] | undefined,
  events: ApiPointsEvent[],
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

interface PointsHistoryListProps {
  history: ApiPointsHistoryItem[] | undefined
  events: ApiPointsEvent[]
  lang: Language
  emptyText: string
  pointsLabel: string
}

export function PointsHistoryList({
  history,
  events,
  lang,
  emptyText,
  pointsLabel,
}: PointsHistoryListProps) {
  const items = resolveHistoryItems(history, events)

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{emptyText}</p>
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
        const pointsColor =
          item.points > 0 ? "text-green-600" : item.points < 0 ? "text-red-600" : "text-slate-500"

        const inner = (
          <>
            <div className="flex items-center gap-3">
              {isBonus ? (
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Sparkle className="h-5 w-5 text-blue-600" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                </div>
              )}
              <div>
                <p className={HISTORY_ROW_NAME}>{item.title}</p>
                {subtitle ? <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}
                <p className="text-sm text-gray-500">{dateText}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-bold text-lg ${pointsColor}`} dir="ltr">
                {pointsText}
              </p>
              <p className="text-xs text-gray-500">{pointsLabel}</p>
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
}
