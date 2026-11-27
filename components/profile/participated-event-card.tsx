"use client"

import { CalendarDays, Sparkle } from 'lucide-react'
import type { ApiMemberBonus, ApiMyEventItem } from '@/lib/api/types'

interface ParticipatedEventCardProps {
  event?: ApiMyEventItem
  bonus?: ApiMemberBonus
  locale: string
}

function formatEventDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function ParticipatedEventCard({ event, bonus, locale }: ParticipatedEventCardProps) {
  const title = bonus ? bonus.title : (event?.name ?? '')
  const dateStr = bonus ? bonus.given_at : (event?.start_datetime ?? '')
  const points = bonus ? bonus.points : null

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        {bonus ? <Sparkle className="h-3.5 w-3.5 shrink-0 text-blue-600" /> : null}
        <span className="font-medium text-sm truncate">{title}</span>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        {points !== null ? (
          <span
            dir="ltr"
            className={`text-xs font-semibold tabular-nums ${points < 0 ? 'text-red-600' : 'text-green-600'}`}
          >
            {points > 0 ? `+${points}` : points}
          </span>
        ) : null}
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatEventDate(dateStr, locale)}
        </span>
      </div>
    </div>
  )
}
