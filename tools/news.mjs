// 在作者頁「最新消息」最上面新增一則消息（只改明文原稿，之後請重新 build）
// 使用方式:
//   node tools/news.mjs 2026-11-02 "消息內容"              → 所有已還原的語言原稿都加入同一則
//   node tools/news.mjs --lang ja 2026-11-02 "お知らせ"     → 只加入指定語言（zh-Hant / zh-Hans / ja / ko / en）
//   日期格式 YYYY-MM-DD；內容照原樣顯示（不會自動翻譯），網址會自動變成連結，\n 可換行
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { PAGES } from "./pages.mjs";

const args = process.argv.slice(2);
let only = null;
const li = args.indexOf("--lang");
if (li !== -1) { only = args[li + 1]; args.splice(li, 2); }
const [date, ...rest] = args;
const text = rest.join(" ").replace(/\\n/g, "\n").trim();
const usage = 'node tools/news.mjs [--lang 語言] YYYY-MM-DD "消息內容"';
if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") || !text) { console.error(`使用方式: ${usage}`); process.exit(1); }

const langs = PAGES.author.langs;
if (only && !langs[only]) { console.error(`未知語言: ${only}（可用: ${Object.keys(langs).join(", ")}）`); process.exit(1); }
const root = new URL("../", import.meta.url);
const targets = Object.entries(langs).filter(([l, c]) => (only ? l === only : existsSync(new URL(c.src, root))));
if (!targets.length || (only && !existsSync(new URL(langs[only].src, root)))) {
  console.error("找不到原稿，請先執行 tools/decrypt.mjs author 還原原稿"); process.exit(1);
}

const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const body = esc(text).replace(/https?:\/\/[^\s<]+/g, u => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
const item = `    <li><time datetime="${date}">${date.replaceAll("-", ".")}</time><p>${body}</p></li>\n`;
const marker = '<ol class="news-list">\n';

for (const [, { src }] of targets) {
  const file = new URL(src, root);
  const html = readFileSync(file, "utf8");
  if (!html.includes(marker)) { console.error(`${src} 中找不到最新消息區塊`); process.exit(1); }
  writeFileSync(file, html.replace(marker, marker + item));
}
console.log(`已新增：${date.replaceAll("-", ".")} ${text}`);
console.log(`寫入：${targets.map(([l]) => l).join(", ")}`);
console.log("接著請執行：KK_ID=<ID> KK_PW=<PASSWORD> node tools/build.mjs author");
