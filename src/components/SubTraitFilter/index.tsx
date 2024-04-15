import { Checkbox } from 'antd';
import { useGetSubTraits } from 'graphqlServer';
import { useWalletService } from 'hooks/useWallet';
import { ChangeEvent, useCallback, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import { useCmsInfo } from 'redux/hooks';
import { TFilterSubTrait } from 'types/trait';
import Loading from 'components/Loading';
import { ZERO } from 'constants/misc';
import CommonSearch from 'components/CommonSearch';
import styles from './style.module.css';

type TSubTraitItem = Omit<TFilterSubTrait, 'amount'> & {
  amount: string;
};

export interface ISubTraitFilterProps {
  traitType: string;
  selectValues?: string[];
  defaultValue?: string[];
  onChange?: (checkedValue: string[]) => void;
}

export interface ISubTraitFilterInstance {
  clearSearch: () => void;
}

export const SubTraitFilter = forwardRef(
  ({ traitType, selectValues = [], defaultValue = [], onChange }: ISubTraitFilterProps, ref) => {
    const cmsInfo = useCmsInfo();
    const [isLoading, setIsLoading] = useState(false);
    const getSubTraits = useGetSubTraits();
    const { wallet } = useWalletService();
    const [list, setList] = useState<TSubTraitItem[]>([]);

    const getSubTraitList = useCallback(async () => {
      setIsLoading(true);
      try {
        const {
          data: {
            getTraits: { traitsFilter: traitsList },
          },
        } = await getSubTraits({
          input: {
            chainId: cmsInfo?.curChain || '',
            address: wallet.address || '',
            traitType,
          },
        });

        const trait = traitsList[0];
        const list: TSubTraitItem[] = trait.values.map((item) => ({
          ...item,
          amount: ZERO.plus(item.amount).toFormat(),
        }));

        setList(list);
      } catch (error) {
        console.log('getSubTraitList error', error);
      }

      setIsLoading(false);
    }, [cmsInfo?.curChain, getSubTraits, traitType, wallet.address]);

    useEffectOnce(() => {
      console.log('traitType', traitType, selectValues);
      getSubTraitList();
    });

    const [searchValue, setSearchValue] = useState('');
    const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    }, []);

    const clearSearch = useCallback(() => {
      setSearchValue('');
    }, []);

    useImperativeHandle(ref, () => ({
      clearSearch,
    }));

    const options = useMemo(() => {
      let _list = list;
      const _searchValue = searchValue.toLocaleUpperCase();
      if (searchValue) {
        _list = list.filter((item) => item.value.toLocaleUpperCase() === _searchValue);
      }

      return _list.map((item) => {
        return {
          label: (
            <div className="flex justify-between h-[44px] items-center gap-4">
              <span className="text-neutralPrimary truncate">{item.value}</span>
              <span className="text-neutralPrimary flex-none">{item.amount}</span>
            </div>
          ),
          value: item.value,
        };
      });
    }, [list, searchValue]);

    return (
      <div className={styles.subTraitFilter}>
        <div className={styles.searchWrapper}>
          <CommonSearch size="small" value={searchValue} placeholder="Search" onChange={onSearchChange} />
        </div>

        <Checkbox.Group
          value={selectValues}
          className="w-full flex-col"
          onChange={onChange}
          defaultValue={defaultValue}
          options={options}>
          {isLoading ? (
            <div className="h-[184px] flex items-center justify-center w-full">
              <Loading />
            </div>
          ) : (
            !options.length && (
              <div className="pl-4 pr-5 leading-[44px] text-neutralPrimary">No corresponding results found</div>
            )
          )}
        </Checkbox.Group>
      </div>
    );
  },
);
