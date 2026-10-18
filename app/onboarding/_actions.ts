'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { memberEditableMetadata, withVerifiedUniId } from '@/lib/member-metadata'

export async function updateUserMetadata(metadata: Record<string, unknown>) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return { error: 'Not authenticated' }
  }

  const client = await clerkClient()

  try {
    // Only the member's own fields come from the browser; uni_id comes from the
    // email Clerk verified (lib/member-metadata.ts).
    const user = await client.users.getUser(userId)
    await client.users.updateUser(userId, {
      publicMetadata: withVerifiedUniId(memberEditableMetadata(metadata), user.primaryEmailAddress?.emailAddress),
    })

    return { success: true }
  } catch (err) {
    console.error('Error updating user metadata:', err)
    return { error: 'There was an error updating you data, please try again later' }
  }
}

// Used to add the typed personal email to the Clerk account as already
// verified, with no code, so a later Google sign-in under that address would
// be linked into this account. Switched off: it let any account vouch for
// someone else's address - including <their uni_id>@qu.edu.sa. Made primary
// (promoteEmailToPrimary), that address became the session token's email
// claim, which the backend uses to find a member's row, and Clerk would link
// the real owner's later Google sign-in into the wrong account. Bring it back
// only behind a real verification code. The original manual-merge path still
// covers members who end up with two accounts.
export async function addVerifiedPersonalEmail(personalEmail: string) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return { error: 'Not authenticated' }
  }

  void personalEmail
  return { success: true, skipped: 'requires-verification-code' }
}
