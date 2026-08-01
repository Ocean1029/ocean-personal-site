# Plan: 調酒圖鑑頁重設計
_Locked via grill — by Claude + user_

## Goal

將現有只像簡化菜單、缺乏收藏感的調酒頁，重做為可長期維護的個人調酒圖鑑。列表易於瀏覽，單杯可閱讀完整配方與筆記；它在全站深色基調中有一個溫暖的米白酒冊視覺區域，日式感只來自材質、留白、細線與編排，不使用日文。

## Approach

1. 擴充 cocktail content schema 與 Pages CMS 欄位：每筆有 slug、`style: classic|improvisation`、`isVariation`、可選 `baseClassic`、基酒、`ingredients: { ingredient, amount?, unit? }[]`、`method`（短做法）、評分、日期、短筆記、Markdown body（長筆記）、草稿與發布時間。Zod `superRefine` 強制變體必須是 `style: classic` 且有非空 `baseClassic`；所有非變體必須沒有 `baseClassic`。每筆 ingredient 的 `amount` 和 `unit` 要麼同時存在、要麼都省略（garnish／to taste），半填寫均拒絕。`status`／`publishedAt` 規則維持與其他內容一致；新增 build 前 `assertUniqueCocktailSlugs()` 驗證，任何重複 slug 使 build 失敗，且 CMS 顯示既有 slug 以避免建立重複值。
2. 圖片一律由 CMS 上傳至 repo 的 `public/media/`；Zod schema 強制可選 `image` 為 `{ src: '/media/<filename>.(avif|webp|jpg|jpeg|png)', alt: nonempty }`，拒絕外部 URL、`..` traversal 與所有其他格式。CMS 僅允許 AVIF、WebP、JPEG、PNG 上傳並拒絕 SVG。未提供 image 時使用有 aria-label 的中性 CSS placeholder；圖片採固定裁切比例、`loading="lazy"`（首屏例外）。載入失敗時，client-side `error` handler 會移除損壞的 `<img>`、插入相同中性 placeholder 和可讀的 alt，且以缺失本地圖片 fixture 做瀏覽器驗證。`.pages.yml` 映射上述所有欄位與媒體選擇。
3. 將既有資料遷移為新 schema 的示範條目；`method` 是短做法，Markdown body 只作長筆記，避免雙重權威。發布內容只在 GitHub Pages 重新建置後可見；CMS commit 觸發的 Actions deployment 是發布動作。
4. 將 `/cocktails/` 改為米白酒冊式圖鑑列表：中文主標、少量英文小標、語意化篩選按鈕群組（經典／即興）、基酒 select 與搜尋欄，不使用 ARIA tabs。採 URL query state（`style`、`spirit`、`q`）而非分頁；無 JavaScript 時顯示所有已發布項目，JS 啟用後套用交集篩選與字母大小寫不敏感的中文／英文名稱、基酒、標籤搜尋。query URL 僅在 JavaScript 可用時還原，介面提供清楚的「清除篩選」按鈕與提示。
5. 卡片以單一可聚焦的 detail link 包覆，呈現照片或 placeholder、名稱、基酒、評分與文字分類標籤；色彩固定為深茶綠＝經典、朱紅＝經典變體、墨紫＝即興，但標籤文字不依賴顏色。排序為 publication 時間遞減，再以 slug 為 tie-breaker；零結果顯示可清除篩選的空狀態，不插入假條目。
6. 建立 `/cocktails/[slug]/` 靜態詳情頁，以 `getStaticPaths()` 只產生已發布且已到時間的唯一 slug；未知 slug 使用 Astro 的 static 404。頁面顯示分類、基底經典（若有）、結構化材料與比例、短做法、評分、日期與長筆記，並具正確 title、canonical、sitemap entry 及可分享 URL。
7. 做好桌面與手機版格狀／單欄調整、原生 filter button 的鍵盤操作與 `aria-pressed`、focus-visible、圖片 alt、色彩對比。
8. 以純函式測試覆蓋經典變體仍在經典篩選、style／基酒／搜尋交集、空搜尋、中文與大小寫搜尋、零結果、時間與 slug 排序、草稿與未發布項排除、變體欄位關聯與不合法 ingredient 半填寫，以及 image path 對外部 URL、traversal、SVG／不支援格式的拒絕；完成後驗證 build、list/detail routes、sitemap/canonical、空狀態與損壞本地圖片 fallback。

## Key decisions & tradeoffs

- 以「個人調酒圖鑑」取代「餐廳點單酒單」：更適合收藏與持續新增，但需要個別 detail route。
- 優先使用使用者實拍；無照片以中性 placeholder 呈現，避免 AI 插畫或來源不明圖片。
- 經典變體是經典的視覺子狀態（朱紅標記），不是獨立分類；即興才是第二個主分類。
- 調酒頁改為米白獨立視覺區，仍保持全站深色導航與背景，兼顧內容區的溫度與全站一致性。
- 不使用日文；繁體中文為主、少量英文僅作輔助編輯小標。

## Risks / open questions

- 使用者尚未提供實拍照片，第一版視覺將以 placeholder 為主；之後可透過 CMS 逐筆補上。
- 所有圖片必須為 repo 內 `public/media/` 的授權資產，且具正確 alt；公開 repo 中不可加入敏感或未授權媒體。

## Out of scope

- 酒吧地點、情境回憶、社群留言、購買／點餐、帳號與資料庫。
- 日文介面、AI 插畫或自動生成酒類圖片。
- 其餘網站區塊的重新設計。
