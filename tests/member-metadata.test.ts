// Run with: npx tsx --test tests/member-metadata.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"
import { memberEditableMetadata, uniIdFromVerifiedEmail, withVerifiedUniId } from "../lib/member-metadata"

test("uni_id comes only from a university email", () => {
  assert.equal(uniIdFromVerifiedEmail("442106350@qu.edu.sa"), "442106350")
  assert.equal(uniIdFromVerifiedEmail(" 442106350@QU.EDU.SA "), "442106350")
  assert.equal(uniIdFromVerifiedEmail("someone@gmail.com"), undefined)
  assert.equal(uniIdFromVerifiedEmail("44210635@qu.edu.sa"), undefined)
  assert.equal(uniIdFromVerifiedEmail("442106350@qu.edu.sa.evil.com"), undefined)
  assert.equal(uniIdFromVerifiedEmail(undefined), undefined)
})

test("only the member's own fields pass through", () => {
  const sent = {
    uni_id: "111111111",
    fullArabicName: "عزام",
    personalEmail: "me@example.com",
    onboardingComplete: true,
    is_admin: true,
    email: "victim@example.com",
  }

  assert.deepEqual(memberEditableMetadata(sent), {
    fullArabicName: "عزام",
    personalEmail: "me@example.com",
    onboardingComplete: true,
  })
})

test("a uni_id sent from the browser is replaced by the one the email proves", () => {
  const stored = withVerifiedUniId({ fullArabicName: "x", uni_id: "111111111" }, "442106350@qu.edu.sa")
  assert.deepEqual(stored, { fullArabicName: "x", uni_id: "442106350" })
})

test("a Google account keeps no uni_id at all", () => {
  const stored = withVerifiedUniId({ fullArabicName: "x", uni_id: "111111111" }, "someone@gmail.com")
  assert.deepEqual(stored, { fullArabicName: "x" })
})
