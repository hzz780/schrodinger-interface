import { ChainId } from '@portkey/types';
import CheckBoxGroups from 'components/CheckBoxGroups';
import MenuFilter from 'components/MenuFilter';
import { store } from 'redux/store';

export enum FilterType {
  Checkbox = 'Checkbox',
  MenuCheckbox = 'MenuCheckbox',
}

export type SourceItemType = {
  value: string | number;
  label: string;
  disabled?: boolean;
  count?: string;
};

export type MenuCheckboxItemDataType = {
  value: string;
  label: string;
  count?: string;
  values?: MenuCheckboxItemDataType[];
};

export enum FilterKeyEnum {
  Chain = 'Chain',
  Traits = 'Traits',
  Generation = 'Generation',
  Rarity = 'Rarity',
}

export const DEFAULT_FILTER_OPEN_KEYS = [FilterKeyEnum.Chain, FilterKeyEnum.Rarity];

export type CheckboxItemType = {
  key: FilterKeyEnum;
  title: string;
  type: FilterType.Checkbox;
  data: SourceItemType[];
  tips?: string;
  allItem?: SourceItemType;
};

export type MenuCheckboxItemType = {
  key: FilterKeyEnum;
  title: string;
  type: FilterType.MenuCheckbox;
  data: MenuCheckboxItemDataType[];
  tips?: string;
};

export const getFilterList = (ChainId: string): Array<CheckboxItemType | MenuCheckboxItemType> => {
  const filterList = [
    {
      key: FilterKeyEnum.Rarity,
      title: FilterKeyEnum.Rarity,
      type: FilterType.Checkbox,
      tips: 'Only Gen-9 Cats support Rarity filtering.',
      data: store.getState().info.cmsInfo?.rarityFilterItems || [],
      allItem: {
        label: 'All',
        value: 'All',
      },
    },
    {
      key: FilterKeyEnum.Chain,
      title: FilterKeyEnum.Chain,
      type: FilterType.Checkbox,
      data: [{ value: ChainId, label: `SideChain ${ChainId}`, disabled: true }],
    },
    {
      key: FilterKeyEnum.Traits,
      title: FilterKeyEnum.Traits,
      type: FilterType.MenuCheckbox,
      data: [],
    },
    {
      key: FilterKeyEnum.Generation,
      title: FilterKeyEnum.Generation,
      type: FilterType.Checkbox,
      data: [],
    },
  ];
  return filterList as Array<CheckboxItemType | MenuCheckboxItemType>;
};

export interface IFilterSelect {
  [FilterKeyEnum.Rarity]: {
    type: FilterType.Checkbox;
    data: Array<any>;
  };
  [FilterKeyEnum.Chain]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.Traits]: {
    type: FilterType.MenuCheckbox;
    data: MenuCheckboxItemDataType[];
  };
  [FilterKeyEnum.Generation]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
}

export const getDefaultFilter = (
  ChainId: string,
  defaultFilter?: {
    pathname?: string;
    rarityFilterItems:
      | {
          label: string;
          value: string;
        }[]
      | undefined;
  },
): IFilterSelect => {
  const { pathname, rarityFilterItems } = defaultFilter || {};
  const needRare = pathname && pathname === '/rare-cats';
  return {
    [FilterKeyEnum.Rarity]: {
      type: FilterType.Checkbox,
      data: needRare ? rarityFilterItems || [] : [],
    },
    [FilterKeyEnum.Chain]: {
      type: FilterType.Checkbox,
      data: [{ value: ChainId, label: `SideChain ${ChainId}`, disabled: true }],
    },
    [FilterKeyEnum.Traits]: {
      type: FilterType.MenuCheckbox,
      data: [],
    },
    [FilterKeyEnum.Generation]: {
      type: FilterType.Checkbox,
      data: [],
    },
  };
};

export type ItemsSelectSourceType = { [x: string]: CheckboxSelectType | MenuCheckboxSelectType };
export type CheckboxSelectType = {
  type: FilterType.Checkbox;
  data: SourceItemType[];
};
export type MenuCheckboxSelectType = {
  type: FilterType.MenuCheckbox;
  data: MenuCheckboxItemDataType[];
};

type TComponentMap = {
  [FilterType.Checkbox]: typeof CheckBoxGroups;
  [FilterType.MenuCheckbox]: typeof MenuFilter;
};

const COMPONENT_MAP: TComponentMap = {
  [FilterType.Checkbox]: CheckBoxGroups,
  [FilterType.MenuCheckbox]: MenuFilter,
};

export const getComponentByType = <T extends FilterType>(type: T): TComponentMap[T] => {
  return COMPONENT_MAP[type];
};

export const getFilter = (filterSelect: IFilterSelect) => {
  return {
    chainId: filterSelect.Chain.data[0].value as ChainId,
    traits: filterSelect.Traits.data.map((item) => ({
      traitType: item.value,
      values: item.values?.map((subItem) => subItem.value) || [],
    })),
    generations: filterSelect.Generation.data.map((item) => item.value) as number[],
    rarities: filterSelect.Rarity.data.map((item) => item.value) as string[],
  };
};

export const SEARCH_TAG_ITEM_TYPE = 'search';

export type TagItemType = {
  label: string;
  type: FilterKeyEnum | typeof SEARCH_TAG_ITEM_TYPE;
  value?: string | number;
  parentValue?: string;
  subValue?: string;
  disabled?: boolean;
};

export const getTagList = (filterSelect: IFilterSelect, search: string) => {
  const result: TagItemType[] = [];
  const entries = Object.entries(filterSelect) as [keyof IFilterSelect, IFilterSelect[keyof IFilterSelect]][];
  for (const [key, value] of entries) {
    const { data, type } = value;
    if (type === FilterType.Checkbox) {
      data.forEach((element) => {
        if (!element.disabled) {
          let label = element.label;
          if (key === FilterKeyEnum.Generation) {
            label = `Gen-${element.value}`;
          }
          result.push({
            type: key,
            ...element,
            label,
          });
        }
      });
    } else if (type === FilterType.MenuCheckbox) {
      data.forEach((element) => {
        element.values?.forEach((subItem) => {
          result.push({
            type: key,
            ...subItem,
            label: `${element.value} - ${subItem.value}`,
            value: `${element.value} - ${subItem.value}`,
            parentValue: element.value,
            subValue: subItem.value,
          });
        });
      });
    }
  }
  if (search) {
    result.push({
      type: SEARCH_TAG_ITEM_TYPE,
      label: search,
    });
  }

  return result;
};
