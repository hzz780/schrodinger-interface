import SkeletonImage from 'components/SkeletonImage';
import { TTradeItem } from 'redux/types/reducerTypes';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useCallback } from 'react';

export interface IMarketItemProps {
  data: TTradeItem;
  onClick?: (item: TTradeItem) => void;
}
export default function MarketItem({ data, onClick }: IMarketItemProps) {
  const { title, imgUrl, description } = data;

  const onItemClick = useCallback(() => {
    onClick && onClick(data);
  }, [data, onClick]);

  return (
    <div
      className="flex items-center gap-4 px-3 py-3 rounded-lg border-neutralBorder cursor-pointer border border-solid hover:lg:bg-neutralHoverBg hover:bg-neutralDefaultBg"
      onClick={onItemClick}>
      <SkeletonImage className="flex-none basis-16 rounded-md" img={imgUrl} width={64} height={64} />
      <div className="flex-1 ">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-neutralSecondary">{description}</div>
      </div>
      <ArrowSVG className="w-4 h-4 flex-none common-revert-negative-90" />
    </div>
  );
}
