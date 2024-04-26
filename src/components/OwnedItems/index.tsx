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
} from 'types/tokensPage';
import { ListTypeEnum } from 'types';
import clsx from 'clsx';
import { Flex, Layout, MenuProps } from 'antd';
import CommonSearch from 'components/CommonSearch';
import { ISubTraitFilterInstance } from 'components/SubTraitFilter';
import FilterTags from '../FilterTags';
import { CollapseForPC, CollapseForPhone } from '../FilterContainer';
import { divDecimals, getPageNumber } from 'utils/calculate';
import { useDebounceFn } from 'ahooks';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as CollapsedSVG } from 'assets/img/collapsed.svg';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import useLoading from 'hooks/useLoading';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { store } from 'redux/store';
import {
  TGetAllTraitsParams,
  TGetAllTraitsResult,
  TGetTraitsParams,
  TGetTraitsResult,
  useGetAllTraits,
  useGetTraits,
} from 'graphqlServer';
import { ZERO } from 'constants/misc';
import { TSGRItem } from 'types/tokens';
import { Button, ToolTip } from 'aelf-design';
import { catsList, catsListAll } from 'api/request';
import ScrollContent from 'components/ScrollContent';
import { CardType } from 'components/ItemCard';
import useColumns from 'hooks/useColumns';
import { EmptyList } from 'components/EmptyList';
import { usePathname, useRouter } from 'next/navigation';
import qs from 'qs';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import ScrollAlert, { IScrollAlertItem } from 'components/ScrollAlert';
import { setCurViewListType } from 'redux/reducer/info';

