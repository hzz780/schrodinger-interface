import { store } from 'redux/store';
import { getProto, getResult } from './deserializeLog';
import { currentRpcUrl } from 'constants/common';
import { Proto } from './proto';

class ProtoInstance {
  static getProto = async (contractAddress: string) => {
    const configInfo = store.getState().info.cmsInfo;
    const sideChain = currentRpcUrl[configInfo!.curChain as Chain];
    const proto = Proto.getInstance();
    const rpcUrl = configInfo?.[sideChain];
    if (!rpcUrl) throw "Can't get current chain RpcUrl";
    if (!contractAddress) throw "Can't get contractAddress";
    if (proto.getProto(contractAddress)) return proto.getProto(contractAddress);

    const protoBuf = await getProto(contractAddress, rpcUrl);
    proto.setProto(contractAddress, protoBuf);
    return protoBuf;
  };

  static getLogEventResult = async <T = any>(params: {
    contractAddress: string;
    logsName: string;
    TransactionResult: ITransactionResult;
  }) => {
    await ProtoInstance.getProto(params.contractAddress);
    return getResult<T>(params);
  };
}

export default ProtoInstance;
