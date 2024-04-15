import { ReactNode, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { List, ListProps } from 'antd';
import ItemCard from 'components/ItemCard';
import { TSGRItem } from 'types/tokens';
import { useDebounceFn } from 'ahooks';
import { PAGE_CONTAINER_ID } from 'constants/index';
import { CardType } from 'components/ItemCard';
import styles from './style.module.css';
import { ListGridType } from 'antd/es/list';

interface IContentProps {
  type: CardType;
  className?: string;
  grid: ListGridType;
  emptyText?: ReactNode;
  loadMore?: () => void;
  onPress: (item: TSGRItem) => void;
  ListProps: ListProps<TSGRItem>;
}

function ScrollContent(props: IContentProps) {
  const { ListProps, loadMore = () => null, type, grid, emptyText, onPress } = props;
  const { run } = useDebounceFn(loadMore, {
    wait: 100,
  });

  const handleScroll = useCallback(
    async (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.scrollHeight - target.scrollTop - target.clientHeight <= 75) {
        run();
      }
    },
    [run],
  );
  useEffect(() => {
    document.querySelector(`#${PAGE_CONTAINER_ID}`)?.addEventListener('scroll', handleScroll);
    return () => {
      document.querySelector(`#${PAGE_CONTAINER_ID}`)?.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className={clsx(styles.cardListWrapper, props.className)}>
      <List
        grid={grid}
        locale={{
          emptyText,
        }}
        renderItem={(item) => (
          <List.Item key={`${item.symbol}`}>
            <ItemCard type={type} item={item} onPress={onPress} />
          </List.Item>
        )}
        {...ListProps}
      />
    </div>
  );
}

export default ScrollContent;
