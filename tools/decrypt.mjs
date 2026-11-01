// 從 index.html 還原 src/content.html（編輯前使用）
// 使用方式: KK_ID=xxx KK_PW=yyy node tools/decrypt.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const { KK_ID, KK_PW } = process.env;
if (!KK_ID || !KK_PW) { console.error("請設定環境變數 KK_ID 與 KK_PW"); process.exit(1); }

const root = new URL("../", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const m = html.match(/const PAYLOAD = (\{.*?\});/s);
if (!m) { console.error("index.html 中找不到加密資料"); process.exit(1); }
const p = JSON.parse(m[1]);
const b = s => Buffer.from(s, "base64");

const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(`${KK_ID}:${KK_PW}`), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: b(p.salt), iterations: p.iter, hash: "SHA-256" },
  base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
const out = new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: b(p.iv) }, key, b(p.data)));
mkdirSync(new URL("src/", root), { recursive: true });
writeFileSync(new URL("src/content.html", root), out);
console.log("src/content.html 已還原");
