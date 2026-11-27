"use client"

import Link from 'next/link'
import { CalendarDays, Sparkle } from 'lucide-react'
import type { ApiMemberBonus, ApiMyEventItem } from '@/lib/api/types'

type ParticipatedEventCardProps = (
  | { event: ApiMyEventItem; bonus?: never }
  | { bonus: ApiMemberBonus; event?: never }
) & {
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
  if (!bonus) {
    return (
      <Link
        href={`/events/${event.id}`}
        className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-accent"
      >
        <span className="font-medium text-sm truncate">{event.name}</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatEventDate(event.start_datetime, locale)}
        </span>
      </Link>
    )
  }

  const pointsColor =
    bonus.points > 0 ? 'text-green-600' : bonus.points < 0 ? 'text-red-600' : 'text-muted-foreground'

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <Sparkle className="h-3.5 w-3.5 shrink-0 text-blue-600" />
        <span className="font-medium text-sm truncate">{bonus.title}</span>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        <span dir="ltr" className={`text-xs font-semibold tabular-nums ${pointsColor}`}>
          {bonus.points > 0 ? `+${bonus.points}` : bonus.points}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatEventDate(bonus.given_at, locale)}
        </span>
      </div>
    </div>
  )
}
