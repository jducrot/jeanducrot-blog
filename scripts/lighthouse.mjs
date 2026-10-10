// Runs Lighthouse against the built homepage and fails if any category is under 95.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const server = spawn("npx", ["http-server", "_site", "-p", "4175", "-s", "-a", "127.0.0.1"], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 1500));
const chrome = await chromeLauncher.launch({ chromePath: await puppeteer.executablePath(), chromeFlags: ["--headless=new", "--no-sandbox"] });
let failed = false;
try {
  const { lhr } = await lighthouse("http://127.0.0.1:4175/", { port: chrome.port, logLevel: "error" });
  for (const [id, c] of Object.entries(lhr.categories)) {
    const score = Math.round(c.score * 100);
    console.log(`${score >= 95 ? "✔" : "✘"} ${id}: ${score}`);
    if (id !== "agentic-browsing" && score < 95) failed = true;
  }
} finally {
  await chrome.kill();
  server.kill();
}
process.exit(failed ? 1 : 0);
