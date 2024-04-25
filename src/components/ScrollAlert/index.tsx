import { Alert, AlertProps, Carousel } from 'antd';
import clsx from 'clsx';
import React, { ReactNode, useMemo } from 'react';
import styles from './index.module.css';
import { ReactComponent as NoticeIcon } from 'assets/img/icons/notice.svg';

export interface IScrollAlertItem {
  text: string | ReactNode;
  handle?: Function;
}

const customizeAlertStyle: Record<
  string,
  {
    styles?: string;
    icon?: ReactNode;
  }
> = {
  notice: {
    styles: styles['alert-notice'],
    icon: <NoticeIcon />,
  },
};

export type TScrollAlertType = 'info' | 'warning' | 'success' | 'error' | 'notice';

type TProps = Omit<AlertProps, 'type'> & {
  data: IScrollAlertItem[];
  type?: TScrollAlertType;
};

function ScrollAlert(props: TProps) {
  const { data, type = 'warning' } = props;

  const antType: AlertProps['type'] = useMemo(() => {
    switch (type) {
      case 'notice':
        return 'warning';
      default:
        return type;
    }
  }, [type]);

  if (!data?.length) return null;

  return (
    <Alert
      className={clsx(styles['scroll-alert'], customizeAlertStyle?.[type] && customizeAlertStyle[type].styles)}
      message={
        <div>
          <Carousel autoplay vertical dots={false}>
            {data.map((item, index) => {
              return (
                <p
                  key={index}
                  onClick={() => item?.handle && item.handle()}
                  className={clsx(
                    'text-sm lg:text-base text-neutralPrimary font-semibold',
                    item.handle ? 'cursor-pointer' : 'cursor-default',
                  )}>
                  {item.text}
                </p>
              );
            })}
          </Carousel>
        </div>
      }
      {...props}
      type={antType}
      icon={props.icon || customizeAlertStyle?.[type].icon}
      showIcon
    />
  );
}

export default React.memo(ScrollAlert);
