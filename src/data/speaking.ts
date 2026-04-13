// 衛教演講 / 企業健康講座 資料
// 陳昱彰醫師歷年合作單位與主題
// 最後更新:2026-04-14

export interface ClientGroup {
  category: string;
  icon: string;
  clients: string[];
  note?: string;
}

export const CLIENTS: ClientGroup[] = [
  {
    category: '大學院校',
    icon: 'school',
    clients: ['東海大學', '義守大學', '國立高雄科技大學', '國立中正大學'],
  },
  {
    category: '上市櫃企業 / 大型工廠',
    icon: 'business',
    clients: [
      '中鋼(CSC)',
      '中鋼構',
      '中油(CPC)',
      '國巨(Yageo)',
      '李長榮化學(LCY)',
      '英特格(Entegris)',
      '高雄銀行',
      '麥當勞(McDonald\'s)',
    ],
  },
  {
    category: '運動健身產業',
    icon: 'fitness_center',
    clients: ['Anytime Fitness', '競心體能訓練中心'],
  },
  {
    category: '公部門與警消',
    icon: 'local_police',
    clients: ['高雄市仁武分局', '各地警察局', '法院系統', '各鄉鎮市衛生所(多場)'],
  },
  {
    category: '高中、國中、國小',
    icon: 'menu_book',
    clients: ['鳳山高中', '岡山高中', '長榮中學', '牡丹國中', '多所國中小(巡迴場)'],
  },
];

export interface Topic {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
}

export const TOPICS: Topic[] = [
  {
    icon: 'monitor_weight',
    title: '減重醫學與 GLP-1 新藥',
    subtitle: '猛健樂、Ozempic、Wegovy 的真相',
    description:
      '從肥胖醫學專科角度,講清楚 GLP-1 類藥物(semaglutide、tirzepatide)的作用機轉、真實效果、副作用、停藥反彈與適用對象。員工最想知道的「那支減重針到底能不能打」,我用臨床試驗數據告訴你。',
    keywords: ['肥胖醫學', '猛健樂', 'GLP-1', '行為改變', 'COM-B'],
  },
  {
    icon: 'monitor_heart',
    title: '三高慢性病管理',
    subtitle: '糖尿病、高血壓、高血脂',
    description:
      '用員工健檢報告的真實數據解讀三高風險。什麼時候該吃藥?藥物副作用真的那麼可怕嗎?為什麼有人吃藥吃到失控?一場演講讓員工對自己的慢性病管理建立正確觀念。',
    keywords: ['糖尿病', '高血壓', '高血脂', '健檢解讀', '藥物'],
  },
  {
    icon: 'elderly',
    title: '骨質疏鬆與肌少症',
    subtitle: '30 歲後的骨本,50 歲後的功能',
    description:
      '骨鬆不是老人的事,是從 30 歲就開始累積的結果。我會講骨密度 DXA 怎麼看、FRAX 風險怎麼算、哪些藥物真的有效、怎麼用阻力訓練對抗肌少症。結合運動醫學與營養觀點。',
    keywords: ['骨質疏鬆', '肌少症', '阻力訓練', 'DXA', 'FRAX'],
  },
  {
    icon: 'psychology',
    title: '行為科學導向的健康改變',
    subtitle: 'COM-B 模型與動機式晤談',
    description:
      '為什麼每年健檢都紅字、員工還是不運動不改飲食?因為傳統衛教「給知識」的模式根本沒用。我用行為科學工具 —能力(Capability)、機會(Opportunity)、動機(Motivation)—告訴你怎麼讓員工真的改變。',
    keywords: ['COM-B', '動機式晤談', '行為改變', '健康促進', '衛教設計'],
  },
  {
    icon: 'business_center',
    title: '職場健康與四大計畫',
    subtitle: '人因危害、異常工作負荷、母性保護、不法侵害',
    description:
      '從臨場服務醫師的實戰角度,講解《職業安全衛生法》的勞工健康保護四大計畫。不只是法規條文,而是員工真實案例、常見疏忽、HR 和雇主該怎麼配合。適合企業內訓、HR 教育訓練、職安衛委員會。',
    keywords: ['職業醫學', '四大計畫', '人因工程', '異常工作負荷', '母性保護'],
  },
  {
    icon: 'directions_run',
    title: '運動處方 FITT-VP',
    subtitle: '從 ACSM 架構到辦公室就能做的 10 分鐘',
    description:
      '用 ACSM 的 FITT-VP(頻率/強度/時間/類型/總量/進階)開給員工能真正執行的運動處方:有氧心跳區間怎麼算、阻力訓練安排、肌少症預防、下背痛舒緩、辦公室 10 分鐘動作。陳醫師同時具備 ACE-CPT 認證私人教練執照,結合臨床醫學與訓練學觀點。',
    keywords: ['FITT-VP', 'ACE-CPT', '運動處方', '阻力訓練', '肌少症', '職場健康'],
  },
];

