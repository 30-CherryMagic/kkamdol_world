// 從輸出 HTML 還原頁面原稿（編輯前使用）
// 使用方式: KK_ID=xxx KK_PW=yyy node tools/decrypt.mjs [author|organizer]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";
import { pick } from "./pages.mjs";

const { page, cred } = pick();
const root = new URL("../", import.meta.url);
const html = readFileSync(new URL(page.out, root), "utf8");
const m = html.match(/const PAYLOAD = (\{.*?\});/s);
if (!m) { console.error(`${page.out} 中找不到加密資料`); process.exit(1); }
const p = JSON.parse(m[1]);
const b = s => Buffer.from(s, "base64");

const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(cred), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: b(p.salt), iterations: p.iter, hash: "SHA-256" },
  base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
const out = new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: b(p.iv) }, key, b(p.data)));
mkdirSync(new URL("src/", root), { recursive: true });
writeFileSync(new URL(page.src, root), out);
console.log(`${page.src} 已還原`);
