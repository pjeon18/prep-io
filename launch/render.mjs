/* Renders the launch film frame-by-frame to MP4.
   Needs the dev server running and playwright + ffmpeg installed.
   node launch/render.mjs [baseUrl] [fps]                              */
import { spawn } from "node:child_process";
import { chromium } from "/Users/pauljeon/Downloads/assets/iso-prototype/node_modules/playwright/index.mjs";

const base = process.argv[2] ?? "http://localhost:5173";
const fps = Number(process.argv[3] ?? 60);
const DURATION = 32;
const out = new URL("./prep-io-launch.mp4", import.meta.url).pathname;

const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`${base}/launch/?render`, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__ready);
await page.evaluate(() => document.fonts.ready);
const frames = Math.round(DURATION * fps);
for (let i = 0; i < frames; i++) {
  await page.evaluate((x) => window.__seek(x), i / fps);
  const buf = await page.screenshot({ type: "jpeg", quality: 94 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % 120 === 0) console.log(`frame ${i}/${frames}`);
}
ff.stdin.end();
await browser.close();
await new Promise((r) => ff.on("close", r));
console.log("wrote", out);
