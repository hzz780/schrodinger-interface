import { ApolloQueryResult } from '@apollo/client';
import { TGraphQLClient } from './common';
import { ITrait, TSGRItem, TSGRToken } from 'types/tokens';
import { TBaseFilterTrait, TFilterGeneration, TFilterTrait } from 'types/trait';
export * from './common';

export type TCommonGraphQLResult<T> = Promise<ApolloQueryResult<T>>;

export type TGetSchrodingerListParams = {
  input: {
    chainId: string;
    address?: string;
    tick?: string;
    traits?: Array<{
      traitType: string;
      values: string[];
    }>;
    generations?: number[];
    skipCount?: number;
    maxResultCount?: number;
    keyword?: string;
  };
};
export type TGetSchrodingerListResult = {
  getSchrodingerList: {
    totalCount: number;
    data: Array<TSGRItem>;
  };
};
export type TGetSchrodingerList = (
  client: TGraphQLClient,
  params: TGetSchrodingerListParams,
) => TCommonGraphQLResult<TGetSchrodingerListResult>;

export type TGetSchrodingerDetailParams = {
  input: {
    chainId: string;
    address?: string;
    symbol: string;
  };
};
export type TGetSchrodingerDetailResult = {
  getSchrodingerDetail: TSGRToken;
};

export type TGetSchrodingerDetail = (
  client: TGraphQLClient,
  params: TGetSchrodingerDetailParams,
) => TCommonGraphQLResult<TGetSchrodingerDetailResult>;

export type TGetTraitsParams = {
  input: {
    chainId: String;
    address: String;
  };
};
export type TGetTraitsResult = {
  getTraits: {
    traitsFilter: TBaseFilterTrait[];
    generationFilter: TFilterGeneration[];
  };
};
export type TGetTraits = (client: TGraphQLClient, params: TGetTraitsParams) => TCommonGraphQLResult<TGetTraitsResult>;

type TGetSubTraitsParams = {
  input: {
    chainId: string;
    address: string;
    traitType: string;
  };
};
type TGetSubTraitsResult = {
  getTraits: {
    traitsFilter: TFilterTrait[];
  };
};
export type TGetSubTraits = (
  client: TGraphQLClient,
  params: TGetSubTraitsParams,
) => TCommonGraphQLResult<TGetSubTraitsResult>;

export type TGetStrayCatsParams = {
  input: {
    adopter: string;
    chainId: string;
    skipCount?: number;
    maxResultCount?: number;
  };
};

export type TStrayCats = {
  inscriptionImageUri: string;
  tokenName: string;
  gen: number;
  symbol: string;
  consumeAmount: number;
  receivedAmount: number;
  decimals: number;
  adoptId: string;
  nextTokenName: string;
  nextSymbol: string;
  nextAmount: string;
  parentTraits: Omit<ITrait, 'percent'>[];
};

export type TGetStrayCatsResult = {
  getStrayCats: {
    totalCount: number;
    data: Array<TStrayCats>;
  };
};

export type TGetStrayCats = (
  client: TGraphQLClient,
  params: TGetStrayCatsParams,
) => TCommonGraphQLResult<TGetStrayCatsResult>;

export type TGetLatestSchrodingerListParams = {
  input: {
    chainId: string;
    skipCount: number;
    maxResultCount: number;
    blackList?: Array<string>;
  };
};
export type TGetLatestSchrodingerListResult = {
  getLatestSchrodingerListAsync: {
    totalCount: number;
    data: Array<TSGRItem>;
  };
};
export type TGetLatestSchrodingerList = (
  client: TGraphQLClient,
  params: TGetLatestSchrodingerListParams,
) => TCommonGraphQLResult<TGetLatestSchrodingerListResult>;
