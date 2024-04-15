import { useCallback, useMemo } from 'react';
import { handleLoopFetch } from 'utils';
import { DEFAULT_TOKEN_SYMBOL, DEFAULT_TX_FEE, PRICE_QUOTE_COIN } from 'constants/assets';
import request from 'api/axios';
import { setTokenPriceMap, setTxFee } from 'redux/reducer/assets';
import { store } from 'redux/store';
import { useTokenPriceMapStore, useTxFeeStore } from 'redux/hooks';

export function useAssets() {
  const refreshTokenPrice = useCallback(async (symbol = DEFAULT_TOKEN_SYMBOL) => {
    const { price } = await request.get<{ price: string }>('/app/schrodinger/token-price', {
      params: {
        symbol,
      },
    });

    store.dispatch(
      setTokenPriceMap({
        [`${symbol}_${PRICE_QUOTE_COIN}`]: price,
      }),
    );

    return price as string;
  }, []);

  const refreshTxFee = useCallback(async () => {
    const { transactionFee } = await request.get<{ transactionFee: string }>('/app/schrodinger/transaction-fee');
    store.dispatch(
      setTxFee({
        common: transactionFee,
      }),
    );
    return transactionFee;
  }, []);

  const initTxFee = useCallback(async () => {
    try {
      await handleLoopFetch({
        fetch: () => {
          return refreshTxFee();
        },
        times: 2,
        interval: 1000,
        checkIsContinue: (result) => !result,
      });
    } catch (error) {
      console.log('Init txFee', error);
    }
  }, [refreshTxFee]);

  const initTokenPrice = useCallback(
    async (symbol = DEFAULT_TOKEN_SYMBOL) => {
      try {
        await handleLoopFetch({
          fetch: () => {
            return refreshTokenPrice(symbol);
          },
          times: 2,
          interval: 1000,
          checkIsContinue: (result) => !result,
        });
      } catch (error) {
        console.log('Init tokenPrice', error);
      }
    },
    [refreshTokenPrice],
  );

  const init = useCallback(() => {
    initTxFee();
    initTokenPrice();
  }, [initTokenPrice, initTxFee]);

  return {
    refreshTxFee,
    refreshTokenPrice,
    init,
    initTxFee,
    initTokenPrice,
  };
}

export function useGetTokenPrice() {
  const { refreshTokenPrice } = useAssets();
  const tokenPriceMap = useTokenPriceMapStore();

  return useCallback(
    async (symbol = DEFAULT_TOKEN_SYMBOL) => {
      const tokenPrice = tokenPriceMap?.[`${symbol}_${PRICE_QUOTE_COIN}`];
      if (tokenPrice) return tokenPrice;
      return await refreshTokenPrice(symbol);
    },
    [refreshTokenPrice, tokenPriceMap],
  );
}

export function useTokenPrice(symbol = DEFAULT_TOKEN_SYMBOL) {
  const tokenPriceMap = useTokenPriceMapStore();
  const getTokenPrice = useGetTokenPrice();

  const tokenPrice = useMemo(() => tokenPriceMap?.[`${symbol}_${PRICE_QUOTE_COIN}`], [symbol, tokenPriceMap]);

  return {
    tokenPrice,
    getTokenPrice,
  };
}

export function useTxFee() {
  const txFee = useTxFeeStore();
  const { refreshTxFee } = useAssets();

  const _txFee = useMemo(() => (txFee || DEFAULT_TX_FEE).common, [txFee]);

  return {
    txFee: _txFee,
    getTxFee: refreshTxFee,
  };
}
