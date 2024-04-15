import { TSGRToken } from 'types/tokens';
import SkeletonImage from 'components/SkeletonImage';
import { useMemo } from 'react';
import { formatTokenPrice } from 'utils/format';

export default function ItemImage({
  detail: { generation, inscriptionImageUri },
  level,
  rarity,
  rank,
}: {
  detail: TSGRToken;
  level?: string;
  rarity?: string;
  rank?: number;
}) {
  const rankDisplay = useMemo(() => {
    return rank ? `Rank: ${formatTokenPrice(rank)}` : '';
  }, [rank]);

  return (
    <div className="relative aspect-square w-full lg:mr-[40px] mr-0 lg:w-[450px] flex items-center justify-center mt-[16px] lg:mt-[0px] rounded-2xl	border-solid border border-[#E1E1E1] bg-[#F5FEF7CC]">
      <SkeletonImage
        img={inscriptionImageUri}
        tag={`GEN ${generation}`}
        level={level ? `Lv. ${level}` : ''}
        rarity={rarity}
        rank={rankDisplay}
        tagStyle="!top-[12px] !left-[12px] !rounded-[4px]"
        levelStyle="!top-[34px] !left-[12px] !rounded-[4px]"
        rarityStyle="!top-[12px] !right-[12px]"
        className="w-full"
      />
    </div>
  );
}
