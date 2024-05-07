'use client';
import TokensInfo from 'components/TokensInfo';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import useLoading from 'hooks/useLoading';
import { useTimeoutFn } from 'react-use';
import { useRouter } from 'next/navigation';

export default function TokensPage() {
  const { isLogin } = useGetLoginStatus();
  const { closeLoading } = useLoading();
  const router = useRouter();

  useTimeoutFn(() => {
    if (!isLogin) {
      closeLoading();
      router.replace('/');
    }
  }, 3000);

  return (
    <div className="flex flex-col max-w-[2560px] w-full">
      <TokensInfo />
      <OwnedItems pageState={ListTypeEnum.My} />
    </div>
  );
}
