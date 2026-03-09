// Standard imports

// Third party imports
import { expect, test } from "@playwright/test"

// Project imports
import { runBrowser } from "@geode/opengeodeweb-front/app/utils/local/scripts.js"

// Local imports

// Constants
const WINDOWS_TIMEOUT = 15
const LINUX_TIMEOUT = 10
const MILLISECONDS = 1000

test.beforeEach(async ({ page }) => {
  nuxtPort = await runBrowser("preview:browser")
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))
  await page.goto(`http://localhost:${nuxtPort}`)
  console.log("Navigated to", page.url())
})

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout(
    (isWindows ? WINDOWS_TIMEOUT : LINUX_TIMEOUT) * MILLISECONDS,
  )
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
