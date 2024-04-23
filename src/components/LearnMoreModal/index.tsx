import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import CommonModal from 'components/CommonModal';
import SkeletonImage from 'components/SkeletonImage';
import { useCallback, useMemo } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { TSGRItem, TSGRToken } from 'types/tokens';
import { ReactComponent as XIcon } from 'assets/img/x.svg';
import { divDecimals } from 'utils/calculate';
import { openExternalLink } from 'utils/openlink';
import { formatTokenPrice } from 'utils/format';

interface ILearnMoreModalProps {
  item:
    | TSGRItem
    | (TSGRToken & {
        rank?: number;
      });
}

function LearnMoreModal({ item }: ILearnMoreModalProps) {
  const modal = useModal();
  const cmsInfo = useCmsInfo();

  const latestModal = useMemo(() => {
    return cmsInfo?.latestModal;
  }, [cmsInfo?.latestModal]);

  const onCancel = useCallback(() => {
    modal.hide();
  }, [modal]);

  const onJump = useCallback(() => {
    if (latestModal?.btnUrl) {
      openExternalLink(latestModal.btnUrl, '_blank');
      modal.hide();
      return;
    }
    const forestUrl = cmsInfo?.forestUrl || '';
    if (!forestUrl) return;
    // const collection = getCollection(item.symbol);
    // openExternalLink(`${forestUrl}/explore-items/${cmsInfo?.curChain}-${collection}-0`, '_blank');
    openExternalLink(`${forestUrl}/detail/buy/${cmsInfo?.curChain}-${item.symbol}/${cmsInfo?.curChain}`, '_blank');
    modal.hide();
  }, [cmsInfo?.curChain, cmsInfo?.forestUrl, item.symbol, latestModal?.btnUrl, modal]);

  const confirmBtn = useMemo(
    () => (
      <Button className="md:w-[356px]" onClick={onJump} type="primary">
        {latestModal?.btnText || 'Go to Forest'}
      </Button>
    ),
    [latestModal?.btnText, onJump],
  );

  const transformedAmount = useMemo(
    () => divDecimals(item.amount, item.decimals).toFixed(),
    [item.amount, item.decimals],
  );

  return (
    <CommonModal
      title={latestModal?.title || 'Notice'}
      width={438}
      open={modal.visible}
      onOk={onCancel}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={confirmBtn}
      disableMobileLayout={true}>
      <div className="text-neutralPrimary text-sm mb-[24px]">
        {latestModal?.desc || 'Please go to the Forest NFT marketplace to learn more about the inscription.'}
      </div>
      <div className="rounded-[16px] bg-[#F6F6F6] p-[12px] flex flex-row items-center">
        <SkeletonImage img={item.inscriptionImageUri} className={'w-[64px] h-[64px]'} />
        <div className="flex flex-1 ml-[16px] flex-col">
          <div>
            <div className="text-xs text-[#B8B8B8]">Name</div>
            <div className="text-sm text-neutralPrimary">{item.tokenName}</div>
          </div>
          <div>
            <div className="text-xs text-[#B8B8B8]">Symbol</div>
            <div className="text-sm text-neutralPrimary">{item.symbol}</div>
          </div>
          {item?.rank ? (
            <div>
              <div className="text-xs text-[#B8B8B8]">Rank</div>
              <div className="text-sm text-neutralPrimary">{formatTokenPrice(item?.rank)}</div>
            </div>
          ) : null}

          <div className="flex flex-row items-center mt-[4px]">
            <XIcon />
            <div className="ml-[6px] text-xs text-neutralSecondary">{transformedAmount}</div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(LearnMoreModal);
