import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const ROOTS = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ['src', 'public'];
const BINARY_EXTENSIONS = new Set([
  '.avif', '.gif', '.ico', '.jpeg', '.jpg', '.mp3', '.mp4', '.otf', '.pdf', '.png', '.ttf',
  '.webm', '.webp', '.woff', '.woff2',
]);

// 這份清單只攔截本站已確認要避免的用語；專有名詞與台灣正式醫療用語不在此列。
const RULES = [
  ['計劃', /計劃/gu, '計畫'],
  ['血檢縮寫', /(?<!抽)血檢(?!查)/gu, '抽血檢查或血液檢查'],
  ['體檢', /體檢(?!查)/gu, '健檢或健康檢查'],
  ['篩查', /篩查/gu, '篩檢'],
  ['化驗', /化驗/gu, '檢驗'],
  ['數據', /數據/gu, '資料、數值或試驗結果'],
  ['依從性', /依從性/gu, '治療遵從性、配合情形或容易持續'],
  ['冠脈', /冠脈/gu, '冠狀動脈'],
  ['多變量', /多變量/gu, '多變項'],
  ['信號', /信號/gu, '訊號'],
  ['托管', /托管/gu, '代管'],
  ['帘', /帘/gu, '簾'],
  ['合集', /合集/gu, '總覽'],
  ['查找', /查找/gu, '查詢或尋找'],
  ['可持續', /可持續/gu, '能長期維持或長期可行'],
  ['優化', /優化/gu, '改善或調整'],
  ['打造', /打造/gu, '建立'],
  ['培訓', /培訓/gu, '教育訓練或進階訓練'],
  ['用戶', /用戶/gu, '使用者'],
  ['閉環', /閉環/gu, '完整流程或追蹤循環'],
  ['痛點', /痛點/gu, '問題或最需要改善之處'],
  ['跟進', /跟進/gu, '接續、追蹤或參考趨勢'],
  ['排查', /排查/gu, '檢查或排除'],
  ['全局', /全局/gu, '大局或整體'],
  ['大概率', /大概率/gu, '很可能或多半'],
  ['首個', /首個/gu, '第一個'],
  ['梳理', /梳理/gu, '整理'],
  ['新型客戶', /新型客戶/gu, '新客群'],
  ['效果量級', /效果量級/gu, '效果幅度'],
  ['平台期', /平台期/gu, '停滯期'],
  ['七日均值', /七日均值/gu, '7 日平均值'],
  ['獨立算法', /(?<!演)算法/gu, '計算方式或演算法'],
  ['聯繫', /聯繫/gu, '聯絡'],
  ['查看', /查看/gu, '檢視或瀏覽'],
  ['收集', /收集/gu, '蒐集'],
  ['扎實', /扎實/gu, '紮實'],
  ['面向使用者', /(?:推出面向|面向使用)/gu, '針對使用者推出'],
  ['比喻式落地', /(?:實際落地|計畫落地|方案落地|政策落地)/gu, '落實'],
  ['減重反彈', /(?:體重反彈|停藥反彈|全部反彈)/gu, '體重回升或復胖'],
  ['保存肌肉', /保存(?:瘦體組織|肌肉)/gu, '保留'],
];

// 高確定性的簡體字；排除「胜肽、游離、托兒、雇主、干擾」等台灣正確用字。
const SIMPLIFIED_CHARS = /[这为与医药疗检验筛护数据发后国们进门风书体质网软话车东乐见长头万无过还术声实应认导产历层总务动广开关问题设从达毕虽个吗别并来时处区际义专业类选将现统续经线较结给视频资虑顾须养针]/gu;

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(path));
    else if (!BINARY_EXTENSIONS.has(extname(entry.name).toLowerCase())) files.push(path);
  }
  return files;
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split('\n').length;
}

const failures = [];
for (const root of ROOTS) {
  for (const file of await collectFiles(root)) {
    let text;
    try {
      text = await readFile(file, 'utf8');
    } catch {
      continue;
    }

    for (const [label, pattern, suggestion] of RULES) {
      pattern.lastIndex = 0;
      for (const match of text.matchAll(pattern)) {
        failures.push({ file, line: lineNumberAt(text, match.index), term: match[0], label, suggestion });
      }
    }

    SIMPLIFIED_CHARS.lastIndex = 0;
    for (const match of text.matchAll(SIMPLIFIED_CHARS)) {
      failures.push({
        file,
        line: lineNumberAt(text, match.index),
        term: match[0],
        label: '簡體字',
        suggestion: '改用繁體中文並人工確認上下文',
      });
    }
  }
}

if (failures.length > 0) {
  console.error(`發現 ${failures.length} 個需人工確認的台灣用語問題：`);
  for (const failure of failures) {
    console.error(
      `- ${relative(process.cwd(), failure.file)}:${failure.line} ` +
      `「${failure.term}」（${failure.label}）→ ${failure.suggestion}`,
    );
  }
  process.exit(1);
}

console.log('台灣用語檢查通過。');
