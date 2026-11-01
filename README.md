# 깜돌 WORLDWIDE ANTHOLOGY PROJECT｜繁中資料整理

PLLI 台灣用的跨國合誌資料整理頁面。內容以 AES-GCM 加密，輸入正確 ID / PASSWORD 後才在瀏覽器中解密並渲染。

| 頁面 | 檔案 | 對象 | 帳密 |
|---|---|---|---|
| author | `index.html` | 作者 | 作者用 |
| organizer | `organizer/index.html` | 各地區主辦 | 主辦用（與作者用不同） |

## 編輯內容

明文原稿（`src/content.html`、`src/organizer.html`）不會進入 repo（已 gitignore）。

```bash
KK_ID=<ID> KK_PW=<PASSWORD> node tools/decrypt.mjs author      # 還原原稿（organizer 同理）
# 編輯 src/*.html
KK_ID=<ID> KK_PW=<PASSWORD> node tools/build.mjs author        # 重新產生加密頁面
```
