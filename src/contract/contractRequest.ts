import { WalletType } from 'constants/index';
import { IPortkeyContract, getContractBasic } from '@portkey/contracts';
import { ChainId, IContract, SendOptions } from '@portkey/types';
import { MethodsWallet } from '@portkey/provider-types';
import { did } from '@portkey/did-ui-react';

import { CallContractParams, IDiscoverInfo, PortkeyInfoType, WalletInfoType } from 'types';
import { getAElfInstance, getViewWallet } from 'utils/contractInstance';
import { aelf, sleep } from '@portkey/utils';
import { getTxResultRetry } from 'utils/getTxResult';
import DetectProvider from 'utils/portkeyProvider';
import { Manager } from '@portkey/services';
import { store } from 'redux/store';
import { SECONDS_60 } from 'constants/index';
import getAccountInfoSync from 'utils/getAccountInfoSync';
import { compareVersion } from 'utils/version';

interface IContractConfig {
  chainId: ChainId;
  rpcUrl?: string;
  contractAddress: string;
  discoverRpcUrl?: string;
}

interface IWallet {
  discoverInfo?: IDiscoverInfo;
  portkeyInfo?: PortkeyInfoType;
}

interface IViewContract {
  [props: string]: {
    call: any;
  };
}

export default class ContractRequest {
  private static instance: ContractRequest | null = null;
  private walletType: WalletType = WalletType.unknown;
  private chainId: ChainId | undefined;
  private rpcUrl: string | undefined;
  private wallet: IWallet = {};
  public caContractProvider?: IContract;
  public caContract?: IPortkeyContract;
  public viewContractMap: { [x: string]: IPortkeyContract };

  public viewContract?: IViewContract;
  private caAddress: string | undefined;
  private caHash: string | undefined;
  constructor() {
    this.viewContractMap = {};
  }
  static get() {
    if (!ContractRequest.instance) {
      ContractRequest.instance = new ContractRequest();
    }
    return ContractRequest.instance;
  }

  public setConfig(config: IContractConfig) {
    const { info } = store.getState();
    this.chainId = config.chainId;
    const rpcUrl = info.walletType === WalletType.discover ? config.discoverRpcUrl : config.rpcUrl;
    this.rpcUrl = rpcUrl;
    this.initCaContract(config.contractAddress);
  }

  public resetConfig() {
    this.chainId = undefined;
    this.rpcUrl = undefined;
    this.caContractProvider = undefined;
    this.caContract = undefined;
    this.viewContract = undefined;
    this.caAddress = undefined;
    this.caHash = undefined;
    this.walletType = WalletType.unknown;
    this.wallet = {};
  }

  public setWallet(wallet: WalletInfoType, walletType: WalletType) {
    if (wallet) {
      this.walletType = walletType;
      if (walletType === WalletType.discover) {
        this.wallet.discoverInfo = wallet.discoverInfo;
        this.caAddress = wallet.discoverInfo?.address;
      } else {
        this.wallet.portkeyInfo = wallet.portkeyInfo;
      }
    }
  }

  public async initCaContract(contractAddress: string) {
    if (this.walletType === WalletType.discover) {
      this.caContractProvider = await this.getProviderCaContract(contractAddress);
    } else {
      this.caContract = await this.getCaContract();
    }

    this.viewContract = await this.getViewContract(contractAddress);
  }

  private getCaContract = async () => {
    if (!this.caContract) {
      const chainsInfo = await did.services.getChainsInfo();
      const chainInfo = chainsInfo.find((chain) => chain.chainId === this.chainId);
      if (!chainInfo) {
        throw new Error(`Chain is not running: ${this.chainId}`);
      }
      const didWalletInfo = this.wallet.portkeyInfo!;
      const account = aelf.getWallet(didWalletInfo?.walletInfo?.privateKey);
      const caContract = await getContractBasic({
        contractAddress: chainInfo.caContractAddress,
        account,
        rpcUrl: this.rpcUrl,
      });
      this.caContract = caContract;

      this.caAddress = didWalletInfo?.walletInfo?.address;
      this.caHash = didWalletInfo?.caInfo?.caHash;
    }
    return this.caContract;
  };

  public getViewContracts = async (rpcUrl: string, chainId: ChainId, address: string) => {
    const key = rpcUrl + chainId;
    if (!this.viewContractMap[key]) {
      const aelfInstance = getAElfInstance(rpcUrl);

      this.viewContractMap[key] = await getContractBasic({
        aelfInstance,
        contractAddress: address,
        account: aelf.getWallet('f6e512a3c259e5f9af981d7f99d245aa5bc52fe448495e0b0dd56e8406be6f71'),
      });
    }
    return this.viewContractMap[key];
  };

  private getViewContract = async (contractAddress: string) => {
    if (!this.viewContract) {
      const aelfInstance = getAElfInstance(this.rpcUrl!);
      const viewWallet = getViewWallet();

      const contract = await aelfInstance.chain.contractAt(contractAddress, viewWallet);
      this.viewContract = contract;
    }
    return this.viewContract;
  };

