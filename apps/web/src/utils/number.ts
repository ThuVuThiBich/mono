import BigNumber from 'bignumber.js';
import bigDecimal from 'js-big-decimal';
import numeral from 'numeral';

export const formatNumber = (num: any, scale?: number) => {
  // Avoid scientist format
  if (Number(num) < 1 || Number(num) > 999999999999999999999)
    return new bigDecimal(num).getPrettyValue(undefined, undefined);

  let formatString = `0,0`;
  if (scale) {
    formatString += `.[${`0`.repeat(scale)}]`;
  }

  return numeral(num).format(formatString, Math.floor);
};

export const formatNumberFixed = (num: any, scale = 8) => {
  // Avoid scientist format
  if (Number(num) < 1) return fixed(num, scale);

  let formatString = `0,0`;
  if (scale) {
    formatString += `[.]${`0`.repeat(scale)}`;
  }
  return numeral(num).format(formatString, Math.floor);
};

// Output string of form xxx b or yyy k
// with only {digits} decimals
export function nFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

export const nDecimalFormat = (value: string, scale?: number) => {
  if (!value) {
    return value;
  }
  let result = value;
  if (scale) {
    result = fixed(value, scale);
  }
  const arr = result.toString().split('.');
  result = numeral(arr[0]).format('0,0');
  if (scale) {
    result += '.';
  }
  result += arr[1] ? `${arr[1]}` : '';
  return result;
};

export const fixed = (value: string, scale: number) => {
  const result = new BigNumber(value).toFixed(scale, BigNumber.ROUND_DOWN);
  return result;
};

export const absolute = (number: string | number): string | number => {
  if (typeof number === 'number') {
    return Math.abs(number);
  }

  while (number && number.indexOf('-') === 0) {
    number = number.slice(1);
  }

  return number;
};

interface nDecimalFormatAdvanceConfig {
  isNoZero?: boolean;
  minPrecision?: number;
  isAbsolute?: boolean;
}

export const nDecimalFormatAdvance = (
  number: string | number,
  scale?: number,
  options?: nDecimalFormatAdvanceConfig
) => {
  const defaultOptions: nDecimalFormatAdvanceConfig = {
    isNoZero: false,
    minPrecision: undefined,
    isAbsolute: false,
  };
  options = { ...defaultOptions, ...options };

  if (!scale) {
    scale = 2; // default scale
  }

  if (typeof number === 'number') {
    number = '' + number;
  }

  // check absolute
  if (options.isAbsolute) {
    number = absolute(number) as string;
  }

  // format number
  number = nDecimalFormat(number, scale);

  // precess zero
  if (options.isNoZero) {
    let temp: any = '' + parseFloat(number.replace(/,/g, ''));
    temp = temp.split('.');
    temp = temp.length === 2 ? temp[1] : '';
    if (options.minPrecision && options.minPrecision <= scale && temp.length < options.minPrecision) {
      let len = options.minPrecision - temp.length;
      for (let i = 0; i < len; i = i + 1) {
        temp = temp + '0';
      }
    }
    if (temp.length !== 0) {
      temp = '.' + temp;
    }
    number = number.split('.')[0] + temp;
  }

  // return
  return number;
};
