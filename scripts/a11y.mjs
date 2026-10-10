// Serves the built site and audits every page in light and dark themes.
//  1. pa11y-ci   (axe + HTML CodeSniffer, WCAG2AA)
//  2. axe-core   (explicit WCAG 2.0/2.1/2.2 A and AA tags, incl. target size)
// Run `npm run build` first (the `a11y` npm script does this for you).
import { spawn, spawnSync } from "node:child_process";
import { readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";

const root = "_site";
const port = 4173;
const base = `http://127.0.0.1:${port}`;

function pages(dir = root, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (f.endsWith(".html")) {
      let url = "/" + relative(root, p).split(sep).join("/");
      url = url.replace(/index\.html$/, "");
      out.push(url);
    }
  }
  return out;
}

if (!existsSync(root)) { console.error("Run `npm run build` first."); process.exit(1); }
const urls = pages().sort();

const server = spawn("npx", ["http-server", root, "-p", String(port), "-s", "-a", "127.0.0.1"], { stdio: "inherit" });
const stop = () => server.kill();
process.on("exit", stop);
await new Promise((r) => setTimeout(r, 1500));

let failed = false;
try {
  // 1. pa11y-ci
  const chromeLaunchConfig = { args: ["--no-sandbox"] };
  const darkLaunch = { args: ["--no-sandbox", "--blink-settings=preferredColorScheme=1"] };
  const config = {
    defaults: { standard: "WCAG2AA", runners: ["axe", "htmlcs"], chromeLaunchConfig, timeout: 30000 },
    urls: urls.flatMap((u) => [`${base}${u}`, { url: `${base}${u}`, chromeLaunchConfig: darkLaunch, label: `${u} (dark)` }]),
  };
  writeFileSync(".pa11yci.generated.json", JSON.stringify(config, null, 2));
  const r = spawnSync("npx", ["pa11y-ci", "-c", ".pa11yci.generated.json"], { stdio: "inherit" });
  if (r.status !== 0) failed = true;

  // 2. axe-core with WCAG 2.2 tags
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
  for (const scheme of ["light", "dark"]) {
    for (const u of urls) {
      const page = await browser.newPage();
      await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
      await page.goto(base + u, { waitUntil: "networkidle0" });
      const { violations } = await new AxePuppeteer(page).withTags(tags).analyze();
      if (violations.length) {
        failed = true;
        console.error(`\n✘ ${u} (${scheme}): ${violations.length} violation(s)`);
        for (const v of violations) console.error(`  - ${v.id} [${v.impact}]: ${v.help}\n    ${v.nodes.map((n) => n.target.join(" ")).join("\n    ")}`);
      } else console.log(`✔ axe wcag2.2 AA ${u} (${scheme})`);
      await page.close();
    }
  }
  await browser.close();
} finally {
  stop();
}
process.exit(failed ? 1 : 0);
