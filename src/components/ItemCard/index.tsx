import { HashAddress } from 'aelf-design';
import SkeletonImage from 'components/SkeletonImage';
import React, { useCallback, useMemo } from 'react';
import { TSGRItem } from 'types/tokens';
import { formatNumber, formatTimeByDayjs, formatTokenPrice } from 'utils/format';
import { useCmsInfo } from 'redux/hooks';
import { divDecimals } from 'utils/calculate';
import styles from './style.module.css';
import { ReactComponent as XIcon } from 'assets/img/x.svg';
export enum CardType {
  MY = 'my',
  LATEST = 'latest',
}
interface IItemCard {
  item: TSGRItem;
  onPress: (item: TSGRItem) => void;
  type: CardType;
}

export default function ItemCard({ item, onPress, type }: IItemCard) {
  const {
    inscriptionImageUri,
    generation = '1',
    tokenName,
    decimals,
    adoptTime,
    adopter,
    amount,
    rank,
    level,
    describe,
    awakenPrice,
    token,
    inscriptionDeploy,
  } = item || {};

  const transformedAmount = useMemo(() => formatTokenPrice(amount, { decimalPlaces: decimals }), [amount, decimals]);

  const rankDisplay = useMemo(() => {
    return rank && rank !== '0' ? `Rank: ${formatTokenPrice(rank)}` : '';
  }, [rank]);

  const awakenPriceDisplay = useMemo(() => {
    return awakenPrice ? `${formatNumber(awakenPrice)} ELF` : '';
  }, [awakenPrice]);

  const tokenDisplay = useMemo(() => {
    return token ? `${formatNumber(token)} SGR` : '';
  }, [token]);

  const cmsInfo = useCmsInfo();

  const containsInscriptionCode = useMemo(() => {
    if (inscriptionDeploy === '{}') return false;
    try {
      JSON.parse(inscriptionDeploy);
      return true;
      // eslint-disable-next-line no-empty
    } catch (ignored) {}
    return false;
  }, [inscriptionDeploy]);

  const onCardClick = useCallback(() => {
    onPress && onPress(item);
  }, [item, onPress]);

  const adoptTimeStr = useMemo(() => formatTimeByDayjs(adoptTime), [adoptTime]);

  return (
    <div
      className="w-full overflow-hidden border border-neutralBorder border-solid rounded-lg cursor-pointer"
      onClick={onCardClick}>
      <div>
        <div className={styles['item-card-img-wrap']}>
          <SkeletonImage
            img={inscriptionImageUri}
            imageSizeType="contain"
            rank={rankDisplay}
            tag={`GEN ${generation}`}
            level={level && `Lv. ${level}`}
            rarity={describe}
            hideRankHover={true}
            containsInscriptionCode={
              containsInscriptionCode
                ? {
                    inscriptionDeploy,
                    decimals,
                  }
                : undefined
            }
            className={`${styles['item-card-img']} w-full h-auto aspect-square object-contain rounded-b-none`}
          />
        </div>

        <div className="px-4 py-4 flex flex-col">
          <div className="flex  flex-col text-lg leading-6 font-medium max-w-xs whitespace-nowrap">
            <span className="text-sm text-neutralPrimary font-medium truncate">{tokenName || '--'}</span>
          </div>
          {type === CardType.LATEST && (
            <div className="flex flex-col pt-1">
              <div className="text-xs leading-[18px] text-neutralDisable">{adoptTimeStr || '--'}</div>
              <div onClick={(e) => e.stopPropagation()}>
                <HashAddress size="small" preLen={8} endLen={9} address={adopter} chain={cmsInfo?.curChain} hasCopy />
                <div className="flex flex-row items-center">
                  <XIcon className="fill-neutralDisable" />
                  <div className="ml-1 text-xs text-neutralTitle font-medium">{transformedAmount}</div>
                </div>
                <div className="flex flex-row items-center">
                  <div className="text-[10px] h-[18px] leading-[18px] text-neutralTitle font-medium">
                    {tokenDisplay}
                  </div>
                </div>
                <div className="text-neutralSecondary h-[18px] font-normal text-[10px] leading-[18px]">
                  {awakenPriceDisplay}
                </div>
              </div>
            </div>
          )}
          {type === CardType.MY && (
            <div>
              <div className="flex flex-row items-center pt-1">
                <XIcon className="fill-neutralDisable" />
                <div className="ml-1 text-xs text-neutralTitle font-medium">{transformedAmount}</div>
              </div>
              <div className="flex flex-row items-center pt-1">
                <div className="text-[10px] h-[18px] leading-[18px] text-neutralTitle font-medium">{tokenDisplay}</div>
              </div>

              <div className="text-neutralSecondary h-[18px] font-normal text-[10px] leading-[18px]">
                {awakenPriceDisplay}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CodeBlock({ value, decimals = 8 }: { value: string; decimals?: number }) {
  const list: string[] = useMemo(() => {
    try {
      const parsed = JSON.parse(value);
      const _list: string[] = [];
      Object.keys(parsed).map((item) => {
        let value = parsed[item];
        if (item === 'lim' || item === 'max') {
          value = divDecimals(value, decimals);
        }
        _list.push(`    "${item}": "${value}"`);
      });
      return _list;
    } catch (error) {
      console.log('error', error);
    }
    return [];
  }, [decimals, value]);

  return (
    <div className="flex flex-col ml-[8px]">
      <span className="text-white text-xs main:text-sm">{`{`}</span>
      {list.map((item, index) => (
        <span className="text-white text-xs main:text-sm whitespace-pre" key={index}>
          {item}
        </span>
      ))}
      <span className="text-white text-xs main:text-sm">{`}`}</span>
    </div>
  );
}