export default function OwnedItems({
  pageState = ListTypeEnum.All,
  noticeData,
}: {
  pageState?: ListTypeEnum;
  noticeData?: IScrollAlertItem[];
}) {
  const pathname = usePathname();
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
  const defaultFilter = useMemo(
    () =>
      getDefaultFilter(curChain, {
        pathname,
        rarityFilterItems: cmsInfo?.rarityFilterItems,
      }),
    [cmsInfo?.rarityFilterItems, curChain, pathname],
  );

  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);
  const [tempFilterSelect, setTempFilterSelect] = useState<IFilterSelect>(defaultFilter);
  const [current, setCurrent] = useState(1);
  const [dataSource, setDataSource] = useState<TSGRItem[]>();
  const { showLoading, closeLoading, visible: isLoading } = useLoading();
  const pageSize = 32;
  const gutter = useMemo(() => (isLG ? 12 : 20), [isLG]);
  const column = useColumns(collapsed);
  const router = useRouter();
  const walletAddress = useMemo(() => wallet.address, [wallet.address]);
  const filterListRef = useRef<any>();
  const walletAddressRef = useRef(walletAddress);
  const { isLogin } = useGetLoginStatus();
  const { checkLogin } = useCheckLoginAndToken();

  useEffect(() => {
    walletAddressRef.current = walletAddress;
  }, [walletAddress]);

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

  const defaultRequestParams = useMemo(() => {
    const filter = getFilter(defaultFilter);
    return {
      ...filter,
      skipCount: 0,
      maxResultCount: pageSize,
    };
  }, [defaultFilter]);

  const requestParams = useMemo(() => {
    const filter = getFilter(filterSelect);
    return {
      ...filter,
      skipCount: getPageNumber(current, pageSize),
      maxResultCount: pageSize,
      keyword: searchParam,
    };
  }, [filterSelect, current, searchParam]);

  const fetchData = useCallback(
    async ({
      params,
      loadMore = false,
      requestType,
    }: {
      params: ICatsListParams;
      loadMore?: boolean;
      requestType: ListTypeEnum;
    }) => {
      if (!params.chainId) {
        return;
      }
      showLoading();
      const requestCatApi = requestType === ListTypeEnum.My ? catsList : catsListAll;
      try {
        const res = await requestCatApi(params);
        const total = res.totalCount ?? 0;
        setTotal(total);
        const hasSearch =
          params.traits?.length || params.generations?.length || !!params.keyword || params.rarities?.length;
        if (!hasSearch) {
          setOwnedTotal(total);
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
        setCurrent((count) => {
          return ++count;
        });
      } catch {
        setDataSource((preData) => preData || []);
      } finally {
        closeLoading();
      }
    },
    [closeLoading, showLoading],
  );

  useEffect(() => {
    setDataSource([]);
    setTotal(0);
  }, [pageState]);

  useEffect(() => {
    setSearchParam('');
    fetchData({
      params: defaultRequestParams,
      requestType: pageState,
    });
  }, [defaultRequestParams, fetchData, pageState, isLogin]);

  const getTraits = useGetTraits();
  const getAllTraits = useGetAllTraits();

  const getFilterListData = useCallback(
    async ({ type }: { type: ListTypeEnum }) => {
      const currentWalletAddress = walletAddressRef.current;
      const requestApi = type === ListTypeEnum.All ? getAllTraits : getTraits;
      const reqParams: {
        chainId: string;
        address?: string;
      } = {
        chainId: curChain,
        address: currentWalletAddress,
      };
      if (type === ListTypeEnum.All) {
        delete reqParams.address;
      }
      try {
        const { data } = await requestApi({
          input: reqParams,
        } as TGetTraitsParams & TGetAllTraitsParams);
        const { traitsFilter, generationFilter } =
          type === ListTypeEnum.All ? (data as TGetAllTraitsResult).getAllTraits : (data as TGetTraitsResult).getTraits;
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
    },
    [curChain, getAllTraits, getTraits],
  );

  useEffect(() => {
    getFilterListData({ type: pageState });
  }, [getFilterListData, pageState]);

  const applyFilter = useCallback(
    (newFilterSelect: IFilterSelect = tempFilterSelect) => {
      setFilterSelect(newFilterSelect);
      const filter = getFilter(newFilterSelect);
      setCurrent(1);
      fetchData({
        params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize) },
        requestType: pageState,
      });
    },
    [tempFilterSelect, fetchData, requestParams, pageState],
  );

  const filterChange = useCallback(
    (val: ItemsSelectSourceType) => {
      const newFilterSelect = { ...filterSelect, ...val };
      setTempFilterSelect(newFilterSelect);
      if (!isMobile || !collapsed) {
        applyFilter(newFilterSelect);
      }
    },
    [filterSelect, isMobile, collapsed, applyFilter],
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
    return filterList
      ?.map((item) => {
        const value = tempFilterSelect[item.key]?.data;
        let children: Required<MenuProps>['items'] = [];
        if (item.type === FilterType.Checkbox) {
          const Comp = getComponentByType(item.type);
          if (item.data.length) {
            children = [
              {
                key: item.key,
                label: <Comp dataSource={item} defaultValue={value} onChange={filterChange} />,
              },
            ];
          }
        } else if (item.type === FilterType.MenuCheckbox) {
          const Comp = getComponentByType(item.type);
          if (item.data.length) {
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
        return children.length
          ? {
              key: item.key,
              label: renderCollapseItemsLabel({
                title: item.title,
                tips: item?.tips,
              }),
              children,
            }
          : undefined;
      })
      .filter((i) => i) as ItemType[];
  }, [filterList, tempFilterSelect, renderCollapseItemsLabel, filterChange, compChildRefs]);

  const collapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const { run } = useDebounceFn(
    (value) => {
      setCurrent(1);
      fetchData({
        params: { ...requestParams, keyword: value, skipCount: getPageNumber(1, pageSize) },
        requestType: pageState,
      });
    },
    {
      wait: 500,
    },
  );

  const handleBaseClearAll = useCallback(
    (filterData?: IFilterSelect) => {
      setCurrent(1);
      setFilterSelect(filterData || defaultFilter);
      setTempFilterSelect(filterData || defaultFilter);
    },
    [defaultFilter],
  );

  const handleFilterClearAll = useCallback(() => {
    const filterData = getDefaultFilter(curChain);
    handleBaseClearAll(filterData);
    const filter = getFilter(filterData);
    fetchData({
      params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize) },
      requestType: pageState,
    });
    setCollapsed(false);
  }, [curChain, fetchData, handleBaseClearAll, pageState, requestParams]);

  const handleTagsClearAll = useCallback(() => {
    const filterData = getDefaultFilter(curChain);
    setSearchParam('');
    handleBaseClearAll(filterData);
    const filter = getFilter(filterData);
    fetchData({
      params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize), keyword: '' },
      requestType: pageState,
    });
  }, [curChain, fetchData, handleBaseClearAll, pageState, requestParams]);

  const symbolChange = (e: any) => {
    setSearchParam(e.target.value);
    run(e.target.value);
  };

  const clearSearchChange = () => {
    setSearchParam('');
    setCurrent(1);
    fetchData({
      params: { ...requestParams, keyword: '', skipCount: getPageNumber(1, pageSize) },
      requestType: pageState,
    });
  };

  const hasMore = useMemo(() => {
    return !!(dataSource && total > dataSource.length);
  }, [total, dataSource]);

  const tagList = useMemo(() => {
    return getTagList(filterSelect, searchParam);
  }, [filterSelect, searchParam]);

  const loadMoreData = useCallback(() => {
    if (isLoading || !hasMore) return;
    fetchData({
      params: {
        ...requestParams,
        skipCount: getPageNumber(current, pageSize),
      },
      loadMore: true,
      requestType: pageState,
    });
  }, [isLoading, hasMore, current, fetchData, requestParams, pageState]);

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
      const params = qs.stringify({
        symbol: item.symbol,
        from: pageState === ListTypeEnum.All ? 'all' : 'my',
      });

      router.push(`/detail?${params}`);
    },
    [pageState, router],
  );

  const toMyCats = useCallback(() => {
    if (isLogin) {
      router.push('/my-cats');
    } else {
      checkLogin({
        onSuccess: () => {
          router.push('/my-cats');
          store.dispatch(setCurViewListType(ListTypeEnum.My));
        },
      });
    }
  }, [checkLogin, isLogin, router]);

  useEffect(() => {
    // clear all status
    handleBaseClearAll();
  }, [handleBaseClearAll, pageState]);

  const renderTotalAmount = useMemo(() => {
    if (pageState === ListTypeEnum.All) {
      return (
        <span
          className="text-2xl font-semibold min-w-max"
          style={{
            width: siderWidth,
          }}>{`${total} ${total > 1 ? 'Cats' : 'Cat'}`}</span>
      );
    }
    return (
      <div>
        <span className="text-2xl font-semibold pr-[8px]">Amount Owned</span>
        <span className="text-base font-semibold">({total})</span>
      </div>
    );
  }, [pageState, siderWidth, total]);

  return (
    <div>
      {isLG && noticeData?.length ? (
        <div className="flex-1 mb-[24px] overflow-hidden">
          <ScrollAlert data={noticeData} type="notice" />
        </div>
      ) : null}
      <Flex
        className="pb-2 border-0 border-b border-solid border-neutralDivider text-neutralTitle w-full"
        align="center"
        justify="space-between">
        {renderTotalAmount}
        {pageState === ListTypeEnum.All ? (
          <div
            className={clsx(
              'flex-1 flex items-center overflow-hidden',
              noticeData?.length ? 'justify-end lg:justify-between' : 'justify-end',
            )}>
            {!isLG && noticeData?.length ? (
              <div className="flex-1 mr-[40px] overflow-hidden h-[48px]">
                <ScrollAlert data={noticeData} type="notice" />
              </div>
            ) : null}

            {!isLG ? (
              <Button type="primary" size="large" onClick={toMyCats}>
                Get Your Own Cat
              </Button>
            ) : null}
          </div>
        ) : null}
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

      {isLG && pageState === ListTypeEnum.All ? (
        <div className="flex z-[60] fixed bottom-0 left-0 flex-row w-full p-[16px] bg-neutralWhiteBg border-0 border-t border-solid border-neutralDivider ">
          <Button className="w-full" type="primary" size="large" onClick={toMyCats}>
            Get Your Own Cat
          </Button>
        </div>
      ) : null}
    </div>
  );
}
