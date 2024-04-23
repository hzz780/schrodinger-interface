'use client';
import TokensInfo from 'components/TokensInfo';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';

export default function TokensPage() {
  return (
    <div className="flex flex-col max-w-[2560px] w-full">
      <TokensInfo />
      <OwnedItems pageState={ListTypeEnum.My} />
    </div>
  );
}
