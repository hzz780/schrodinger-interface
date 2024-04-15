import { ZERO } from './misc';

export enum WalletType {
  unknown = 'unknown',
  discover = 'discover',
  portkey = 'portkey',
}

export enum NetworkType {
  MAIN = 'MAIN',
  TESTNET = 'TESTNET',
}

export const SECONDS_60 = 60000;

export const PAGE_CONTAINER_ID = 'pageContainer';

export enum NotFoundType {
  domain = 'domain',
  path = 'path',
}

export const notFoundErrorTip = {
  [NotFoundType.domain]: 'The specified customised link does not exist.',
  [NotFoundType.path]: '',
};

export const ewellUrl = 'https://ewell.finance/';

export const ADOPT_NEXT_RATE = ZERO.plus(0.95);

export const mainChain = 'AELF';
