/**
 * How to reach the club. The footer and the old legal pages linked "GDG_QU1@gmail.com", which is not a valid Gmail
 * address (Gmail allows no underscores), so mail sent to it never arrived.
 */
export const CLUB_EMAIL = "gdg.qu1@gmail.com"

export const CLUB_EMAIL_HREF = `mailto:${CLUB_EMAIL}`

/** A mailto link with the subject filled in, so requests are easy to find in the club's inbox. */
export function clubEmailHref(subject: string): string {
  return `${CLUB_EMAIL_HREF}?subject=${encodeURIComponent(subject)}`
}
