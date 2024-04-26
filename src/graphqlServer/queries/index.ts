import { gql } from '@apollo/client';

export const GET_SCHRODINGER_LIST_QUERY = gql`
  query getSchrodingerList($input: GetSchrodingerListInput) {
    getSchrodingerList(input: $input) {
      totalCount
      data {
        symbol
        tokenName
        inscriptionImageUri
        amount
        generation
        decimals
        inscriptionDeploy
        adopter
        adoptTime
        traits {
          traitType
          value
        }
      }
    }
  }
`;

export const GET_SCHRODINGER_DETAIL_QUERY = gql`
  query getSchrodingerDetail($input: GetSchrodingerDetailInput) {
    getSchrodingerDetail(input: $input) {
      symbol
      tokenName
      inscriptionImageUri
      amount
      generation
      decimals
      traits {
        traitType
        value
        percent
      }
    }
  }
`;

export const GET_TRAITS_QUERY = gql`
  query getTraits($input: GetTraitsInput) {
    getTraits(input: $input) {
      traitsFilter {
        traitType
        amount
      }
      generationFilter {
        generationName
        generationAmount
      }
    }
  }
`;

export const GET_TRAITS_ALL_QUERY = gql`
  query getAllTraits($input: GetAllTraitsInput) {
    getAllTraits(input: $input) {
      traitsFilter {
        traitType
        amount
      }
      generationFilter {
        generationName
        generationAmount
      }
    }
  }
`;

export const GET_SUB_TRAITS_QUERY = gql`
  query getTraits($input: GetTraitsInput) {
    getTraits(input: $input) {
      traitsFilter {
        traitType
        amount
        values {
          value
          amount
        }
      }
    }
  }
`;

export const GET_SUB_TRAITS_ALL_QUERY = gql`
  query getAllTraits($input: GetAllTraitsInput) {
    getAllTraits(input: $input) {
      traitsFilter {
        traitType
        amount
        values {
          value
          amount
        }
      }
    }
  }
`;

export const GET_STRAY_CATS_QUERY = gql`
  query getStrayCats($input: StrayCatInput) {
    getStrayCats(input: $input) {
      totalCount
      data {
        adoptId
        inscriptionImageUri
        tokenName
        gen
        symbol
        consumeAmount
        receivedAmount
        decimals
        nextTokenName
        nextSymbol
        nextAmount
        parentTraits {
          traitType
          value
        }
      }
    }
  }
`;

export const GET_LATEST_SCHRODINGER_LIST_QUERY = gql`
  query getLatestSchrodingerListAsync($input: GetLatestSchrodingerListInput) {
    getLatestSchrodingerListAsync(input: $input) {
      totalCount
      data {
        symbol
        tokenName
        inscriptionImageUri
        amount
        generation
        decimals
        inscriptionDeploy
        adopter
        adoptTime
        traits {
          traitType
          value
        }
      }
    }
  }
`;

export const NFT_ACTIVITY_LIST_BY_CONDITION = gql`
  query nftActivityListByCondition($input: GetActivitiesConditionDto) {
    nftActivityListByCondition(input: $input) {
      totalRecordCount
      data {
        nftInfoId
        amount
        timestamp
        price
        amount
        type
        from
        to
      }
    }
  }
`;
