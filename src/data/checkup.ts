// 義大醫院健診中心套餐資料(2025–2026)
// 資料來源:義大醫院健診中心官方 PDF 與型錄
// 套餐內容最後核對:2026-05-26 by 陳昱彰醫師
// USPSTF 大腸癌篩檢建議最後核對:2026-09-02
// 免責聲明:價格與內容以義大醫院健診中心官方最新公告為準
//          本資料由義大家醫科陳昱彰醫師整理,不收取任何轉介佣金

export const LAST_UPDATED = '2026-09-02';
// 僅指下方篩檢建議與台灣公費資格的來源核對，不代表套餐價格重新查核。
export const SCREENING_LAST_CHECKED = '2026-09-20';
export const PACKAGE_LAST_CHECKED = '2026-05-26';
export const HOSPITAL_URL = 'https://www.edah.org.tw';
export const OFFICIAL_PACKAGES_URL =
  'https://exdep.edah.org.tw/hec/index.php/en/2017-07-20-05-36-07';
export const PUBLIC_EMPLOYEE_PDF_URL =
  'https://exdep.edah.org.tw/hec/images/2025/Governmental/2025poster.pdf';
export const USPSTF_COLORECTAL_URL =
  'https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening';
export const BOOKING_PHONE = '07-615-0011';
export const BOOKING_EXTENSIONS = ['5706', '5708', '5715', '5716', '5735'];

export interface Package {
  id: string;
  group: '公教人員專案' | '健診中心精選';
  name: string;
  theme: string;
  price: number;
  duration: string;
  bestFor: string;
  highlights: string[];
  chenNote: string; // 套餐選擇提醒；不代表整套檢查具有同一實證等級
}

