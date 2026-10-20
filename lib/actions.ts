'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { memberEditableMetadata, withVerifiedUniId } from '@/lib/member-metadata'

export async function updateClerkMetadata(newMetadata: Record<string, unknown>) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return { error: 'Not authenticated' }
  }

  const client = await clerkClient()

  try {
    const currentUser = await client.users.getUser(userId)
    const existingMetadata = currentUser.publicMetadata || {}

    // Only the member's own fields come from the browser, and uni_id is
    // re-derived from the verified email on every write (lib/member-metadata.ts).
    const mergedMetadata = withVerifiedUniId(
      {
        ...existingMetadata,
        ...memberEditableMetadata(newMetadata),
      },
      currentUser.primaryEmailAddress?.emailAddress,
    )

    await client.users.updateUser(userId, {
      publicMetadata: mergedMetadata,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Successfully updated user public metadata:', mergedMetadata)
    }

    return { success: true }
  } catch (err) {
    console.error('Error updating user metadata:', err)
    return { error: 'There was an error updating your data, please try again later' }
  }
}

// For uni_id accounts whose typed personal email got auto-linked to this
// Clerk user via a later Google sign-in (Clerk's native account linking -
// see addVerifiedPersonalEmail in score-leaderboard-authentication), the
// linked email lands as a verified secondary, not primary. Clerk doesn't
// promote it automatically. Until it's primary, the account still looks
// like a plain uni_id account (primary email still the synthetic
// <uni_id>@qu.edu.sa address), so profile-form.tsx's isEmailLocked check
// stays false and the user can still edit an email that's actually already
// their proven Google identity. Promoting it to primary here fixes that for
// free: isQuAccount/isEmailLocked in profile-form.tsx are computed off the
// primary email, so once this flips, the field locks with no other changes.
//
// The caller (profile-form.tsx) determines *whether* there's anything to
// promote entirely from data useUser() already has loaded client-side
// (externalAccounts, emailAddresses) - this action only performs the
// privileged write once the client has decided it's needed, so it's never
// called on ordinary page loads, only in the one-time window right after a
// linking Google sign-in. Clerk's own API validates that emailAddressId
// actually belongs to the authenticated user, so there's no need to
// re-fetch and re-verify that here.
export async function promoteEmailToPrimary(emailAddressId: string) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return { error: 'Not authenticated' }
  }

  const client = await clerkClient()

  try {
    // The primary email is the session token's email claim, which the backend
    // trusts to find a member's row. Only an address a linked Google (OAuth)
    // account proved may take that place - never one added without a code.
    const user = await client.users.getUser(userId)
    const target = user.emailAddresses.find((email) => email.id === emailAddressId)
    const provenByOAuth =
      target?.verification?.status === 'verified' &&
      target.linkedTo.some((link) => link.type.startsWith('oauth_'))
    if (!provenByOAuth) {
      return { error: 'Only an email proven by a linked Google account can become primary' }
    }

    await client.users.updateUser(userId, {
      primaryEmailAddressID: emailAddressId,
    })

    return { promoted: true }
  } catch (err) {
    console.error('Error promoting linked email to primary:', err)
    return { error: 'Failed to promote linked email' }
  }
}

export async function getMemberIdFromPrivateMetadata() {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return null
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  
  return user.privateMetadata?.memberId as number | undefined
}
