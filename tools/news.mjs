// 在作者頁「最新消息」最上面新增一則消息（只改明文原稿，之後請重新 build）
// 使用方式: node tools/news.mjs 2026-11-02 "消息內容"
//   日期格式 YYYY-MM-DD；內容照原樣顯示，網址會自動變成連結，\n 可換行
import { readFileSync, writeFileSync } from "node:fs";

const [date, ...rest] = process.argv.slice(2);
const text = rest.join(" ").replace(/\\n/g, "\n").trim();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") || !text) {
  console.error('使用方式: node tools/news.mjs YYYY-MM-DD "消息內容"'); process.exit(1);
}
const src = new URL("../src/content.html", import.meta.url);
let html;
try { html = readFileSync(src, "utf8"); }
catch { console.error("找不到 src/content.html，請先執行 tools/decrypt.mjs author 還原原稿"); process.exit(1); }

const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const body = esc(text).replace(/https?:\/\/[^\s<]+/g, u => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
const item = `    <li><time datetime="${date}">${date.replaceAll("-", ".")}</time><p>${body}</p></li>\n`;

const marker = '<ol class="news-list">\n';
if (!html.includes(marker)) { console.error("src/content.html 中找不到最新消息區塊"); process.exit(1); }
writeFileSync(src, html.replace(marker, marker + item));
console.log(`已新增：${date.replaceAll("-", ".")} ${text}`);
console.log("接著請執行：KK_ID=<ID> KK_PW=<PASSWORD> node tools/build.mjs author");
