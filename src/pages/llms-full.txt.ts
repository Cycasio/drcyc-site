import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// 固定的醫師資訊區塊(手動維護,變動少)
const HEADER = `# 陳昱彰醫師（Yu-Chang Chen, MD）

> 義大醫院家庭暨社區醫學部主治醫師、職業醫學科訓練醫師（尚未取得該科專科醫師資格），具勞工健康服務醫師資格。
> Family medicine attending physician and occupational medicine trainee at E-Da Hospital, Kaohsiung, Taiwan; not yet board-certified in occupational medicine; qualified to provide occupational health services in Taiwan.

- Website: https://www.drcyc.io
- 預約掛號: https://webreg.edah.org.tw/Register/ChooseDoctorTime/2675
- Email: cyc@edfm.org
- Facebook: https://facebook.com/lazydr
- Instagram: @lazydr.cyc
- ORCID: 0009-0005-2506-1058

## 頁面索引

- [首頁](/) — 醫師簡介與服務總覽
- [關於陳醫師](/about/) — 完整學經歷、證照、學術發表
- [學術論文與研究](/publications/) — 完整作者順序、出版社揭露的作者貢獻、研究摘要、DOI 與 PubMed 紀錄
- [主治項目](/conditions/) — 三高、內分泌代謝、體重、骨骼肌肉、預防保健與一般家庭醫學的整合看診範圍
- [服務項目](/services/) — 企業臨場健康服務、減重門診、骨鬆門診、社區營造等
- [高雄減重門診](/weight-loss/) — 義大減重中心與旗山週五夜診；整合飲食、運動、睡眠、壓力、行為科學與適當藥物選項
- [骨質疏鬆門診](/osteoporosis/) — DXA 骨密度、骨折風險、次發原因、用藥與跌倒預防的整合評估
- [企業臨場健康服務](/workplace-health/) — 依人數、危害作業與事業類別核對醫護配置，提供職場健康服務與合作洽詢
- [義大健檢指南](/health-checkup/) — 義大醫院 16 個健檢套餐完整比較、實證點評、健檢前準備、清腸藥時程、交通與預約
- [旗山大政診所夜診](/qishan-clinic/) — 週五 18:00–21:00 夜診（高雄市旗山區瑞吉里延平一路 337 號）：藥物減重、三高慢性病追蹤、家醫科，適合旗山/美濃/田寮/內門居民與下班後就診的上班族
- [衛教演講 / 企業健康講座](/speaking/) — 曾合作中鋼、中油、國巨、李長榮、英特格、麥當勞、東海/義大/高科大/中正大學等；主題含減重、三高、骨鬆、行為科學、職場健康四大計畫；南部為主、線上可接；邀約 cyc@edfm.org
- [衛教專欄](/blog/) — 健康衛教文章
- [醫療計算工具總覽](/tools/) — 12 個臨床計算工具:BMI、TDEE、體脂率、GLP-1 適應症,以及 AHA PREVENT 心血管風險、Framingham、過勞風險評估等衛教工具
- [FIB-4 肝纖維化指數計算機](/blog/health-tools/fib4-calculator/) — 依年齡、AST、ALT 與血小板估算脂肪肝纖維化風險的衛教工具

## 核心服務

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

## 看診地點

- **義大醫院 家庭暨社區醫學部 / 減重中心**：高雄市燕巢區角宿里義大路 1 號 A 棟。電話 07-615-0011。週一、週二上午（健檢報告解說）、週五上午（家醫科）、週五下午（減重中心）。
- **大政診所（週五夜診）**：高雄市旗山區瑞吉里延平一路 337 號。電話 07-662-2588。週五 18:00–21:00。

## 關鍵字

陳昱彰醫師， 義大醫院家庭醫學科， 減重門診高雄， 台灣肥胖醫學會認證醫師， 骨質疏鬆症學會認證醫師， 骨質疏鬆門診， 企業臨場健康服務， 職業醫學科訓練醫師， 勞工健康服務醫師， 運動處方， 行為科學減重， COM-B模型， 動機式晤談， 實證醫學銀獎， Contrave， 猛健樂 Mounjaro， 義大減重中心
`;

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  // 自動產生的文章索引(永遠與實際文章同步,不再手動維護漂移)
  const index = posts
    .map((p) => `- [${p.data.title}](/blog/${p.slug}/) — ${p.data.description}`)
    .join('\n');

  // 自動帶入每篇文章全文(raw markdown body),確保 llms-full 永遠完整
  const bodies = posts
    .map((p) => {
      const faqBlock =
        p.data.faq && p.data.faq.length > 0
          ? '\n\n### 常見問題\n\n' +
            p.data.faq.map((f) => `**Q: ${f.q}**\nA: ${f.a}`).join('\n\n')
          : '';
      return `---

# ${p.data.title}

> ${p.data.description}
> 發布:${p.data.pubDate.toISOString().slice(0, 10)}${p.data.updatedDate ? `　更新:${p.data.updatedDate.toISOString().slice(0, 10)}` : ''}　分類:${p.data.category ?? ''}

${p.body.trim()}${faqBlock}`;
    })
    .join('\n\n');

  const out = `${HEADER}\n## 衛教文章索引\n\n${index}\n\n---\n\n# 以下為完整文章內容\n\n${bodies}\n`;

  return new Response(out, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
