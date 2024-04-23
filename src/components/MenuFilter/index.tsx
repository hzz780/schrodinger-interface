import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Flex } from 'antd';
import { ISubTraitFilterInstance, SubTraitFilter } from 'components/SubTraitFilter';
import { FilterKeyEnum, FilterType, MenuCheckboxItemDataType, MenuCheckboxSelectType } from 'types/tokensPage';

export interface IMenuFilterProps {
  label: string;
  count?: string;
}

interface IMenuCheckboxItemProps {
  itemKey: FilterKeyEnum;
  parentLabel: string;
  parentValue: string;
  value: MenuCheckboxItemDataType[];
  onChange: (value: { [x: string]: MenuCheckboxSelectType }) => void;
}

const MenuCheckboxItem = forwardRef(
  ({ itemKey, parentLabel, parentValue, value, onChange }: IMenuCheckboxItemProps, ref) => {
    const subTraitFilterRef = useRef<ISubTraitFilterInstance>();

    useImperativeHandle(ref, () => ({
      clearSearch: () => subTraitFilterRef.current?.clearSearch(),
    }));

    const selectValues = useMemo(
      () => value.find((i) => i.value === parentValue)?.values?.map((i) => i.value) || [],
      [parentValue, value],
    );

    return (
      <SubTraitFilter
        ref={subTraitFilterRef}
        traitType={parentValue}
        selectValues={selectValues}
        onChange={(checkedValues) => {
          const otherData = value.filter((i) => i.value !== parentValue);
          onChange({
            [itemKey]: {
              type: FilterType.MenuCheckbox,
              data: [
                ...otherData,
                {
                  label: parentLabel,
                  value: parentValue,
                  values: checkedValues.map((i) => ({ label: i, value: i })),
                },
              ],
            },
          });
        }}
      />
    );
  },
);

interface IMenuFilterComponent extends React.FC<IMenuFilterProps> {
  child: typeof MenuCheckboxItem;
}

const MenuFilter: IMenuFilterComponent = ({ label, count }) => {
  return (
    <Flex justify="space-between" gap={16}>
      <span className="truncate">{label}</span>
      <span className="flex-none">{count ?? '0'}</span>
    </Flex>
  );
};

MenuFilter.child = MenuCheckboxItem;

export default MenuFilter;