export const PACKAGES: Package[] = [
  {
    id: 'A',
    group: '公教人員專案',
    name: '防癌健檢',
    theme: '基礎全身防癌',
    price: 8900,
    duration: '半日',
    bestFor: '第一次做完整健檢、預算有限、以癌症篩檢為主要目標',
    highlights: [
      '完整腫瘤標記(AFP / CEA / CA-199 / SCC / CYFRA21-1 / PSA 或 CA-153 + CA-125)',
      '腹部超音波 + 女性乳房/婦科二擇一',
      '胸部、頸部 X 光',
      '肝膽腎、血糖、血脂、甲狀腺與風濕免疫相關抽血檢查',
    ],
    chenNote:
      '腫瘤標記套組不能取代具實證支持的癌症篩檢，也不能用正常結果排除癌症。請先確認公費篩檢與既往檢查，再評估套餐中每一項是否有需要；不能把未獲 USPSTF 評等的項目一律稱為證據不足等級。',
  },
  {
    id: 'B',
    group: '公教人員專案',
    name: '影像學健檢',
    theme: '高階影像三擇一',
    price: 10000,
    duration: '半日',
    bestFor: '想在半日內加做一項高階影像(CT),不跑到全日檢',
    highlights: [
      '專案 A 全部內容',
      '640 排 CT 三擇一:冠狀動脈鈣化指數 / 頭部 CT / 低劑量肺部 CT(LDCT)',
      '加做胰島素阻抗 HOMA-IR',
    ],
    chenNote:
      '影像檢查不是越多越好。LDCT 的 USPSTF Grade B 只適用符合年齡與吸菸條件者；台灣公費另有資格。冠狀動脈鈣化應在傳統風險評估後個別討論。有頭痛、頭暈等症狀應先就醫，不宜自行用健檢頭部 CT 代替診斷。',
  },
  {
    id: 'C',
    group: '公教人員專案',
    name: '心肺健檢',
    theme: '心臟+肺部雙重把關',
    price: 14000,
    duration: '一日',
    bestFor: '中年以上、有吸菸史、心血管或肺癌家族史',
    highlights: [
      '640 排低劑量肺部 CT(LDCT)',
      '640 排冠狀動脈鈣化指數',
      '同半胱胺酸 Homocysteine',
      '骨質密度 DXA、電解質、完整腫瘤標記',
    ],
    chenNote:
      'USPSTF 的 LDCT Grade B 適用於 50–80 歲、至少 20 包年，且仍吸菸或戒菸未滿 15 年者；這個分級不延伸到整套套餐。冠狀動脈鈣化、骨密度及腫瘤標記需分別評估，不應因為搭售就視為都需要。',
  },
  {
    id: 'D',
    group: '公教人員專案',
    name: '上腹部健檢',
    theme: '上腹部 MRI 深度檢查',
    price: 14000,
    duration: '一日',
    bestFor: 'B 型或 C 型肝炎帶原、脂肪肝、代謝症候群追蹤',
    highlights: [
      '1.5T 上腹部磁振造影(肝、膽、胰、脾、腎)',
      '肝纖維化超音波 FibroScan',
      '甲狀腺超音波、骨質密度',
    ],
    chenNote:
      '已知肝炎、肝功能異常或肝臟病變，應依門診追蹤計畫決定檢查，不必為追蹤單一疾病購買整套健檢。MRI 與肝纖維化評估回答的問題不同，是否需要兩者應由醫師依病史判斷。',
  },
  {
    id: 'E',
    group: '公教人員專案',
    name: '腦血管健檢',
    theme: '腦中風風險全套評估',
    price: 16000,
    duration: '一日',
    bestFor: '希望了解腦部影像項目者；有症狀請先門診評估',
    highlights: [
      '1.5T 頭部磁振造影 Brain MRI',
      '頸動脈內膜中層厚度 IMT(早期動脈硬化指標)',
      '同半胱胺酸 + CPK/LDH 心肌酵素',
      '骨質密度、完整電解質、風濕免疫',
    ],
    chenNote:
      '腦部影像正常不能保證未來不會中風。血壓、血脂、糖尿病與吸菸管理仍是重要基礎。一般無症狀成人不建議例行篩檢頸動脈狹窄；IMT 與狹窄篩檢不是同一項評估，也不應據此宣稱整套檢查可預防中風。',
  },
  {
    id: 'F',
    group: '公教人員專案',
    name: '功能醫學專案',
    theme: '慢性發炎與環境荷爾蒙',
    price: 16000,
    duration: '一日',
    bestFor: '慢性疲勞、不明過敏、想了解環境暴露影響',
    highlights: [
      '慢性食物發炎檢測 IgG4',
      '環境荷爾蒙代謝評估',
      '腹部超音波、胸部 X 光、心電圖',
      '基礎生化、血脂、甲狀腺',
    ],
    chenNote:
      'IgG4 檢測與 IgE 過敏評估不同，不宜自行把檢驗結果當成食物過敏診斷，或據此長期限制飲食。有疲勞、過敏等症狀應先接受臨床評估；選套餐前請確認結果是否會改變有根據的照護方式。',
  },
  {
    id: 'G',
    group: '公教人員專案',
    name: '心血管健檢',
    theme: '冠狀動脈 CTA 深度檢查',
    price: 18800,
    duration: '一日',
    bestFor: '經醫師評估有冠狀動脈影像需求者；不是胸痛就醫的替代方案',
    highlights: [
      '640 排冠狀動脈血管 CT(含顯影劑)— 直接看血管狹窄',
      '完整腫瘤標記、腹部超音波',
      '完整基礎抽血檢查',
    ],
    chenNote:
      '冠狀動脈 CTA 與鈣化指數的用途不同，不能只用價格或影像精細度比較。CTA 涉及顯影劑與輻射，需先評估臨床問題及腎功能。有胸痛、胸悶應先就醫；突發持續胸痛或合併冒冷汗、呼吸困難，請立即求助急診，不要等健檢。',
  },
  {
    id: 'H',
    group: '公教人員專案',
    name: '消化道健檢',
    theme: '無痛胃腸鏡 + 全套',
    price: 18800,
    duration: '一日',
    bestFor: '經共同決策選擇大腸鏡，或另有胃腸症狀、家族史等風險者',
    highlights: [
      '無痛胃鏡 + 無痛大腸鏡(含瀉劑、檢查食)',
      'PON1 巴拉松酶、Lp(a) 脂蛋白',
      '眼底鏡、骨質密度、攝護腺/婦科超音波',
      '完整腫瘤標記與肝炎篩檢',
    ],
    chenNote:
      '若你已和醫師共同決策選擇大腸鏡,或另有胃腸症狀、家族史等風險,H 是較完整的套餐之一。USPSTF 對無症狀、平均風險成人的「大腸癌篩檢」評等為 45–49 歲 Grade B、50–75 歲 Grade A；大腸鏡每 10 年是可選策略之一,不是「大腸鏡本身一律 Grade A」。76–85 歲則是 Grade C,需按健康狀況、既往篩檢史與個人偏好決定。胃鏡不在 USPSTF 例行篩檢建議內,可依症狀、幽門桿菌、家族史等個別評估。無痛檢查當天不能自行開車。',
  },
  // ── 精選套餐 ──
  {
    id: 'health-vitality',
    group: '健診中心精選',
    name: '健康活力',
    theme: '肺部保健半日檢',
    price: 15000,
    duration: '半日',
    bestFor: '忙碌上班族、想快速做完肺部重點篩檢',
    highlights: [
      '640 排低劑量肺部 CT',
      '腹部超音波、甲狀腺功能',
      '胸部 X 光、骨質密度 DXA',
    ],
    chenNote:
      '半日安排是便利性，不代表每項檢查都適合。先確認 LDCT 的公費資格及個人風險，再評估骨密度等項目是否符合篩檢條件；沒有符合條件時，不必只為肺部影像購買套餐。',
  },
  {
    id: 'comfort',
    group: '健診中心精選',
    name: '舒適健檢',
    theme: '消化道全日檢',
    price: 22000,
    duration: '全日',
    bestFor: '單純想做無痛腸胃鏡 + 一般健檢,不需要太多高階影像',
    highlights: [
      '無痛胃鏡 + 無痛大腸鏡',
      '腹部超音波 + 甲狀腺超音波',
      '骨質密度 DXA、眼底鏡',
      '完整腫瘤標記',
    ],
    chenNote:
      '胃鏡與大腸鏡的適應情況不同，不是人人都需同時做。已知甲狀腺結節請依門診追蹤計畫安排，不要只因套餐含超音波就重複檢查。比較價格時也要確認適用身分及實際內容。',
  },
  {
    id: 'happy-peace',
    group: '健診中心精選',
    name: '樂活安心',
    theme: '心血管全日檢',
    price: 27000,
    duration: '全日',
    bestFor: '中年、心血管風險族群、想同時做頸動脈超音波',
    highlights: [
      '640 排冠狀動脈鈣化指數',
      '頸動脈超音波(男性)',
      '同半胱胺酸 + hs-CRP',
      '骨質密度、完整生化',
    ],
    chenNote:
      '先做血壓、血脂、糖尿病與吸菸等傳統風險評估。USPSTF 對無症狀成人加入冠狀動脈鈣化評估為 I（證據不足），對一般無症狀成人頸動脈狹窄篩檢為 D（不建議）；不能把兩者搭配稱為人人適用的第一線檢查。',
  },
  {
    id: 'fulu-life',
    group: '健診中心精選',
    name: '富樂人生',
    theme: '全腹部全日檢',
    price: 31000,
    duration: '全日',
    bestFor: '想一次把肝膽胰脾與周邊動脈看完整',
    highlights: [
      '1.5T 上腹部 MRI',
      '肝纖維化超音波 FibroScan',
      '周邊動脈血管硬化 ABI',
      '甲狀腺超音波、骨質密度',
    ],
    chenNote:
      '上腹部 MRI、肝纖維化與 ABI 是不同用途的檢查。已知肝病、行走疼痛或其他症狀，應先由醫師評估；對沒有症狀的人，不能僅因套餐包含多種儀器檢查就認定有額外健康效益。',
  },
  {
    id: 'rising-star',
    group: '健診中心精選',
    name: '菁采人生',
    theme: '腦心肺全日檢',
    price: 46000,
    duration: '全日',
    bestFor: '想一次把腦、心、肺三大高階影像一次做完',
    highlights: [
      '1.5T 頭部 MRI',
      '640 排低劑量肺部 CT',
      '640 排冠狀動脈鈣化指數',
      '頸動脈超音波、腹部超音波',
      '完整腫瘤標記與功能醫學相關抽血檢查',
    ],
    chenNote:
      '同時做腦、心、肺影像不等於完整預防三類疾病。請逐項確認適應情況、輻射或顯影劑風險，以及偶發發現可能帶來的後續檢查；家族史應用來調整個別照護，不是直接購買整套影像的理由。',
  },
  {
    id: 'elegant',
    group: '健診中心精選',
    name: '吉緻健檢',
    theme: '腫瘤篩檢全日檢',
    price: 68000,
    duration: '全日',
    bestFor: '有特殊癌症家族史、想做全身高階影像腫瘤篩檢',
    highlights: [
      '1.5T 全身 MRI(含 DWIBS 擴散加權)',
      '640 排低劑量肺部 CT',
      '肝纖維化超音波',
      'oxLDL 氧化型低密度脂蛋白',
      '完整腫瘤標記 + 高階抽血檢查',
    ],
    chenNote:
      '全身 MRI 與 LDCT 都不能排除所有癌症，也不能取代符合年齡與風險的標準篩檢。無症狀者可能遇到偶發發現、偽陽性及後續處置；特殊癌症家族史宜先門診評估，必要時安排遺傳諮詢。',
  },
  {
    id: 'royal',
    group: '健診中心精選',
    name: '尊爵健檢',
    theme: '全身腫瘤 + 功能醫學旗艦',
    price: 196000,
    duration: '全日',
    bestFor: '頂級健檢需求、特殊家族史、想做到目前最完整的項目',
    highlights: [
      '1.5T 全身 MRI + 頭部 MRI',
      '640 排低劑量肺部 CT + 冠狀動脈鈣化',
      '基因檢測(SOD2 / NQO1 / CYP1A1 / GSTP1)',
      '代謝體荷爾蒙評估(2-OHE1 / 4-OHE1 / 16α-OHE1)',
      '女性荷爾蒙評估、功能醫學氧化壓力',
      'oxLDL / sdLDL 小顆粒脂蛋白分析',
    ],
    chenNote:
      '價格最高或項目最多，不代表能帶來最大的健康效益。基因、代謝體與功能醫學項目，應先確認臨床用途、結果可採取的行動及限制；不要把正常結果當成沒有疾病，也不要僅依異常數值自行治療。',
  },
];

