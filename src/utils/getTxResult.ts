import AElf from 'aelf-sdk';
import { sleep } from './common';

export interface ITxResultProps {
  TransactionId: string;
  chainId: Chain;
  rePendingEnd?: number;
  rpcUrl: string;
  reNotexistedCount?: number;
  reGetCount?: number;
}

export function getAElf(rpcUrl?: string) {
  const rpc = rpcUrl || '';
  const httpProviders: any = {};

  if (!httpProviders[rpc]) {
    httpProviders[rpc] = new AElf(new AElf.providers.HttpProvider(rpc));
  }
  return httpProviders[rpc];
}

export async function getTxResultRetry({
  TransactionId,
  chainId,
  rpcUrl,
  reGetCount = 3,
  rePendingEnd,
  reNotexistedCount = 3,
}: ITxResultProps): Promise<any> {
  try {
    const txResult = await getAElf(rpcUrl).chain.getTxResult(TransactionId);
    if (txResult.error && txResult.errorMessage) {
      throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
    }

    if (!txResult) {
      if (reGetCount > 1) {
        await sleep(500);
        reGetCount--;
        return getTxResultRetry({
          TransactionId,
          chainId,
          rePendingEnd,
          rpcUrl,
          reNotexistedCount,
          reGetCount,
        });
      }

      throw Error('Please check your internet connection and try again.');
    }

    if (txResult.Status.toLowerCase() === 'pending') {
      const current = new Date().getTime();
      if (rePendingEnd && rePendingEnd <= current) {
        throw Error('Please check your internet connection and try again.');
      }
      await sleep(500);
      const pendingEnd = rePendingEnd || current;
      return getTxResultRetry({
        TransactionId,
        chainId,
        rePendingEnd: pendingEnd,
        rpcUrl,
        reNotexistedCount,
        reGetCount,
      });
    }

    if (txResult.Status.toLowerCase() === 'notexisted' && reNotexistedCount > 1) {
      await sleep(500);
      reNotexistedCount--;
      return getTxResultRetry({
        TransactionId,
        chainId,
        rePendingEnd,
        rpcUrl,
        reNotexistedCount,
        reGetCount,
      });
    }

    if (txResult.Status.toLowerCase() === 'mined') {
      return { TransactionId, txResult };
    }
    throw Error('Please check your internet connection and try again.');
  } catch (error) {
    console.log('=====getTxResult error', error);
    if (reGetCount > 1) {
      await sleep(500);
      reGetCount--;
      return getTxResultRetry({
        TransactionId,
        chainId,
        rePendingEnd,
        rpcUrl,
        reNotexistedCount,
        reGetCount,
      });
    }
    throw Error('Please check your internet connection and try again.');
  }
}
