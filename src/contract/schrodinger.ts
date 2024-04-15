import { webLoginInstance } from './webLogin';
import { formatErrorMsg } from 'utils/formattError';
import { ContractMethodType, IContractError, IContractOptions, ISendResult, SupportedELFChainId } from 'types';
import { store } from 'redux/store';
import { getTxResultRetry } from 'utils/getTxResult';
import { sleep } from '@portkey/utils';

const schrodingerContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().info.cmsInfo;

  const addressList = {
    main: info?.schrodingerMainAddress,
    side: info?.schrodingerSideAddress,
  };

  try {
    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain: Chain = options?.chain || info!.curChain;

    console.log('=====schrodingerContractRequest type: ', method, options?.type);
    console.log('=====schrodingerContractRequest address: ', method, address);
    console.log('=====schrodingerContractRequest curChain: ', method, curChain);
    console.log('=====schrodingerContractRequest params: ', method, params);

    if (options?.type === ContractMethodType.VIEW) {
      const res: R = await webLoginInstance.callViewMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====schrodingerContractRequest res: ', method, res);

      const result = res as IContractError;
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      return Promise.resolve(res);
    } else {
      const res: R = await webLoginInstance.callSendMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====schrodingerContractRequest res: ', method, res);

      const result = res as IContractError;

      console.log('=====schrodingerContractRequest result: ', method, JSON.stringify(result), result?.Error);

      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResultRetry({
        TransactionId: resTransactionId!,
        chainId: info!.curChain,
      });

      console.log('=====schrodingerContractRequest transaction: ', method, transaction);

      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    console.error('=====schrodingerContractRequest error: ', method, JSON.stringify(error), error);
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError, method));
  }
};

export const Join = async (
  params: {
    domain: string;
  },
  options?: IContractOptions,
): Promise<IContractError> => {
  try {
    const res = (await schrodingerContractRequest('Join', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetJoinRecord = async (address: string, options?: IContractOptions): Promise<boolean> => {
  try {
    const res: any = await schrodingerContractRequest('GetJoinRecord', address, {
      ...options,
      type: ContractMethodType.VIEW,
    });
    const isJoin = res?.value;
    return Promise.resolve(Boolean(isJoin));
  } catch (error) {
    return Promise.reject(error);
  }
};

export const Adopt = async (
  params: {
    parent: string;
    amount: string;
    domain: string;
  },
  options?: IContractOptions,
): Promise<ISendResult> => await schrodingerContractRequest('Adopt', params, options);

export const confirmAdopt = async (params: IConfirmAdoptParams, options?: IContractOptions): Promise<ISendResult> =>
  await schrodingerContractRequest('Confirm', params, options);

export const rerollSGR = async (params: IRerollSGRParams, options?: IContractOptions): Promise<ISendResult> =>
  await schrodingerContractRequest('Reroll', params, options);

export const AcceptReferral = async (params: { referrer: string }, options?: IContractOptions): Promise<ISendResult> =>
  await schrodingerContractRequest('AcceptReferral', params, options);
