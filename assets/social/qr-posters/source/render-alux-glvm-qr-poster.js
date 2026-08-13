import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const source = path.join(__dirname, "alux-glvm-qr-poster-20260810.html");
const output = path.join(
  __dirname,
  "..",
  "alux-glvm-qr-poster-3x4-4k-20260810.jpg",
);

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });

  const page = await browser.newPage({
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 4,
  });

  await page.goto(pathToFileURL(source).href, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", reject, { once: true });
        });
      }),
    );
  });

  await page.screenshot({
    path: output,
    type: "jpeg",
    quality: 96,
    fullPage: false,
  });

  await browser.close();
  console.log(output);
})();
