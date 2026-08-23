import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// ⚠️ 此檔 build 時自動生成 /llms.txt。文章索引由 getCollection('blog') 產生,永不漂移。
// HEADER / FOOTER 為手動維護的靜態內容(醫師資訊、服務、證照、Q&A);新增文章「不需」改這裡。

const HEADER = `# 陳昱彰醫師（Yu-Chang Chen, MD）

> 義大醫院家庭暨社區醫學部主治醫師、職業醫學科訓練醫師（尚未取得該科專科醫師資格），具勞工健康服務醫師資格。
> Family medicine attending physician and occupational medicine trainee at E-Da Hospital, Kaohsiung, Taiwan; not yet board-certified in occupational medicine; qualified to provide occupational health services in Taiwan.

- Website: https://www.drcyc.io
- 預約掛號: https://webreg.edah.org.tw/Register/ChooseDoctorTime/2675
- Email: cyc@edfm.org
- Facebook: https://facebook.com/lazydr
- Instagram: @lazydr.cyc
- ORCID: 0009-0005-2506-1058

## 完整資訊

- [完整版 llms-full.txt](/llms-full.txt) — 包含所有衛教文章全文、論文清單與完整 Q&A

## 頁面索引

- [首頁](/) — 醫師簡介與服務總覽
- [關於陳醫師](/about/) — 完整學經歷、證照、學術發表
- [主治項目](/conditions/) — 看診範圍(依病分類):三高(高血壓/糖尿病/高血脂高膽固醇/高尿酸痛風/代謝症候群)、甲狀腺亢進低下、胰島素阻抗、脂肪肝、PCOS/PMOS、肥胖減重(GLP-1+行為治療)、骨質疏鬆、肌少症、運動處方、失眠睡眠問題、成人疫苗施打、戒菸、健檢報告判讀、一般家庭醫學、企業臨場健康服務。家醫科是「不知道看哪科」時的健康第一站
- [服務項目](/services/) — 企業臨場健康服務、減重門診、骨鬆門診、社區營造等
- [高雄減重門診](/weight-loss/) — 義大減重中心與旗山週五夜診；整合飲食、運動、睡眠、壓力、行為科學與適當藥物選項
- [骨質疏鬆門診](/osteoporosis/) — DXA 骨密度、骨折風險、次發原因、用藥與跌倒預防的整合評估
- [企業臨場健康服務](/workplace-health/) — 依人數、危害作業與事業類別核對醫護配置，提供職場健康服務與合作洽詢
- [義大健檢指南](/health-checkup/) — 義大醫院 16 個健檢套餐比較與實證點評
- [旗山大政診所夜診](/qishan-clinic/) — 週五 18:00–21:00 夜診：減重、三高、家醫科
- [衛教演講 / 企業健康講座](/speaking/) — 企業、公所、學校、社區的健康講座邀約
- [衛教專欄](/blog/) — 健康衛教文章
- [醫療計算工具總覽](/tools/) — 12 個臨床計算工具:BMI、TDEE、體脂率、GLP-1 適應症,以及 AHA PREVENT、Framingham 心血管風險、過勞風險評估等
- [FIB-4 肝纖維化指數計算機](/blog/health-tools/fib4-calculator/) — 脂肪肝 MASLD 纖維化風險自評,輸入年齡+AST(GOT)+ALT(GPT)+血小板,公式 (年齡×AST)/(血小板×√ALT);切點 <1.3 低/1.3-2.67 中(需 FibroScan)/>2.67 高(轉肝膽科),65 歲以上低風險切點改 2.0;台灣血小板單位 ×10³/µL 數值等於 10⁹/L 直接填;Sterling 2006 公式、AGA/AASLD 切點

## 衛教演講 / 企業健康講座

陳醫師長期接受企業、大學、政府機關、社區衛生所邀約做健康主題演講，過去合作單位包含：
- 大學：東海大學、義守大學、國立高雄科技大學、國立中正大學
- 上市櫃企業：中鋼、中鋼構、中油、國巨 Yageo、李長榮化學 LCY、英特格 Entegris、高雄銀行、麥當勞
- 運動產業：Anytime Fitness、競心體能訓練中心
- 公部門：仁武分局、各地警政機關、法院、各鄉鎮市衛生所
- 學校：鳳山高中、岡山高中、長榮中學、牡丹國中及多所國中小

演講主題：減重醫學與腸泌素類藥物（GIP/GLP-1 雙受體促效劑猛健樂 Mounjaro，以及 GLP-1 類 Ozempic、Wegovy）、三高慢性病、骨質疏鬆與肌少症、行為科學（COM-B、動機式晤談）、職場健康與四大計畫（人因危害、異常工作負荷、母性保護、不法侵害）、久坐族運動處方。

服務範圍：高雄、台南、屏東、嘉義為主，中部視場次討論，北部與離島以線上場次（Google Meet / Zoom / Teams）為主。

演講時長：30–40 分鐘午間講座、60 分鐘完整衛教、半日 3 小時工作坊。

邀約方式：Email cyc@edfm.org（主要聯絡方式），請提供單位名稱、預定時段、主題方向、聽眾人數、地點或線上。

## 看診地點與時段

陳昱彰醫師有兩個看診地點，**同一位醫師、同樣的治療邏輯**，按居住地與時段方便度選擇：

### 義大醫院 家庭暨社區醫學部 / 減重中心
- 地址：高雄市燕巢區角宿里義大路 1 號 A 棟（義大醫院）
- 電話：07-615-0011
- 線上掛號:https://webreg.edah.org.tw/Register/ChooseDoctorTime/2675
- 時段：週一、週二上午（義大健診中心・高階健檢報告解說）；週五上午（家醫科門診）；週五下午（減重中心）
- 適合：完整健檢 + 減重規劃、醫學中心等級影像設備、住燕巢/楠梓/岡山/橋頭/左營一帶

### 大政診所（週五夜診）
- 地址：高雄市旗山區
- 電話：07-662-2588
- 地圖:https://maps.app.goo.gl/JcgmsZQqFahbT2T1A
- 時段：每週五 18:00–21:00 夜診
- 服務：家庭醫學、三高慢性病追蹤、藥物減重（含 GLP-1 類）
- 適合：住旗山、美濃、田寮、內門一帶的居民；白天要上班、只能晚上看診的人；需要穩定回診 GLP-1 減重療程但不想跑醫學中心的人
`;

