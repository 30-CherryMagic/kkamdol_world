# 깜돌 WORLDWIDE ANTHOLOGY PROJECT｜繁中資料整理

PLLI 台灣用的跨國合誌資料整理頁面（`index.html`）。
開啟後需輸入 ID / PASSWORD，內容以 AES-GCM 加密，認證成功後才在瀏覽器中解密並渲染。

## 編輯內容

明文原稿 `src/content.html` 不會進入 repo（已 gitignore）。

```bash
KK_ID=<ID> KK_PW=<PASSWORD> node tools/decrypt.mjs   # 還原 src/content.html
# 編輯 src/content.html 或 src/template.html
KK_ID=<ID> KK_PW=<PASSWORD> node tools/build.mjs     # 重新產生 index.html
```
