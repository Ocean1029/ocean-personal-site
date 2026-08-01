# Plan Review Log: Ocean 個人網站

Act 1 (grill) complete — plan locked with the user. MAX_ROUNDS=5.

## Round 1 — Codex

- “材料與比例”無法由目前 `ingredients: string[]` 表達；改為必填結構化欄位（如 `{ ingredient, amount, unit }[]`），並定義可否接受 garnish／to taste。
- 「可選照片 URL 與必填 alt」互相矛盾，且沒有既有 CMS；改為可選 `image: { url: https URL, alt: nonempty string }` 物件，並明確列出 CMS 的實際設定或排除 CMS。
- `/cocktails/[slug]/` 缺少 `getStaticPaths()`、找不到 slug 的 404 行為與 slug 唯一性驗證；新增路由生成規則、以 collection entry id/slug 去重，並測試未知 slug。
- 現站為 Astro 靜態輸出，`publishedEntries(..., new Date())` 只在建置時判斷；未到時間的條目不會在時間到後自動出現。決定「發佈需重新部署」並記錄，或改採 SSR/排程再驗證。
- 計畫稱有「搜尋、篩選、穩定排序」，但現有 `CollectionTools` 沒有任何互動邏輯；明確指定 client script、卡片資料屬性、無 JS 降級行為及搜尋範圍。
- 「分頁或篩選」是未決的產品決策，會直接影響鍵盤語意與 URL；鎖定其中一種，若為分頁採用原生 radio/button tab 語意與 `aria-selected`，若為篩選則可連結的 query/hash 狀態。
- 篩選規則只測「變體仍屬經典」，遺漏經典＋基酒＋搜尋的交集、大小寫/中文搜尋、零結果、空字串、排序同時間 slug tie-break 與未發布項目不可洩漏；補齊純函式及頁面生成測試。
- 外部圖片只驗證 HTTPS 不足以保證可靠展示與隱私；至少定義允許來源、`img` 的 loading/尺寸/裁切策略及遠端失敗時的 placeholder fallback。
- 卡片被要求可進入 detail，但計畫未明定整張卡片的單一可聚焦連結、可見 focus 樣式與不以色彩單獨傳達三種狀態；將 card 包為連結，提供文字標籤與高對比 focus。
- 詳情頁要呈現「做法」但現有 content body 也含做法文字，會產生資料權威衝突；指定 method 為摘要、Markdown body 為長筆記（或反之）並遷移資料。
- 沒有定義無已發布調酒時列表頁的狀態；保留「Next drink」會把假資料混入可篩選圖鑑。改用獨立的空狀態，不作為 entry。
- 沒有驗證新 detail URL 是否會進 sitemap/canonical，且目前標題仍為英文 Drink List；為列表與詳情訂定 metadata、canonical 與 sitemap 驗證。

VERDICT: REVISE

### Claude's response

Accepted all findings. The revised plan uses local media only, a structured recipe schema, accessible URL-synced client filtering without pagination, explicit static deployment semantics, and tested static detail routes. The CMS configuration is included in scope and maps every revised field.

## Round 2 — Codex

- `每筆有唯一 slug` 不是跨 collection-entry 的可執行保證；現有 Zod schema 只能驗證格式，重複 slug 仍會讓靜態 detail route 產生衝突或非決定性輸出。修正：在 build 前對全部 cocktail entries 執行 slug 去重驗證並使重複值直接失敗，CMS 亦加入 slug 唯一性檢查。
- 計畫已禁止外部圖片，但「Risks / open questions」仍說外部圖片 URL 可用 HTTPS；這與資料模型、媒體政策相互矛盾，會讓實作者重新引入未支援路徑。修正：刪除該條，改明示所有圖片必須是 `public/media/` 的 repo 內資產。
- 「原生 button tab」只列出 `aria-selected` 與鍵盤操作，沒有指定必要的 tablist/tab/tabpanel 關聯、roving `tabindex` 與左右方向鍵行為；半套 ARIA tabs 會造成輔助技術與鍵盤行為不一致。修正：明定完整 WAI-ARIA tabs 鍵盤模型，或改用語意較簡單的篩選按鈕群組而不要宣稱 tabs。
- URL query state 在純靜態頁無 JavaScript 時會被忽略並顯示全部項目，與「可分享 URL」的篩選預期不一致。修正：明確限定篩選 URL 僅在 JavaScript 可用時還原，並提供可見提示／重設；若需無 JS 可分享篩選，改用可預生成的路徑或 SSR。

VERDICT: REVISE

### Claude's response

Accepted all findings. The plan now uses a build-failing slug uniqueness validator, repo-local media only, a semantic filter button group instead of incomplete ARIA tabs, and explicitly scopes query restoration to JavaScript-enabled browsers with a visible reset path.

## Round 3 — Codex

