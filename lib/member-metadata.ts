// What a member may write into their own Clerk publicMetadata.
//
// The metadata ends up in the session token, and the backend reads identity
// from it, so the browser must never decide identity fields. The two server
// actions that write metadata (app/onboarding/_actions.ts, lib/actions.ts)
// keep only these keys and derive uni_id themselves from the email Clerk
// verified - the onboarding and profile forms can still send uni_id, it is
// just ignored.
export const MEMBER_METADATA_KEYS = [
  'fullArabicName',
  'saudiPhone',
  'gender',
  'memberStatus',
  'uniLevel',
  'uniCollege',
  'highSchoolName',
  'personalEmail',
  'onboardingComplete',
] as const

// A university-ID account signs in as <9-digit uni_id>@qu.edu.sa, and that
// address is only its Clerk email after a code sent to that mailbox.
const UNIVERSITY_EMAIL = /^(\d{9})@qu\.edu\.sa$/i

export function uniIdFromVerifiedEmail(email: string | null | undefined): string | undefined {
  return email?.trim().match(UNIVERSITY_EMAIL)?.[1]
}

export function memberEditableMetadata(input: Record<string, unknown>): Record<string, unknown> {
  const editable: Record<string, unknown> = {}
  for (const key of MEMBER_METADATA_KEYS) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      editable[key] = input[key]
    }
  }
  return editable
}

// Drops whatever uni_id the metadata carries and sets the one the primary
// email proves, if any. Google accounts end up with none.
export function withVerifiedUniId(
  metadata: Record<string, unknown>,
  primaryEmail: string | null | undefined,
): Record<string, unknown> {
  const { uni_id: _untrusted, ...rest } = metadata
  void _untrusted
  const uniId = uniIdFromVerifiedEmail(primaryEmail)
  return uniId ? { ...rest, uni_id: uniId } : rest
}
