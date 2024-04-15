import BigNumber from 'bignumber.js';
import dayjs, { Dayjs } from 'dayjs';
import { ZERO } from 'constants/misc';
import { getIPFSImageURI, getS3ImageURI } from './image';

export function formatTime({
  minDigits = 2,
  showSecond = true,
  hours,
  minutes,
  seconds,
}: {
  hours: number | string;
  minutes: number | string;
  seconds: number | string;
  showSecond?: boolean;
  minDigits?: number;
}) {
  if (minDigits === 1) {
    return `${hours}:${minutes}${showSecond ? `:${seconds}` : ''}`;
  } else {
    return `${timeFillDigits(hours)}:${timeFillDigits(minutes)}${showSecond ? `:${timeFillDigits(seconds)}` : ''}`;
  }
}

export function timeFillDigits(n: number | string) {
  return `${String(n).length < 2 ? `0${n}` : n}`;
}

export function formatTokenPriceOnItemCard(price: number | BigNumber | string) {
  const priceBig: BigNumber = BigNumber.isBigNumber(price) ? price : new BigNumber(price);
  if (priceBig.isNaN()) return `${price}`;
  if (priceBig.lt(BigNumber(10).exponentiatedBy(6))) {
    return formatTokenPrice(priceBig, {
      decimalPlaces: 2,
    });
  } else if (priceBig.lt(BigNumber(10).exponentiatedBy(9))) {
    const priceFixed = priceBig.div(BigNumber(10).exponentiatedBy(6)).toFixed(4);
    const res = new BigNumber(priceFixed).toFormat();
    return res + 'M';
  } else {
    const priceFixed = priceBig.div(BigNumber(10).exponentiatedBy(9)).toFixed(4);
    const res = new BigNumber(priceFixed).toFormat();
    return res + 'B';
  }
}

export function formatTokenPrice(
  price: number | BigNumber | string,
  toFixedProps?: {
    decimalPlaces?: number;
    roundingMode?: BigNumber.RoundingMode;
  },
) {
  const { decimalPlaces = 4, roundingMode = BigNumber.ROUND_DOWN } = toFixedProps || {};
  const priceBig: BigNumber = BigNumber.isBigNumber(price) ? price : new BigNumber(price);
  if (priceBig.isNaN()) return `${price}`;

  const min = BigNumber(1).div(BigNumber(10).exponentiatedBy(decimalPlaces)).toFormat();

  if (!priceBig.isEqualTo(0) && priceBig.lt(min)) {
    return `< ${min}`;
  }

  const priceFixed = priceBig.toFixed(decimalPlaces, roundingMode);
  const res = new BigNumber(priceFixed).toFormat();
  return res;
}

export function formatUSDPrice(
  price: number | BigNumber | string,
  toFixedProps?: {
    decimalPlaces?: number;
    roundingMode?: BigNumber.RoundingMode;
  },
) {
  const { decimalPlaces = 4, roundingMode = BigNumber.ROUND_DOWN } = toFixedProps || {};
  const priceBig: BigNumber = BigNumber.isBigNumber(price) ? price : new BigNumber(price);
  if (priceBig.isNaN()) return `${price}`;
  const priceFixed = priceBig.toFixed(decimalPlaces, roundingMode);
  const priceFixedBig = new BigNumber(priceFixed);

  if (priceBig.comparedTo(0) === 0) {
    return '$ 0';
  }

  if (priceFixedBig.comparedTo(0.0001) === -1) {
    return '<$ 0.0001';
  }

  return `$ ${priceFixedBig.toFormat()}`;
}

const KUnit = 1000;
const MUnit = KUnit * 1000;
const BUnit = MUnit * 1000;
const TUnit = BUnit * 1000;

export function formatNumber(
  number: number | string | BigNumber,
  toFixedProps?: {
    decimalPlaces?: number;
    roundingMode?: BigNumber.RoundingMode;
  },
) {
  const { decimalPlaces = 4, roundingMode = BigNumber.ROUND_DOWN } = toFixedProps || {};
  const numberBig: BigNumber = BigNumber.isBigNumber(number) ? number : new BigNumber(number);
  if (numberBig.isNaN() || numberBig.eq(0)) return '0';

  const regexp = /(?:\.0*|(\.\d+?)0+)$/;

  const abs = numberBig.abs();
  if (abs.gt(TUnit)) {
    return BigNumber(numberBig.div(TUnit).toFixed(decimalPlaces, roundingMode)).toFormat().replace(regexp, '$1') + 'T';
  } else if (abs.gte(BUnit)) {
    return BigNumber(numberBig.div(BUnit).toFixed(decimalPlaces, roundingMode)).toFormat().replace(regexp, '$1') + 'B';
  } else if (abs.gte(MUnit)) {
    return BigNumber(numberBig.div(MUnit).toFixed(decimalPlaces, roundingMode)).toFormat().replace(regexp, '$1') + 'M';
  } else {
    return BigNumber(numberBig.toFixed(2, roundingMode)).toFormat();
  }
}

const reg = /^https?:/;
const base64Prefix = 'data:image/png;base64,';

export function formatImageSrc(url: string) {
  if (!url) return '';
  if (reg.test(url) || url.startsWith('data:image')) return url;
  return base64Prefix + url;
}

export function formatTimeByDayjs(date: dayjs.ConfigType, format?: string) {
  const utcFormat = 'DD-MM-YYYY HH:mm [UTC] Z';
  return dayjs(date).format(format ?? utcFormat);
}

/* eslint-disable no-case-declarations */
/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */
export default function uriToHttp(uri: string): string[] {
  const protocol = uri.split(':')[0].toLowerCase();
  switch (protocol) {
    case 'https':
    case 'http':
      return [uri];
    case 'ipfs':
      const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
      return [`${getS3ImageURI()}/${hash}`, `${getIPFSImageURI()}/${hash}`, `https://ipfs.io/ipfs/${hash}`];
    case 'ipns':
      const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
      return [`${getS3ImageURI()}/${hash}`, `https://ipfs.io/ipns/${name}`];
    default:
      if (uri.includes('_next')) return [uri];

      const isBase64 = uri.startsWith('data:image');
      if (!isBase64) return [base64Prefix + uri];
      return [uri];
  }
}

export function convertDecimalToPercentage(percent: string | number, decimals = 2) {
  let p = ZERO.plus(percent);
  if (p.isNaN()) p = ZERO;
  return Number(p.multipliedBy(100).toFixed(decimals));
}

export function formatPercent(percent: string | number, decimals = 2) {
  let p = ZERO.plus(percent);
  if (p.isNaN()) p = ZERO;
  return p.toFixed(decimals);
}

export const thousandsNumber = (number?: string | number): string => {
  const num = Number(number);
  if (number === '' || Number.isNaN(num)) return '-';
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 8 })}`;
};