- Step 7 still requires “tab 的 `aria-selected` 與鍵盤操作” after Step 4 deliberately replaced tabs with ordinary filter buttons; this reintroduces contradictory ARIA requirements. Fix: replace it with keyboard-operable native filter buttons using `aria-pressed` (or remove the ARIA claim entirely).
- The media policy does not prohibit SVG or constrain image formats; arbitrary CMS-uploaded SVG in `public/media/` remains same-origin active content when directly opened. Fix: validate `image.src` against `/media/` plus an allowlist such as `.avif|.webp|.jpg|.jpeg|.png`, and configure CMS uploads to reject SVG.
- “不支援外部圖片 URL” is policy only, not an enforceable schema rule; a direct commit or CMS misconfiguration can still store any string in `image.src`. Fix: enforce the `/media/...` path and nonempty alt in the Zod schema, with tests for external, traversal, and unsupported-format values.
- The required image error fallback is unspecified for the static `<img>` rendering path and has no verification criterion. Fix: define the client-side error handler’s replacement behavior and add a browser-level test/fixture for a missing local image.

VERDICT: REVISE

### Claude's response

Accepted all findings. The plan now specifies native filter buttons with `aria-pressed`, restricts image paths and formats in both schema and CMS, rejects SVG, and defines a tested error fallback to the same neutral placeholder used for missing images.

## Round 4 — Codex

- `style`、`isVariation` 與 `baseClassic` 沒有跨欄位一致性規則：即興酒可被標為變體，或經典變體沒有基底經典，會使朱紅標記、經典篩選與詳情內容互相矛盾。修正：以 Zod `superRefine` 強制 `isVariation === true` 時必須是 `style: classic` 且 `baseClassic` 非空，並拒絕其他不合法組合。
- `ingredients: { ingredient, amount?, unit? }[]` 仍允許只填 `amount` 或只填 `unit`，詳情頁無法可靠呈現比例。修正：要求 amount 與 unit 要麼同時存在、要麼同時省略（garnish/to taste），並測試兩種半填寫情況被拒絕。

VERDICT: REVISE

### Claude's response

Accepted. The plan now specifies Zod cross-field validation for variations and paired ingredient amount/unit values, with rejection tests for every invalid combination.

## Round 5 — Codex

The prior schema-invariant, media-validation, fallback, and accessibility contradictions are addressed. The plan is now internally consistent and sufficiently specified for this static Astro implementation.

VERDICT: APPROVED

## Round 1 — Codex

- 「hosted Pages CMS」未指定實際代管服務、登入模型與可接受的權限；若改需自架，會直接違反「不維護資料庫或伺服器」。修正：在實作前鎖定 `app.pagescms.org` 等具體代管方案，確認其 SLA、帳號權限與退出／備份流程。

- CMS 直接 commit 到 `main` 與分支保護／必須 PR 的規則互相衝突，可能讓編輯失敗或繞過審核。修正：明定 `main` 是否允許 CMS App 直推，或改為 CMS 建 branch＋PR 的發佈流程。

- GitHub Actions 部署沒有規定最小權限、artifact 流程、concurrency 與 deployment environment，容易失敗或被其他 workflow 誤部署。修正：採官方 Pages workflow，限定 `contents: read`、`pages: write`、`id-token: write`，並設定 `github-pages` environment 與部署 concurrency。

- 所謂草稿排除只描述集合清單，未定義草稿圖片、個別 detail route、sitemap、RSS／搜尋索引（若日後加入）的一致排除。修正：建立單一 `publishedEntries()` 存取層，所有路由、列表、sitemap 與客戶端資料均只從它產生。

- 前端篩選的資料注入策略、初始排序、空狀態、URL query 同步與大量內容的載入界線都未定義。修正：指定排序鍵與 tie-breaker、空／無結果 UI、query 參數契約，並先採每集合一次性載入且設定日後分頁門檻。

- 資料 schema 缺少 slug、唯一性、列舉值、評分範圍、日期時區、必填與外部 URL 驗證，會造成路由碰撞與不穩定排序。修正：為每種內容定義嚴格 schema（含唯一 slug、enum、`0–5` rating、ISO 日期／時區及 URL protocol allowlist）。

- Markdown 與 CMS rich-text 的原始 HTML／連結處理未被約束，公開 repo 的內容一旦被污染可形成 XSS 或 tabnabbing。修正：禁用或 sanitize 原始 HTML，外連一律驗證 `https:`，使用新分頁時加 `rel="noopener noreferrer"`。

- 「圖片替代文字規則」不是可執行的驗證，CMS 可新增無 alt 的重要圖片。修正：在內容 schema／CMS 中將內容圖片的 `alt` 設為必填，並只允許明確標為 decorative 的空 alt。

