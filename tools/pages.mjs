// 頁面設定：src → 輸出檔，及登入畫面標題
export const PAGES = {
  author:    { src: "src/content.html",   out: "index.html",           label: "此為受保護的頁面" },
  organizer: { src: "src/organizer.html", out: "organizer/index.html", label: "主辦限定頁面" },
};
export function pick() {
  const name = process.argv[2] || "author";
  const page = PAGES[name];
  if (!page) { console.error(`未知頁面: ${name}（可用: ${Object.keys(PAGES).join(", ")}）`); process.exit(1); }
  const { KK_ID, KK_PW } = process.env;
  if (!KK_ID || !KK_PW) { console.error("請設定環境變數 KK_ID 與 KK_PW"); process.exit(1); }
  return { name, page, cred: `${KK_ID}:${KK_PW}` };
}
