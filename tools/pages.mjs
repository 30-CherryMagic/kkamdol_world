// 頁面設定：src → 輸出檔，及登入畫面標題
// langs：多語言頁面。各語言原稿合併成同一份加密資料（帳密共用），頁面內切換語言。
//   第一個語言為預設語言；原稿檔不存在的語言會略過。
export const LANGS = {
  "zh-Hant": "繁體中文",
  "zh-Hans": "简体中文",
  "ja": "日本語",
  "ko": "한국어",
  "en": "English",
};
export const PAGES = {
  author: {
    out: "index.html",
    langs: {
      "zh-Hant": { src: "src/content.html",         label: "此為受保護的頁面" },
      "zh-Hans": { src: "src/content.zh-Hans.html", label: "此页面受密码保护" },
      "ja":      { src: "src/content.ja.html",      label: "このページは保護されています" },
      "ko":      { src: "src/content.ko.html",      label: "보호된 페이지입니다" },
      "en":      { src: "src/content.en.html",      label: "This page is protected" },
    },
  },
  organizer: {
    out: "organizer/index.html",
    langs: {
      "zh-Hant": { src: "src/organizer.html", label: "主辦限定頁面" },
    },
  },
};
export function pick() {
  const name = process.argv[2] || "author";
  const page = PAGES[name];
  if (!page) { console.error(`未知頁面: ${name}（可用: ${Object.keys(PAGES).join(", ")}）`); process.exit(1); }
  const { KK_ID, KK_PW } = process.env;
  if (!KK_ID || !KK_PW) { console.error("請設定環境變數 KK_ID 與 KK_PW"); process.exit(1); }
  return { name, page, cred: `${KK_ID}:${KK_PW}` };
}
