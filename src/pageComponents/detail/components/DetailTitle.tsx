import { TSGRToken } from 'types/tokens';
import styles from './styles.module.css';
import clsx from 'clsx';
import TextEllipsis from 'components/TextEllipsis';
import { useMemo } from 'react';
import { divDecimals } from 'utils/calculate';

export default function DetailTitle({ detail }: { detail: TSGRToken }) {
  const amountStr = useMemo(
    () => divDecimals(detail.amount, detail.decimals).toFixed(),
    [detail.amount, detail.decimals],
  );

  return (
    <div className="w-full lg:w-[450px] mr-0 lg:mr-[40px] flex justify-between lg:justify-start">
      <div className={styles.card}>
        <div className={styles.title}>Name</div>
        <TextEllipsis value={detail.tokenName} className={styles.value} />
      </div>
      <div className={clsx(styles.card, 'ml-[16px]')}>
        <div className={styles.title}>Symbol</div>
        <TextEllipsis value={detail.symbol} className={styles.value} />
      </div>
      <div className={clsx(styles.card, 'ml-[16px]')}>
        <div className={clsx(styles.title, 'min-w-[102px] whitespace-nowrap')}>Amount Owned</div>
        <div className={clsx(styles.value, 'text-right')}>{amountStr}</div>
      </div>
    </div>
  );
}
