// Standard imports

// Third party imports
import { expect, test } from "@playwright/test"

// Local imports
import { run_browser_wrapper } from "../../../utils/local"

const TIMEOUT = 23000

test.beforeEach(async ({ page }) => {
  const ports = await run_browser_wrapper(`preview:browser`)
  console.log("ports", ports)
  const { geode_port, viewer_port, nuxt_port } = ports
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))
  await page.goto(
    `http://localhost:${nuxt_port}?geode_port=${geode_port}&viewer_port=${viewer_port}`,
  )
  console.log("Navigated to", page.url())
})

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout(TIMEOUT)
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
