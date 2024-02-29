import { useWebLogin, WalletType, WebLoginState } from 'aelf-web-login';
import { useCallback } from 'react';
import { storages } from 'storages';
import { fetchToken } from 'api/request';
import { message } from 'antd';
import { useRequest } from 'ahooks';
import useDiscoverProvider from './useDiscoverProvider';

const AElf = require('aelf-sdk');

export const useGetToken = () => {
  const { loginState, wallet, getSignature, walletType, version } = useWebLogin();

  const { getSignatureAndPublicKey } = useDiscoverProvider();

  const { runAsync } = useRequest(fetchToken, {
    retryCount: 3,
    manual: true,
    onSuccess(res) {
      localStorage.setItem(
        storages.accountInfo,
        JSON.stringify({
          account: wallet.address,
          token: res.access_token,
          expirationTime: Date.now() + res.expires_in * 1000,
        }),
      );
    },
  });

  const getToken = useCallback(async () => {
    if (loginState !== WebLoginState.logined) return;
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (
      accountInfo?.token &&
      Date.now() < accountInfo?.expirationTime &&
      accountInfo.account === wallet.address
    ) {
      return;
    } else {
      localStorage.removeItem(storages.accountInfo);
    }
    const timestamp = Date.now();

    const signInfo = AElf.utils.sha256(`${wallet.address}-${timestamp}`);

    let publicKey = '';
    let signature = '';
    let source = '';

    if (walletType === WalletType.discover) {
      try {
        const { pubKey, signatureStr } = await getSignatureAndPublicKey(signInfo);
        publicKey = pubKey || '';
        signature = signatureStr || '';
        source = 'portkey';
      } catch (error) {
        message.error(error as string);
        return;
      }
    } else {
      const sign = await getSignature({
        appName: 'schrodinger',
        address: wallet.address,
        signInfo,
      });
      if (sign?.errorMessage) {
        message.error(sign.errorMessage);
        return;
      }
      publicKey = wallet.publicKey || '';
      signature = sign.signature;
      if (walletType === WalletType.elf) {
        source = 'nightElf';
      } else {
        source = 'portkey';
      }
    }
    runAsync({
      grant_type: 'signature',
      scope: 'SchrodingerServer',
      client_id: 'SchrodingerServer_App',
      timestamp,
      signature,
      source,
      publickey: publicKey,
      address: wallet.address,
    } as ITokenParams);
  }, [loginState, getSignature, wallet]);

  return { getToken };
};
