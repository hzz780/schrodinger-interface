import { sleep } from '@portkey/utils';
import { fetchSchrodingerImagesByAdoptId, fetchWaterImageRequest } from 'api/request';
import { Adopt, confirmAdopt } from 'contract/schrodinger';
import { store } from 'redux/store';
import { checkAllowanceAndApprove } from 'utils/aelfUtils';
import { timesDecimals } from 'utils/calculate';
import ProtoInstance from 'utils/initializeProto';
import { AdoptActionErrorCode } from './adopt';

export interface IAttribute {
  traitType: string;
  value: string;
}

export interface IAdoptNextInfo {
  symbol: string;
  tokenName: string;
  outputAmount: string | number;
  adoptId: string;
}

export interface IAdoptedLogs extends IAdoptNextInfo {
  parent: string;
  parentGen: number;
  inputAmount: number;
  lossAmount: number;
  commissionAmount: number;
  imageCount: number;
  adopter: string;
  blockHeight: number;
  attributes: IAttribute[];
  gen: number;
}

export const adoptStep1Handler = async ({
  params,
  address,
  decimals,
}: {
  address: string;
  decimals: number;
  params: {
    parent: string;
    amount: string;
    domain: string;
  };
}) => {
  const amount = params.amount;
  const { schrodingerSideAddress: contractAddress, curChain: chainId } = store.getState()?.info.cmsInfo || {};
  if (!contractAddress || !chainId) throw AdoptActionErrorCode.missingParams;
  await sleep(1000);
  const check = await checkAllowanceAndApprove({
    spender: contractAddress,
    address,
    chainId,
    symbol: params.parent,
    decimals,
    amount,
  });

  if (!check) throw AdoptActionErrorCode.approveFailed;

  params.amount = timesDecimals(params.amount, decimals).toFixed(0);

  const result = await Adopt(params);

  const TransactionResult = result.TransactionResult;

  const logs = await ProtoInstance.getLogEventResult<IAdoptedLogs>({
    contractAddress,
    logsName: 'Adopted',
    TransactionResult,
  });
  if (!logs) throw AdoptActionErrorCode.adoptFailed;
  return logs;
};

export const fetchWaterImages = async (
  params: IWaterImageRequest,
  count = 0,
): Promise<IWaterImage & { error?: any }> => {
  try {
    const result = await fetchWaterImageRequest(params);
    if (!result.signature) throw 'Get not get signature';
    return result;
  } catch (error) {
    if (count > 10)
      return {
        error,
        image: '',
        signature: '',
        imageUri: '',
      };
    await sleep(500);
    count++;
    return await fetchWaterImages(params, count);
  }
};

export const fetchTraitsAndImages = async (adoptId: string, count = 0): Promise<IAdoptImageInfo> => {
  count++;
  try {
    const result = await fetchSchrodingerImagesByAdoptId({ adoptId });
    if (!result || !result.adoptImageInfo?.images?.length) throw 'Waiting...';
    return result;
  } catch (error) {
    // Waiting to generate ai picture
    await sleep(6000);
    return fetchTraitsAndImages(adoptId, count);
  }
};

export const adoptStep2Handler = (params: IConfirmAdoptParams) => confirmAdopt(params);

interface IConfirmEventLogs {
  adoptId: string;
  parent: string;
  symbol: string;
  totalSupply: number;
  decimals: number;
  gen: number;
  attributes: IBaseTrait;
  issuer: string;
  owner: string;
  issueChainId: number;
  externalInfos: Record<string, string>;
  tokenName: string;
  deployer: string;
}

export const getAdoptConfirmEventLogs = async (TransactionResult: ITransactionResult): Promise<IConfirmEventLogs> => {
  const { schrodingerSideAddress: contractAddress, curChain: chainId } = store.getState()?.info.cmsInfo || {};
  if (!contractAddress || !chainId) throw AdoptActionErrorCode.missingParams;

  const logs = await ProtoInstance.getLogEventResult<IConfirmEventLogs>({
    contractAddress,
    logsName: 'Confirmed',
    TransactionResult,
  });

  if (!logs) throw AdoptActionErrorCode.parseEventLogsFailed;

  return logs;
};
