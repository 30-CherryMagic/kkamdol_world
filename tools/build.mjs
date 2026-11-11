// 加密頁面原稿 → 輸出 HTML
// 使用方式: KK_ID=xxx KK_PW=yyy node tools/build.mjs [author]
// 多語言頁面：各語言原稿合併成一份 JSON {v:2, pages:{語言:HTML}} 後加密（帳密共用）
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";
import { pick, LANGS } from "./pages.mjs";

const { page, cred } = pick();
const root = new URL("../", import.meta.url);
const template = readFileSync(new URL("src/template.html", root), "utf8");

const pages = {}, meta = [];
for (const [lang, { src, label }] of Object.entries(page.langs)) {
  const file = new URL(src, root);
  if (!existsSync(file)) { console.warn(`略過 ${lang}：找不到 ${src}`); continue; }
  pages[lang] = readFileSync(file, "utf8");
  meta.push({ code: lang, name: LANGS[lang], label });
}
if (!meta.length) { console.error("沒有任何原稿，請先執行 tools/decrypt.mjs"); process.exit(1); }
const content = JSON.stringify({ v: 2, pages });

const ITER = 250000;
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(cred), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
  base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(content)));

const b64 = u => Buffer.from(u).toString("base64");
const payload = JSON.stringify({ iter: ITER, salt: b64(salt), iv: b64(iv), data: b64(data) });
const out = new URL(page.out, root);
mkdirSync(new URL("./", out), { recursive: true });
// 登入畫面的預設文字（JS 啟動前顯示）使用第一個語言
writeFileSync(out, template
  .replace("__LABEL__", meta[0].label)
  .replace("/*LANGS*/null", JSON.stringify(meta))
  .replace("/*PAYLOAD*/null", payload));
console.log(`${page.out} 已產生（${meta.map(m => m.code).join(", ")}）`);
