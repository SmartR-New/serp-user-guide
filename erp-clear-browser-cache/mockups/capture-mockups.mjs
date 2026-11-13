import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../images");

const steps = ["02-network-tab", "03-disable-cache", "04-hard-reload", "05-close-devtools"];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const id of steps) {
  const file = path.join(__dirname, `${id}.html`);
  await page.goto(`file:///${file.replace(/\\/g, "/")}`, { waitUntil: "load" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `${id}.png`) });
}

await browser.close();
console.log("Mockup captures done:", OUT);
