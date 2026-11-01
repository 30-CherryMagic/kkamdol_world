# 깜돌 WORLDWIDE ANTHOLOGY PROJECT｜繁中資料整理

PLLI 台灣用的跨國合誌資料整理頁面。內容以 AES-GCM 加密，輸入正確 ID / PASSWORD 後才在瀏覽器中解密並顯示。

| 頁面 | 檔案 | 對象 | 帳密 |
|---|---|---|---|
| author | `index.html` | 作者 | 作者用 |
| organizer | `organizer/index.html` | 各地區主辦 | 主辦用（與作者用不同） |

## 編輯內容

明文原稿（`src/content*.html`、`src/organizer.html`）不會進入 repo（已 gitignore）。

### 多語言（作者頁）

作者頁有 5 個語言，全部合併成同一份加密資料（帳密共用），在頁面右上角的語言選單切換（不使用國旗，以各語言自己的名稱標示）。

| 語言 | 原稿 |
|---|---|
| 繁體中文（預設） | `src/content.html` |
| 简体中文 | `src/content.zh-Hans.html` |
| 日本語 | `src/content.ja.html` |
| 한국어 | `src/content.ko.html` |
| English | `src/content.en.html` |

- `decrypt.mjs author` 會一次還原所有語言；`build.mjs author` 會把找得到的原稿全部加密（缺少的語言會略過）。
- 顯示語言的順序：網址 `?lang=ja` → 上次選擇的語言 → 瀏覽器語言 → 繁體中文。
- 登入畫面、loading、目錄按鈕等介面文字在 `src/template.html` 的 `I18N`；登入標題在 `tools/pages.mjs`。
- 修改內容時，請記得每個語言的原稿都要一起更新。

```bash
KK_ID=<ID> KK_PW=<PASSWORD> node tools/decrypt.mjs author      # 還原原稿（organizer 同理）
# 編輯 src/*.html
KK_ID=<ID> KK_PW=<PASSWORD> node tools/build.mjs author        # 重新產生加密頁面
```

## 發佈最新消息（作者頁）

```bash
KK_ID=<ID> KK_PW=<PASSWORD> node tools/decrypt.mjs author   # 還原原稿（已還原過可略過）
node tools/news.mjs 2026-11-02 "消息內容"                     # 新增到所有語言的最上面；網址自動變連結，\n 可換行
node tools/news.mjs --lang ja 2026-11-02 "お知らせ"           # 只新增到指定語言（zh-Hant / zh-Hans / ja / ko / en）
KK_ID=<ID> KK_PW=<PASSWORD> node tools/build.mjs author     # 重新加密
```
