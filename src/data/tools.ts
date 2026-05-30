// 醫療計算機分頁設定（SEO meta、卡片資訊、相關連結）
export const TOOLS_SITE = 'https://www.drcyc.io';
export const TOOLS_INDEX_URL = `${TOOLS_SITE}/tools/`;
export const TOOLS_DASHBOARD_URL = `${TOOLS_SITE}/tools/dashboard/`;
export const HEALTH_TOOLS_URL = `${TOOLS_SITE}/blog/health-tools/`;
export const TDEE_TOOL_URL = `${TOOLS_SITE}/blog/health-tools/tdee-calculator/`;
export const BOOKING_URL = 'https://webreg.edah.org.tw/Register/ChooseDoctorTime/2675';

export type ToolSlug =
  | 'bmi'
  | 'ideal-weight'
  | 'bmr'
  | 'tdee'
  | 'body-fat'
  | 'waist-ratio'
  | 'glp1-eligibility'
  | 'weight-progress';

export interface ToolMeta {
  slug: ToolSlug;
  url: string;
  title: string;          // <title>
  pageHeading: string;    // h1
  shortLabel: string;     // 卡片標籤、麵包屑
  description: string;    // meta description / 卡片副標
  keyword: string;        // 主打關鍵字
  emoji: string;
  category: '減重核心' | '進階指標' | '臨床評估';
  audience: string;       // 卡片標語
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'bmi',
    url: `${TOOLS_SITE}/tools/bmi/`,
    title: 'BMI 計算機｜台灣國健署成人肥胖分級｜陳昱彰醫師',
    pageHeading: 'BMI 計算機',
    shortLabel: 'BMI',
    description: '免費 BMI 計算機，採用台灣衛福部國民健康署成人肥胖分級（過輕、健康、過重、輕度／中度／重度肥胖）。義大醫院家醫科、肥胖醫學專科陳昱彰醫師整理，附減重藥物適應症與門診入口。',
    keyword: 'BMI 計算機',
    emoji: '⚖️',
    category: '減重核心',
    audience: '想知道自己屬於哪一級體位',
  },
  {
    slug: 'ideal-weight',
    url: `${TOOLS_SITE}/tools/ideal-weight/`,
    title: '理想體重計算｜BMI 22 健康體重 + Devine 公式｜陳昱彰醫師',
    pageHeading: '理想體重計算',
    shortLabel: '理想體重',
    description: '依身高與性別計算你的理想體重：以衛福部國健署常用之 BMI 22 為基準，同時提供 BMI 18.5–24 健康體重區間及 Devine 公式參考值。義大醫院家醫科陳昱彰醫師。',
    keyword: '理想體重計算',
    emoji: '🎯',
    category: '減重核心',
    audience: '想知道自己應該減到幾公斤',
  },
  {
    slug: 'bmr',
    url: `${TOOLS_SITE}/tools/bmr/`,
    title: 'BMR 基礎代謝率計算｜Mifflin-St Jeor 公式｜陳昱彰醫師',
    pageHeading: 'BMR 基礎代謝率計算',
    shortLabel: 'BMR',
    description: '以 Mifflin-St Jeor 公式（成人最準確之公認公式）計算你的基礎代謝率（BMR）。義大醫院家醫科陳昱彰醫師整理，附 TDEE 進階計算入口。',
    keyword: 'BMR 計算',
    emoji: '🔥',
    category: '減重核心',
    audience: '想知道完全休息一天會燒多少熱量',
  },
  {
    slug: 'tdee',
    url: TDEE_TOOL_URL,
    title: 'TDEE 計算機｜每日總熱量需求 + 減重熱量缺口｜陳昱彰醫師',
    pageHeading: 'TDEE 與每日減重熱量計算',
    shortLabel: 'TDEE',
    description: '依 BMR 與活動量計算 TDEE（每日總熱量需求），自動推算每週減 0.5 / 1 kg 的建議攝取熱量，並標示安全攝取下限。義大醫院家醫科、肥胖醫學專科陳昱彰醫師整理。',
    keyword: 'TDEE 計算機',
    emoji: '🍽️',
    category: '減重核心',
    audience: '想算每天能吃多少 + 減重該吃多少',
  },
  {
    slug: 'body-fat',
    url: `${TOOLS_SITE}/tools/body-fat/`,
    title: '體脂率計算｜Deurenberg 公式概略估算｜陳昱彰醫師',
    pageHeading: '體脂率粗估',
    shortLabel: '體脂率',
    description: '以身高、體重、年齡、性別套入 Deurenberg 公式概略估算體脂率，附男女性正常範圍對照與「為何臨床用 InBody / DXA 才準確」的說明。義大醫院家醫科陳昱彰醫師。',
    keyword: '體脂率計算',
    emoji: '💪',
    category: '進階指標',
    audience: '沒有 InBody，想先抓個大概',
  },
  {
    slug: 'waist-ratio',
    url: `${TOOLS_SITE}/tools/waist-ratio/`,
    title: '腰圍身高比 WHtR 計算｜中央型肥胖風險評估｜陳昱彰醫師',
    pageHeading: '腰圍身高比 / 腰臀比 計算',
    shortLabel: '腰圍指標',
    description: '腰圍身高比（WHtR）與腰臀比（WHR）能比 BMI 更準確反映中央型肥胖與心血管風險。附國健署腰圍標準（男 ≥ 90 cm／女 ≥ 80 cm）對照。',
    keyword: '腰圍身高比',
    emoji: '📏',
    category: '進階指標',
    audience: '看 BMI 正常但肚子有救生圈的人',
  },
  {
    slug: 'glp1-eligibility',
    url: `${TOOLS_SITE}/tools/glp1-eligibility/`,
    title: 'GLP-1 減重藥物資格評估｜瘦瘦針適應症 BMI 標準｜陳昱彰醫師',
    pageHeading: 'GLP-1 減重藥物資格評估',
    shortLabel: 'GLP-1 資格',
    description: '依 BMI 與共病條件評估你是否符合 GLP-1 減重藥物（瘦瘦針：Wegovy、Mounjaro、Saxenda）的適應症。義大醫院肥胖醫學專科陳昱彰醫師整理，含禁忌症提醒與門診評估入口。',
    keyword: 'GLP-1 適應症',
    emoji: '💉',
    category: '臨床評估',
    audience: '考慮瘦瘦針 / Mounjaro 的患者',
  },
  {
    slug: 'weight-progress',
    url: `${TOOLS_SITE}/tools/weight-progress/`,
    title: '減重進度計算｜減重百分比與達標進度｜陳昱彰醫師',
    pageHeading: '減重進度追蹤',
    shortLabel: '減重進度',
    description: '輸入起始、目前與目標體重，計算已減重 kg、減重百分比與目標達成率。臨床上 5–10% 的體重下降即可顯著改善慢性病。義大醫院家醫科陳昱彰醫師整理。',
    keyword: '減重進度',
    emoji: '📈',
    category: '臨床評估',
    audience: '減重療程中追蹤進度',
  },
];

