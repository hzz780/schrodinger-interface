import { store } from 'redux/store';

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

  const { prevLen, endLen, limitLen } =
    type === OmittedType.CUSTOM ? params || defaults[type] : defaults[type];

  if (str?.length > limitLen) {
    return `${str.slice(0, prevLen)}...${str.slice(-endLen)}`;
  }
  return str;
};

export const addPrefixSuffix = (str: string, ChainId?: string) => {
  if (!str) return str;
  const info = store.getState().info.cmsInfo;
  let resStr = str;
  const prefix = 'ELF_';
  const suffix = `_${ChainId || info?.curChain}`;
  if (!str.startsWith(prefix)) {
    resStr = `${prefix}${resStr}`;
  }
  if (!str.endsWith(suffix)) {
    resStr = `${resStr}${suffix}`;
  }
  return resStr;
};
