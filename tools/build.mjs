// 加密 src/content.html → index.html
// 使用方式: KK_ID=xxx KK_PW=yyy node tools/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const { KK_ID, KK_PW } = process.env;
if (!KK_ID || !KK_PW) { console.error("請設定環境變數 KK_ID 與 KK_PW"); process.exit(1); }

const root = new URL("../", import.meta.url);
const content = readFileSync(new URL("src/content.html", root), "utf8");
const template = readFileSync(new URL("src/template.html", root), "utf8");

const ITER = 250000;
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(`${KK_ID}:${KK_PW}`), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
  base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(content)));

const b64 = u => Buffer.from(u).toString("base64");
const payload = JSON.stringify({ iter: ITER, salt: b64(salt), iv: b64(iv), data: b64(data) });
writeFileSync(new URL("index.html", root), template.replace("/*PAYLOAD*/null", payload));
console.log("index.html 已產生");
