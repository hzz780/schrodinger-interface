import {
  getLatestSchrodingerList,
  getSchrodingerDetail,
  getSchrodingerList,
  getStrayCats,
  getSubTraits,
  getTraits,
} from '../request';
import { getGraphQLClient } from '../client';
import { useCallback } from 'react';
import { TGraphQLParamsType } from '../types';
import { useCmsInfo } from 'redux/hooks';

export const useGraphQLClient = () => {
  const cmsInfo = useCmsInfo();
  return getGraphQLClient(cmsInfo?.graphqlSchrodinger || '');
};

export const useGetSchrodingerList = () => {
  const client = useGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof getSchrodingerList>) => getSchrodingerList(client, params),
    [client],
  );
};

export const useGetSchrodingerDetail = () => {
  const client = useGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof getSchrodingerDetail>) => getSchrodingerDetail(client, params),
    [client],
  );
};

export const useGetTraits = () => {
  const client = useGraphQLClient();
  return useCallback((params: TGraphQLParamsType<typeof getTraits>) => getTraits(client, params), [client]);
};

export const useGetSubTraits = () => {
  const client = useGraphQLClient();
  return useCallback((params: TGraphQLParamsType<typeof getSubTraits>) => getSubTraits(client, params), [client]);
};

export const useGetStrayCats = () => {
  const client = useGraphQLClient();
  return useCallback((params: TGraphQLParamsType<typeof getStrayCats>) => getStrayCats(client, params), [client]);
};

export const useGetLatestSchrodingerList = () => {
  const client = useGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof getLatestSchrodingerList>) => getLatestSchrodingerList(client, params),
    [client],
  );
};
