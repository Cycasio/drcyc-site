# 2026-09-20 官網 GEO 內容改善記錄

## 範圍與授權

- 使用者要求：依前一輪 GEO 評估修改官網。
- 正式原始碼：`/Users/asio/projects/drcyc-site`；不是桌面下載的靜態內容包。
- 基底：`eac46f3ac7fee66fdfd99a8a18d10dac8bb876ef`，保留前次已發布的 Lp(a)/ApoB 衛教內容。
- 修改分支：`codex/geo-content-improvements-20260920`；主工作目錄不變，單一寫入者；兩個獨立唯讀審查。
- 授權範圍：官網內容、站內連結、身分結構化資料與本地驗證。本輪不部署、不送出院方更新稿、不接入分析服務、不改公式或健康資料處理。

## 完成項目

1. 套餐數量改由同一份資料推導，現為 15 筆；首頁、服務頁、健檢頁與機器可讀摘要一致。
2. 公費資格與 USPSTF 正式建議分開；修正 HBV/HCV、statin、CAC、頸動脈、乳攝、HPV、DXA、AAA 等說明，逐列附原始來源。
3. 保留套餐原核對日 2026-05-26，不宣稱價格已重查；移除未經確認的 InStock。改寫過度保證的套餐點評。
4. 移除舊固定清腸劑量、時刻與停藥規則，以及對應 HowTo；準備區與 FAQ 統一依個別書面指示。
5. 工具名稱維持獨立名稱；頁首加必要公式來源聲明，下方保留一份連續完整的授權、研究出處、部分使用及版本聲明。
6. 健檢、Lp(a)/ApoB 衛教與風險工具互連，明示 Lp(a)/ApoB 不是本站基本模型輸入。
7. 關於頁及 Person.sameAs 加入院方官方身分連結。職醫訓練、學會認證與既有學歷文字不變。
8. 院方更新稿與成效量測交接已整理，尚未送出／接通。未取得後台數據，不宣稱本週流量成長。

日期語意：dateModified 反映本次修改；篩檢來源核對與套餐價格核對各自標示。移除將昔日單項檢查核對日當成整頁 lastReviewed 的欄位，不宣稱本次完成全面人工醫療審閱。

## 驗證與結果

- `npm test`：16 項通過。
- `npm run build`：59 頁產出；原始碼及產物台灣用語檢查通過，結構化日期檢查通過。
- 瀏覽器：首頁、健檢、工具、Lp(a)/ApoB、關於、服務共 6 頁，各測 1440 / 390 寬度，12 組通過。無頁面橫向溢出、無頁面 JavaScript 例外；canonical、單一 H1 與頁內連結檢查通過。
- 健檢比較表 15 筆、實證表 14 筆；59 個 HTML 中 64 個 JSON-LD 區塊均可解析。
- 計算元件、公式與驗證程式、Functions、隱私頁、CSP 及 redirects 對基底無差異；未輸入或提交健康資料。
- `git diff --check` 通過；原始工作目錄保持乾淨。
- 已目視檢查桌面與手機主要修改區塊。預覽只提供靜態內容；本輪未重做未修改的伺服端計算整合測試。

## 未完成或刻意未做

- 未發布：正式站仍是既有版本，尚未產生本輪部署 ID。
- 院方頁面需院方處理；文稿不是已送出的訊息。
- Search Console 與分析後台資料未取得，轉換事件未接通。
- 套餐價格與供應、完整醫師證書及學籍未重新驗證。
- 建置有非阻擋的 Browserslist 資料過舊提醒，未為內容修改額外更新依賴。

## 參考依據

- https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=612&pid=1102&sid=1093
- 各列 USPSTF 官方最終建議：見 `src/data/checkup.ts` 的 `sourceUrl`。
- https://www.asge.org/home/resources/publications/guidelines/optimizing-bowel-preparation-quality-for-colonoscopy--consensus-recommendations-by-the-us-multi-society-task-force-on-colorectal-cancer
- https://www.jotform.com/240774577352161
- https://webreg.edah.org.tw/Register/ChooseDoctorTime/2675

完成條件：本地修改與驗證完成，交付可預覽頁面；部署等待後續明確指示。
