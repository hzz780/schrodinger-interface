import { useMemo } from 'react';
import { Drawer, Flex, Menu, MenuProps } from 'antd';
import { Button } from 'aelf-design';
import { ReactComponent as CloseSVG } from 'assets/img/close.svg';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import styles from './style.module.css';

function CollapseForPC(props: MenuProps) {
  return (
    <Menu
      {...props}
      expandIcon={<ArrowSVG />}
      className={`${styles['items-side-menu']}`}
      selectable={false}
      mode="inline"
    />
  );
}

interface IDropMenu extends MenuProps {
  showDropMenu: boolean;
  onCloseHandler: () => void;
  handleClearAll: () => void;
  handleApply: () => void;
  titleTxt?: string;
  wrapClassName?: string;
}

const CollapseForPhone = ({
  showDropMenu,
  items,
  onCloseHandler,
  handleClearAll,
  handleApply,
  titleTxt = 'Filter',
  ...params
}: IDropMenu) => {
  const footer = useMemo(() => {
    return (
      <>
        <Flex className={styles['footer-wrapper']} gap={16}>
          <Button className={styles['footer-button']} type="primary" ghost onClick={handleClearAll}>
            Clear All
          </Button>
          <Button className={styles['footer-button']} type="primary" onClick={handleApply}>
            Apply
          </Button>
        </Flex>
      </>
    );
  }, [handleApply, handleClearAll]);
  return (
    <Drawer
      className={`${styles['dropdown-phone-dark']} ${params.wrapClassName || ''}`}
      placement="top"
      maskClosable={false}
      title={
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-neutralTitle">{titleTxt}</span>
          <CloseSVG className="size-4" onClick={onCloseHandler} />
        </div>
      }
      closeIcon={null}
      push={false}
      open={showDropMenu}
      height={'100%'}
      footer={footer}
      onClose={onCloseHandler}>
      <div>
        <CollapseForPC items={items} {...params} />
      </div>
    </Drawer>
  );
};

export { CollapseForPC, CollapseForPhone };
