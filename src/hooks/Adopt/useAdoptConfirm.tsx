import { useModal } from '@ebay/nice-modal-react';
import SyncAdoptModal from 'components/SyncAdoptModal';
import { useCallback } from 'react';
import {
  IAdoptNextInfo,
  adoptStep2Handler,
  fetchTraitsAndImages,
  fetchWaterImages,
  getAdoptConfirmEventLogs,
} from './AdoptStep';
import { ITrait, TSGRToken } from 'types/tokens';
import { ZERO } from 'constants/misc';
import AdoptNextModal from 'components/AdoptNextModal';
import { AELF_TOKEN_INFO } from 'constants/assets';
import { useGetAllBalance } from 'hooks/useGetAllBalance';
import { useTokenPrice, useTxFee } from 'hooks/useAssets';
import { AdoptActionErrorCode } from './adopt';
import PromptModal from 'components/PromptModal';
import { IContractError, ISendResult } from 'types';
import { getAdoptErrorMessage } from './getErrorMessage';
import { singleMessage } from '@portkey/did-ui-react';
import ResultModal, { Status } from 'components/ResultModal';
import useIntervalGetSchrodingerDetail from './useIntervalGetSchrodingerDetail';
import { getExploreLink } from 'utils';
import { store } from 'redux/store';
import { useRouter } from 'next/navigation';
import { divDecimals } from 'utils/calculate';
import { message } from 'antd';
import { DEFAULT_ERROR, formatErrorMsg } from 'utils/formattError';
import { MethodType, SentryMessageType, captureMessage } from 'utils/captureMessage';
import { formatTraits, getRankInfoToShow } from 'utils/formatTraits';
import { getCatsRankProbability } from 'utils/getCatsRankProbability';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { useWalletService } from 'hooks/useWallet';

