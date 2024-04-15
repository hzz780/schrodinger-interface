import { sleep } from '@portkey/utils';
import { ENVIRONMENT, EXPLORE_URL } from 'constants/url';
import { SupportedELFChainId } from 'types';

export const handleLoopFetch = async <T>({
  fetch,
  times = 0,
  interval = 1000,
  checkIsContinue,
  checkIsInvalid,
}: {
  fetch: () => Promise<T>;
  times?: number;
  interval?: number;
  checkIsContinue?: (param: T) => boolean;
  checkIsInvalid?: () => boolean;
}): Promise<T> => {
  try {
    const result = await fetch();
    if (checkIsContinue) {
      const isContinue = checkIsContinue(result);
      if (!isContinue) return result;
    } else {
      return result;
    }
  } catch (error) {
    const isInvalid = checkIsInvalid ? checkIsInvalid() : true;
    if (!isInvalid) throw new Error('fetch invalid');
    console.log('handleLoopFetch: error', times, error);
  }
  if (times === 1) {
    throw new Error('fetch exceed limit');
  }
  await sleep(interval);
  return handleLoopFetch({
    fetch,
    times: times - 1,
    interval,
    checkIsContinue,
    checkIsInvalid,
  });
};

export const POTENTIAL_NUMBER = /^(0|[1-9]\d*)(\.\d*)?$/;
export const isPotentialNumber = (str: string) => {
  return POTENTIAL_NUMBER.test(str);
};

export function getExploreLink(
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block',
  chainName?: Chain,
): string {
  const target = (chainName && (chainName.toUpperCase() as 'AELF' | 'TDVV' | 'TDVW')) || SupportedELFChainId.MAIN_NET;
  const prefix = EXPLORE_URL[target];
  switch (type) {
    case 'transaction': {
      return `${prefix}tx/${data}`;
    }
    case 'token': {
      return `${prefix}token/${data}`;
    }
    case 'block': {
      return `${prefix}block/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}address/${data}`;
    }
  }
}

export enum OmittedType {
  ADDRESS = 'address',
  NAME = 'name',
  CUSTOM = 'custom',
}

export const getOmittedStr = (
  str: string,
  type: OmittedType,
  params?: {
    prevLen: number;
    endLen: number;
    limitLen: number;
  },
) => {
  const defaults: Record<OmittedType, { prevLen: number; endLen: number; limitLen: number }> = {
    [OmittedType.ADDRESS]: { prevLen: 10, endLen: 9, limitLen: 19 },
    [OmittedType.NAME]: { prevLen: 6, endLen: 4, limitLen: 10 },
    [OmittedType.CUSTOM]: { prevLen: 6, endLen: 4, limitLen: 10 },
  };

  const { prevLen, endLen, limitLen } = type === OmittedType.CUSTOM ? params || defaults[type] : defaults[type];

  if (str?.length > limitLen) {
    return `${str.slice(0, prevLen)}...${str.slice(-endLen)}`;
  }
  return str;
};

const testnetDefaultDomain = 'schrodingerai.com';
const mainnetDefaultDomain = 'schrodingernft.ai';

const defaultDomain =
  process.env.NEXT_PUBLIC_APP_ENV !== ENVIRONMENT.PRODUCTION ? testnetDefaultDomain : mainnetDefaultDomain;

export const getDomain = () => (!location.port ? location.host : defaultDomain);

export const getOriginSymbol = (symbol: string) => (symbol ? `${symbol.split('-')[0]}-1` : '');

export const getCollection = (symbol: string) => (symbol ? symbol.split('-')[0] : '');
