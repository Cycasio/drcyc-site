const SITE = 'https://www.drcyc.io';

export type Publication = {
  id: string;
  type: 'MedicalScholarlyArticle' | 'ScholarlyArticle';
  title: string;
  authors: string[];
  citation: string;
  journal: string;
  volume: string;
  articleNumber: string;
  publishedDate: string;
  publishedDateLabel: string;
  doi: string;
  pubmed: string;
  publisherUrl: string;
  studyType: string;
  equalContributionNote: string;
  verifiedContribution: string;
  researchQuestion: string;
  methods: string;
  keyFinding: string;
  interpretationNote: string;
  about?: string;
};

export const publications: Publication[] = [
  {
    id: 'sarcopenia-resistance-training',
    type: 'MedicalScholarlyArticle',
    title: 'Is moderate resistance training adequate for older adults with sarcopenia? A systematic review and network meta-analysis of RCTs',
    authors: [
      'Yu Chang Chen',
      'Wang-Chun Chen',
      'Chia-Wei Liu',
      'Wei-Yu Huang',
      'ICheng Lu',
      'Chi Wei Lin',
      'Ru Yi Huang',
      'Jung Sheng Chen',
      'Chi Hsien Huang',
    ],
    citation: 'Chen YC, Chen WC, Liu CW, Huang WY, Lu I, Lin CW, Huang RY, Chen JS, Huang CH. (2023). Is moderate resistance training adequate for older adults with sarcopenia? A systematic review and network meta-analysis of RCTs. European Review of Aging and Physical Activity, 20, Article 22.',
    journal: 'European Review of Aging and Physical Activity',
    volume: '20',
    articleNumber: '22',
    publishedDate: '2023-11-29',
    publishedDateLabel: '2023 年 11 月 29 日',
    doi: '10.1186/s11556-023-00333-4',
    pubmed: '38030985',
    publisherUrl: 'https://link.springer.com/article/10.1186/s11556-023-00333-4',
    studyType: '系統性回顧與網絡統合分析',
    equalContributionNote: '出版社註記 Yu Chang Chen 與 Wang-Chun Chen 對本研究貢獻相同。',
    verifiedContribution: '出版社揭露的作者貢獻顯示，Yu Chang Chen 參與研究構想與設計、資料取得與文獻篩選、資料擷取與分析解讀，並為論文撰寫的主要貢獻者之一。',
    researchQuestion: '比較不同阻力訓練強度，以及運動合併營養介入，對肌少症成人肌肉量、肌力與身體功能的影響。',
    methods: '納入 50 項隨機對照試驗，共 4,085 名參與者，依阻力訓練強度進行網絡統合分析。',
    keyFinding: '中高強度阻力訓練在部分肌肉量、下肢肌力與身體功能指標上的效果優於中等強度訓練。',
    interpretationNote: '各結局指標的結果並非完全一致；研究結果不能直接取代個別運動能力與安全性的臨床評估。',
    about: 'Sarcopenia',
  },
  {
    id: 'emr-privacy-policy-compliance',
    type: 'ScholarlyArticle',
    title: 'Continuance compliance of privacy policy of electronic medical records: the roles of both motivation and habit',
    authors: [
      'Kuang Ming Kuo',
      'Yu Chang Chen',
      'Paul C. Talley',
      'Chi Hsien Huang',
    ],
    citation: 'Kuo KM, Chen YC, Talley PC, Huang CH. (2018). Continuance compliance of privacy policy of electronic medical records: the roles of both motivation and habit. BMC Medical Informatics and Decision Making, 18, Article 135.',
    journal: 'BMC Medical Informatics and Decision Making',
    volume: '18',
    articleNumber: '135',
    publishedDate: '2018-12-18',
    publishedDateLabel: '2018 年 12 月 18 日',
    doi: '10.1186/s12911-018-0722-7',
    pubmed: '30563500',
    publisherUrl: 'https://link.springer.com/article/10.1186/s12911-018-0722-7',
    studyType: '問卷研究與結構方程模型',
    equalContributionNote: '出版社註記 Kuang Ming Kuo 與 Yu Chang Chen 對本研究貢獻相同。',
    verifiedContribution: '出版社揭露的作者貢獻顯示，Yu Chang Chen 參與論文撰寫與統計分析，並與 Kuang Ming Kuo 對本研究貢獻相同。',
    researchQuestion: '探討動機因素與習慣，如何影響醫院工作人員持續遵循電子病歷隱私政策的意圖。',
    methods: '蒐集台灣一所醫學中心 312 名醫療工作人員的問卷資料，並以結構方程模型分析。',
    keyFinding: '自我效能、知覺有用性與促成條件可預測遵循習慣的形成，而習慣可預測持續遵循隱私政策的意圖。',
    interpretationNote: '本研究使用橫斷面問卷與行為意圖資料，結果應解讀為模型中的關聯，不等同於已證明因果關係。',
  },
];

const schemaAuthor = (name: string) =>
  name === 'Yu Chang Chen'
    ? { '@type': 'Person', '@id': `${SITE}/#person`, name }
    : { '@type': 'Person', name };

export const publicationSchemas = publications.map((publication) => ({
  '@type': publication.type,
  '@id': `https://doi.org/${publication.doi}`,
  headline: publication.title,
  author: publication.authors.map(schemaAuthor),
  datePublished: publication.publishedDate,
  isPartOf: {
    '@type': 'PublicationVolume',
    volumeNumber: publication.volume,
    isPartOf: {
      '@type': 'Periodical',
      name: publication.journal,
    },
  },
  pagination: publication.articleNumber,
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'DOI', value: publication.doi },
    { '@type': 'PropertyValue', propertyID: 'PMID', value: publication.pubmed },
  ],
  url: `https://doi.org/${publication.doi}`,
  sameAs: [
    publication.publisherUrl,
    `https://pubmed.ncbi.nlm.nih.gov/${publication.pubmed}/`,
  ],
  ...(publication.about
    ? { about: { '@type': 'MedicalCondition', name: publication.about } }
    : {}),
}));
