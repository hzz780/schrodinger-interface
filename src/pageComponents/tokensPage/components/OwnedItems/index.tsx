import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getDefaultFilter,
  getComponentByType,
  getFilter,
  getFilterList,
  IFilterSelect,
  ItemsSelectSourceType,
  getTagList,
  DEFAULT_FILTER_OPEN_KEYS,
  FilterType,
  MenuCheckboxItemDataType,
  FilterKeyEnum,
  CheckboxItemType,
  MenuCheckboxItemType,
} from '../../type';
import clsx from 'clsx';
import { Flex, Layout, MenuProps, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import CommonSearch from 'components/CommonSearch';
import { ISubTraitFilterInstance } from 'components/SubTraitFilter';
import FilterTags from '../FilterTags';
import { CollapseForPC, CollapseForPhone } from '../FilterContainer';
import FilterMenuEmpty from '../FilterMenuEmpty';
// import ScrollContent from '../ScrollContent';
import { divDecimals, getPageNumber } from 'utils/calculate';
import { useDebounceFn } from 'ahooks';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as CollapsedSVG } from 'assets/img/collapsed.svg';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import useLoading from 'hooks/useLoading';
import { useWalletService } from 'hooks/useWallet';
import { store } from 'redux/store';
import { useGetTraits } from 'graphqlServer';
import { ZERO } from 'constants/misc';
import { TSGRItem } from 'types/tokens';
import { ToolTip } from 'aelf-design';
import { catsList } from 'api/request';
import ScrollContent from 'components/ScrollContent';
import { CardType } from 'components/ItemCard';
import useColumns from 'hooks/useColumns';
import { EmptyList } from 'components/EmptyList';
import { useRouter } from 'next/navigation';

