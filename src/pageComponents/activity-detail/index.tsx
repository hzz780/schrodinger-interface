import { getActivityDetail } from 'api/request';
import { useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import useLoading from 'hooks/useLoading';
import { IActivityDetailRules } from 'redux/types/reducerTypes';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useRouter } from 'next/navigation';
import RulesList from './components/RulesList';

export default function ActivityDetail() {
  const { showLoading, closeLoading } = useLoading();
  const router = useRouter();

  const [rulesList, setRulesList] = useState<IActivityDetailRules[]>([]);
  const [pageTitle, setPageTitle] = useState<string>('');

  const rankList = useCallback(async () => {
    showLoading();
    const { data } = await getActivityDetail();
    setRulesList(data.rules || []);
    setPageTitle(data.pageTitle || '');
    closeLoading();
  }, [closeLoading, showLoading]);

  useEffectOnce(() => {
    rankList();
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1360px]">
        <h1 className="pt-[24px] flex items-start pb-[8px] font-semibold text-neutralTitle text-2xl">
          <div className="h-[32px] flex items-center justify-center">
            <ArrowSVG
              className="w-[24px] mr-[8px] rotate-90  cursor-pointer"
              onClick={() => {
                router.back();
              }}
            />
          </div>
          <span className="flex-1">{pageTitle}</span>
        </h1>
        <div>
          {rulesList.map((item, index) => {
            return <RulesList key={index} {...item} />;
          })}
        </div>
      </div>
    </div>
  );
}
