// What a member card's QR encodes (Backend docs/CARD_QR.md).
//
// The backend signs the card QR: `/wallet/me` returns it as `qr_value`,
// `https://gdg-q.com/p/{uuid}?s={sig}`, and staff scanners check the `s`. An
// older backend sends no `qr_value`; then the card shows the unsigned profile
// link, as it always did. Sharing a profile keeps using the unsigned link.

export const HOME_PAGE = "https://gdg-q.com"

export function profileUrl(uuid: string): string {
  return `${HOME_PAGE}/p/${uuid}`
}

/** `qr_value` from `/wallet/me`, when it is one of the backend's card links; otherwise undefined. */
export function readQrValue(value: unknown): string | undefined {
  return typeof value === "string" && value.startsWith(`${HOME_PAGE}/p/`) ? value : undefined
}

/** The value a card's QR draws: the backend's signed value, else the unsigned link, else the home page. */
export function cardQrValue(card: { qrValue?: string; uuid?: string }): string {
  return card.qrValue || (card.uuid ? profileUrl(card.uuid) : HOME_PAGE)
}
