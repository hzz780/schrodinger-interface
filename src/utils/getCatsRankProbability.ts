import { catsRankProbability } from 'api/request';

export const getCatsRankProbability: (
  params: ICatsRankProbabilityParams,
) => Promise<TRankInfoAddLevelInfo[] | false> = async (params: ICatsRankProbabilityParams) => {
  try {
    if (!params?.catsTraits?.length) return false;
    const rankProbability = await catsRankProbability(params);

    if (!rankProbability.length) {
      return false;
    }

    const formatRankProbability: TRankInfoAddLevelInfo[] = rankProbability.map((item) => {
      return {
        ...item.rank,
        levelInfo: item.levelInfo,
      };
    });
    return formatRankProbability;
  } catch (error) {
    return false;
  }
};
