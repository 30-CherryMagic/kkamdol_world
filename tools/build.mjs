// 加密頁面原稿 → 輸出 HTML
// 使用方式: KK_ID=xxx KK_PW=yyy node tools/build.mjs [author|organizer]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";
import { pick } from "./pages.mjs";

const { page, cred } = pick();
const root = new URL("../", import.meta.url);
const content = readFileSync(new URL(page.src, root), "utf8");
const template = readFileSync(new URL("src/template.html", root), "utf8");

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
writeFileSync(out, template.replace("__LABEL__", page.label).replace("/*PAYLOAD*/null", payload));
console.log(`${page.out} 已產生`);
