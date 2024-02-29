'use client';
import { NetworkType } from '@portkey/provider-types';
import dynamic from 'next/dynamic';
import { store } from 'redux/store';

const APP_NAME = 'schrodinger';

const PortkeyProviderDynamic = dynamic(
  async () => {
    const weblogin = await import('aelf-web-login').then((module) => module);
    return weblogin.PortkeyProvider;
  },
  { ssr: false },
) as any;

const WebLoginProviderDynamic = dynamic(
  async () => {
    const cmsInfo = store.getState().info.cmsInfo;
    const serverV2 = cmsInfo?.portkeyServerV2;
    const connectUrlV2 = cmsInfo?.connectUrlV2;

    const webLogin = await import('aelf-web-login').then((module) => module);

    webLogin.setGlobalConfig({
      onlyShowV2: true,
      appName: APP_NAME,
      chainId: cmsInfo?.curChain || '',
      portkey: {},
      portkeyV2: {
        networkType: (cmsInfo?.networkTypeV2 || 'TESTNET') as NetworkType,
        useLocalStorage: true,
        graphQLUrl: cmsInfo?.graphqlServerV2,
        connectUrl: connectUrlV2 || '',
        requestDefaults: {
          timeout: cmsInfo?.networkType === 'TESTNET' ? 300000 : 80000,
          baseURL: serverV2 || '',
        },
        serviceUrl: serverV2,
      },
      aelfReact: {
        appName: APP_NAME,
        nodes: {
          AELF: {
            chainId: 'AELF',
            rpcUrl: cmsInfo?.rpcUrlAELF as unknown as string,
          },
          tDVW: {
            chainId: 'tDVW',
            rpcUrl: cmsInfo?.rpcUrlTDVW as unknown as string,
          },
          tDVV: {
            chainId: 'tDVV',
            rpcUrl: cmsInfo?.rpcUrlTDVV as unknown as string,
          },
        },
      },
      defaultRpcUrl:
        (cmsInfo?.[`rpcUrl${String(cmsInfo?.curChain).toUpperCase()}`] as unknown as string) ||
        cmsInfo?.rpcUrlTDVW ||
        '',
      networkType: cmsInfo?.networkType || 'TESTNET',
    });
    return webLogin.WebLoginProvider;
  },
  { ssr: false },
);

export default ({ children }: { children: React.ReactNode }) => {
  const info = store.getState().info.cmsInfo;
  return (
    <PortkeyProviderDynamic networkType={info?.networkType} networkTypeV2={info?.networkTypeV2}>
      <WebLoginProviderDynamic
        nightElf={{
          useMultiChain: true,
          connectEagerly: true,
        }}
        portkey={{
          autoShowUnlock: false,
          checkAccountInfoSync: true,
          design: 'CryptoDesign',
          keyboard: {
            v2: true,
          },
        }}
        extraWallets={['discover']}
        discover={{
          autoRequestAccount: true,
          autoLogoutOnDisconnected: true,
          autoLogoutOnNetworkMismatch: true,
          autoLogoutOnAccountMismatch: true,
          autoLogoutOnChainMismatch: true,
        }}
      >
        {children}
      </WebLoginProviderDynamic>
    </PortkeyProviderDynamic>
  );
};
