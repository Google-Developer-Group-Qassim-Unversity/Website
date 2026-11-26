import { addDays, differenceInHours, format, isSameDay as dateFnsIsSameDay } from "date-fns"
import type {
  ApiEventItem,
  EffectiveRegistrationStatus,
  EventPhase,
} from "./api/types"
import type { Language } from "./translations"

// 'none' and 'hidden' are internal-only events that should never surface publicly.
export function isPublicEventLocation(locationType: string): boolean {
  return locationType !== "none" && locationType !== "hidden"
}

export function getEventPhase(
  event: { phase?: EventPhase | null; start_datetime: string; end_datetime: string },
  now: number = Date.now(),
): EventPhase {
  if (event.phase === "upcoming" || event.phase === "live" || event.phase === "ended") {
    return event.phase
  }
  const start = new Date(event.start_datetime).getTime()
  const end = new Date(event.end_datetime).getTime()
  if (now < start) return "upcoming"
  if (now <= end) return "live"
  return "ended"
}

export function isEventPast(
  event: { phase?: EventPhase | null; end_datetime: string },
  now: number = Date.now(),
): boolean {
  if (event.phase === "ended") return true
  if (event.phase === "upcoming" || event.phase === "live") return false
  return new Date(event.end_datetime).getTime() < now
}

export function getEffectiveRegistrationStatus(
  event: Pick<
    ApiEventItem,
    | "status"
    | "phase"
    | "end_datetime"
    | "form_type"
    | "registration_status"
    | "effective_registration_status"
    | "is_registration_open"
  >,
  now: number = Date.now(),
): EffectiveRegistrationStatus {
  if (event.effective_registration_status) {
    return event.effective_registration_status
  }
  if (!event.form_type || event.form_type === "none") {
    return "none"
  }
  if (event.is_registration_open === true) {
    return "open"
  }
  if (event.status === "cancelled") {
    return "closed"
  }
  if (event.status === "draft") {
    return "not_open"
  }
  if (isEventPast(event, now) || event.registration_status === "closed") {
    return "closed"
  }
  if (!event.registration_status || event.registration_status === "not_open") {
    return "not_open"
  }
  return "open"
}

export function isRegistrationOpen(
  event: Pick<
    ApiEventItem,
    | "status"
    | "phase"
    | "end_datetime"
    | "form_type"
    | "registration_status"
    | "effective_registration_status"
    | "is_registration_open"
  >,
  now: number = Date.now(),
): boolean {
  if (typeof event.is_registration_open === "boolean") {
    return event.is_registration_open
  }
  return getEffectiveRegistrationStatus(event, now) === "open"
}

export function isUpcomingOrLivePublicEvent(
  event: Pick<ApiEventItem, "status" | "location_type" | "phase" | "end_datetime">,
  now: number = Date.now(),
): boolean {
  return (
    event.status === "published" &&
    isPublicEventLocation(event.location_type) &&
    !isEventPast(event, now)
  )
}

export function isPastPublicEvent(
  event: Pick<ApiEventItem, "status" | "location_type" | "phase" | "end_datetime">,
  now: number = Date.now(),
): boolean {
  return (
    event.status === "published" &&
    isPublicEventLocation(event.location_type) &&
    isEventPast(event, now)
  )
}

export function formatEventDateTimeShort(dateString: string | null | undefined, lang: Language): string | null {
  if (!dateString) return null
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null

  const locale = lang === "ar" ? "ar-SA" : "en-US"
  const datePart = date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    numberingSystem: "latn",
  })
  let timePart = date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    numberingSystem: "latn",
  })
  if (lang === "ar") {
    timePart = timePart.replace(/AM/gi, "صباحاً").replace(/PM/gi, "مساءً")
    return `${datePart}، ${timePart}`
  }
  return `${datePart}, ${timePart}`
}

export function isOvernightEvent(start: Date | undefined, end: Date | undefined): boolean {
  if (!start || !end) return false;
  if (dateFnsIsSameDay(start, end)) return false;
  return differenceInHours(end, start) < 24;
}

export function isSameDayOrOvernight(start: Date | undefined, end: Date | undefined): boolean {
  if (!start || !end) return true;
  return dateFnsIsSameDay(start, end) || isOvernightEvent(start, end);
}

