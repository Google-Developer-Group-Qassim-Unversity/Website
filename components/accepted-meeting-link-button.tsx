"use client"

import { Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSubmissionStatus } from "@/hooks/queries/use-submission-status"
import type { EventPhase } from "@/lib/api/types"

interface AcceptedMeetingLinkButtonProps {
  formId: number
  phase: EventPhase
  joinLabel: string
  linkLabel: string
}

function isSafeHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

/**
 * Renders the Join Meeting button for signed-in accepted members when an online
 * event sets `meeting_url_visibility = "accepted"` (so the public SSR response
 * intentionally omits `meeting_url`, and the authenticated submission check
 * delivers it only to accepted registrants).
 */
export function AcceptedMeetingLinkButton({
  formId,
  phase,
  joinLabel,
  linkLabel,
}: AcceptedMeetingLinkButtonProps) {
  const { data } = useSubmissionStatus(formId)
  const url = data?.meeting_url?.trim()

  if (phase === "ended" || !url || !isSafeHttpUrl(url)) {
    return null
  }

  return (
    <Button asChild size="lg" className="w-full">
      <a href={url} target="_blank" rel="noopener noreferrer nofollow">
        <Video className="h-5 w-5" />
        {phase === "live" ? joinLabel : linkLabel}
      </a>
    </Button>
  )
}
