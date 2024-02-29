import { webLoginInstance } from './webLogin';
import contractRequest from './contractRequest';
import { getTxResultRetry } from 'utils/getTxResult';
import {
  ContractMethodType,
  IContractError,
  IContractOptions,
  ISendResult,
  SupportedELFChainId,
} from 'types';
import { sleep } from 'utils/common';
import { formatErrorMsg } from 'utils/formattError';
import { SECONDS_60 } from 'constants/index';

const multiTokenContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  try {
    const address = 'address';
    const curChain = 'AELF';

    const contract = webLoginInstance;

    if (options?.type === ContractMethodType.VIEW) {
      const res: R = await contract.callSendMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      const result = res as IContractError;
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result));
      }

      return Promise.resolve(res);
    } else {
      const res: R = await contract.callSendMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      const result = res as IContractError;

      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResultRetry({
        TransactionId: resTransactionId!,
        chainId: curChain,
        rpcUrl: 'rpcUrl',
        rePendingEnd: new Date().getTime() + SECONDS_60,
      });

      return Promise.resolve({
        TransactionId: transaction.TransactionId,
        TransactionResult: transaction.txResult,
      });
    }
  } catch (error) {
    console.error('=====multiTokenContractRequest error:', method, JSON.stringify(error));
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError));
  }
};

export const Create = async (params: any): Promise<ICallSendResponse> => {
  try {
    const res: ICallSendResponse = await multiTokenContractRequest('Create', params, {
      chain: SupportedELFChainId.MAIN_NET,
    });
    return Promise.resolve(res);
  } catch (_) {
    return Promise.reject(null);
  }
};