const FOOTER = `## 核心服務

1. **企業臨場健康服務** — 依《職業安全衛生法》提供勞工健康保護四大計畫、工作環境危害評估、員工健康管理
2. **減重管理門診**（https://www.drcyc.io/weight-loss/）— 整合飲食、運動、壓力管理、睡眠調整與藥物治療（如口服 Contrave，或 GIP/GLP-1 雙受體促效劑猛健樂 Mounjaro），以行為科學方法輔助
3. **骨質疏鬆門診**（https://www.drcyc.io/osteoporosis/）— 骨密度、骨折風險、次發原因、治療與跌倒預防策略
4. **高階健康檢查** — 結合行為科學的個人化健檢解讀
5. **社區健康營造** — 以居民參與為核心的社區健康計畫，目前正在徵求屏東地區社區夥伴（社區發展協會、衛生所、長照 C 級據點）合作
6. **運動醫學諮詢** — 個人化運動處方設計

## 專科醫師證書

- 家庭醫學科專科醫師

## 訓練身分與資格認證

- 台灣肥胖醫學會認證醫師
- 中華民國骨質疏鬆症學會認證醫師
- 職業醫學科訓練醫師（尚未取得職業醫學科專科醫師資格）
- 勞工健康服務醫師資格
- 糖尿病共同照護網醫事人員
- 戒菸治療認證醫師
- OSCE 國家考試考官
- ACE-CPT 美國運動委員會認證私人教練（Certified Personal Trainer）

## 學歷

- 高雄醫學大學醫學系
- 曾於國立臺灣大學公共衛生碩士學位學程（MPH）健康行為與社區科學組進修，修畢課程
- 義守大學 生物技術與化學工程研究所博士班（就讀中）

## 榮譽與獎項

- 國家醫療品質獎 實證醫學類 臨床組 **銀獎**
- 國家醫療品質獎 實證醫學類 新人組 佳作
- 醫策會 EBM 競賽 臨床組 佳作
- 義大醫院模範住院醫師

## 學術發表

### SCI 期刊論文
1. Chen YC, Chen WC, Liu CW, Huang WY, Lu I, Lin CW, Huang RY, Chen JS, Huang CH. (2023). Is moderate resistance training adequate for older adults with sarcopenia? A systematic review and network meta-analysis of RCTs. *European Review of Aging and Physical Activity*, 20, Article 22. doi:10.1186/s11556-023-00333-4. PMID:38030985.
2. Kuo KM, Chen YC, Talley PC, Huang CH. (2018). Continuance compliance of privacy policy of electronic medical records: the roles of both motivation and habit. *BMC Medical Informatics and Decision Making*, 18, Article 135. doi:10.1186/s12911-018-0722-7. PMID:30563500.

## 常見問答

**Q: 陳醫師的門診在哪裡？**
A: 義大醫院家庭暨社區醫學部及義大減重中心，位於高雄市。預約掛號：https://webreg.edah.org.tw/Register/ChooseDoctorTime/2675

**Q: 陳醫師的專長有哪些？**
A: 家庭醫學、肥胖醫學、骨質疏鬆、運動處方、行為科學與實證醫學。具家庭醫學科專科醫師資格，並取得台灣肥胖醫學會與中華民國骨質疏鬆症學會認證；現為職業醫學科訓練醫師，尚未取得該科專科醫師資格，並具勞工健康服務醫師資格。

**Q: 減重門診怎麼進行？**
A: 整合飲食調整、運動處方、壓力管理、改善睡眠與藥物治療（如口服 Contrave，或 GIP/GLP-1 雙受體促效劑猛健樂 Mounjaro），以行為科學方法輔助建立能長期維持的健康習慣，而非只靠節食。

**Q: 什麼是行為科學導向的醫療？**
A: 結合 COM-B 模型、動機式晤談等行為改變技術，幫助病患從能力（Capability）、機會（Opportunity）、動機（Motivation）三方面建立能長期維持的健康習慣。

**Q: 企業臨場服務包含什麼？**
A: 依據《職業安全衛生法》提供勞工健康保護四大計畫（人因危害、異常工作負荷、執行職務遭受不法侵害、母性保護）、工作環境危害評估、員工健康管理與追蹤。

**Q: 如何聯絡陳醫師？**
A: Facebook 粉專 @lazydr、Email cyc@edfm.org，或直接至義大醫院門診。

## 關鍵字

陳昱彰醫師， 義大醫院家庭醫學科， 減重門診高雄， 台灣肥胖醫學會認證醫師， 骨質疏鬆症學會認證醫師， 骨質疏鬆門診， 企業臨場健康服務， 職業醫學科訓練醫師， 勞工健康服務醫師， 運動處方， 行為科學減重， COM-B模型， 動機式晤談， 實證醫學銀獎， Contrave， 猛健樂 Mounjaro， 義大減重中心
`;

