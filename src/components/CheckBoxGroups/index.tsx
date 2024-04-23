import { Checkbox, Col, Flex, Row } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxItemType, FilterType, ItemsSelectSourceType, SourceItemType } from 'types/tokensPage';
import { memo, useCallback, useMemo, useState } from 'react';
import FilterMenuEmpty from '../FilterMenuEmpty';
import styles from './style.module.css';
import { CheckboxChangeEvent, CheckboxProps } from 'antd/es/checkbox';

export interface CheckboxChoiceProps {
  dataSource?: CheckboxItemType;
  defaultValue?: SourceItemType[];
  onChange?: (val: ItemsSelectSourceType) => void;
  clearAll?: () => void;
}

function CheckBoxItem({ item }: { item: CheckboxProps & SourceItemType }) {
  return (
    <Col key={item.value} span={24}>
      <Checkbox
        value={item.value}
        disabled={item.disabled}
        onChange={item.onChange}
        checked={item.checked}
        indeterminate={item.indeterminate}>
        <Flex justify="space-between">
          <span>{item.label}</span>
          {!!item.count && <span>{item.count}</span>}
        </Flex>
      </Checkbox>
    </Col>
  );
}

function CheckBoxGroups({ dataSource, defaultValue, onChange }: CheckboxChoiceProps) {
  const options = useMemo(() => {
    return dataSource?.data || [];
  }, [dataSource?.data]);

  const allOption = useMemo(() => {
    return dataSource?.allItem;
  }, [dataSource?.allItem]);

  const getVal = useMemo(() => {
    return defaultValue?.map((item) => item.value);
  }, [defaultValue]);

  const checkAll = useMemo(() => {
    return options?.length === getVal?.length && (getVal || []).length > 0;
  }, [getVal, options?.length]);

  const indeterminate = useMemo(() => {
    return getVal && getVal.length > 0 && getVal.length < (options || []).length;
  }, [getVal, options]);

  const valueChange = useCallback(
    (value: CheckboxValueType[]) => {
      if (!dataSource) return;
      const data = dataSource?.data.filter((item) => {
        return value.some((s) => s === item.value);
      });
      onChange?.({
        [dataSource.key]: {
          type: FilterType.Checkbox,
          data,
        },
      });
    },
    [dataSource, onChange],
  );

  const handleAllOptionChange = useCallback(
    (value: CheckboxChangeEvent) => {
      if (!dataSource) return;
      const isChecked = value.target.checked;
      onChange?.({
        [dataSource.key]: {
          type: FilterType.Checkbox,
          data: isChecked ? options || [] : [],
        },
      });
    },
    [dataSource, onChange, options],
  );

  const checkboxItems = useMemo(() => {
    return options?.map((item: SourceItemType) => {
      return <CheckBoxItem item={item} key={item.value} />;
    });
  }, [options]);

  return dataSource?.data?.length ? (
    <>
      {allOption && (
        <Row className={styles.checkbox}>
          <CheckBoxItem
            item={{
              ...allOption,
              onChange: handleAllOptionChange,
              indeterminate,
              checked: checkAll,
            }}
          />
        </Row>
      )}
      <Checkbox.Group value={getVal} className={styles.checkbox} onChange={valueChange}>
        <Row>{checkboxItems}</Row>
      </Checkbox.Group>
    </>
  ) : (
    <FilterMenuEmpty />
  );
}

export default memo(CheckBoxGroups);