  private getProviderCaContract = async (contractAddress: string) => {
    if (!this.caContractProvider) {
      const dp = await DetectProvider.getDetectProvider();
      const chainProvider = await dp?.getChain(this.chainId as ChainId);
      if (!chainProvider) return;
      const contract = await getContractBasic({
        contractAddress: contractAddress,
        chainProvider: chainProvider,
      });
      this.caContractProvider = contract;
      return contract;
    }
    return this.caContractProvider;
  };

  public async callSendMethod<T, R>(params: CallContractParams<T>, sendOptions?: SendOptions) {
    if (this.walletType === WalletType.unknown) {
      throw new Error('Wallet not login');
    }

    let result: R | any;

    const walletType = this.walletType;
    switch (walletType) {
      case WalletType.discover: {
        const discoverInfo = this.wallet.discoverInfo!;
        try {
          const contract = await this.getProviderCaContract(params.contractAddress);
          const accounts = discoverInfo.accounts;

          if (!accounts) {
            throw new Error('Account not found');
          }

          const accountsInChain = accounts[this.chainId as ChainId];
          if (!accountsInChain || accountsInChain.length === 0) {
            throw new Error(`Account not found in chain: ${this.chainId}`);
          }
          const address = accountsInChain[0];
          result = await contract?.callSendMethod(params.methodName, address, params.args, {
            onMethod: 'transactionHash',
          });
          console.log(result);
        } catch (error: any) {
          console.error('=====callSendMethod error', error);
          return Promise.reject(error);
        }
        break;
      }
      case WalletType.portkey: {
        try {
          result = await this.caContract?.callSendMethod(
            'ManagerForwardCall',
            this.caAddress!,
            {
              caHash: this.caHash,
              contractAddress: params.contractAddress,
              methodName: params.methodName,
              args: params.args,
            },
            { onMethod: 'transactionHash' },
          );
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }

    if (result?.error || result?.code || result?.Error) {
      console.error('=====callSendMethod error result', result);
      return Promise.reject(result);
    }

    const { transactionId, TransactionId } = result.result || result;
    const resTransactionId = TransactionId || transactionId;
    const transaction = await getTxResultRetry({
      TransactionId: resTransactionId!,
      chainId: this.chainId as ChainId,
      rpcUrl: this.rpcUrl!,
      rePendingEnd: new Date().getTime() + SECONDS_60,
    });

    return Promise.resolve({
      TransactionId: transaction.TransactionId,
      TransactionResult: transaction.txResult,
    });
  }

  public async callViewMethod<T, R>(params: CallContractParams<T>): Promise<R> {
    try {
      const contract = await this.getViewContract(params.contractAddress);
      let res;
      if (!params.args) {
        res = await contract![params.methodName].call();
      } else {
        res = await contract![params.methodName].call(params.args);
      }
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getSyncChainStatus() {
    if (this.walletType === WalletType.discover) {
      let version = undefined;
      try {
        const provider = await DetectProvider.getDetectProvider();
        if (!provider) throw Error('Provider not found');

        const providerVersion = compareVersion(provider.providerVersion, '0.0.1');
        version = providerVersion;
        let syncStatus = false;
        if (providerVersion > 0) {
          const status = await provider.request({
            method: MethodsWallet.GET_WALLET_MANAGER_SYNC_STATUS,
            payload: { chainId: this.chainId },
          });
          syncStatus = !!status;
        } else {
          syncStatus = await this.getHolder(this.caAddress!);
        }
        return syncStatus;
      } catch (error) {
        console.error('=====getSyncChainStatus error', error);
        return false;
      }
    } else {
      try {
        const accountSyncInfo = await getAccountInfoSync(this.chainId!, this.wallet.portkeyInfo);
        const { holder, filteredHolders } = accountSyncInfo!;
        if (holder && filteredHolders && filteredHolders.length) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error('=====getSyncChainStatus error', error);
        return false;
      }
    }
  }

  public async getHolder(caAddress: string) {
    // get caHash
    const rst = await did.services.communityRecovery.getHolderInfoByManager({
      caAddresses: [caAddress],
    } as any);
    const caHash = rst[0].caHash;
    let managerInfo: Manager[] = [];
    const originChainId = rst[0].originChainId;

    // get every chain HolderInfo
    const chainsInfo = await did.services.getChainsInfo();
    const result = await Promise.all(
      chainsInfo.map(async (item) => {
        const contract = await this.getViewContracts(
          item.endPoint,
          item.chainId,
          item.caContractAddress,
        );
        const info = await contract.callViewMethod('GetHolderInfo', {
          caHash,
        });
        if (item.chainId === originChainId) managerInfo = info.data.managerInfos;
        return info.data;
      }),
    );

    // compare
    const managerList = result.map((item) => {
      return item.managerInfos as Manager[];
    });

    const managerInfoStr = JSON.stringify(managerInfo);
    const isSame = managerList.every((item) => JSON.stringify(item) === managerInfoStr);

    if (isSame) return true;
    const lastManager = managerInfo.slice(-1)[0].address;
    const isLastManager = managerList.every((item) => item.slice(-1)[0].address === lastManager);
    if (isLastManager) return true;
    return false;
  }
}
