import { TSGRToken } from 'types/tokens';
import SkeletonImage from 'components/SkeletonImage';

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
  return (
    <div className="relative aspect-square w-full lg:mr-[40px] mr-0 lg:w-[450px] flex items-center justify-center mt-[16px] lg:mt-[0px] rounded-2xl	border-solid border border-[#E1E1E1] bg-[#F5FEF7CC]">
      <SkeletonImage
        img={inscriptionImageUri}
        generation={generation}
        level={level}
        rarity={rarity}
        tagPosition="large"
        rank={rank}
        className="w-full"
      />
    </div>
  );
}
