// Generates public/og.png (1200x630). Run with `npm run og`; commit the result.
import { readFileSync, writeFileSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const dir = "node_modules/@fontsource/bricolage-grotesque/files/";
const font = (w) => readFileSync(`${dir}bricolage-grotesque-latin-${w}-normal.woff`);
const h = (type, style, children) => ({ type, props: { style, children } });

const tree = h("div", { display: "flex", flexDirection: "column", justifyContent: "center", gap: 56, width: "100%", height: "100%", background: "#0f1218", color: "#eef0f4", padding: 80, fontFamily: "Bricolage" }, [
  h("div", { display: "flex", fontSize: 36, color: "#a6adbb" }, [h("span", { fontWeight: 700, color: "#ff8fa3", marginRight: 16 }, "Jean Ducrot"), h("span", {}, "Technical product leader")]),
  h("div", { display: "flex", flexDirection: "column", width: 1040, fontSize: 64, lineHeight: 1.08, letterSpacing: -2, fontWeight: 500 }, [
    h("div", {}, "I keep large engineering organizations moving"),
    h("div", { fontWeight: 300, color: "#a6adbb" }, "without breaking the rules they can't afford to break."),
  ]),
]);

const svg = await satori(tree, {
  width: 1200, height: 630,
  fonts: [
    { name: "Bricolage", data: font(300), weight: 300 },
    { name: "Bricolage", data: font(500), weight: 500 },
    { name: "Bricolage", data: font(700), weight: 700 },
  ],
});
writeFileSync("public/og.png", new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng());
console.log("wrote public/og.png");
