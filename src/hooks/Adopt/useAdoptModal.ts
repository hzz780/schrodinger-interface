import { useModal } from '@ebay/nice-modal-react';
import PromptModal from 'components/PromptModal';
import { useCallback } from 'react';
import { IAdoptedLogs, adoptStep1Handler } from './AdoptStep';
import AdoptActionModal from 'components/AdoptActionModal';
import { AdoptActionErrorCode } from './adopt';
import { getAdoptErrorMessage } from './getErrorMessage';
import { singleMessage } from '@portkey/did-ui-react';
import { TSGRToken } from 'types/tokens';
import { AELF_TOKEN_INFO } from 'constants/assets';
import { useGetTokenPrice, useTokenPrice } from 'hooks/useAssets';
import { ONE, ZERO } from 'constants/misc';
import { useGetAllBalance } from 'hooks/useGetAllBalance';
import useLoading from 'hooks/useLoading';
import { adopt1Message, promptContentTitle } from 'constants/promptMessage';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { getDomain } from 'utils';
import { checkAIService } from 'api/request';
import { useAdoptConfirm } from './useAdoptConfirm';
import SyncAdoptModal from 'components/SyncAdoptModal';
import { AIServerError } from 'utils/formattError';
import { getRankInfoToShow } from 'utils/formatTraits';

const useAdoptHandler = () => {
  const adoptActionModal = useModal(AdoptActionModal);
  const { walletType } = useWebLogin();

  const promptModal = useModal(PromptModal);
  const { showLoading, closeLoading } = useLoading();
  const { tokenPrice: ELFPrice } = useTokenPrice(AELF_TOKEN_INFO.symbol);
  const asyncModal = useModal(SyncAdoptModal);

  const adoptConfirm = useAdoptConfirm();

  const getTokenPrice = useGetTokenPrice();
  const getAllBalance = useGetAllBalance();

  const getParentBalance = useCallback(
    ({ symbol, decimals, account }: { symbol: string; decimals: number; account: string }) =>
      getAllBalance([{ symbol, decimals }, AELF_TOKEN_INFO], account),
    [getAllBalance],
  );

  const adoptInput = useCallback(
    (parentItemInfo: TSGRToken, account: string, parentPrice?: string, rankInfo?: IRankInfo): Promise<string> => {
      return new Promise(async (resolve, reject) => {
        showLoading();
        let symbolBalance;
        let ELFBalance;
        try {
          const [symbolB, ELFB] = await getParentBalance({
            symbol: parentItemInfo.symbol,
            account,
            decimals: parentItemInfo.decimals,
          });
          symbolBalance = symbolB;
          ELFBalance = ELFB;
        } finally {
          closeLoading();
        }

        adoptActionModal.show({
          modalTitle: 'Adopt Next-Gen Cat',
          info: {
            logo: parentItemInfo.inscriptionImageUri,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
            rank: rankInfo && getRankInfoToShow(rankInfo, 'Rank'),
          },

          inputProps: {
            min: ONE.div(`1e${parentItemInfo.decimals}`).toFixed(),
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
              amount: ELFBalance,
              suffix: AELF_TOKEN_INFO.symbol,
              usd: `${ELFBalance && ELFPrice ? ZERO.plus(ELFBalance).times(ELFPrice).toFixed(2) : '--'}`,
            },
          ],
          onClose: () => {
            adoptActionModal.hide();

            reject(AdoptActionErrorCode.cancel);
          },
          onConfirm: (amount: string) => {
            adoptActionModal.hide();
            resolve(amount as string);
          },
        });
      });
    },
    [ELFPrice, adoptActionModal, closeLoading, getParentBalance, showLoading],
  );

  const approveAdopt = useCallback(
    async ({
      amount,
      parentItemInfo,
      account,
    }: {
      account: string;
      amount: string;
      parentItemInfo: TSGRToken;
    }): Promise<IAdoptedLogs> =>
      new Promise((resolve, reject) => {
        promptModal.show({
          info: {
            logo: parentItemInfo.inscriptionImageUri,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
          },
          title: adopt1Message.prompt.title,
          content: {
            title: promptContentTitle,
            content:
              walletType === WalletType.portkey ? [adopt1Message.prompt.portkey] : [adopt1Message.prompt.default],
          },
          initialization: async () => {
            try {
              const domain = getDomain();

              const adoptedInfo = await adoptStep1Handler({
                params: {
                  parent: parentItemInfo.symbol,
                  amount,
                  domain,
                },
                address: account,
                decimals: parentItemInfo.decimals,
              });
              promptModal.hide();
              resolve(adoptedInfo);
            } catch (error) {
              console.log(error, 'error===');
              if (error === AdoptActionErrorCode.missingParams) {
                reject(error);
                return;
              }
              if (error === AdoptActionErrorCode.approveFailed) throw error;
              const errorMessage = getAdoptErrorMessage(error, 'adopt error');
              singleMessage.error(errorMessage);
              throw error;
            }
          },
          onClose: () => {
            promptModal.hide();
          },
        });
      }),
    [promptModal, walletType],
  );

  const checkAIServer = useCallback(async () => {
    return new Promise(async (resolve, reject) => {
      const isAIserviceError = await checkAIService();

      if (!isAIserviceError) {
        resolve('continue');
        return;
      }
      asyncModal.show({
        closable: true,
        showLoading: false,
        innerText: AIServerError,
        onCancel: () => {
          asyncModal.hide();
          reject(AdoptActionErrorCode.cancel);
        },
      });
    });
  }, [asyncModal]);

  return useCallback(
    async (parentItemInfo: TSGRToken, account: string, rankInfo?: IRankInfo) => {
      try {
        showLoading();
        const parentPrice = await getTokenPrice(parentItemInfo.symbol);
        closeLoading();
        await checkAIServer();

        const amount = await adoptInput(parentItemInfo, account, parentPrice, rankInfo);
        const { adoptId, outputAmount, symbol, tokenName } = await approveAdopt({ amount, account, parentItemInfo });

        await adoptConfirm(parentItemInfo, { adoptId, symbol, outputAmount, tokenName }, account);
      } catch (error) {
        console.log(error, 'error==');
        if (error === AdoptActionErrorCode.cancel) return;
        const errorMessage = getAdoptErrorMessage(error, 'adopt error');
        singleMessage.error(errorMessage);
      }
    },
    [adoptConfirm, adoptInput, approveAdopt, checkAIServer, closeLoading, getTokenPrice, showLoading],
  );
};

export default useAdoptHandler;
