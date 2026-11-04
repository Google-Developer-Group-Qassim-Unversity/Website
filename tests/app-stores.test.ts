// Run with: npx tsx --test tests/app-stores.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"
import { APP_STORE_URL, GOOGLE_PLAY_URL, STORE_URL, storeForUserAgent } from "../lib/app-stores"

const UA = {
  iPhoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
  iPhoneInstagram:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 390.0.0.0 (iPhone15,3; iOS 18_6; ar_SA; ar)",
  iPadMobile:
    "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
  samsungInternet:
    "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36",
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15",
  windowsChrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  linuxFirefox: "Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0",
}

test("iPhones, iPods and iPads that say so go to the App Store", () => {
  assert.equal(storeForUserAgent(UA.iPhoneSafari), "ios")
  assert.equal(storeForUserAgent(UA.iPhoneInstagram), "ios")
  assert.equal(storeForUserAgent(UA.iPadMobile), "ios")
})

test("Android phones go to Google Play, whatever the browser", () => {
  assert.equal(storeForUserAgent(UA.androidChrome), "android")
  assert.equal(storeForUserAgent(UA.samsungInternet), "android")
})

test("computers, iPadOS desktop mode and a missing header get the page", () => {
  assert.equal(storeForUserAgent(UA.macSafari), null)
  assert.equal(storeForUserAgent(UA.windowsChrome), null)
  assert.equal(storeForUserAgent(UA.linuxFirefox), null)
  assert.equal(storeForUserAgent(""), null)
  assert.equal(storeForUserAgent(null), null)
  assert.equal(storeForUserAgent(undefined), null)
})

test("each store has its listing", () => {
  assert.equal(STORE_URL.ios, APP_STORE_URL)
  assert.equal(STORE_URL.android, GOOGLE_PLAY_URL)
  assert.match(APP_STORE_URL, /^https:\/\/apps\.apple\.com\/app\/id6824663288$/)
  assert.match(GOOGLE_PLAY_URL, /^https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.gdgq\.app$/)
})
