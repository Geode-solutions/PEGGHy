// Standard imports

// Third party imports
import { expect, test } from "@playwright/test"

// Local imports

const TIMEOUT = 23000

test.beforeEach(async ({ page }) => {
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))
  const nuxt_port = 3000
  await page.goto(`http://localhost:${nuxt_port}`)
  console.log("Navigated to", page.url())
})

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout(TIMEOUT)
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
