// Run with: npx tsx --test tests/event-lifecycle.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"
import {
  formatEventDateTimeShort,
  getEffectiveRegistrationStatus,
  getEventPhase,
  isEventPast,
  isPastPublicEvent,
  isPublicEventLocation,
  isRegistrationOpen,
  isUpcomingOrLivePublicEvent,
} from "../lib/event-utils"
import type { ApiEventItem } from "../lib/api/types"

function makeEvent(overrides: Partial<ApiEventItem> = {}): ApiEventItem {
  return {
    id: 1,
    name: "Intro to Cloud",
    description: "Hands-on workshop",
    location_type: "online",
    location: "Google Meet",
    start_datetime: "2026-06-10T18:00:00",
    end_datetime: "2026-06-10T20:00:00",
    status: "published",
    level: "beginner",
    image_url: null,
    meeting_url: null,
    created_at: "2026-06-01T10:00:00",
    phase: "upcoming",
    form_id: 10,
    form_type: "registration",
    registration_status: "open",
    effective_registration_status: "open",
    is_registration_open: true,
    ...overrides,
  }
}

test("isPublicEventLocation excludes internal none and hidden events", () => {
  assert.equal(isPublicEventLocation("online"), true)
  assert.equal(isPublicEventLocation("on-site"), true)
  assert.equal(isPublicEventLocation("none"), false)
  assert.equal(isPublicEventLocation("hidden"), false)
})

test("getEventPhase prefers server-derived phase and falls back to timestamps", () => {
  assert.equal(getEventPhase(makeEvent({ phase: "live" }), 0), "live")
  assert.equal(getEventPhase(makeEvent({ phase: "ended" }), 0), "ended")

  const base = makeEvent({
    phase: undefined,
    start_datetime: "2026-06-10T18:00:00",
    end_datetime: "2026-06-10T20:00:00",
  })
  assert.equal(getEventPhase(base, new Date("2026-06-10T17:59:59").getTime()), "upcoming")
  assert.equal(getEventPhase(base, new Date("2026-06-10T18:30:00").getTime()), "live")
  assert.equal(getEventPhase(base, new Date("2026-06-10T20:00:01").getTime()), "ended")
})

test("isEventPast prefers server-derived phase and falls back to end_datetime", () => {
  assert.equal(isEventPast(makeEvent({ phase: "ended" }), 0), true)
  assert.equal(isEventPast(makeEvent({ phase: "live" }), Number.MAX_SAFE_INTEGER), false)
  assert.equal(
    isEventPast(
      makeEvent({ phase: null, end_datetime: "2026-06-10T20:00:00" }),
      new Date("2026-06-10T21:00:00").getTime(),
    ),
    true,
  )
})

test("upcoming & live filter keeps published events even when registration is closed or opens soon", () => {
  const openReg = makeEvent({ phase: "upcoming", effective_registration_status: "open", is_registration_open: true })
  const closedReg = makeEvent({ phase: "upcoming", effective_registration_status: "closed", is_registration_open: false })
  const opensSoon = makeEvent({ phase: "upcoming", effective_registration_status: "not_open", is_registration_open: false })
  const liveEvent = makeEvent({ phase: "live", effective_registration_status: "closed", is_registration_open: false })
  const endedEvent = makeEvent({ phase: "ended" })
  const draftEvent = makeEvent({ status: "draft", phase: "upcoming" })
  const cancelledEvent = makeEvent({ status: "cancelled", phase: "upcoming" })
  const hiddenEvent = makeEvent({ location_type: "hidden", phase: "upcoming" })

  assert.equal(isUpcomingOrLivePublicEvent(openReg), true)
  assert.equal(isUpcomingOrLivePublicEvent(closedReg), true)
  assert.equal(isUpcomingOrLivePublicEvent(opensSoon), true)
  assert.equal(isUpcomingOrLivePublicEvent(liveEvent), true)
  assert.equal(isUpcomingOrLivePublicEvent(endedEvent), false)
  assert.equal(isUpcomingOrLivePublicEvent(draftEvent), false)
  assert.equal(isUpcomingOrLivePublicEvent(cancelledEvent), false)
  assert.equal(isUpcomingOrLivePublicEvent(hiddenEvent), false)
})

test("past public events include ended published events and never draft or cancelled", () => {
  assert.equal(isPastPublicEvent(makeEvent({ status: "published", phase: "ended" })), true)
  assert.equal(isPastPublicEvent(makeEvent({ status: "published", phase: "live" })), false)
  assert.equal(isPastPublicEvent(makeEvent({ status: "draft", phase: "ended" })), false)
  assert.equal(isPastPublicEvent(makeEvent({ status: "cancelled", phase: "ended" })), false)
  assert.equal(isPastPublicEvent(makeEvent({ status: "published", phase: "ended", location_type: "none" })), false)
  assert.equal(isPastPublicEvent(makeEvent({ status: "published", phase: "ended", location_type: "hidden" })), false)
})

test("effective registration helpers prefer server values and fall back accurately", () => {
  assert.equal(
    getEffectiveRegistrationStatus(makeEvent({ effective_registration_status: "not_open", is_registration_open: false })),
    "not_open",
  )
  assert.equal(
    isRegistrationOpen(makeEvent({ effective_registration_status: "not_open", is_registration_open: false })),
    false,
  )

  const fallbackNone = makeEvent({
    form_type: "none",
    effective_registration_status: undefined,
    is_registration_open: undefined,
  })
  assert.equal(getEffectiveRegistrationStatus(fallbackNone), "none")
  assert.equal(isRegistrationOpen(fallbackNone), false)

  const fallbackNotOpen = makeEvent({
    phase: "upcoming",
    registration_status: "not_open",
    effective_registration_status: undefined,
    is_registration_open: undefined,
  })
  assert.equal(getEffectiveRegistrationStatus(fallbackNotOpen), "not_open")
  assert.equal(isRegistrationOpen(fallbackNotOpen), false)

  const fallbackOpen = makeEvent({
    phase: "upcoming",
    registration_status: "open",
    effective_registration_status: undefined,
    is_registration_open: undefined,
  })
  assert.equal(getEffectiveRegistrationStatus(fallbackOpen), "open")
  assert.equal(isRegistrationOpen(fallbackOpen), true)
})

test("formatEventDateTimeShort formats valid dates and returns null for empty or invalid values", () => {
  assert.equal(formatEventDateTimeShort(null, "en"), null)
  assert.equal(formatEventDateTimeShort("not-a-date", "en"), null)
  const enFormatted = formatEventDateTimeShort("2026-06-10T18:30:00", "en")
  const arFormatted = formatEventDateTimeShort("2026-06-10T18:30:00", "ar")
  assert.ok(enFormatted && enFormatted.includes("10"))
  assert.ok(arFormatted && arFormatted.includes("10"))
})
