import { ICompassProps, RouterItemType } from '../type';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import styles from '../style.module.css';
import clsx from 'clsx';

export const CompassText = (props: { title?: string; schema?: string }) => {
  const pathname = usePathname();
  const isCurrent = pathname?.toLocaleLowerCase() === props.schema?.toLowerCase();

  return (
    <span
      className={clsx(
        styles['header-menu'],
        `!rounded-[12px] text-lg ${
          isCurrent ? '!text-brandDefault' : ''
        } hover:text-brandHover cursor-pointer font-medium`,
      )}>
      {props.title}
    </span>
  );
};

export interface ICompassLinkProps {
  item: ICompassProps;
  className?: string;
  onPressCompassItems?: (item: ICompassProps) => void;
}

export const CompassLink = ({ item, className, onPressCompassItems }: ICompassLinkProps) => {
  const { schema, type, title } = item;
  const isOut = type === RouterItemType.Out || !type;
  const renderCom = <CompassText title={title} schema={schema} />;
  const onPress = useCallback(
    (event: any) => {
      event.preventDefault();
      onPressCompassItems && onPressCompassItems(item);
    },
    [item, onPressCompassItems],
  );

  return isOut ? (
    <Link className={className} href={schema || ''} scroll={false}>
      {renderCom}
    </Link>
  ) : (
    <span className={className} onClick={onPress}>
      {renderCom}
    </span>
  );
};
