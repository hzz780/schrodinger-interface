import { getRankList } from 'api/request';
import { useCallback, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import useLoading from 'hooks/useLoading';
import { IRankList } from 'redux/types/reducerTypes';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { Table, ToolTip } from 'aelf-design';
import TableEmpty from 'components/TableEmpty';
import { TableColumnsType } from 'antd';
import RulesList from './components/RulesList';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useRouter } from 'next/navigation';
import { formatTokenPrice } from 'utils/format';
import { useResponsive } from 'hooks/useResponsive';
import CommonCopy from 'components/CommonCopy';

export default function PointsPage() {
  const { showLoading, closeLoading, visible } = useLoading();

  const [list, setList] = useState<IRankList[]>([]);
  const [title, setTitle] = useState<string>();
  const [pageTitle, setPageTitle] = useState<string>();
  const [description, setDescription] = useState<string[]>();
  const [rulesTitle, setRulesTitle] = useState<string>();
  const [rulesList, setRulesList] = useState<string[]>();
  const router = useRouter();
  const { isLG } = useResponsive();

  const rankList = useCallback(async () => {
    showLoading();
    const { data } = await getRankList();
    closeLoading();
    setList(data.lp.list);
    setDescription(data.lp.description);
    setTitle(data.lp.title);
    setRulesTitle(data.lp.rules?.title);
    setRulesList(data.lp.rules?.rulesList);
    setPageTitle(data.lp.pageTitle);
  }, [closeLoading, showLoading]);

  const renderCell = (value: string) => {
    return <span className="text-neutralTitle font-medium text-base">{value}</span>;
  };

  const renderTitle = (value: string) => {
    return <span className="text-neutralSecondary font-medium text-base">{value}</span>;
  };

  const columns: TableColumnsType<IRankList> = useMemo(() => {
    return [
      {
        title: renderTitle('TOP 40'),
        dataIndex: 'index',
        key: 'index',
        width: 100,
        render: (_, _record, index) => {
          return renderCell(`${index + 1}`);
        },
      },
      {
        title: renderTitle('Address'),
        dataIndex: 'address',
        key: 'address',
        width: 200,
        render: (address) => {
          return (
            <CommonCopy toCopy={addPrefixSuffix(address)}>
              {isLG ? (
                renderCell(getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS))
              ) : (
                <ToolTip trigger={'hover'} title={addPrefixSuffix(address)}>
                  {renderCell(getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS))}
                </ToolTip>
              )}
            </CommonCopy>
          );
        },
      },
      {
        title: renderTitle('LP Scores'),
        dataIndex: 'scores',
        key: 'scores',
        width: 200,
        render: (scores) => {
          return renderCell(formatTokenPrice(scores));
        },
      },
    ];
  }, [isLG]);

  useEffectOnce(() => {
    rankList();
  });

  if (visible) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1360px]">
        <h1 className="pt-[24px] flex items-start pb-[8px] font-semibold text-2xl">
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
        {rulesTitle || rulesList?.length ? (
          <div className="flex flex-col mt-[24px]">
            {rulesTitle ? <span className="text-xl font-semibold">{rulesTitle}</span> : null}
            <RulesList />
          </div>
        ) : null}

        <div className="mt-[32px]">
          <div className="flex flex-col mt-[24px] mb-[24px]">
            {title ? <span className="text-xl font-semibold">{title}</span> : null}
            {description?.length ? (
              <span className="flex flex-col">
                {description.map((item, index) => {
                  return (
                    <span key={index} className="text-base font-medium text-neutralSecondary mt-[8px]">
                      {item}
                    </span>
                  );
                })}
              </span>
            ) : null}
          </div>
          <div className="max-w-[1000px]">
            <Table
              dataSource={list}
              columns={columns}
              loading={visible}
              pagination={null}
              locale={{
                emptyText: <TableEmpty description="No data yet." />,
              }}
              scroll={{
                x: 'max-content',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
