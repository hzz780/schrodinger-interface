import React, { useCallback, useMemo } from 'react';
import { Table, ToolTip } from 'aelf-design';
import TableEmpty from 'components/TableEmpty';
import RulesList from './RulesList';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useRouter } from 'next/navigation';
import {
  IKOLRulesSection,
  IRankList,
  IRankListPageConfig,
  IRankListPageConfigLink,
  IRulesSection,
} from 'redux/types/reducerTypes';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { TableColumnsType } from 'antd';
import { formatTokenPrice } from 'utils/format';
import { useResponsive } from 'hooks/useResponsive';
import CommonCopy from 'components/CommonCopy';
import SkeletonImage from 'components/SkeletonImage';
import clsx from 'clsx';
import { openExternalLink } from 'utils/openlink';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { NEED_LOGIN_PAGE } from 'constants/router';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

interface IProps {
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

function AwardAnnouncement({
  rulesList,
  rulesTitle,
  rulesSection,
  kolRulesSection,
  title,
  description,
  list,
  loadingVisible,
  subdomain,
  pageConfig,
}: IProps) {
  const router = useRouter();
  const { isLG } = useResponsive();
  const { pageTitle, title: configTitle, description: configDescription, link, content } = pageConfig || {};
  const { isLogin } = useGetLoginStatus();
  const { checkLogin } = useCheckLoginAndToken();

  const renderCell = (value: string) => {
    return <span className="text-neutralTitle font-medium text-base">{value}</span>;
  };

  const renderTitle = (value: string) => {
    return <span className="text-neutralSecondary font-medium text-base">{value}</span>;
  };

  const jumpTo = useCallback(
    (link: IRankListPageConfigLink) => {
      if (!link.link) return;
      if (link.type === 'externalLink' || link.type === 'img-externalLink') {
        openExternalLink(link.link, '_blank');
      } else {
        if (NEED_LOGIN_PAGE.includes(link.link)) {
          if (NEED_LOGIN_PAGE.includes(link.link)) {
            if (isLogin) {
              router.push(link.link);
            } else {
              checkLogin({
                onSuccess: () => {
                  if (!link.link) return;
                  router.push(link.link);
                },
              });
            }
          } else {
            router.push(link.link);
          }
        } else {
          router.push(link.link);
        }
      }
    },
    [checkLogin, isLogin, router],
  );

  const renderLink = useCallback(
    (link: IRankListPageConfigLink) => {
      switch (link.type) {
        case 'img-link':
        case 'img-externalLink':
          return (
            <span
              className={clsx('flex w-full h-auto mt-[8px] cursor-pointer overflow-hidden')}
              onClick={() => jumpTo(link)}>
              <SkeletonImage img={isLG ? link.imgUrl?.mobile || '' : link.imgUrl?.pc || ''} className="w-full h-full" />
            </span>
          );
        case 'link':
        case 'externalLink':
          return (
            <span
              className={clsx('w-max mt-[8px] text-brandDefault font-medium text-base cursor-pointer', link.style)}
              onClick={() => jumpTo(link)}>
              {link.text}
            </span>
          );
      }
    },
    [isLG, jumpTo],
  );

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
      {
        title: renderTitle('Reward ($SGR)'),
        dataIndex: 'reward',
        key: 'reward',
        width: 200,
        render: (reward) => {
          return renderCell(reward ? formatTokenPrice(reward) : '--');
        },
      },
      {
        title: renderTitle('Referral Address'),
        dataIndex: 'referralAddress',
        key: 'referralAddress',
        width: 200,
        render: (address) => {
          if (!address || address === '-') return renderCell('--');
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
        title: renderTitle('Referral Reward ($SGR)'),
        dataIndex: 'referralReward',
        key: 'referralReward',
        width: 220,
        render: (referralReward) => {
          return renderCell(referralReward ? formatTokenPrice(referralReward) : '--');
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
        title: renderTitle('TOP 8'),
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
      {
        title: renderTitle('Reward ($SGR)'),
        dataIndex: 'reward',
        key: 'reward',
        width: 200,
        render: (reward) => {
          return renderCell(reward ? formatTokenPrice(reward) : '--');
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
        <div className="flex flex-col mt-[24px] mb-[24px]">
          {content ? <div className="mb-[24px]">{renderDescription(content)}</div> : null}
          {configTitle ? <span className="text-xl font-semibold">{configTitle}</span> : null}
          {renderDescription(configDescription)}
          {link && link.length ? (
            <div className="flex flex-col">
              {link.map((item) => {
                return renderLink(item);
              })}
            </div>
          ) : null}
        </div>
        <div className="mt-[32px]">
          <div className="flex flex-col mt-[24px] mb-[24px]">
            {title ? <span className="text-xl font-semibold">{title}</span> : null}
            {renderDescription(description)}
          </div>
          {list?.length ? (
            <div className="max-w-full lg:max-w-[1220px] overflow-x-auto">
              <Table
                dataSource={list}
                columns={columns}
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

            <div className="max-w-full lg:max-w-[1200px] overflow-x-auto">
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

        {rulesTitle || rulesList?.length ? (
          <div className="flex flex-col mt-[24px]">
            {rulesTitle ? <span className="text-xl font-semibold">{rulesTitle}</span> : null}
            <RulesList rulesSection={rulesSection} kolRulesSection={kolRulesSection} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(AwardAnnouncement);