export default function OwnedItems() {
  const { wallet } = useWalletService();
  // 1024 below is the mobile display
  const { isLG, is2XL, is3XL, is4XL, is5XL } = useResponsive();
  const isMobile = useMemo(() => isLG, [isLG]);
  const [collapsed, setCollapsed] = useState(!isLG);
  const [ownedTotal, setOwnedTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchParam, setSearchParam] = useState('');
  const cmsInfo = store.getState().info.cmsInfo;
  const curChain = cmsInfo?.curChain || '';
  const [filterList, setFilterList] = useState(getFilterList(curChain));
  const defaultFilter = useMemo(() => getDefaultFilter(curChain), [curChain]);
  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);
  const [tempFilterSelect, setTempFilterSelect] = useState<IFilterSelect>(defaultFilter);
  const [current, SetCurrent] = useState(1);
  const [dataSource, setDataSource] = useState<TSGRItem[]>();
  const { showLoading, closeLoading, visible: isLoading } = useLoading();
  const pageSize = 32;
  const gutter = useMemo(() => (isLG ? 12 : 20), [isLG]);
  const column = useColumns(collapsed);
  const router = useRouter();
  const walletAddress = useMemo(() => wallet.address, [wallet.address]);
  const filterListRef = useRef<any>();

  const siderWidth = useMemo(() => {
    if (is2XL) {
      return '25%';
    } else if (is3XL) {
      return '22%';
    } else if (is4XL) {
      return '20%';
    } else if (is5XL) {
      return '21%';
    } else {
      return 368;
    }
  }, [is2XL, is3XL, is4XL, is5XL]);

  const options = [
    { label: 'My cats', value: 1 },
    { label: 'View all', value: 2 },
  ];

  const [pageState, setPageState] = useState(1);
  const [searchAddress, setSearchAddress] = useState<string | undefined>(undefined);

  const handleRadioChange = ({ target: { value } }: RadioChangeEvent) => {
    setPageState(value);
    // clear all status
    handleBaseClearAll();
    const filterList: any[] = [];
    Object.assign(filterList, filterListRef.current);

    if (value === 2) {
      delete filterList[3];
    }
    setFilterList(filterList);
    setSearchAddress(value === 1 ? undefined : walletAddress);
  };

  useEffect(() => {
    fetchData({ params: requestParams });
  }, [searchAddress]);

  const defaultRequestParams = useMemo(() => {
    const filter = getFilter(defaultFilter);
    return {
      ...filter,
      address: walletAddress,
      skipCount: 0,
      maxResultCount: pageSize,
    };
  }, [defaultFilter, walletAddress]);
  const requestParams = useMemo(() => {
    const filter = getFilter(filterSelect);
    return {
      ...filter,
      address: pageState === 1 ? walletAddress : undefined,
      skipCount: getPageNumber(current, pageSize),
      maxResultCount: pageSize,
      keyword: searchParam,
      searchAddress,
    };
  }, [filterSelect, walletAddress, current, searchParam, pageState]);

  const fetchData = useCallback(
    async ({ params, loadMore = false }: { params: ICatsListParams; loadMore?: boolean }) => {
      if (!params.chainId) {
        return;
      }
      showLoading();
      try {
        const res = await catsList(params);

        setTotal(res.totalCount ?? 0);
        const hasSearch =
          params.traits?.length || params.generations?.length || !!params.keyword || params.rarities?.length;
        if (!hasSearch) {
          setOwnedTotal(res.totalCount ?? 0);
        }
        const data = (res.data || []).map((item) => {
          return {
            ...item,
            amount: divDecimals(item.amount, item.decimals).toFixed(),
          };
        });

        if (loadMore) {
          setDataSource((preData) => [...(preData || []), ...data]);
        } else {
          setDataSource(data);
        }
      } catch {
        setDataSource((preData) => preData || []);
      } finally {
        closeLoading();
      }
    },
    [closeLoading, showLoading],
  );

  useEffect(() => {
    fetchData({
      params: defaultRequestParams,
    });
  }, [fetchData, defaultRequestParams]);

  const getTraits = useGetTraits();

  const getFilterListData = useCallback(async () => {
    try {
      const {
        data: {
          getTraits: { traitsFilter, generationFilter },
        },
      } = await getTraits({
        input: {
          chainId: curChain,
          address: walletAddress,
        },
      });
      const traitsList =
        traitsFilter?.map((item) => ({
          label: item.traitType,
          value: item.traitType,
          count: ZERO.plus(item.amount).toFormat(),
        })) || [];
      const generationList =
        generationFilter?.map((item) => ({
          label: String(item.generationName),
          value: item.generationName,
          count: ZERO.plus(item.generationAmount).toFormat(),
        })) || [];
      setFilterList((preFilterList) => {
        const newFilterList = preFilterList.map((item) => {
          if (item.key === FilterKeyEnum.Traits) {
            return { ...item, data: traitsList };
          } else if (item.key === FilterKeyEnum.Generation) {
            return { ...item, data: generationList } as CheckboxItemType;
          }
          return item;
        });
        filterListRef.current = newFilterList;
        return newFilterList;
      });
    } catch (error) {
      console.log('getTraitList error', error);
    }
  }, [curChain, getTraits, walletAddress]);

  useEffect(() => {
    getFilterListData();
  }, [getFilterListData]);

  const applyFilter = useCallback(
    (newFilterSelect: IFilterSelect = tempFilterSelect) => {
      setFilterSelect(newFilterSelect);
      const filter = getFilter(newFilterSelect);
      SetCurrent(1);
      fetchData({ params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize) } });
    },
    [tempFilterSelect, fetchData, requestParams],
  );

  const filterChange = useCallback(
    (val: ItemsSelectSourceType) => {
      const newFilterSelect = { ...filterSelect, ...val };
      setTempFilterSelect(newFilterSelect);
      if (!isMobile || !collapsed) {
        applyFilter(newFilterSelect);
      }
    },
    [filterSelect, isMobile, collapsed, applyFilter, pageState],
  );

  const compChildRefs = useMemo(() => {
    const refs: { [key: string]: React.RefObject<ISubTraitFilterInstance> } = {};
    filterList?.forEach((item) => {
      if (item.type === FilterType.MenuCheckbox && item.data.length > 0) {
        item.data.forEach((subItem) => {
          refs[subItem.value] = React.createRef();
        });
      }
    });
    return refs;
  }, [filterList]);

  const clearAllCompChildSearches = useCallback(() => {
    Object.values(compChildRefs).forEach((ref) => {
      ref.current?.clearSearch?.();
    });
  }, [compChildRefs]);

  useEffect(() => {
    if (isMobile && !collapsed) {
      clearAllCompChildSearches();
    }
  }, [isMobile, collapsed, clearAllCompChildSearches]);

  const renderCollapseItemsLabel = useCallback(
    ({ title, tips }: { title: string; tips?: string }) => {
      return (
        <div className="flex items-center h-[26px]">
          {title}
          {tips ? (
            <ToolTip title={tips} trigger={isLG ? 'click' : 'hover'}>
              <div className="px-[8px] h-full flex items-center" onClick={(e) => e.stopPropagation()}>
                <QuestionSVG />
              </div>
            </ToolTip>
          ) : null}
        </div>
      );
    },
    [isLG],
  );

  const collapseItems = useMemo(() => {
    return filterList?.map((item) => {
      const value = tempFilterSelect[item.key]?.data;
      let children: Required<MenuProps>['items'] = [];
      if (item.type === FilterType.Checkbox) {
        const Comp = getComponentByType(item.type);
        children = [
          {
            key: item.key,
            label: <Comp dataSource={item} defaultValue={value} onChange={filterChange} />,
          },
        ];
      } else if (item.type === FilterType.MenuCheckbox) {
        const Comp = getComponentByType(item.type);
        if (item.data.length === 0) {
          children = [
            {
              key: item.key,
              label: <FilterMenuEmpty />,
            },
          ];
        } else {
          children = item.data.map((subItem) => {
            return {
              key: subItem.value,
              label: <Comp label={subItem.label} count={subItem.count} />,
              children: [
                {
                  key: subItem.value,
                  label: (
                    <Comp.child
                      ref={compChildRefs[subItem.value]}
                      itemKey={item.key}
                      parentLabel={subItem.label}
                      parentValue={subItem.value}
                      value={value as MenuCheckboxItemDataType[]}
                      onChange={filterChange}
                    />
                  ),
                },
              ],
            };
          });
        }
      }
      return {
        key: item.key,
        label: renderCollapseItemsLabel({
          title: item.title,
          tips: item?.tips,
        }),
        children,
      };
    });
  }, [filterList, tempFilterSelect, renderCollapseItemsLabel, filterChange, compChildRefs]);

  const collapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const { run } = useDebounceFn(
    (value) => {
      SetCurrent(1);
      fetchData({ params: { ...requestParams, keyword: value, skipCount: getPageNumber(1, pageSize) } });
    },
    {
      wait: 500,
    },
  );

  const handleBaseClearAll = useCallback(() => {
    SetCurrent(1);
    setFilterSelect(defaultFilter);
    setTempFilterSelect(defaultFilter);
  }, [defaultFilter]);

  const handleFilterClearAll = useCallback(() => {
    handleBaseClearAll();
    const filter = getFilter(defaultFilter);
    fetchData({ params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize) } });
    setCollapsed(false);
  }, [defaultFilter, fetchData, handleBaseClearAll, requestParams]);

  const handleTagsClearAll = useCallback(() => {
    setSearchParam('');
    handleBaseClearAll();
    const filter = getFilter(defaultFilter);
    fetchData({ params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize), keyword: '' } });
  }, [defaultFilter, fetchData, handleBaseClearAll, requestParams]);

  const symbolChange = (e: any) => {
    setSearchParam(e.target.value);
    run(e.target.value);
  };

  const clearSearchChange = () => {
    setSearchParam('');
    SetCurrent(1);
    fetchData({ params: { ...requestParams, keyword: '', skipCount: getPageNumber(1, pageSize) } });
  };

  const hasMore = useMemo(() => {
    return !!(dataSource && total > dataSource.length);
  }, [total, dataSource]);

  const tagList = useMemo(() => {
    return getTagList(filterSelect, searchParam);
  }, [filterSelect, searchParam]);

  const loadMoreData = useCallback(() => {
    if (isLoading || !hasMore) return;
    SetCurrent(current + 1);
    fetchData({
      params: {
        ...requestParams,
        skipCount: getPageNumber(current + 1, pageSize),
      },
      loadMore: true,
    });
  }, [isLoading, hasMore, current, fetchData, requestParams]);

  const emptyText = useMemo(() => {
    return (
      dataSource && (
        <Flex className="pt-0 lg:pt-6" justify="center" align="center">
          <EmptyList isChannelShow={!ownedTotal} defaultDescription="No inscriptions found" />
        </Flex>
      )
    );
  }, [dataSource, ownedTotal]);
  const onPress = useCallback(
    (item: TSGRItem) => {
      router.push(`/detail?symbol=${item.symbol}&address=${item.address}`);
    },
    [router],
  );

  return (
    <div>
      <Flex
        className="pb-2 border-0 border-b border-solid border-neutralDivider text-neutralTitle w-full"
        align="center"
        justify="space-between">
        <div>
          <span className="text-2xl font-semibold pr-[8px]">Amount Owned</span>
          <span className="text-base font-semibold">({total})</span>
        </div>
        <Radio.Group
          className="min-w-[179px]"
          options={options}
          onChange={handleRadioChange}
          value={pageState}
          optionType="button"
        />
      </Flex>
      <Layout>
        {isMobile ? (
          <CollapseForPhone
            items={collapseItems}
            defaultOpenKeys={DEFAULT_FILTER_OPEN_KEYS}
            showDropMenu={collapsed}
            onCloseHandler={() => {
              setCollapsed(false);
              setTempFilterSelect(filterSelect);
            }}
            handleClearAll={handleFilterClearAll}
            handleApply={() => {
              applyFilter();
              setCollapsed(false);
            }}
          />
        ) : (
          <Layout.Sider
            collapsedWidth={0}
            className={clsx('!bg-[var(--bg-page)] m-0 mt-5', collapsed && '!mr-5')}
            width={collapsed ? siderWidth : 0}
            trigger={null}>
            {collapsed && <CollapseForPC items={collapseItems} defaultOpenKeys={DEFAULT_FILTER_OPEN_KEYS} />}
          </Layout.Sider>
        )}

        <Layout className="!bg-[var(--bg-page)] relative">
          <Flex
            className={clsx('bg-neutralWhiteBg z-[50] pb-5 pt-6 lg:pt-5', !isLG && 'sticky top-0')}
            vertical
            gap={12}>
            <Flex gap={16}>
              <Flex
                className="flex-none size-12 border border-solid border-brandDefault rounded-lg cursor-pointer"
                justify="center"
                align="center"
                onClick={collapsedChange}>
                <CollapsedSVG />
              </Flex>
              <CommonSearch
                placeholder="Search for an inscription symbol or name"
                value={searchParam}
                onChange={symbolChange}
                onPressEnter={symbolChange}
              />
            </Flex>
            <FilterTags
              tagList={tagList}
              filterSelect={filterSelect}
              clearAll={handleTagsClearAll}
              onchange={filterChange}
              clearSearchChange={clearSearchChange}
            />
          </Flex>
          <ScrollContent
            type={CardType.MY}
            grid={{ gutter, column }}
            emptyText={emptyText}
            onPress={onPress}
            loadMore={loadMoreData}
            ListProps={{ dataSource }}
          />
        </Layout>
      </Layout>
    </div>
  );
}