export function findTool(slug: ToolSlug): ToolMeta {
  const t = TOOLS.find((x) => x.slug === slug);
  if (!t) throw new Error(`Tool not found: ${slug}`);
  return t;
}

// 分組（給索引頁、儀表板用）
export const TOOL_GROUPS: { category: ToolMeta['category']; tools: ToolMeta[] }[] = [
  { category: '減重核心',  tools: TOOLS.filter((t) => t.category === '減重核心') },
  { category: '進階指標',  tools: TOOLS.filter((t) => t.category === '進階指標') },
  { category: '臨床評估',  tools: TOOLS.filter((t) => t.category === '臨床評估') },
];

// 相關連結建議（每頁底部）
const RELATED: Record<ToolSlug, ToolSlug[]> = {
  'bmi':              ['ideal-weight', 'tdee', 'glp1-eligibility'],
  'ideal-weight':     ['bmi', 'tdee', 'weight-progress'],
  'bmr':              ['tdee', 'bmi', 'body-fat'],
  'tdee':             ['bmr', 'bmi', 'weight-progress'],
  'body-fat':         ['bmi', 'waist-ratio', 'tdee'],
  'waist-ratio':      ['bmi', 'body-fat', 'glp1-eligibility'],
  'glp1-eligibility': ['bmi', 'waist-ratio', 'weight-progress'],
  'weight-progress':  ['tdee', 'bmi', 'glp1-eligibility'],
};

export function relatedTools(slug: ToolSlug): ToolMeta[] {
  return RELATED[slug].map(findTool);
}