export const PACKAGE_COUNT = PACKAGES.length;

// ── 台灣公費資格與 USPSTF 建議分開呈現 ──
export const HPA_SCREENING_URL = 'https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=612&pid=1102&sid=1093';
export const TAIWAN_SCREENING = [
  { name: '乳房 X 光攝影', eligibility: '40–74 歲女性，每 2 年補助 1 次。' },
  { name: '子宮頸抹片', eligibility: '25–29 歲女性每 3 年補助 1 次；30 歲以上女性每年補助 1 次，國健署建議至少每 3 年接受 1 次。' },
  { name: 'HPV 檢測', eligibility: '35、45、65 歲女性，於該年齡各補助 1 次。並非所有年齡都只能自費。' },
];

export interface EvidenceItem {
  name: string;
  grade: string;
  population: string;
  note?: string;
  sourceUrl: string;
}

const USPSTF = 'https://www.uspreventiveservicestaskforce.org/uspstf/';
export const EVIDENCE: EvidenceItem[] = [
  {
    name: '大腸癌篩檢(45–49 歲)', grade: 'B',
    population: '無症狀、平均風險成人',
    note: '可選每年糞便免疫法(FIT)、每 10 年大腸鏡等策略。不是所有人都必須選大腸鏡。',
    sourceUrl: USPSTF_COLORECTAL_URL,
  },
  {
    name: '大腸癌篩檢(50–75 歲)', grade: 'A',
    population: '無症狀、平均風險成人',
    note: '評等針對完整篩檢策略，不是大腸鏡單一檢查本身。',
    sourceUrl: USPSTF_COLORECTAL_URL,
  },
  {
    name: '大腸癌篩檢(76–85 歲)', grade: 'C',
    population: '依健康狀況、既往篩檢史與個人偏好選擇性篩檢',
    note: '過去未曾接受篩檢者較可能受益，應由醫病共同決定。',
    sourceUrl: USPSTF_COLORECTAL_URL,
  },
  {
    name: '子宮頸癌篩檢(抹片 / HPV)', grade: 'A',
    population: '具子宮頸、一般風險者：21–29 歲每 3 年抹片；30–65 歲可選每 3 年抹片、每 5 年高風險 HPV 檢測，或每 5 年兩者合併。',
    note: '依 2018 正式建議，不採尚未定案的更新草案；台灣公費資格另見上方。',
    sourceUrl: USPSTF + 'document/RecommendationStatementFinal/cervical-cancer-screening',
  },
  {
    name: 'B 型肝炎（HBV）篩檢', grade: 'B',
    population: '無症狀、非懷孕且具 HBV 感染高風險的青少年與成人',
    note: '不是對所有 18 歲以上成人的同一項 USPSTF 建議。',
    sourceUrl: USPSTF + 'recommendation/hepatitis-b-virus-infection-screening',
  },
  {
    name: 'C 型肝炎（HCV）篩檢', grade: 'B',
    population: '18–79 歲無症狀成人，至少篩檢一次',
    note: '持續高風險者需定期篩檢，間隔依個別風險討論。',
    sourceUrl: USPSTF + 'recommendation/hepatitis-c-screening',
  },
  {
    name: '糖尿病前期與第二型糖尿病篩檢', grade: 'B',
    population: '35–70 歲、過重或肥胖的無症狀成人',
    note: '亞洲族群可考慮較低 BMI 門檻；不能把一般抽血套餐等同這項完整建議。',
    sourceUrl: USPSTF + 'recommendation/screening-for-prediabetes-and-type-2-diabetes',
  },
  {
    name: 'Statin 用於心血管疾病初級預防', grade: 'B',
    population: '40–75 歲、無已知心血管疾病，具至少一項風險因子，且估計 10 年風險 ≥10%',
    note: '7.5–<10% 為 C；≥76 歲開始用藥為 I。這是用藥建議，不是對所有心血管檢查的推薦；不同模型的數值不可直接互換套用。',
    sourceUrl: USPSTF + 'document/ClinicalSummaryFinal/statin-use-in-adults-preventive-medication',
  },
  {
    name: '冠狀動脈鈣化（CAC）加入傳統風險評估', grade: 'I',
    population: '無症狀成人',
    note: 'USPSTF 認為證據不足以判定加入評估的利弊；不等於每個人都應做，也不等於在所有臨床情境都沒有用途。',
    sourceUrl: USPSTF + 'recommendation/cardiovascular-disease-screening-using-nontraditional-risk-assessment',
  },
  {
    name: '無症狀頸動脈狹窄篩檢', grade: 'D',
    population: '一般無症狀成人，不建議例行篩檢',
    note: '不適用於已有短暫性腦缺血、中風或相關神經症狀者的診斷評估。',
    sourceUrl: USPSTF + 'recommendation/carotid-artery-stenosis-screening',
  },
  {
    name: '低劑量肺部 CT（LDCT）', grade: 'B',
    population: '50–80 歲、至少 20 包年、仍吸菸或戒菸未滿 15 年，每年篩檢',
    note: '台灣公費資格不同，另有肺癌家族史條件；請先查國健署最新資格，不要直接認定只能自費。',
    sourceUrl: USPSTF + 'recommendation/lung-cancer-screening',
  },
  {
    name: '乳房攝影', grade: 'B',
    population: '40–74 歲女性，每 2 年 1 次',
    note: '台灣公費資格獨立列於上方；有症狀者需診斷評估，不應等待篩檢。',
    sourceUrl: USPSTF + 'document/ClinicalSummaryFinal/breast-cancer-screening',
  },
  {
    name: '骨質疏鬆 DXA 篩檢', grade: 'B',
    population: '65 歲以上女性；或未滿 65 歲、停經後具危險因子，且經臨床工具判定骨折風險增加者',
    note: '男性篩檢為 I（證據不足）；已知骨鬆或脆弱性骨折者的照護不屬本項一般篩檢情境。',
    sourceUrl: USPSTF + 'recommendation/osteoporosis-screening',
  },
  {
    name: '腹主動脈瘤（AAA）篩檢', grade: 'B',
    population: '65–75 歲、曾吸菸男性，一次性超音波篩檢',
    note: '一般腹部超音波不一定包含腹主動脈量測，需向檢查單位確認；其他性別與風險族群的建議不同。',
    sourceUrl: USPSTF + 'recommendation/abdominal-aortic-aneurysm-screening',
  },
];

