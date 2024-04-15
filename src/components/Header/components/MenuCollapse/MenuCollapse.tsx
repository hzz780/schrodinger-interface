import { Collapse } from 'aelf-design';
import { ICompassProps } from '../../type';
import React, { ReactElement } from 'react';
import { ReactComponent as ArrowIcon } from 'assets/img/right_arrow.svg';
import styles from './style.module.css';
import { useJoinStatus } from 'redux/hooks';
import { NEED_JOIN_PAGE } from 'constants/router';

interface IProps {
  title: ReactElement;
  item: ICompassProps;
  onPressCompassItems: (item: ICompassProps) => void;
}

function MenuCollapse({ title, item, onPressCompassItems }: IProps) {
  const isJoin = useJoinStatus();

  return (
    <Collapse
      ghost
      className={styles['menu-collapse']}
      items={[
        {
          key: item.title,
          label: title,
          children: item?.items
            ?.filter((val) => {
              if (!val.show) return false;
              if (val.schema && NEED_JOIN_PAGE.includes(val.schema)) {
                if (isJoin) return true;
                return false;
              } else {
                return true;
              }
            })
            .map((sub) => {
              return (
                <div
                  className="h-[56px] pr-[16px] pl-[40px] flex items-center justify-between"
                  key={sub.title}
                  onClick={() => onPressCompassItems(sub)}>
                  <span className="text-base font-medium text-neutralTitle">{sub.title}</span>
                  <ArrowIcon className="size-[14px]" />
                </div>
              );
            }),
        },
      ]}
    />
  );
}

export default React.memo(MenuCollapse);
