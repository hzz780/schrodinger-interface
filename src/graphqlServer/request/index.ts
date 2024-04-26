import {
  GET_LATEST_SCHRODINGER_LIST_QUERY,
  GET_SCHRODINGER_DETAIL_QUERY,
  GET_SCHRODINGER_LIST_QUERY,
  GET_STRAY_CATS_QUERY,
  GET_SUB_TRAITS_QUERY,
  GET_TRAITS_QUERY,
  GET_TRAITS_ALL_QUERY,
  GET_SUB_TRAITS_ALL_QUERY,
  NFT_ACTIVITY_LIST_BY_CONDITION,
} from '../queries';
import {
  TGetAllTraits,
  TGetLatestSchrodingerList,
  TGetSchrodingerDetail,
  TGetSchrodingerList,
  TGetStrayCats,
  TGetSubAllTraits,
  TGetSubTraits,
  TGetTraits,
  TNftActivityListByCondition,
} from '../types';

export const getSchrodingerList: TGetSchrodingerList = (client, params) => {
  return client.query({
    query: GET_SCHRODINGER_LIST_QUERY,
    variables: params,
  });
};

export const getSchrodingerDetail: TGetSchrodingerDetail = (client, params) => {
  return client.query({
    query: GET_SCHRODINGER_DETAIL_QUERY,
    variables: params,
  });
};

export const getTraits: TGetTraits = (client, params) => {
  return client.query({
    query: GET_TRAITS_QUERY,
    variables: params,
  });
};

export const getAllTraits: TGetAllTraits = (client, params) => {
  return client.query({
    query: GET_TRAITS_ALL_QUERY,
    variables: params,
  });
};

export const getSubTraits: TGetSubTraits = (client, params) => {
  return client.query({
    query: GET_SUB_TRAITS_QUERY,
    variables: params,
  });
};

export const getAllSubTraits: TGetSubAllTraits = (client, params) => {
  return client.query({
    query: GET_SUB_TRAITS_ALL_QUERY,
    variables: params,
  });
};

export const getStrayCats: TGetStrayCats = (client, params) => {
  return client.query({
    query: GET_STRAY_CATS_QUERY,
    variables: params,
  });
};

export const getLatestSchrodingerList: TGetLatestSchrodingerList = (client, params) => {
  return client.query({
    query: GET_LATEST_SCHRODINGER_LIST_QUERY,
    variables: params,
  });
};

export const nftActivityListByCondition: TNftActivityListByCondition = (client, params) => {
  return client.query({
    query: NFT_ACTIVITY_LIST_BY_CONDITION,
    variables: params,
  });
};
