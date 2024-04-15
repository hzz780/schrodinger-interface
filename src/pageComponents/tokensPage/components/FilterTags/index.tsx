import { memo, useCallback, useMemo } from 'react';
import { FilterType, ItemsSelectSourceType, IFilterSelect, TagItemType, SEARCH_TAG_ITEM_TYPE } from '../../type';
import styles from './style.module.css';
import { ReactComponent as CloseIcon } from 'assets/img/close.svg';
import { Ellipsis } from 'antd-mobile';
import clsx from 'clsx';
import { OmittedType, getOmittedStr } from 'utils';

function FilterTags({
  filterSelect,
  onchange,
  tagList,
  clearAll,
  clearSearchChange,
}: {
  tagList: TagItemType[];
  filterSelect: IFilterSelect;
  onchange?: (result: ItemsSelectSourceType) => void;
  clearSearchChange?: () => void;
  clearAll?: () => void;
}) {
  const closeChange = useCallback(
    (tag: TagItemType) => {
      if (tag.type === SEARCH_TAG_ITEM_TYPE) {
        clearSearchChange && clearSearchChange();
      } else {
        const filter = filterSelect[tag.type];
        if (filter.type === FilterType.Checkbox) {
          const data = filter.data;
          const result = {
            [tag.type]: {
              ...filter,
              data: data.filter((item) => item.value !== tag.value),
            },
          };
          onchange && onchange(result);
        } else if (filter.type === FilterType.MenuCheckbox) {
          const data = filter.data;
          const result = {
            [tag.type]: {
              ...filter,
              data: data.map((item) => {
                if (item.value === tag.parentValue) {
                  return {
                    ...item,
                    values: item.values?.filter((subItem) => subItem.value !== tag.subValue),
                  };
                }
                return item;
              }),
            },
          };
          onchange && onchange(result);
        }
      }
    },
    [filterSelect, onchange, clearSearchChange],
  );
  const clearAllDom = useMemo(() => {
    return (
      <div className={styles.filter__button} onClick={clearAll}>
        Clear All
      </div>
    );
  }, [clearAll]);
  return tagList.length ? (
    <div className={clsx(styles['filter-tags'])}>
      <div className={styles['filter-tags-container']}>
        {tagList.map((tag, index) => {
          return (
            <div key={`${tag.label}_${index}`} className={styles['tag-item']}>
              {tag.type === SEARCH_TAG_ITEM_TYPE ? (
                <div>
                  <Ellipsis
                    className={clsx(styles['tag-label'], 'break-words')}
                    direction="middle"
                    content={getOmittedStr(tag.label, OmittedType.CUSTOM, { prevLen: 7, endLen: 6, limitLen: 13 })}
                  />
                </div>
              ) : (
                <span className={styles['tag-label']}>{tag.label}</span>
              )}
              <CloseIcon
                className={clsx(styles['tag-close'], tag.disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
                onClick={() => {
                  if (tag.disabled) return;
                  closeChange(tag);
                }}
              />
            </div>
          );
        })}
        {tagList.length && clearAllDom}
      </div>
    </div>
  ) : (
    <></>
  );
}

export default memo(FilterTags);