export const useAdoptConfirm = () => {
  const asyncModal = useModal(SyncAdoptModal);
  const adoptNextModal = useModal(AdoptNextModal);
  const resultModal = useModal(ResultModal);

  const { txFee: commonTxFee } = useTxFee();
  const { tokenPrice: ELFPrice } = useTokenPrice(AELF_TOKEN_INFO.symbol);
  const promptModal = useModal(PromptModal);
  const intervalFetch = useIntervalGetSchrodingerDetail();
  const router = useRouter();
  const { wallet } = useWalletService();

  const getAllBalance = useGetAllBalance();

  const getParentBalance = useCallback(
    ({ symbol, decimals, account }: { symbol: string; decimals: number; account: string }) =>
      getAllBalance([{ symbol, decimals }, AELF_TOKEN_INFO], account),
    [getAllBalance],
  );

  const adoptConfirmInput = useCallback(
    async ({
      infos,
      parentItemInfo,
      childrenItemInfo,
      account,
      rankInfo,
    }: {
      infos: IAdoptImageInfo;
      parentItemInfo: TSGRToken;
      childrenItemInfo: IAdoptNextInfo;
      account: string;
      rankInfo?: IRankInfo;
    }): Promise<string> => {
      return new Promise(async (resolve, reject) => {
        try {
          const [, ELFBalance] = await getParentBalance({
            symbol: parentItemInfo.symbol,
            account,
            decimals: parentItemInfo.decimals,
          });

          const isAcross = ZERO.plus(parentItemInfo.generation).plus(1).lt(infos.adoptImageInfo.generation);

          adoptNextModal.show({
            isAcross,
            data: {
              SGRToken: {
                tokenName: childrenItemInfo.tokenName,
                symbol: childrenItemInfo.symbol,
                amount: divDecimals(childrenItemInfo.outputAmount, parentItemInfo.decimals).toFixed(),
                rankInfo: rankInfo,
              },
              allTraits: infos.adoptImageInfo.attributes,
              images: infos.adoptImageInfo.images,
              inheritedTraits: parentItemInfo.traits,
              transaction: {
                txFee: ZERO.plus(commonTxFee).toFixed(),
                usd: `${commonTxFee && ELFPrice ? ZERO.plus(commonTxFee).times(ELFPrice).toFixed(4) : '--'}`,
              },
              ELFBalance: {
                amount: ELFBalance,
                usd: `${ELFBalance && ELFPrice ? ZERO.plus(ELFBalance).times(ELFPrice).toFixed(2) : '--'}`,
              },
            },

            onClose: () => {
              adoptNextModal.hide();
              reject(AdoptActionErrorCode.cancel);
            },
            onConfirm: (selectImage) => {
              resolve(selectImage);
            },
          });
        } catch (error) {
          reject(error);
        }
      });
    },
    [ELFPrice, adoptNextModal, commonTxFee, getParentBalance],
  );

  const retryAdoptConfirm = useCallback(
    async (
      confirmParams: {
        adoptId: string;
        image: string;
        imageUri: string;
        signature: string;
      },
      parentItemInfo: TSGRToken,
      rankInfo?: IRankInfo,
    ): Promise<{
      txResult: ISendResult;
      image: string;
      imageUri: string;
    }> =>
      new Promise(async (resolve, reject) => {
        try {
          const result = await adoptStep2Handler(confirmParams);
          resolve({
            txResult: result,
            image: confirmParams.image,
            imageUri: confirmParams.imageUri,
          });
          promptModal.hide();
        } catch (error) {
          promptModal.hide();

          captureMessage({
            type: SentryMessageType.CONTRACT,
            params: {
              name: 'adoptStep2Handler',
              method: MethodType.CALLSENDMETHOD,
              query: confirmParams,
              description: error,
            },
          });

          console.log(error, 'error===');
          if (error === AdoptActionErrorCode.missingParams) throw error;

          const errorMessage = getAdoptErrorMessage(error, 'adopt confirm error');
          singleMessage.error(errorMessage);

          resultModal.show({
            modalTitle: 'You have failed minted!',
            info: {
              name: parentItemInfo.tokenName,
              logo: confirmParams.image,
              rank: rankInfo && getRankInfoToShow(rankInfo, 'Rank'),
            },
            id: 'adopt-retry-modal',
            status: Status.ERROR,
            description:
              'Adopt can fail due to network issues, transaction fee increases, because someone else mint the inscription before you.',
            onCancel: () => {
              reject(AdoptActionErrorCode.cancel);
              resultModal.hide();
            },
            buttonInfo: {
              btnText: 'Try Again',
              openLoading: true,
              onConfirm: async () => {
                const result = await adoptStep2Handler(confirmParams);
                resolve({
                  txResult: result,
                  image: confirmParams.image,
                  imageUri: confirmParams.imageUri,
                });

                resultModal.hide();
              },
            },
          });
        }
      }),
    [promptModal, resultModal],
  );

  const adoptConfirmHandler = useCallback(
    async ({
      childrenItemInfo,
      image: originImage,
      parentItemInfo,
      rankInfo,
    }: {
      childrenItemInfo: IAdoptNextInfo;
      image: string;
      parentItemInfo: TSGRToken;
      rankInfo?: IRankInfo;
    }): Promise<{
      txResult: ISendResult;
      image: string;
      imageUri: string;
    }> => {
      return new Promise(async (resolve, reject) => {
        // showLoading();
        const imageSignature = await fetchWaterImages({
          adoptId: childrenItemInfo.adoptId,
          image: originImage,
        });
        adoptNextModal.hide();
        // closeLoading();
        if (imageSignature?.error || !imageSignature.signature) {
          reject(imageSignature?.error || 'Failed to obtain watermark image');
          captureMessage({
            type: SentryMessageType.HTTP,
            params: {
              name: 'fetchWaterImages',
              method: 'post',
              query: {
                adoptId: childrenItemInfo.adoptId,
                image: originImage,
              },
              description: imageSignature,
            },
          });
          return;
        }

        const signature = imageSignature.signature;
        const image = imageSignature.image;
        const imageUri = imageSignature.imageUri;

        const confirmParams = {
          adoptId: childrenItemInfo.adoptId,
          image: image,
          imageUri: imageUri,
          signature: Buffer.from(signature, 'hex').toString('base64'),
        };

        promptModal.show({
          info: {
            logo: parentItemInfo.inscriptionImageUri,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
          },
          title: 'Pending Approval',
          content: {
            title: 'Go to your wallet',
            content: "You'll be asked to approve this offer from your wallet",
          },
          initialization: async () => {
            const result = await retryAdoptConfirm(confirmParams, parentItemInfo, rankInfo);
            resolve(result);
          },
          onClose: () => {
            promptModal.hide();
          },
        });
      });
    },
    [adoptNextModal, promptModal, retryAdoptConfirm],
  );

  const fetchImages = useCallback(
    async (adoptId: string) => {
      asyncModal.show();
      const result = await fetchTraitsAndImages(adoptId);
      asyncModal.hide();
      return result;
    },
    [asyncModal],
  );

  const approveAdoptConfirm = useCallback(
    async ({
      infos,
      childrenItemInfo,
      parentItemInfo,
      account,
      rankInfo,
    }: {
      infos: IAdoptImageInfo;
      childrenItemInfo: IAdoptNextInfo;
      parentItemInfo: TSGRToken;
      account: string;
      rankInfo?: IRankInfo;
    }) => {
      const selectItem = await adoptConfirmInput({ infos, parentItemInfo, childrenItemInfo, account, rankInfo });

      const { txResult, imageUri } = await adoptConfirmHandler({
        image: selectItem,
        parentItemInfo,
        childrenItemInfo,
        rankInfo,
      });
      let nextTokenName = '';
      let nextSymbol = '';

      try {
        const { tokenName, symbol } = await getAdoptConfirmEventLogs(txResult.TransactionResult);
        nextTokenName = tokenName;
        nextSymbol = symbol;
      } catch (error) {
        //
      }
      // Get next gen symbol
      return {
        image: imageUri,
        txResult,
        nextTokenName,
        nextSymbol,
      };
    },
    [adoptConfirmHandler, adoptConfirmInput],
  );

  const adoptConfirmSuccess = useCallback(
    async ({
      transactionId,
      image,
      name,
      symbol,
      rankInfo,
    }: {
      transactionId: string;
      image: string;
      name: string;
      symbol: string;
      rankInfo?: IRankInfo;
    }) =>
      new Promise((resolve) => {
        const cmsInfo = store.getState().info.cmsInfo;
        const explorerUrl = getExploreLink(transactionId, 'transaction', cmsInfo?.curChain);
        console.log('=====getExploreLink', explorerUrl, transactionId, cmsInfo?.curChain, image, rankInfo);
        resultModal.show({
          modalTitle: 'Cat Successfully Adopted!',
          info: {
            name: name,
            logo: image,
            rank: rankInfo && getRankInfoToShow(rankInfo, 'Rank'),
          },
          status: Status.SUCCESS,
          description: `You have successfully minted the inscription ${name}`,
          link: {
            href: explorerUrl,
          },
          buttonInfo: {
            btnText: `View Inscription`,
            openLoading: true,
            onConfirm: async () => {
              await intervalFetch.start(symbol);
              intervalFetch.remove();
              resultModal.hide();
              router.replace(`/detail?symbol=${symbol}&address=${wallet.address}`);
            },
          },
          onCancel: () => {
            resolve(true);
            intervalFetch.remove();
            resultModal.hide();
          },
        });
      }),
    [intervalFetch, resultModal, router],
  );

  const getRankInfo = useCallback(
    async (allTraits: ITrait[]) => {
      const traits = formatTraits(allTraits);
      if (!traits) {
        return;
      }
      const catsRankProbability = await getCatsRankProbability({
        catsTraits: [traits],
        address: addPrefixSuffix(wallet.address),
      });

      const info = (catsRankProbability && catsRankProbability?.[0]) || undefined;

      return info;
    },
    [wallet.address],
  );

  return useCallback(
    async (parentItemInfo: TSGRToken, childrenItemInfo: IAdoptNextInfo, account: string) => {
      try {
        const infos = await fetchImages(childrenItemInfo.adoptId);

        const rankInfo = await getRankInfo(infos.adoptImageInfo.attributes);

        const { txResult, image, nextTokenName, nextSymbol } = await approveAdoptConfirm({
          infos,
          childrenItemInfo,
          parentItemInfo,
          account,
          rankInfo,
        });
        await adoptConfirmSuccess({
          transactionId: txResult.TransactionId,
          image,
          name: nextTokenName,
          symbol: nextSymbol,
          rankInfo,
        });
      } catch (error) {
        if (error === AdoptActionErrorCode.cancel) {
          return;
        }
        message.error(
          typeof error === 'string'
            ? error
            : formatErrorMsg(error as IContractError).errorMessage.message || DEFAULT_ERROR,
        );
      }
    },
    [adoptConfirmSuccess, approveAdoptConfirm, fetchImages, getRankInfo],
  );
};
