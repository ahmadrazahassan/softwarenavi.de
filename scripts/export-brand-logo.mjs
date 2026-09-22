import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import React from "react";
import { ImageResponse } from "next/og.js";
import sharp from "sharp";

const root = process.cwd();
const output = join(root, "public", "brand");
await mkdir(output, { recursive: true });

const ink = "#15131E";
const violet = "#5B4FE0";
const h = React.createElement;
const mark = h("svg", { width: 144, height: 144, viewBox: "0 0 64 64", fill: "none", "aria-hidden": "true" },
  h("path", { d: "M50 12H27C18 12 12 16 12 23S18 34 27 34h10c9 0 15 4 15 11s-6 11-15 11H14", stroke: ink, strokeWidth: 8, strokeLinecap: "round", strokeLinejoin: "round" }),
  h("circle", { cx: 50, cy: 12, r: 5, fill: violet }),
);
const font = await readFile(join(root, "app", "fonts", "GeneralSans-Variable.woff2"));
const logo = h("div", {
  style: { display: "flex", alignItems: "center", width: "100%", height: "100%", padding: "24px", gap: "26px" },
},
mark,
h("div", { style: { display: "flex", alignItems: "center", fontFamily: "General Sans", fontSize: 112, fontWeight: 500, letterSpacing: "-5px" } },
  h("span", { style: { color: ink } }, "Software"),
  h("span", { style: { color: violet } }, "navi"),
));

const response = new ImageResponse(logo, {
  width: 920,
  height: 192,
  fonts: [{ name: "General Sans", data: font, weight: 500, style: "normal" }],
});
await writeFile(join(output, "softwarenavi-logo.png"), Buffer.from(await response.arrayBuffer()));

const icon = await readFile(join(root, "app", "icon.svg"));
await sharp(icon, { density: 1536 }).resize(1024, 1024).png().toFile(join(output, "softwarenavi-icon.png"));
