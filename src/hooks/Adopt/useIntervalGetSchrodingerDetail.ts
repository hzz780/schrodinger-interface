import { useGetSchrodingerDetail } from 'graphqlServer';
import { useWalletService } from 'hooks/useWallet';
import { useCallback, useMemo, useRef } from 'react';
import { useCmsInfo } from 'redux/hooks';

const useIntervalGetSchrodingerDetail = () => {
  const getSDGDetail = useGetSchrodingerDetail();
  const { wallet } = useWalletService();
  const cmsInfo = useCmsInfo();

  const intervalRef = useRef<number>();

  const getInterval = useCallback(
    async (symbol: string): Promise<Boolean> =>
      new Promise((resolve) => {
        intervalRef.current = Number(
          setInterval(async () => {
            try {
              const result = await getSDGDetail({
                input: { symbol: symbol ?? '', chainId: cmsInfo?.curChain || '', address: wallet.address },
              });
              if (result.data.getSchrodingerDetail?.symbol) {
                clearInterval(intervalRef.current);
                resolve(true);
              }
            } catch (error) {
              //
            }
          }, 2000),
        );
      }),
    [cmsInfo?.curChain, getSDGDetail, wallet.address],
  );

  const startInterval = useCallback(async (symbol: string) => {
    intervalRef.current && clearInterval(intervalRef.current);
    await getInterval(symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(
    () => ({
      start: startInterval,
      remove: () => {
        intervalRef.current && clearInterval(intervalRef.current);
      },
    }),
    [startInterval],
  );
};

export default useIntervalGetSchrodingerDetail;
