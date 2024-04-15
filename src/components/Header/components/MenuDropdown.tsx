import { Dropdown } from 'aelf-design';
import styles from '../style.module.css';
import { ICompassProps } from '../type';
import { CompassLink, CompassText } from './CompassLink';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import clsx from 'clsx';
import { ReactComponent as ArrowDownIcon } from 'assets/img/arrow.svg';
import React, { useMemo, useState } from 'react';
import { useJoinStatus } from 'redux/hooks';
import { NEED_JOIN_PAGE } from 'constants/router';

interface IProps {
  title?: string;
  schema?: string;
  items: ICompassProps[];
  onPressCompassItems: (item: ICompassProps) => void;
}

function MenuDropdown({ title, items, schema, onPressCompassItems }: IProps) {
  const [rotate, setRotate] = useState<boolean>(false);
  const isJoin = useJoinStatus();

  const onOpenChange = (open: boolean) => {
    if (open) {
      setRotate(true);
    } else {
      setRotate(false);
    }
  };

  const subMenuItems = useMemo(() => {
    return items
      .filter((val) => {
        if (!val.show) return false;
        if (val.schema && NEED_JOIN_PAGE.includes(val.schema)) {
          if (isJoin) return true;
          return false;
        } else {
          return true;
        }
      })
      .map((sub) => {
        return {
          key: sub.title,
          label: (
            <CompassLink
              key={sub.title}
              item={sub}
              className={clsx('text-neutralPrimary rounded-[12px] hover:text-brandHover', styles.menuItem)}
              onPressCompassItems={onPressCompassItems}
            />
          ),
        } as ItemType;
      });
  }, [isJoin, items, onPressCompassItems]);

  return (
    <Dropdown
      key={title}
      overlayClassName={styles.dropdown}
      placement="bottomLeft"
      onOpenChange={onOpenChange}
      menu={{
        items: subMenuItems,
      }}>
      <span className={clsx('flex justify-center items-center', styles['menu-dropdown-title'])}>
        <CompassText title={title} schema={schema} />
        <ArrowDownIcon
          className={clsx(
            'w-[16px] h-[16px] ml-[8px] hover:fill-brandDefault transition-transform',
            styles['menu-dropdown-arrow'],
            rotate && styles.rotate,
          )}
        />
      </span>
    </Dropdown>
  );
}

export default React.memo(MenuDropdown);
