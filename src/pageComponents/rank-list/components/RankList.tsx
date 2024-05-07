import React, { useMemo } from 'react';
import { Table, ToolTip } from 'aelf-design';
import TableEmpty from 'components/TableEmpty';
import RulesList from './RulesList';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useRouter } from 'next/navigation';
import { IKOLRulesSection, IRankList, IRankListPageConfig, IRulesSection } from 'redux/types/reducerTypes';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { TableColumnsType } from 'antd';
import { formatTokenPrice } from 'utils/format';
import { useResponsive } from 'hooks/useResponsive';
import CommonCopy from 'components/CommonCopy';

interface IProps {
  pageTitle?: string;
  rulesList?: string[];
  rulesTitle?: string;
  rulesSection?: IRulesSection;
  kolRulesSection?: IKOLRulesSection;
  title?: string;
  description?: string[];
  list?: IRankList[];
  loadingVisible: boolean;
  subdomain?: {
    title?: string;
    description?: string[];
    list?: (IRankList & {
      link: string;
    })[];
  };
  pageConfig?: IRankListPageConfig;
}

function RankList({
  pageConfig,
  rulesList,
  rulesTitle,
  rulesSection,
  kolRulesSection,
  title,
  description,
  list,
  loadingVisible,
  subdomain,
}: IProps) {
  const router = useRouter();
  const { isLG } = useResponsive();
  const { pageTitle } = pageConfig || {};

  const renderCell = (value: string) => {
    return <span className="text-neutralTitle font-medium text-base">{value}</span>;
  };

  const renderTitle = (value: string) => {
    return <span className="text-neutralSecondary font-medium text-base">{value}</span>;
  };

  const renderDescription = (description?: string[]) => {
    if (description?.length) {
      return (
        <span className="flex flex-col">
          {description.map((item, index) => {
            return (
              <span key={index} className="text-base font-medium text-neutralSecondary mt-[8px]">
                {item}
              </span>
            );
          })}
        </span>
      );
    }
    return null;
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

  const kolColumns: TableColumnsType<
    IRankList & {
      link: string;
    }
  > = useMemo(() => {
    return [
      {
        title: renderTitle('TOP 20'),
        dataIndex: 'index',
        key: 'index',
        width: 100,
        render: (_, _record, index) => {
          return renderCell(`${index + 1}`);
        },
      },
      {
        title: renderTitle('Personalised Links'),
        dataIndex: 'link',
        key: 'link',
        width: 200,
        render: (link) => {
          return renderCell(`https://${link}`);
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
    ];
  }, [isLG]);

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
            <RulesList rulesSection={rulesSection} kolRulesSection={kolRulesSection} />
          </div>
        ) : null}

        <div className="mt-[32px]">
          <div className="flex flex-col mt-[24px] mb-[24px]">
            {title ? <span className="text-xl font-semibold">{title}</span> : null}
            {renderDescription(description)}
          </div>
          {list?.length ? (
            <div className="max-w-full lg:max-w-[1000px] overflow-x-auto">
              <Table
                dataSource={list}
                columns={columns}
                loading={loadingVisible}
                pagination={null}
                locale={{
                  emptyText: <TableEmpty description="No data yet." />,
                }}
                scroll={{
                  x: 'max-content',
                }}
              />
            </div>
          ) : null}
        </div>

        {subdomain ? (
          <div className="mt-[32px]">
            <div className="flex flex-col mt-[24px] mb-[24px]">
              {subdomain?.title ? <span className="text-xl font-semibold">{subdomain?.title}</span> : null}
              {renderDescription(subdomain?.description)}
            </div>

            <div className="max-w-full lg:max-w-[1000px] overflow-x-auto">
              <Table
                dataSource={subdomain?.list}
                columns={kolColumns}
                loading={loadingVisible}
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
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(RankList);