export const LOW_EVIDENCE_NOTE =
  '沒有列入 USPSTF A/B 建議，不代表所有項目都有 C 或 I 評等。各檢查的用途與族群不同；全身影像、腫瘤標記套組或其他加選項目，應先討論是否會改變照護，以及偽陽性、過度診斷與後續處置的風險。';

// ── 健檢前準備：不提供通用停藥、清腸劑量或固定時刻 ──
export const GENERAL_PREP = [
  '預約後索取本次檢查的書面準備單，確認報到時間、地點、攜帶證件與檢查項目。',
  '禁食與飲水規則會因抽血、內視鏡、麻醉或影像檢查而不同，請依本次院方指示，不要自行套用別人的時程。',
  '提供完整藥單、過敏史、腎臟與心臟疾病、懷孕可能及過去麻醉經驗；所有長期處方不要自行停用、延後或改量。',
  '糖尿病藥、胰島素、GLP-1 類藥物、抗血小板藥、抗凝血藥及降壓或心臟藥，需事先確認個別處理方式。',
  '月經可能影響部分檢體或檢查安排，請先向健診中心確認；婦科檢查依年齡、症狀、病史與個人意願討論。',
];

export const ENDO_PREP = [
  '低渣飲食、清腸、禁食與禁水的開始時間，請依本次預約時段及院方書面指示。',
  '清腸劑種類、劑量、飲水量及服用時點須依本次處方，不同產品不可自行互換，也不要自行補服或減量。',
  '原處方醫師、內視鏡與麻醉團隊應依個別出血、血栓、血糖及麻醉風險決定用藥調整。',
  '接受鎮靜後不要自行開車或操作機械；離院方式、是否需成人陪同及恢復活動時間，請依本次院方書面指示事先安排。',
];

