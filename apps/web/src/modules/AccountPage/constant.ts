interface CoinSymbolType {
  type: string;
  name: string;
}

export const coinSymbol: { [key: string]: CoinSymbolType } = {
  USD: {
    type: '$',
    name: '美元',
  },
  CNY: {
    type: 'CNY',
    name: '人民币',
  },
  JPY: {
    type: '¥',
    name: '日元',
  },
  TRY: {
    type: '₺',
    name: 'トルコリラ',
  },
  EUR: {
    type: '€',
    name: '欧元',
  },
  GBP: {
    type: '£',
    name: '英镑',
  },
  CAD: {
    type: 'C$',
    name: '加元',
  },
  AUD: {
    type: 'A$',
    name: '澳元',
  },
  KRW: {
    type: '₩',
    name: '韩元',
  },
  NZD: {
    type: 'NZ$',
    name: '新西兰元',
  },
  HKD: {
    type: 'HK$',
    name: '港币',
  },
  TWD: {
    type: 'NT$',
    name: '新台币',
  },
  SGD: {
    type: 'S$',
    name: '新加坡元',
  },
  ZAR: {
    type: 'R',
    name: '南非兰特',
  },
  RUB: {
    type: 'руб',
    name: '俄罗斯卢布',
  },
  INR: {
    type: '₨',
    name: '印度卢比',
  },
  BRL: {
    type: 'R$',
    name: '巴西雷亚尔',
  },
  CHF: {
    type: 'CHF',
    name: '瑞士法郎',
  },
  SEK: {
    type: 'kr',
    name: '瑞典克朗',
  },
  PHP: {
    type: 'Php',
    name: '菲律宾比索',
  },
  AED: {
    type: 'د.إ',
    name: '阿联酋迪拉姆',
  },
};
