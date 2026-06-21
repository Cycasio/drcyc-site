import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// 固定的醫師資訊區塊(手動維護,變動少)
const HEADER = `# 陳昱彰醫師（Yu-Chang Chen, MD）

> 義大醫院家醫科主治醫師，整合行為科學推動減重、慢性病管理與職場健康。
> Family medicine physician at E-Da Hospital, Kaohsiung, Taiwan. Specializes in obesity medicine, osteoporosis, and occupational health integrated with behavioral science approaches.

- Website: https://www.drcyc.io
- 預約掛號: https://webreg.edah.org.tw/Register/ChooseDoctorTime/2675
- Email: cyc@edfm.org
- Facebook: https://facebook.com/lazydr
- Instagram: @lazydr.cyc
- ORCID: 0009-0005-2506-1058

## 頁面索引

- [首頁](/) — 醫師簡介與服務總覽
- [關於陳醫師](/about/) — 完整學經歷、證照、學術發表
- [服務項目](/services/) — 企業臨場健康服務、減重門診、骨鬆門診、社區營造等
- [義大健檢指南](/health-checkup/) — 義大醫院 16 個健檢套餐完整比較、實證點評、健檢前準備、清腸藥時程、交通與預約
- [旗山大政診所夜診](/qishan-clinic/) — 週五 18:00–21:00 夜診（高雄市旗山區瑞吉里延平一路 337 號）：藥物減重、三高慢性病追蹤、家醫科，適合旗山/美濃/田寮/內門居民與下班後就診的上班族
- [衛教演講 / 企業健康講座](/speaking/) — 曾合作中鋼、中油、國巨、李長榮、英特格、麥當勞、東海/義大/高科大/中正大學等；主題含減重、三高、骨鬆、行為科學、職場健康四大計畫；南部為主、線上可接；邀約 cyc@edfm.org
- [衛教專欄](/blog/) — 健康衛教文章
- [醫療計算機合集](/tools/) — 11 個臨床計算機:BMI、TDEE、體脂率、GLP-1 適應症,以及 AHA PREVENT 心血管風險、Framingham、過勞風險評估等衛教工具

## 核心服務

1. **企業臨場健康服務** — 依《職業安全衛生法》提供勞工健康保護四大計畫、工作環境危害評估、員工健康管理
2. **減重管理門診** — 整合飲食、運動、壓力管理、睡眠調整與藥物治療（含 Contrave 猛健樂等），以行為科學方法輔助
3. **骨質疏鬆門診** — 骨密度評估、骨鬆治療與預防策略
4. **高階健康檢查** — 結合行為科學的個人化健檢解讀
5. **社區健康營造** — 以居民參與為核心的社區健康計畫，目前正在徵求屏東地區社區夥伴（社區發展協會、衛生所、長照 C 級據點）合作
6. **運動醫學諮詢** — 個人化運動處方設計

## 專科證照

- 家庭醫學科專科醫師
- 台灣肥胖醫學會肥胖專科醫師
- 骨質疏鬆症專科醫師
- 勞工健康服務醫師
- 糖尿病共同照護網醫事人員
- 戒菸治療認證醫師
- OSCE 國家考試考官
- ACE-CPT 美國運動委員會認證私人教練（Certified Personal Trainer）

## 學歷

- 高雄醫學大學醫學系
- 臺大公共衛生學院 健康行為與社區科學組（肄業）
- 義守大學 生物科技與化學工程研究所 博士班（就讀中）

## 榮譽與獎項

- 國家醫療品質獎 實證醫學類 臨床組 **銀獎**
- 國家醫療品質獎 實證醫學類 新人組 佳作
- 醫策會 EBM 競賽 臨床組 佳作
- 義大醫院模範住院醫師

## 學術發表

### SCI 期刊論文
1. Chen YC et al. (2023). Comparative effectiveness of pharmacological interventions for sarcopenia: SR/NMA. *European Journal of Applied Physiology and Occupational Physiology (EJAPA)*. (40+ citations)
2. Chen YC et al. (2018). Continuance compliance of privacy policy of electronic medical records. *BMC Medical Informatics and Decision Making*. doi:10.1186/s12911-018-0722-7 (27+ citations)

## 看診地點

- **義大醫院 家庭暨社區醫學部 / 減重中心**：高雄市燕巢區角宿里義大路 1 號 A 棟。電話 07-615-0011。週一、週二上午（健檢報告解說）、週五上午（家醫科）、週五下午（減重中心）。
- **大政診所（週五夜診）**：高雄市旗山區瑞吉里延平一路 337 號。電話 07-662-2588。週五 18:00–21:00。

## 關鍵字

陳昱彰醫師， 義大醫院家庭醫學科， 減重門診高雄， 肥胖專科醫師， 骨質疏鬆門診， 企業臨場健康服務， 職業醫學， 運動醫學， 行為科學減重， COM-B模型， 動機式晤談， 實證醫學銀獎， Contrave猛健樂， 義大減重中心
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
