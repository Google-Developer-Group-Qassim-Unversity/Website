// Run with: npx tsx --test tests/language-param.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"
import { languageFromParam, withoutLanguageParam } from "../lib/language-param"

test("?lang=ar and ?lang=en pick the language", () => {
  assert.equal(languageFromParam(new URLSearchParams("lang=ar")), "ar")
  assert.equal(languageFromParam(new URLSearchParams("lang=en")), "en")
})

test("a missing or unknown language is ignored", () => {
  assert.equal(languageFromParam(new URLSearchParams("")), null)
  assert.equal(languageFromParam(new URLSearchParams("lang=fr")), null)
  assert.equal(languageFromParam(new URLSearchParams("lang=EN")), null)
  assert.equal(languageFromParam(new URLSearchParams("lang=")), null)
})

test("the redirect keeps the path, the other parameters and the fragment", () => {
  const clean = withoutLanguageParam(new URL("https://gdg-q.com/privacy?lang=en&ref=app#retention"))
  assert.equal(clean.toString(), "https://gdg-q.com/privacy?ref=app#retention")
})

test("the redirect leaves no empty query behind", () => {
  assert.equal(withoutLanguageParam(new URL("https://gdg-q.com/support?lang=ar")).toString(), "https://gdg-q.com/support")
})
