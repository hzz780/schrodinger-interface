'use client';
import TokensInfo from 'components/TokensInfo';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';
import { useCallback, useEffect, useState } from 'react';
import { IScrollAlertItem } from 'components/ScrollAlert';
import useGetNoticeData from './hooks/useGetNoticeData';

export default function TokensPage() {
  const { getNoticeData } = useGetNoticeData();

  const [noticeData, setNoticeData] = useState<IScrollAlertItem[]>([]);

  const getNotice = useCallback(async () => {
    try {
      const res = await getNoticeData();
      setNoticeData(res);
    } catch (error) {
      setNoticeData([]);
    }
  }, [getNoticeData]);

  useEffect(() => {
    getNotice();
  }, [getNotice]);

  return (
    <div className="flex flex-col max-w-[2560px] w-full">
      <TokensInfo />
      <OwnedItems noticeData={noticeData} pageState={ListTypeEnum.All} />
    </div>
  );
}
