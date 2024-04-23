import clsx from 'clsx';
import SkeletonImage from 'components/SkeletonImage';
import React, { ReactNode } from 'react';
import styles from './index.module.css';

export interface IInfoCard {
  logo?: string;
  name: string;
  tag?: string;
  rank?: string | number | ReactNode;
  subName?: string;
  items?: {
    label: string;
    value: string;
  }[];
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

function InfoCard(params: IInfoCard) {
  const { logo, name, tag, rank, items, subName, className, layout = 'horizontal' } = params;

  return (
    <div
      className={clsx(
        'flex items-center',
        styles['info-card'],
        layout === 'vertical' ? 'flex-col' : 'flex-row',
        className,
      )}>
      <div className="flex items-center">
        {logo ? <SkeletonImage img={logo} tag={tag} rank={rank} className={clsx('w-[180px] h-[180px]')} /> : null}
      </div>
      <div
        className={`overflow-hidden flex flex-col ${layout === 'vertical' ? 'mt-[16px] w-full' : 'ml-[16px] flex-1'}`}>
        {name && (
          <div className={clsx(styles.item, layout === 'vertical' ? 'flex-row' : 'flex-col')}>
            <span className={clsx(styles.title, layout === 'vertical' ? 'min-w-[128px]' : '')}>Name</span>
            <span className={clsx(styles.value, layout === 'vertical' ? 'flex-1 ml-[16px] text-right' : 'w-full')}>
              {name}
            </span>
          </div>
        )}
        {subName && (
          <div className={clsx(styles.item, layout === 'vertical' ? 'flex-row' : 'flex-col', 'mt-[8px]')}>
            <span className={clsx(styles.title, layout === 'vertical' ? 'min-w-[128px]' : '')}>Symbol</span>
            <span className={clsx(styles.value, layout === 'vertical' ? 'flex-1 ml-[16px] text-right' : 'w-full')}>
              {subName}
            </span>
          </div>
        )}
        {items?.map((val, index) => {
          return (
            <div key={index} className={clsx(styles.item, layout === 'vertical' ? 'flex-row' : 'flex-col', 'mt-[8px]')}>
              <span className={clsx(styles.title, layout === 'vertical' ? 'min-w-[128px]' : '')}>{val.label}</span>
              <span className={clsx(styles.value, layout === 'vertical' ? 'flex-1 ml-[16px] text-right' : 'w-full')}>
                {val.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(InfoCard);
