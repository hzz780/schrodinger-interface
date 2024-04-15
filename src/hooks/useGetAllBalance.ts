import { useCallback } from 'react';
import { GetBalance } from 'contract/multiToken';
import { divDecimals } from 'utils/calculate';

export const useGetAllBalance = () => {
  return useCallback(async (tokens: { symbol: string; decimals: number }[], account: string) => {
    const balances = await Promise.all(tokens.map((token) => GetBalance({ symbol: token.symbol, owner: account })));

    return balances.map((item, index) => divDecimals(item?.balance ?? '0', tokens[index].decimals).toFixed());
  }, []);
};
