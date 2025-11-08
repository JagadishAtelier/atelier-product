// download-assets.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const htmlFile = "hms.html";
const html = fs.readFileSync(htmlFile, "utf-8");
const dom = new JSDOM(html);
const document = dom.window.document;

const outputDir = path.join(process.cwd(), "assets");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

async function downloadFile(url, folder) {
  const fileName = path.basename(url.split("?")[0]);
  const filePath = path.join(folder, fileName);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));
  return `assets/${fileName}`;
}

async function processTags(selector, attr) {
  const tags = document.querySelectorAll(selector);
  for (const tag of tags) {
    const url = tag.getAttribute(attr);
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      const newPath = await downloadFile(url, outputDir);
      tag.setAttribute(attr, newPath);
      console.log("Downloaded:", url);
    }
  }
}

(async () => {
  await processTags("link[rel='stylesheet']", "href");
  await processTags("script[src]", "src");

  fs.writeFileSync("hms_local.html", dom.serialize());
  console.log("\n✅ Done! All assets saved in /assets and HTML updated → hms_local.html");
})();
