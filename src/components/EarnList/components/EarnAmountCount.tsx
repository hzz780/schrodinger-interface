import { useState } from 'react';
import { formatTokenPrice } from 'utils/format';
import BigNumber from 'bignumber.js';
import { useTimeoutFn, useUnmount } from 'react-use';

interface IEarnAmountCountProps {
  updateTime: number;
  amount: number | string;
  rate: number;
  inviteRate: number;
  inviteFollowersNumber: number;
  thirdFollowersNumber: number;
  thirdRate: number;
}

function computeAmountCount({
  updateTime,
  amount,
  rate,
  inviteFollowersNumber,
  inviteRate,
  thirdFollowersNumber,
  thirdRate,
}: IEarnAmountCountProps) {
  const times = Math.floor(Math.max(0, Date.now() - updateTime) / 1000);

  return BigNumber(times)
    .times(rate)
    .plus(BigNumber(times).times(inviteRate).times(inviteFollowersNumber))
    .plus(BigNumber(times).times(thirdFollowersNumber).times(thirdRate))
    .plus(BigNumber(amount).dividedBy(10 ** 8))
    .toNumber();
}

export function EarnAmountCount(props: IEarnAmountCountProps) {
  const [count, setCount] = useState(computeAmountCount(props));

  const [, cancel, reset] = useTimeoutFn(() => {
    setCount(computeAmountCount(props));
    reset();
  }, 1000);

  useUnmount(() => {
    cancel();
  });

  return <>{formatTokenPrice(count)}</>;
}