export interface Format {
  duration: string;
  name: string;
  bestFor: string;
  includes: string[];
}

export const FORMATS: Format[] = [
  {
    duration: '30–40 分鐘',
    name: '午間健康講座',
    bestFor: '企業員工大會、午休時段、廠區全員',
    includes: ['單一主題聚焦', '30 分鐘內文 + 5–10 分鐘 Q&A', '投影片 + 重點講義'],
  },
  {
    duration: '60 分鐘',
    name: '完整衛教講座',
    bestFor: '社區衛生所、公所、學校、部門教育訓練',
    includes: ['主題完整展開', '50 分鐘內文 + 10 分鐘 Q&A', '互動案例討論'],
  },
  {
    duration: '半日 3 小時',
    name: '工作坊 / 內訓課程',
    bestFor: '企業 HR 教育訓練、職安衛委員會、健康管理師深度培訓',
    includes: ['主題深度教學', '案例演練 + 行為設計工具', '後續 Email 諮詢支援'],
  },
];

export const FAQ = [
  {
    q: '陳醫師的演講費用怎麼算?',
    a: '依主題深度、演講時長、地點與客製化程度而異。請先來信 cyc@edfm.org 說明貴單位的時段、主題、聽眾人數與地點,我會在 1–2 個工作天內回覆可行時段與報價。',
  },
  {
    q: '可以客製化講題內容嗎?',
    a: '可以也建議。企業場次我會先了解貴公司員工的健檢數據重點、職場健康痛點、已經做過的健康促進活動,把內容調整到「員工真的關心的問題」。客製比照標準化演講效果好很多,這是行為改變的關鍵。',
  },
  {
    q: '服務範圍到哪裡?北部也接嗎?',
    a: '以南部(高雄、台南、屏東、嘉義)為主,交通便利;中部(台中、彰化)視場次時段與交通安排也可以討論。北部原則上以線上演講為主。線上場次使用 Google Meet / Microsoft Teams / Zoom 皆可,講義與 Q&A 互動不受影響。',
  },
  {
    q: '可以同時安排現場健康諮詢嗎?',
    a: '可以。部分企業場次會搭配演講後的「一對一健康諮詢站」(每人 5–10 分鐘),讓員工針對個別健檢數據提問。這個服務需要額外時段,請在邀約時一併說明需求。',
  },
  {
    q: '演講結束會提供講義或追蹤資料嗎?',
    a: '會。所有演講都附重點講義(PDF)供企業內部分享。如果是 COM-B 行為改變、減重、三高等主題,會另外提供員工後續自助執行的工具表單或追蹤表。',
  },
  {
    q: '臨時邀約來得及嗎?通常需要提前多久預約?',
    a: '一般建議提前 2–4 週,方便雙方確認主題、客製內容、準備資料。如果是急件(2 週內)也歡迎來信,我會看診表空檔盡量配合;客製化深度會略少一些,但品質維持。',
  },
];

export const CONTACT = {
  email: 'cyc@edfm.org',
  facebook: 'https://www.facebook.com/lazydr',
  areaServed: ['高雄市', '台南市', '屏東縣', '嘉義縣市', '台中市(視場次)', '線上場次(全台)'],
};
