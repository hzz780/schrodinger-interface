'use client';
import { IScrollAlertItem } from 'components/ScrollAlert';
import { TNftActivityListByConditionData } from 'graphqlServer';
import { useNftActivityListByCondition } from 'graphqlServer/hooks';
import { useCallback } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { TCustomizationItemType, TGlobalConfigType } from 'redux/types/reducerTypes';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { formatTokenPrice } from 'utils/format';
import { openExternalLink } from 'utils/openlink';

export default function useGetNoticeData() {
  const cmsInfo = useCmsInfo();

  const getNftActivityListByCondition = useNftActivityListByCondition();

  const onJump = (cmsInfo?: TCustomizationItemType & TGlobalConfigType) => {
    const forestActivity = cmsInfo?.forestActivity || '';

    openExternalLink(forestActivity, '_blank');
  };

  const getNoticeData: () => Promise<IScrollAlertItem[]> = useCallback(async () => {
    const { nftActivityListFilter, showNftQuantity } = cmsInfo || {};
    const timestampMax = nftActivityListFilter?.timestampMax || new Date().getTime();
    try {
      const { data } = await getNftActivityListByCondition({
        input: {
          skipCount: 0,
          maxResultCount: nftActivityListFilter?.maxResultCount || 5,
          sortType: nftActivityListFilter?.sortType || 'DESC',
          abovePrice: nftActivityListFilter?.abovePrice || 20,
          filterSymbol: nftActivityListFilter?.filterSymbol || 'SGR',
          timestampMin: nftActivityListFilter?.timestampMin || 1710892800000,
          timestampMax,
          types: nftActivityListFilter?.types || [3],
        },
      });

      let result = [];

      if (data?.nftActivityListByCondition.data) {
        result = data?.nftActivityListByCondition.data.slice(0, showNftQuantity || 5);
      } else {
        return [];
      }

      return result?.map((item: TNftActivityListByConditionData) => {
        const symbol = item?.nftInfoId?.replace(`${cmsInfo?.curChain}-`, '');
        return {
          text: (
            <span>
              {symbol} purchased for <span className="text-warning600">{formatTokenPrice(item.price)} ELF</span> by{' '}
              {getOmittedStr(addPrefixSuffix(item.to), OmittedType.ADDRESS)}
            </span>
          ),
          handle: () => onJump(cmsInfo),
        };
      });
    } catch (error) {
      return [];
    }
  }, [cmsInfo, getNftActivityListByCondition]);

  return {
    getNoticeData,
  };
}
