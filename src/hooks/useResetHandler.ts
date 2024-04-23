import { useModal } from '@ebay/nice-modal-react';
import AdoptActionModal from 'components/AdoptActionModal';
import { useCallback } from 'react';
import { useGetAllBalance } from './useGetAllBalance';
import { TSGRToken } from 'types/tokens';
import { useGetTokenPrice, useTokenPrice } from './useAssets';
import { AELF_TOKEN_INFO } from 'constants/assets';
import { ZERO } from 'constants/misc';
import useLoading from './useLoading';
import { rerollSGR } from 'contract/schrodinger';
import ResultModal, { Status } from 'components/ResultModal';
import { resetSGRMessage } from 'constants/promptMessage';
import { useRouter } from 'next/navigation';
import PromptModal from 'components/PromptModal';
import { checkAllowanceAndApprove } from 'utils/aelfUtils';
import { AdoptActionErrorCode } from './Adopt/adopt';
import { useWalletService } from './useWallet';
import { getDomain, getOriginSymbol } from 'utils';
import { timesDecimals } from 'utils/calculate';
import useIntervalGetSchrodingerDetail from './Adopt/useIntervalGetSchrodingerDetail';
import { store } from 'redux/store';
import { getAdoptErrorMessage } from './Adopt/getErrorMessage';
import { singleMessage } from '@portkey/did-ui-react';
import { AdTracker } from 'utils/ad';

export const useResetHandler = () => {
  const resetModal = useModal(AdoptActionModal);
  const resultModal = useModal(ResultModal);
  const promptModal = useModal(PromptModal);
  const getAllBalance = useGetAllBalance();
  const { tokenPrice: elfTokenPrice } = useTokenPrice();
  const getTokenPrice = useGetTokenPrice();
  const { showLoading, closeLoading } = useLoading();
  const router = useRouter();
  const { wallet } = useWalletService();

  const intervalFetch = useIntervalGetSchrodingerDetail();

  const approveReset = useCallback(
    async (parentItemInfo: TSGRToken, amount: string, rankInfo?: IRankInfo): Promise<void> =>
      new Promise((resolve, reject) => {
        promptModal.show({
          info: {
            logo: parentItemInfo.inscriptionImageUri,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
            rank: rankInfo?.rank,
          },
          title: 'Pending Approval',
          content: {
            title: 'Go to your wallet',
            content: "You'll be asked to approve this offer from your wallet",
          },
          initialization: async () => {
            try {
              const { schrodingerSideAddress: contractAddress, curChain: chainId } =
                store.getState().info.cmsInfo || {};
              if (!contractAddress || !chainId) throw AdoptActionErrorCode.missingParams;

              const check = await checkAllowanceAndApprove({
                spender: contractAddress,
                address: wallet.address,
                chainId,
                symbol: parentItemInfo.symbol,
                decimals: parentItemInfo.decimals,
                amount,
              });

              if (!check) throw AdoptActionErrorCode.approveFailed;
              const domain = getDomain();

              await rerollSGR({
                symbol: parentItemInfo.symbol,
                amount: timesDecimals(amount, parentItemInfo.decimals).toFixed(0),
                domain,
              });
              promptModal.hide();
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          onClose: () => {
            promptModal.hide();
          },
        });
      }),
    [promptModal, wallet.address],
  );

  const showResultModal = useCallback(
    (status: Status, parentItemInfo: TSGRToken, amount: string, rankInfo?: IRankInfo) => {
      const originSymbol = getOriginSymbol(parentItemInfo.symbol);
      const successBtnText = originSymbol ? `View ${originSymbol.split('-')[0]}(${originSymbol})` : 'View';
      console.log('----rankInfo', rankInfo);

      resultModal.show({
        modalTitle: status === Status.ERROR ? resetSGRMessage.error.title : resetSGRMessage.success.title,
        info: {
          name: parentItemInfo.tokenName,
          logo: parentItemInfo.inscriptionImageUri,
          subName: parentItemInfo.symbol,
          tag: `GEN ${parentItemInfo.generation}`,
          rank: rankInfo?.rank,
        },
        id: 'sgr-reset-modal',
        status: status,
        description: status === Status.ERROR ? resetSGRMessage.error.description : resetSGRMessage.success.description,
        onCancel: () => {
          resultModal.hide();
        },
        buttonInfo: {
          btnText: status === Status.ERROR ? resetSGRMessage.error.button : successBtnText,
          openLoading: true,
          onConfirm: async () => {
            if (status === Status.ERROR) {
              resultModal.hide();
              try {
                await approveReset(parentItemInfo, amount);
                promptModal.hide();
                showResultModal(Status.SUCCESS, parentItemInfo, amount);
              } catch (error) {
                promptModal.hide();
                const _error = getAdoptErrorMessage(error);
                singleMessage.error(_error);

                showResultModal(Status.ERROR, parentItemInfo, amount);
              }
            } else {
              if (originSymbol) {
                await intervalFetch.start(originSymbol);
                intervalFetch.remove();
                resultModal.hide();
                router.replace(`/detail?symbol=${originSymbol}&address=${wallet.address}`);
              } else {
                router.replace('/');
              }
            }
          },
        },
      });
    },
    [approveReset, intervalFetch, promptModal, resultModal, router],
  );

  return useCallback(
    async (parentItemInfo: TSGRToken, account: string, rankInfo?: IRankInfo) => {
      showLoading();
      let parentPrice: string | undefined = undefined;
      try {
        parentPrice = await getTokenPrice(parentItemInfo.symbol);
      } catch (error) {
        console.log('getTokenPrice', error);
      }

      try {
        const [symbolBalance, elfBalance] = await getAllBalance([parentItemInfo, AELF_TOKEN_INFO], account);
        closeLoading();
        resetModal.show({
          isReset: true,
          modalTitle: 'Reroll Cat',
          info: {
            logo: parentItemInfo.inscriptionImageUri,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
            rank: rankInfo?.rank,
          },
          inputProps: {
            max: symbolBalance,
            decimals: parentItemInfo.decimals,
          },
          balanceList: [
            {
              amount: symbolBalance,
              suffix: parentItemInfo.symbol,
              usd: `${symbolBalance && parentPrice ? ZERO.plus(symbolBalance).times(parentPrice).toFixed(2) : '--'}`,
            },
            {
              amount: elfBalance,
              suffix: AELF_TOKEN_INFO.symbol,
              usd: `${elfBalance && elfTokenPrice ? ZERO.plus(elfBalance).times(elfTokenPrice).toFixed(2) : '--'}`,
            },
          ],
          onConfirm: async (amount: string) => {
            console.log('amount', amount, parentItemInfo.generation);
            resetModal.hide();
            AdTracker.trackEvent('reroll', {
              generation: parentItemInfo.generation,
            });
            try {
              await approveReset(parentItemInfo, amount, rankInfo);
              promptModal.hide();
              showResultModal(Status.SUCCESS, parentItemInfo, amount, rankInfo);
            } catch (error) {
              promptModal.hide();
              showResultModal(Status.ERROR, parentItemInfo, amount, rankInfo);
            }
          },
        });
      } catch (error) {
        closeLoading();
      }
    },
    [
      approveReset,
      closeLoading,
      elfTokenPrice,
      getAllBalance,
      getTokenPrice,
      promptModal,
      resetModal,
      showLoading,
      showResultModal,
    ],
  );
};