export function getEventDayCount(start: Date, end: Date): number {
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

export function getEffectiveEndDate(start: Date, end: Date): Date {
  const dayCount = getEventDayCount(start, end);
  return addDays(start, dayCount - 1);
}

export interface EventDuration {
  isSingleDay: boolean
  numberOfDays: number
  hoursPerDay: number
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  dateDisplay: string
  timeDisplay: string
  fullDisplay: string
}

/**
 * Calculates the duration and formatting information for an event
 */
export function calculateEventDuration(startDatetime: string, endDatetime: string): EventDuration {
  const startDate = new Date(startDatetime)
  const endDate = new Date(endDatetime)
  
  const isSingleDay = isSameDayOrOvernight(startDate, endDate)
  
  const numberOfDays = getEventDayCount(startDate, endDate)
  const effectiveEndDate = getEffectiveEndDate(startDate, endDate)
  
  // Calculate hours between start time and end time on a single day
  const startHour = startDate.getHours()
  const startMinute = startDate.getMinutes()
  const endHour = endDate.getHours()
  const endMinute = endDate.getMinutes()
  
  // Calculate hours per day based on time difference
  const hoursPerDay = (endHour - startHour) + ((endMinute - startMinute) / 60)
  
  // Format times
  const startTime = format(startDate, "h:mm a")
  const endTime = format(endDate, "h:mm a")
  
  // Format dates
  let dateDisplay: string
  let timeDisplay: string
  let fullDisplay: string
  
  if (isSingleDay) {
    // Single day event: "January 1, 2025"
    dateDisplay = format(startDate, "MMMM dd, yyyy")
    timeDisplay = `${startTime} - ${endTime}`
    
    if (hoursPerDay >= 1) {
      const hours = Math.floor(hoursPerDay)
      const minutes = Math.round((hoursPerDay - hours) * 60)
      const durationText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hour${hours !== 1 ? 's' : ''}`
      fullDisplay = `${dateDisplay} • ${timeDisplay} (${durationText})`
    } else {
      const minutes = Math.round(hoursPerDay * 60)
      fullDisplay = `${dateDisplay} • ${timeDisplay} (${minutes} minutes)`
    }
  } else {
    const startMonth = format(startDate, "MMMM")
    const endMonth = format(effectiveEndDate, "MMMM")
    const startDay = format(startDate, "dd")
    const endDay = format(effectiveEndDate, "dd")
    const year = format(effectiveEndDate, "yyyy")
    
    if (startMonth === endMonth) {
      dateDisplay = `${startMonth} ${startDay} - ${endDay}, ${year}`
    } else {
      dateDisplay = `${format(startDate, "MMMM dd")} - ${format(effectiveEndDate, "MMMM dd")}, ${year}`
    }
    
    timeDisplay = `${startTime} - ${endTime} daily`
    
    const hours = Math.floor(hoursPerDay)
    const minutes = Math.round((hoursPerDay - hours) * 60)
    const durationText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hour${hours !== 1 ? 's' : ''}`
    fullDisplay = `${dateDisplay} • ${numberOfDays} day${numberOfDays !== 1 ? 's' : ''} • ${timeDisplay} (${durationText} per day)`
  }
  
  return {
    isSingleDay,
    numberOfDays,
    hoursPerDay,
    startDate,
    endDate,
    startTime,
    endTime,
    dateDisplay,
    timeDisplay,
    fullDisplay
  }
}

/**
 * Formats a Date as a UTC basic-format timestamp (YYYYMMDDTHHMMSSZ) for Google Calendar links
 */
function toGoogleCalendarUtc(date: Date): string {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, "")
}

/**
 * Builds a Google Calendar "add event" URL (calendar.google.com/render) that pre-fills
 * the event's title, time, location and description. No auth/API access required.
 *
 * When a meeting_url is present, it's put in the location field: Google Calendar
 * auto-detects meet.google.com links there and renders a "Join with Google Meet"
 * button on the saved event, not just a plain text location.
 */
export function buildGoogleCalendarUrl(event: {
  name: string
  description?: string | null
  location?: string | null
  meeting_url?: string | null
  start_datetime: string
  end_datetime: string
}): string {
  const start = new Date(event.start_datetime)
  const end = new Date(event.end_datetime)

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: `${toGoogleCalendarUtc(start)}/${toGoogleCalendarUtc(end)}`,
  })

  const details = [event.description, event.meeting_url].filter(Boolean).join("\n\n")
  if (details) params.set("details", details)

  const location = event.meeting_url || event.location
  if (location) params.set("location", location)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Formats a short version for event cards
 */
export function formatEventCardDate(startDatetime: string, endDatetime: string): { date: string; time: string; duration: string } {
  const duration = calculateEventDuration(startDatetime, endDatetime)
  
  if (duration.isSingleDay) {
    const hours = Math.floor(duration.hoursPerDay)
    const minutes = Math.round((duration.hoursPerDay - hours) * 60)
    const durationText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}hr${hours !== 1 ? 's' : ''}`
    
    return {
      date: duration.dateDisplay,
      time: duration.timeDisplay,
      duration: durationText
    }
  } else {
    const hours = Math.floor(duration.hoursPerDay)
    const durationText = `${duration.numberOfDays} days • ${hours}hrs/day`
    
    return {
      date: duration.dateDisplay,
      time: duration.timeDisplay,
      duration: durationText
    }
  }
}