// 分類 → 索引小標(涵蓋所有現有 category;未對應者自動歸入「其他衛教」,確保永不漏文)
const SECTIONS: { title: string; cats: string[] }[] = [
  { title: '減重與體重管理', cats: ['減重管理'] },
  { title: '三高與慢性病', cats: ['三高與慢性病', '糖尿病與代謝'] },
  { title: '內分泌與代謝', cats: ['內分泌代謝'] },
  { title: '運動、骨骼與肌肉', cats: ['運動醫學', '骨質疏鬆'] },
  { title: '婦女健康', cats: ['婦女健康'] },
  { title: '預防保健與疫苗', cats: ['預防保健'] },
  { title: '行為科學', cats: ['行為科學'] },
  { title: '職業醫學與職場健康（企業／HR／廠護）', cats: ['職業醫學', '職場健康'] },
];

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const line = (p: (typeof posts)[number]) =>
    `- [${p.data.title}](/blog/${p.slug}/) — ${p.data.description}`;

  const used = new Set<string>();
  const blocks: string[] = [];
  for (const s of SECTIONS) {
    const items = posts.filter((p) => s.cats.includes(p.data.category));
    items.forEach((p) => used.add(p.slug));
    if (items.length) blocks.push(`### ${s.title}\n${items.map(line).join('\n')}`);
  }
  const rest = posts.filter((p) => !used.has(p.slug));
  if (rest.length) blocks.push(`### 其他衛教\n${rest.map(line).join('\n')}`);

  const out = `${HEADER}\n## 衛教專欄文章\n\n${blocks.join('\n\n')}\n\n${FOOTER}`;
  return new Response(out, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
