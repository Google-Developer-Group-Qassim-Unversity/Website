// Run with: npx tsx --test tests/card-qr.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"
import { cardQrValue, readQrValue } from "../lib/card-qr"

const UUID = "0f8c2a9d4b6e4c1a9e3f5d7b2c4a6e8f"
const SIGNED = `https://gdg-q.com/p/${UUID}?s=AbCdEfGhIjKlMnOp`

test("the card draws the backend's signed QR value when there is one", () => {
  assert.equal(cardQrValue({ uuid: UUID, qrValue: SIGNED }), SIGNED)
})

test("an older backend's card falls back to the unsigned profile link", () => {
  assert.equal(cardQrValue({ uuid: UUID }), `https://gdg-q.com/p/${UUID}`)
})

test("a card with no uuid points at the home page", () => {
  assert.equal(cardQrValue({}), "https://gdg-q.com")
})

test("only the backend's card links are taken from /wallet/me", () => {
  assert.equal(readQrValue(SIGNED), SIGNED)
  assert.equal(readQrValue(`https://gdg-q.com/p/${UUID}`), `https://gdg-q.com/p/${UUID}`)
  assert.equal(readQrValue(null), undefined)
  assert.equal(readQrValue(undefined), undefined)
  assert.equal(readQrValue(""), undefined)
  assert.equal(readQrValue("https://example.com/p/x"), undefined)
  assert.equal(readQrValue(42), undefined)
})
