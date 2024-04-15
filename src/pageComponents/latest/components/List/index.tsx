import { useState, useMemo, useCallback, useEffect } from 'react';
import { TSGRItem } from 'types/tokens';
import ScrollContent from 'components/ScrollContent';
import useLoading from 'hooks/useLoading';
import { divDecimals, getPageNumber, timesDecimals } from 'utils/calculate';

import { useCmsInfo } from 'redux/hooks';
import { CardType } from 'components/ItemCard';
import { useLatestColumns, useLatestGutter } from './hooks/useLayout';
import Header from '../Header';
import LearnMoreModal from 'components/LearnMoreModal';
import { useModal } from '@ebay/nice-modal-react';
import { TGetLatestSchrodingerListParams, useGetLatestSchrodingerList } from 'graphqlServer';
import { formatTraits } from 'utils/formatTraits';
import { getCatsRankProbability } from 'utils/getCatsRankProbability';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { useWalletService } from 'hooks/useWallet';

const pageSize = 32;
export default function List() {
  const [total, setTotal] = useState(0);
  const [current, SetCurrent] = useState(1);
  const [dataSource, setDataSource] = useState<TSGRItem[]>([]);
  const { showLoading, closeLoading, visible: isLoading } = useLoading();
  const cmsInfo = useCmsInfo();
  const gutter = useLatestGutter();
  const column = useLatestColumns();
  const learnMoreModal = useModal(LearnMoreModal);
  const { wallet } = useWalletService();

  const latestModal = useMemo(() => {
    return cmsInfo?.latestModal;
  }, [cmsInfo?.latestModal]);

  const hasMore = useMemo(() => {
    return total > dataSource.length;
  }, [total, dataSource]);

  const getLatestSchrodingerList = useGetLatestSchrodingerList();

  const getRankInfo = useCallback(
    async (data: TSGRItem[]) => {
      try {
        const needShowRankingIndexList: number[] = [];
        const catsRankProbabilityParams: TCatsRankProbabilityTraits[] = [];
        const needShowRankingList = data.filter((item, index) => {
          if (item.generation === 9) {
            needShowRankingIndexList.push(index);
            return true;
          }
          return false;
        });

        if (!needShowRankingList.length) return false;

        needShowRankingList.map((item) => {
          const params = formatTraits(item.traits);
          params && catsRankProbabilityParams.push(params);
        });

        try {
          const catsRankProbability = await getCatsRankProbability({
            catsTraits: catsRankProbabilityParams,
            address: addPrefixSuffix(wallet.address),
          });

          return {
            catsRankProbability,
            needShowRankingIndexList,
          };
        } catch (error) {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    [wallet.address],
  );

  const fetchData = useCallback(
    async ({ params }: { params: TGetLatestSchrodingerListParams['input']; loadMore?: boolean }) => {
      if (!params.chainId) {
        return;
      }
      showLoading();
      try {
        const {
          data: { getLatestSchrodingerListAsync: res },
        } = await getLatestSchrodingerList({
          input: params,
        });

        const { catsRankProbability, needShowRankingIndexList } = (await getRankInfo(res.data)) || {
          catsRankProbability: false,
          needShowRankingIndexList: [],
        };

        setTotal(res.totalCount ?? 0);
        const data = (res.data || []).map((item) => {
          return {
            ...item,
            amount: divDecimals(item.amount, item.decimals).toFixed(),
          };
        });

        needShowRankingIndexList.forEach((item, index) => {
          const curCatsRankProbability =
            catsRankProbability && catsRankProbability?.[index] ? catsRankProbability?.[index] : undefined;
          if (curCatsRankProbability) {
            data[item] = {
              ...data[item],
              level: curCatsRankProbability.levelInfo?.level,
              token: curCatsRankProbability.levelInfo?.token,
              rank: `${curCatsRankProbability.rank}`,
              describe: curCatsRankProbability.levelInfo?.describe,
              awakenPrice: `${curCatsRankProbability.levelInfo?.awakenPrice}`,
            };
          }
        });

        setDataSource(data);
      } finally {
        closeLoading();
      }
    },
    [closeLoading, getLatestSchrodingerList, getRankInfo, showLoading],
  );

  const loadMoreData = useCallback(() => {
    // TODO
  }, []);

  const defaultRequestParams = useMemo(() => {
    let blackList = undefined;
    const params: {
      chainId: Chain;
      skipCount: number;
      maxResultCount: number;
      blackList: undefined | Array<string>;
    } = {
      chainId: cmsInfo?.curChain ?? 'tDVV',
      skipCount: 0,
      maxResultCount: pageSize,
      blackList: undefined,
    };
    if (!cmsInfo?.blackList) throw 'not config';
    blackList = cmsInfo.blackList;
    if (blackList) {
      params.blackList = blackList;
    } else delete params.blackList;
    return params;
  }, [cmsInfo?.blackList, cmsInfo?.curChain]);

  const initData = useCallback(() => {
    setDataSource([]);
    fetchData({
      params: defaultRequestParams,
    });
  }, [defaultRequestParams, fetchData]);

  const goForest = useCallback(
    (item: TSGRItem) => {
      if (!latestModal?.show) {
        return;
      }

      learnMoreModal.show({
        item: {
          ...item,
          amount: timesDecimals(item.amount, item.decimals).toFixed(),
        },
      });
    },
    [latestModal?.show, learnMoreModal],
  );

  useEffect(() => initData(), [fetchData, defaultRequestParams, initData]);

  return (
    <>
      <Header onClick={initData} />
      <ScrollContent
        grid={{ gutter, column }}
        type={CardType.LATEST}
        onPress={goForest}
        ListProps={{
          dataSource,
        }}
      />
    </>
  );
}
