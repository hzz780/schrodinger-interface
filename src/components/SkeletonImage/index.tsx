import { Skeleton } from 'antd';
import clsx from 'clsx';
import CustomImageLoader from 'components/ImageLoader';
import React, { ReactNode, useCallback } from 'react';
import { useState } from 'react';
import styles from './index.module.css';
import { CodeBlock } from 'components/ItemCard';
import HonourLabel from 'components/ItemCard/components/HonourLabel';
import { TTagSize, TPositionDistance, imageType, labelStyle, formatTagContent } from './config';
import { formatTokenPrice } from 'utils/format';

interface ISkeletonImage {
  img?: string;
  tag?: string;
  tagStyle?: string;
  tagSize?: TTagSize;
  tagPosition?: TPositionDistance;
  className?: string;
  imageSizeType?: 'cover' | 'contain';
  width?: number;
  height?: number;
  rank?: string | number | ReactNode;
  generation?: string | number | ReactNode;
  level?: string | number | ReactNode;
  rarity?: string;
  hideRankHover?: boolean;
  containsInscriptionCode?: {
    inscriptionDeploy: string;
    decimals?: number;
  };
}

function SkeletonImage(props: ISkeletonImage) {
  const {
    img: imageUrl,
    className,
    rank,
    hideRankHover = false,
    imageSizeType = 'cover',
    tag,
    tagStyle,
    tagSize,
    tagPosition,
    level,
    rarity,
    generation,
    containsInscriptionCode,
    width = 108,
    height = 108,
  } = props;

  const [skeletonActive, setSkeletonActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const renderTag = useCallback(
    (value: string | number | ReactNode, key: string) => {
      if (!value) {
        return null;
      }
      if (typeof value === 'string' || typeof value === 'number') {
        return (
          <div
            className={clsx(
              'absolute text-white bg-fillMask1 flex justify-center items-center',
              labelStyle[key].size[tagSize || 'default'],
              labelStyle[key].position[tagPosition || 'default'],
            )}>
            {formatTagContent(value, key)}
          </div>
        );
      } else {
        return value;
      }
    },
    [tagPosition, tagSize],
  );

  const renderRank = useCallback(() => {
    if (!rank) {
      return null;
    }
    if (typeof rank === 'string' || typeof rank === 'number') {
      return (
        <div
          className={clsx(
            'absolute bottom-0 left-0 w-full h-[24px] bg-fillMask1 flex justify-center items-center text-white text-[10px] leading-[16px] font-medium',
            hideRankHover ? styles['hide-rank'] : '',
          )}>
          {rank ? `Rank: ${formatTokenPrice(rank)}` : ''}
        </div>
      );
    } else {
      return rank;
    }
  }, [rank, hideRankHover]);

  return (
    <div className={clsx('relative rounded-lg overflow-hidden', styles['skeleton-image'], className)}>
      {(loading || !imageUrl) && (
        <Skeleton.Image className="absolute top-0 left-0 !w-full !h-full" active={imageUrl ? skeletonActive : false} />
      )}
      {imageUrl ? (
        <div className="w-full h-full relative">
          <CustomImageLoader
            width={width}
            height={height}
            src={imageUrl}
            alt="image"
            className={clsx('w-full h-full rounded-lg', imageType[imageSizeType])}
            onLoad={() => {
              setLoading(false);
              setSkeletonActive(false);
            }}
            onError={() => {
              setSkeletonActive(false);
            }}
          />
          {tag ? (
            <div
              className={clsx(
                'absolute top-[8px] text-white left-[8px] bg-fillMask1 px-[4px] rounded-sm text-[10px] leading-[16px] font-medium h-[18px] flex justify-center items-center',
                tagStyle,
              )}>
              {tag}
            </div>
          ) : null}
          {renderTag(generation || generation === 0 ? `${generation}` : null, 'generation')}
          {containsInscriptionCode ? (
            <div
              className={`bg-black bg-opacity-60 absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-20 invisible ${styles['inscription-info-wrap']}`}>
              <CodeBlock
                value={containsInscriptionCode.inscriptionDeploy}
                decimals={containsInscriptionCode.decimals}
              />
            </div>
          ) : null}
          {renderRank()}
          {renderTag(level, 'level')}
          {rarity ? (
            <div
              className={clsx(
                'absolute flex justify-center items-center',
                labelStyle.rarity.size[tagSize || 'default'],
                labelStyle.rarity.position[tagPosition || 'default'],
              )}>
              <HonourLabel text={rarity} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(SkeletonImage);