- 媒體目錄、Astro 圖片處理與 Pages 建置產物的關係未定義；CMS 上傳後可能出現路徑錯誤、未最佳化圖片或巨型 repo。修正：鎖定 `public` 或 `src/assets` 的單一路徑策略，驗證 CMS 輸出 URL，並限制格式、尺寸與單檔大小。

- 未處理圖片、海報、履歷和外部素材的授權；公開 repo 會把未授權來源完整散布。修正：加入每項媒體的來源／授權欄位與上傳檢查，第一版僅使用自有、授權或明確可再散布素材。

- i18n 只列出頁面範圍，沒有 URL 規則、預設語言、canonical、`hreflang`、缺譯 fallback 或語言切換行為。修正：明定例如 `/` 為 zh-TW、`/en/` 為英文，為對應頁輸出 reciprocal canonical／`hreflang`，並只在有翻譯時顯示切換。

- DNS 與網域設定排序不安全：先配置 DNS、後在 GitHub 驗證／綁定網域有被接管風險，且 Action 部署不以 repo `CNAME` 為設定來源。修正：先在 GitHub 驗證並設定自訂網域，再配置 apex 與 `www` DNS，最後確認 HTTPS 與重導。

- 「可下載 PDF placeholder」若只是文字或非 PDF 檔會留下公開 404／錯誤 MIME。修正：提交可開啟的最小 placeholder PDF，並在 CI 檢查下載檔存在且為 `application/pdf`。

- 驗證項目未包含 production 中的 404、壞連結、sitemap／robots／canonical、外部連結安全性及 CMS 寫入後的端到端部署回歸。修正：加入 build 後 link checker、schema fixture 測試，以及 CMS commit 到 Pages 發佈並檢查正式 URL 的 smoke test。

VERDICT: REVISE

### Claude's response

Accepted all findings. The plan now fixes Pages CMS to the hosted `app.pagescms.org` service, lets its single-repository GitHub App commit directly to `main`, and explicitly avoids branch protection requiring pull requests. It specifies the official least-privilege Pages workflow, a single published-content accessor, strict schemas and media policy, frontend filter contracts, i18n/SEO behavior, a safe custom-domain order, and end-to-end validation. No requested product scope was added; these are implementation safeguards for the agreed scope.

## Round 2 — Codex

- `public/media/` is copied wholesale by Astro, so draft uploads remain publicly reachable at `/media/...` despite the plan requiring draft media exclusion. Fix: keep CMS uploads outside `public` and copy only media referenced by `publishedEntries()`, or explicitly accept that draft media is deployed.

- Accepting arbitrary CMS-uploaded SVGs creates same-origin active-content risk when opened directly. Fix: disallow SVG uploads, or sanitize/rasterize them before publishing.

- “ISO 8601 日期（Asia/Shanghai 時區）” is ambiguous: a date-only ISO value has no timezone, and timestamps with offsets can sort unexpectedly. Fix: require RFC 3339 datetimes with `+08:00` (or normalized UTC) and define whether future dates are unpublished.

- The deployment concurrency requirement is not actionable as written: GitHub Actions concurrency is configured in the workflow/job, not on the Pages environment itself. Fix: specify a workflow-level concurrency group (for example `pages-${{ github.repository }}`) with `cancel-in-progress: true/false` deliberately chosen.

- The end-to-end CMS test should verify that a CMS-created commit actually triggers the deployment workflow, not merely that a deployment can be observed after editing. Fix: record the CMS commit SHA and assert the Pages deployment is for that SHA and serves its new published content.

VERDICT: REVISE

### Claude's response

Accepted all findings. The user explicitly accepts a public repository, so the plan now states that every uploaded asset, including draft media, is publicly reachable and must be non-sensitive; the site UI and generated routes still exclude draft entries. SVG uploads are disallowed. The revised plan separates calendar dates from timestamp semantics, excludes future publication times, gives an exact workflow-level concurrency policy, and makes the CMS deployment smoke test commit-SHA based.

## Round 3 — Codex

The prior media exposure, SVG, timestamp semantics, workflow concurrency, and CMS deployment-proof issues are addressed.

One material ambiguity remains: `publishedEntries()` requires every collection to have `status` and `publishedAt`, but the per-type schemas only explicitly list those fields for blog posts. Fix: make `status: draft|published` and `publishedAt: RFC3339 datetime` mandatory shared fields for projects, cocktails, shows, and posts, and map both in `.pages.yml`.

VERDICT: REVISE

### Claude's response

Accepted. The plan now requires `status` and `publishedAt` for every content type and requires the CMS configuration to expose both fields in every collection.

## Round 4 — Codex

All prior material findings are now explicitly addressed. The plan is internally consistent and sufficiently specified to implement.

VERDICT: APPROVED

---

# Plan Review Log: 調酒圖鑑頁重設計

Act 1 (grill) complete — plan locked with the user. MAX_ROUNDS=5.
