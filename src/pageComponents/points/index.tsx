import { getPoints } from 'api/request';
import { TokenEarnList } from 'components/EarnList';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useRequest } from 'ahooks';
import { useTimeoutFn } from 'react-use';
import useLoading from 'hooks/useLoading';

export default function PointsPage() {
  const { isLogin, wallet } = useWalletService();
  const router = useRouter();
  const { checkTokenValid } = useCheckLoginAndToken();
  const { showLoading, closeLoading } = useLoading();

  const getPointsData = useCallback(
    async (address: string) => {
      if (!address) return;
      showLoading();
      const response = await getPoints({
        domain: document.location.host,
        address: address,
      });
      closeLoading();
      return response;
    },
    [closeLoading, showLoading],
  );

  const { data, loading } = useRequest(() => getPointsData(wallet.address), {
    pollingInterval: 1000 * 60,
    refreshDeps: [wallet.address],
    onError: (err) => {
      console.error('getPointsDataError', err);
    },
  });

  useTimeoutFn(() => {
    if (!isLogin && !checkTokenValid()) {
      router.push('/');
    }
  }, 3000);

  if (loading) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1360px]">
        <h1 className="pt-[24px] pb-[8px] font-semibold text-2xl">Details of credits token earned for this domain</h1>
        {data?.pointDetails.length ? (
          <TokenEarnList dataSource={data?.pointDetails || []} />
        ) : (
          <p className="pt-[24px] pb-[8px] text-[#919191] text-lg text-center">No flux points yet.</p>
        )}
      </div>
    </div>
  );
}
