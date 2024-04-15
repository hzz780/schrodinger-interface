import React, { useCallback, useMemo, useState } from 'react';
import CommonModal from 'components/CommonModal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useResponsive } from 'hooks/useResponsive';
import { Button } from 'aelf-design';
import { getAdoptErrorMessage } from 'hooks/Adopt/getErrorMessage';
import { singleMessage } from '@portkey/did-ui-react';
import styles from './index.module.css';
import clsx from 'clsx';
import { joinContent, joinTitle } from 'constants/joinMessage';

interface IProps {
  buttonInfo?: {
    btnText?: string;
    openLoading?: boolean;
    onConfirm?: () => void | Promise<any>;
  };
  onCancel?: <T, R>(params?: T) => R | void;
}

function JoinModal({ buttonInfo, onCancel }: IProps) {
  const modal = useModal();
  const { isLG } = useResponsive();

  const [loading, setLoading] = useState<boolean>(false);

  const onClick = useCallback(async () => {
    if (buttonInfo?.onConfirm) {
      if (buttonInfo.openLoading) {
        setLoading(true);
      }
      try {
        await buttonInfo.onConfirm();
        setLoading(false);
      } catch (error) {
        console.log(error, 'error==');
        const _error = getAdoptErrorMessage(error);
        console.log(_error, 'errorMessage');

        singleMessage.error(_error);
      } finally {
        setLoading(false);
      }

      return;
    }
    modal.hide();
    return;
  }, [buttonInfo, modal]);

  const modalFooter = useMemo(() => {
    return (
      <div className="flex flex-1 lg:flex-none flex-col justify-center items-center">
        <div className={clsx('w-full flex flex-col items-center', styles['button-wrapper'])}>
          <Button
            type="primary"
            size="ultra"
            loading={loading}
            className={`${isLG ? 'w-full' : '!w-[256px]'}`}
            onClick={onClick}>
            {buttonInfo?.btnText || 'Join'}
          </Button>
        </div>
      </div>
    );
  }, [buttonInfo?.btnText, isLG, loading, onClick]);

  return (
    <CommonModal
      title={
        <p className="flex flex-nowrap">
          <span className="text-neutralTitle font-semibold text-xl lg:text-2xl">{joinTitle}</span>
        </p>
      }
      width={500}
      disableMobileLayout={true}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={onCancel || modal.hide}
      afterClose={modal.remove}
      footer={modalFooter}>
      <div className="w-full h-full flex flex-col">{joinContent}</div>
    </CommonModal>
  );
}

export default NiceModal.create(JoinModal);
