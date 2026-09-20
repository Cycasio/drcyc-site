# GEO 成效追蹤交接

更新：2026-09-20。狀態：量測規格已整理，後台數據與轉換事件尚未接通。不是成效報告，也不是新增追蹤服務。

## 現有設定與本次邊界

- 正式站公開 HTML 可見 Cloudflare Web Analytics；原始碼註明由 Pages 專案注入，本站不再手動加第二份追蹤碼。
- 本次沒有新增 GA4、Clarity、Cookie、資料庫、事件接收端或第三方分析服務；現有隱私說明與計算端點維持原樣。
- 尚未取得 Search Console 或 Cloudflare 後台期間報表，因此曝光、點擊、AI 引用與預約成效均填「資料未取得」，不得當成 0，也不得宣稱本週成長。
- Cloudflare Web Analytics 的頁面瀏覽與來源資訊，不能當成電話點擊、計算完成或實際掛號數。來源欄也無法完整代表所有 AI 引用或使用者旅程。

## 下一份週報的固定比較方式

選擇資料已完整的連續 7 天，與前一個相同星期組成的 7 天比較；不含未完成的當日。Search Console 依太平洋時間，Cloudflare 依實際報表設定，記錄時區，不能未對齊就合併。

| 指標 | 來源 | 分組方式 | 目前狀態 |
| --- | --- | --- | --- |
| 網頁搜尋曝光、點擊、CTR、平均排名 | Search Console 搜尋成效 | 品牌詞與非品牌詞、頁面分開 | 資料未取得 |
| 生成式 AI 曝光 | Search Console 對應報表（帳號可用時） | 頁面、日期、裝置、國家；不捏造未提供的指標 | 資料未取得 |
| 頁面瀏覽、造訪與來源 | Cloudflare Web Analytics | 首頁、關於、健檢、Lp(a)/ApoB、風險工具 | 已有追蹤碼，後台報表未取得 |
| 電話、官方掛號與聯絡連結點擊 | 尚未建置 | 僅作轉換意圖，不等於實際預約 | 未接通 |
| 計算工具完成率 | 尚未建置 | 需獨立隱私評估，不傳健康欄位或結果 | 未接通 |

品牌詞範例：陳昱彰、drcyc、懶惰醫師；非品牌詞範例：Lp(a) ApoB 健檢、義大健檢、心血管風險估算。以實際查詢資料分類，不把搜尋工具的單次結果當成固定排名。

優先頁面：`/`、`/about/`、`/health-checkup/`、`/blog/lpa-apob-health-checkup/`、`/blog/health-tools/cardiovascular-risk-estimator/`。

## 若之後要加入轉換事件

需先選擇接收服務、保留期限及隱私告知，再實作及驗證；不在本輪擅自接入。事件只應包含固定事件名稱及允許的頁面識別，不傳年齡、性別、血脂、BMI、eGFR、用藥、疾病史、風險結果、表單內容、完整 query string 或可識別個人的資料。不得新增 session replay。

先量測一般聯絡與官方掛號點擊；健康工具使用行為另評估，不能因為沒有附數值就假設完全沒有隱私風險。

## 不應誤認為 GEO 成效的事

- 網頁能開啟、結構化資料正確，是基礎條件，不等於 AI 必定引用。
- 更新 llms.txt、增加 FAQ 或重複塞入關鍵字，不能保證 Google AI 曝光。
- 機器人抓取次數不等於搜尋曝光；工具被使用也不等於預約。
- 本次部署日期與版本須在真正上線後補記，不可把本地預覽日期當成正式發布日。

## 參考來源

- [Google：AI 搜尋最佳化](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Search Console：生成式 AI 成效](https://support.google.com/webmasters/answer/16984139)
- [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/)

這份文件提供下一次取得報表後可直接使用的比較規則；不含 token、帳號憑證、健康資料或實際分析數值。
