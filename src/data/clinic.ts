// 陳昱彰醫師門診地點資訊
// 最後更新:2026-04-14

export interface ClinicLocation {
  id: string;
  name: string;
  shortName: string;
  role: 'primary' | 'satellite';
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: { lat: number; lng: number };
  telephone: string;
  mapUrl: string;
  bookingUrl?: string;
  hours: Array<{
    label: string;
    session: '上午' | '下午' | '夜間';
    day: string; // 'Monday' | 'Tuesday' | ...
    dayLabel: string;
    opens: string;
    closes: string;
    focus: string;
  }>;
  services: string[];
  radiusNote: string;
}

export const EDAH: ClinicLocation = {
  id: 'edah',
  name: '義大醫院 家庭暨社區醫學部 / 減重中心',
  shortName: '義大醫院',
  role: 'primary',
  address: {
    streetAddress: '燕巢區角宿里義大路 1 號(A 棟)',
    addressLocality: '高雄市',
    addressRegion: '高雄市',
    postalCode: '82445',
    addressCountry: 'TW',
  },
  geo: { lat: 22.7345, lng: 120.3882 },
  telephone: '+886-7-615-0011',
  mapUrl: 'https://maps.app.goo.gl/Qf7E1ZuDcFaAQBhW6',
  bookingUrl: 'https://webreg.edah.org.tw/Register/ChooseDoctorTime/2675',
  hours: [
    {
      label: '週一上午・家醫科門診',
      session: '上午',
      day: 'Monday',
      dayLabel: '週一',
      opens: '08:30',
      closes: '12:00',
      focus: '家庭醫學・慢性病追蹤・高階健檢',
    },
    {
      label: '週二上午・家醫科門診',
      session: '上午',
      day: 'Tuesday',
      dayLabel: '週二',
      opens: '08:30',
      closes: '12:00',
      focus: '家庭醫學・慢性病追蹤・高階健檢',
    },
    {
      label: '週五上午・家醫科門診',
      session: '上午',
      day: 'Friday',
      dayLabel: '週五',
      opens: '08:30',
      closes: '12:00',
      focus: '家庭醫學・慢性病追蹤',
    },
    {
      label: '週五下午・減重中心',
      session: '下午',
      day: 'Friday',
      dayLabel: '週五',
      opens: '13:30',
      closes: '17:00',
      focus: '藥物減重(含 GLP-1 類)・肥胖醫學',
    },
  ],
  services: [
    '家庭醫學科門診',
    '高階健康檢查與報告解說',
    '慢性病(高血壓、糖尿病、高血脂)整合管理',
    '藥物減重門診(含 Contrave、GLP-1 類)',
    '骨質疏鬆評估',
    '職業醫學諮詢',
  ],
  radiusNote: '義大醫院位於高雄市燕巢區,鄰近橋頭、岡山、路竹、楠梓、左營;提供醫學中心等級的完整檢查設備與團隊支援。',
};

export const DAZHENG: ClinicLocation = {
  id: 'dazheng',
  name: '大政診所(週五夜診)',
  shortName: '旗山大政診所',
  role: 'satellite',
  address: {
    streetAddress: '旗山區',
    addressLocality: '旗山區',
    addressRegion: '高雄市',
    postalCode: '842',
    addressCountry: 'TW',
  },
  geo: { lat: 22.892365, lng: 120.4836464 },
  telephone: '+886-7-662-2588',
  mapUrl: 'https://maps.app.goo.gl/JcgmsZQqFahbT2T1A',
  hours: [
    {
      label: '週五夜診・家醫科 + 減重',
      session: '夜間',
      day: 'Friday',
      dayLabel: '週五',
      opens: '18:00',
      closes: '21:00',
      focus: '家庭醫學・三高追蹤・藥物減重(含 GLP-1)',
    },
  ],
  services: [
    '家庭醫學科夜診',
    '三高慢性病持續處方',
    '藥物減重門診(含 GLP-1 類)',
    '下班後就醫・自費減重諮詢',
  ],
  radiusNote: '適合旗山、美濃、田寮、內門一帶的居民,以及下班後才有空就診的上班族。從旗山市區步行可達,自備停車。',
};

export const CLINICS: ClinicLocation[] = [EDAH, DAZHENG];

// 地理輻射半徑(用於 SEO 關鍵字與 FAQ)
export const QISHAN_RADIUS = ['旗山', '美濃', '田寮', '內門'];

// 清楚的分流語句:不是互斥,是不同使用情境
export const POSITIONING = {
  edah: {
    headline: '醫學中心等級・完整設備',
    bestFor: [
      '想搭配高階健康檢查一起規劃減重與慢性病管理',
      '想在醫學中心等級的環境完成完整代謝與影像評估',
      '白天時段較方便就診',
      '通勤路線順義大(燕巢/楠梓/岡山/橋頭/路竹/左營)',
    ],
  },
  dazheng: {
    headline: '下班後就診・地利之便',
    bestFor: [
      '住在旗山、美濃、田寮、內門一帶的居民',
      '想打 GLP-1 類減重藥、需要穩定回診追蹤,但義大太遠',
      '三高慢性病需要固定處方、不想跑大醫院',
      '白天要上班、只能晚上看診',
    ],
  },
};
