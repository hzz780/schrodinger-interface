/* eslint-disable react/no-unescaped-entities */
import { Table } from 'aelf-design';
import { TableColumnsType } from 'antd';
import React, { useMemo } from 'react';
import { IActivityDetailRulesTable } from 'redux/types/reducerTypes';
import styles from './style.module.css';
import clsx from 'clsx';

const renderCell = (value: string) => {
  return <span className="text-neutralTitle font-medium text-sm">{value}</span>;
};

function RulesTable({ header, data }: IActivityDetailRulesTable) {
  const columns: TableColumnsType<any> = useMemo(() => {
    if (header?.length) {
      return header.map((item) => {
        return {
          title: item.title,
          dataIndex: item.key,
          key: item.key,
          width: item.width,
          render: (value, _record, index) => {
            return renderCell(item.key === 'index' ? `${index + 1}` : value);
          },
        };
      });
    } else {
      return [];
    }
  }, [header]);

  if (!columns || !columns.length) return null;

  return (
    <div className={clsx('mt-[8px] mb-[16px] w-full overflow-x-auto', styles['rules-table'])}>
      <Table
        dataSource={data || []}
        columns={columns}
        pagination={null}
        scroll={{
          x: 'max-content',
        }}
      />
    </div>
  );
}

export default React.memo(RulesTable);
