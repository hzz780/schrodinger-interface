/* eslint-disable react/no-unescaped-entities */
import { Table } from 'aelf-design';
import { TableColumnsType } from 'antd';
import React, { useMemo } from 'react';
import { IKOLRulesSection, IKOLRulesSectionData, IRulesSection, IRulesSectionData } from 'redux/types/reducerTypes';

const textStyle = 'text-base font-medium text-neutralSecondary mt-[8px] mb-[16px]';

const renderCell = (value: string) => {
  return <span className="text-neutralTitle font-medium text-sm">{value}</span>;
};

function RulesList({
  rulesSection,
  kolRulesSection,
}: {
  rulesSection?: IRulesSection;
  kolRulesSection?: IKOLRulesSection;
}) {
  const rewardDetailsColum: TableColumnsType<IRulesSectionData> = useMemo(() => {
    if (rulesSection?.header?.length) {
      return rulesSection.header.map((item) => {
        return {
          title: item.title,
          dataIndex: item.key,
          key: item.key,
          width: item.width || 100,
          render: (value, _record, index) => {
            return renderCell(item.key === 'index' ? `${index + 1}` : value);
          },
        };
      });
    } else {
      return [];
    }
  }, [rulesSection?.header]);

  const kolRewardDetailsColum: TableColumnsType<IKOLRulesSectionData> = useMemo(() => {
    if (kolRulesSection?.header?.length) {
      return kolRulesSection.header.map((item) => {
        return {
          title: item.title,
          dataIndex: item.key,
          key: item.key,
          width: item.width || 100,
          render: (value, _record, index) => {
            return renderCell(item.key === 'index' ? `${index + 1}` : value);
          },
        };
      });
    } else {
      return [];
    }
  }, [kolRulesSection?.header]);

  const rewardDetails: IRulesSectionData[] = useMemo(() => {
    if (rulesSection?.data?.length) {
      return rulesSection.data;
    } else {
      return [];
    }
  }, [rulesSection?.data]);

  const kolRewardDetails: IKOLRulesSectionData[] = useMemo(() => {
    if (kolRulesSection?.data?.length) {
      return kolRulesSection.data;
    } else {
      return [];
    }
  }, [kolRulesSection?.data]);

  return (
    <>
      <span className={textStyle}>
        With the launch of $SGR Liquidity Drive, we are offering you the chance to receive airdrops from a pool of
        18,000 $SGR. You can participate in this campaign by contributing liquidity to our $SGR/ELF liquidity pool on
        AwakenSwap. All you have to do is visit:
        <a
          href="https://awaken.finance/trading/SGR-1_ELF_3"
          className="text-brandDefault"
          target="_blank"
          rel="noreferrer">
          https://awaken.finance/trading/SGR-1_ELF_3
        </a>
        , and click "Add Liquidity" to contribute to our $SGR/ELF liquidity pool.
      </span>
      {rewardDetailsColum?.length && rewardDetails.length ? (
        <div className="mt-[8px] mb-[16px] w-max max-w-full overflow-x-auto">
          <Table
            dataSource={rewardDetails}
            columns={rewardDetailsColum}
            pagination={null}
            scroll={{
              x: 'max-content',
            }}
          />
        </div>
      ) : null}
      <span className={textStyle}>
        Every $1 of provided liquidity during the campaign duration earns you 99 points per day, and daily snapshots
        will be taken to track your contributions. These daily points accumulated will count your total points. When the
        campaign ends on 29 April 2024, the top 40 participants, ranked by total points accumulated during the campaign
        duration, will share the pool of 16,000 $SGR tokens.
      </span>
      {kolRewardDetailsColum?.length && kolRewardDetails.length ? (
        <div className="mt-[8px] mb-[16px] w-max max-w-full overflow-x-auto">
          <Table
            dataSource={kolRewardDetails}
            columns={kolRewardDetailsColum}
            pagination={null}
            scroll={{
              x: 'max-content',
            }}
          />
        </div>
      ) : null}
      <span className={textStyle}>
        An additional 2,000 $SGR tokens will be distributed among participants who use their personalised Project
        Schrodinger link to invite friends and community members to contribute to the $SGR/ELF liquidity pool on
        AwakenSwap. Each contribution made through your link earns you points, and the top 8 participants with the most
        points will share the 2,000 $SGR token pool. If you don't have a personalised link for Project Schrodinger, you
        can apply via:
        <a
          href=" https://pixiepoints.io/apply/Schr%C3%B6dinger"
          className="text-brandDefault"
          target="_blank"
          rel="noreferrer">
          https://pixiepoints.io/apply/Schrödinger
        </a>
      </span>
      <span className={textStyle}>
        Don't miss out on this airdrop and start contributing to our $SGR/ELF liquidity pool now!
      </span>
      <span className={textStyle}>The campaign runs from 19 April until 29 April 2024.</span>
    </>
  );
}

export default React.memo(RulesList);