export const BOWEL_PREP_CHECKLIST = [
  '我拿到的是哪一種清腸劑？每次用量、調配方式與服用時間是否都有書面說明？',
  '飲食、補充水分及最後可喝水的時間是什麼時候？有飲水限制時如何安排？',
  '每一種平常用藥該如何處理？已向原處方醫師與檢查團隊確認了嗎？',
  '若無法喝完、持續嘔吐、明顯腹痛或不舒服，應聯絡哪個單位？不要自行追加清腸劑。',
];
export const BOWEL_PREP_SOURCE_URL =
  'https://www.asge.org/home/resources/publications/guidelines/optimizing-bowel-preparation-quality-for-colonoscopy--consensus-recommendations-by-the-us-multi-society-task-force-on-colorectal-cancer';

// ── 交通資訊 ──
export const LOCATION = '高雄市燕巢區義大路一號 · 義大醫院 A 棟六樓健診中心';

export const TRANSIT_CAR = [
  '南下國道 1 號:楠梓交流道第一出口(355 KM)→ 左轉台 22 線往旗山 4.5 公里,約 5 分鐘',
  '北上國道 1 號:楠梓交流道(357 KM)→ 沿高速公路旁便道至旗楠路 → 右轉台 22 線,約 5 分鐘',
  '國道 1 號岡山交流道:轉省道 186 號往燕巢 7.5 公里,約 10 分鐘',
  '國道 10 號燕巢交流道:轉省道 22 號往燕巢 1.2 公里,約 2 分鐘',
];

