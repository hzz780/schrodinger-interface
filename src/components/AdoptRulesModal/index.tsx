import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import CommonModal from 'components/CommonModal';
import { useCallback, useMemo } from 'react';

import { useCmsInfo } from 'redux/hooks';

function AdoptRulesModal() {
  const modal = useModal();
  const cmsInfo = useCmsInfo();

  const adoptRuleList: string[] = useMemo(() => {
    return cmsInfo?.adoptRuleList || [];
  }, [cmsInfo]);

  const onCancel = useCallback(() => {
    modal.hide();
  }, [modal]);

  const confirmBtn = useMemo(
    () => (
      <Button className="md:w-[356px]" onClick={onCancel} type="primary">
        OK
      </Button>
    ),
    [onCancel],
  );

  return (
    <CommonModal
      title={'Adoption Rules'}
      open={modal.visible}
      onOk={onCancel}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={confirmBtn}>
      <div className="flex flex-col gap-[16px]">
        {adoptRuleList.map((item, idx) => (
          <div key={idx} className="flex flex-row">
            <span className="mr-[4px]">{idx + 1}.</span>
            <div className="flex-1">{item}</div>
          </div>
        ))}
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(AdoptRulesModal);