export const TRANSIT_PUBLIC = [
  '高鐵左營站:搭義大客運 E03 直達',
  '高雄捷運都會公園站:轉搭 7 號 / 97 號 / 98 號 / 紅 58 線',
  '小港→都會公園約 38 分、高雄車站→都會公園約 21 分、左營→都會公園約 11 分',
  '楠梓火車站有 8023 號公車直達本院',
];

// ── FAQ(健檢相關) ──
export const FAQ = [
  {
    q: '義大醫院的健檢套餐怎麼挑最簡單?',
    a: '先看三件事:年齡與是否已規律篩檢(45–75 歲成人應接受大腸癌篩檢,但不一定要選大腸鏡;若選大腸鏡可考慮 H、舒適健檢)、是否吸菸(有吸菸史優先確認自己是否符合 LDCT 條件)、預算。若完全沒方向,先和醫師盤點個人風險與已做過的篩檢,再挑套餐,比直接追求最多檢查更不容易過度檢查。',
  },
  {
    q: '義大健檢價格會變嗎?這份資料可信嗎?',
    a: '價格每年會小幅更新。本頁由義大醫院家醫科陳昱彰醫師整理自 2025–2026 年度官方公告,並標註最後核對日期。預約前建議再跟健診中心確認 07-615-0011 分機 5706 / 5708 / 5715 / 5716 / 5735。若官方價格有更動,將以義大醫院最新公告為準。',
  },
  {
    q: '健檢前要空腹多久?藥可以繼續吃嗎?',
    a: '禁食、喝水及每一種藥物如何處理，均應依本次檢查單位的書面指示，並與原處方醫師確認。規則會因檢查項目、麻醉、腎功能及用藥而不同；不要自行停藥、延後或改量，也不要套用別人的準備時程。',
  },
  {
    q: '為什麼無痛胃腸鏡當天不能自己開車?',
    a: '鎮靜藥物可能影響判斷力與反應速度，即使感覺清醒也不應自行開車或操作機械。離院方式、是否需成人陪同及恢復活動時間，請依本次院方書面指示事先安排；不要只因搭大眾運輸就認定符合安全離院要求。',
  },
  {
    q: '健檢報告出來後可以找陳醫師解說嗎?',
    a: '可在預約時向義大健診中心表達「希望由家醫科陳昱彰醫師解說報告」，實際時段及安排請由中心確認。報告解說會將檢驗數字連同個人病史、生活型態及後續追蹤需求一起討論。',
  },
  {
    q: '無痛大腸鏡的清腸藥怎麼挑?',
    a: '請由檢查團隊依腎心功能、電解質風險、便秘史、平常用藥及預約時段選擇。不要只按口味或飲用量自行挑選、替換或調整劑量；以本次處方及書面衛教單為準。',
  },
  {
    q: '有吸菸史,但年紀還不到 50,需要做 LDCT 嗎?',
    a: 'USPSTF 建議條件是 50–80 歲、至少 20 包年、仍吸菸或戒菸未滿 15 年。台灣公費另有不同的年齡與肺癌家族史資格，請先查國健署最新條件；不符合其中一套規則不等於一定需要自費。是否檢查應與醫師討論利益、輻射及後續追蹤風險。',
  },
];
