'use client';
import React, { useEffect, useMemo } from 'react';
import { Layout as AntdLayout } from 'antd';
import Header from 'components/Header';
import dynamic from 'next/dynamic';

import { store } from 'redux/store';
import { setAdInfo, setIsMobile } from 'redux/reducer/info';
import isMobile from 'utils/isMobile';
import Footer from 'components/Footer';
import { useWalletInit } from 'hooks/useWallet';
import WebLoginInstance from 'contract/webLogin';
import { SupportedELFChainId } from 'types';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';
import { PAGE_CONTAINER_ID } from 'constants/index';
import { usePathname } from 'next/navigation';
import styles from './style.module.css';
import clsx from 'clsx';
import { useResponsive } from 'hooks/useResponsive';
import useGetCustomTheme from 'redux/hooks/useGetCustomTheme';
import { isWeChatBrowser } from 'utils/isWeChatBrowser';
import WeChatGuide from 'components/WeChatGuide';
import { backgroundStyle } from 'provider/useNavigationGuard';
import WalletAndTokenInfo from 'utils/walletAndTokenInfo';
import { useGetToken } from 'hooks/useGetToken';
import queryString from 'query-string';

const Layout = dynamic(async () => {
  const { useWebLogin, useCallContract } = await import('aelf-web-login').then((module) => module);
  return (props: React.PropsWithChildren<{}>) => {
    const { children } = props;

    const { cmsInfo } = useGetStoreInfo();
    const customTheme = useGetCustomTheme();

    const webLoginContext = useWebLogin();
    const { getToken } = useGetToken();

    const pathname = usePathname();

    const { callSendMethod: callAELFSendMethod, callViewMethod: callAELFViewMethod } = useCallContract({
      chainId: SupportedELFChainId.MAIN_NET,
      rpcUrl: cmsInfo?.rpcUrlAELF,
    });
    const { callSendMethod: callTDVVSendMethod, callViewMethod: callTDVVViewMethod } = useCallContract({
      chainId: SupportedELFChainId.TDVV_NET,
      rpcUrl: cmsInfo?.rpcUrlTDVV,
    });
    const { callSendMethod: callTDVWSendMethod, callViewMethod: callTDVWViewMethod } = useCallContract({
      chainId: SupportedELFChainId.TDVW_NET,
      rpcUrl: cmsInfo?.rpcUrlTDVW,
    });

    const isGrayBackground = useMemo(() => {
      return pathname === '/coundown';
    }, [pathname]);

    useEffect(() => {
      // store ad tracker
      const search = queryString.parse(location.search);
      store.dispatch(setAdInfo(search));

      const resize = () => {
        const ua = navigator.userAgent;
        const mobileType = isMobile(ua);
        const isMobileDevice =
          mobileType.apple.phone || mobileType.android.phone || mobileType.apple.tablet || mobileType.android.tablet;
        store.dispatch(setIsMobile(isMobileDevice));
      };
      resize();
      window.addEventListener('resize', resize);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }, []);

    const { isLG } = useResponsive();

    useEffect(() => {
      console.log('webLoginContext.loginState', webLoginContext.loginState);
      WebLoginInstance.get().setContractMethod([
        {
          chain: SupportedELFChainId.MAIN_NET,
          sendMethod: callAELFSendMethod,
          viewMethod: callAELFViewMethod,
        },
        {
          chain: SupportedELFChainId.TDVV_NET,
          sendMethod: callTDVVSendMethod,
          viewMethod: callTDVVViewMethod,
        },
        {
          chain: SupportedELFChainId.TDVW_NET,
          sendMethod: callTDVWSendMethod,
          viewMethod: callTDVWViewMethod,
        },
      ]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [webLoginContext.loginState]);

    useWalletInit();

    const isHiddenHeader = useMemo(() => {
      return ['/privacy-policy'].includes(pathname);
    }, [pathname]);

    const isHiddenLayout = useMemo(() => {
      return ['/assets'].includes(pathname);
    }, [pathname]);

    useEffect(() => {
      WalletAndTokenInfo.setWallet(webLoginContext.walletType, webLoginContext.wallet, webLoginContext.version);
      WalletAndTokenInfo.setSignMethod(getToken);
    }, [getToken, webLoginContext]);

    return (
      <>
        {!isHiddenLayout ? (
          <AntdLayout
            className={clsx(
              'h-full overflow-scroll min-w-[360px] bg-no-repeat bg-cover bg-center',
              customTheme.layout.backgroundStyle,
            )}>
            {!isHiddenHeader && <Header />}
            <div id={PAGE_CONTAINER_ID} className="flex-1 overflow-scroll">
              <AntdLayout.Content
                className={`${
                  isLG ? styles['schrodinger-mobile-content'] : styles['schrodinger-content']
                } flex-shrink-0 pb-4 px-4 lg:px-10 w-full ${isGrayBackground ? 'bg-neutralHoverBg' : ''}`}>
                {children}
              </AntdLayout.Content>
              <Footer className={isGrayBackground ? 'bg-neutralHoverBg' : ''} />
            </div>
          </AntdLayout>
        ) : (
          <>{children}</>
        )}
        <div
          className={clsx(
            'w-[100vw] h-[100vh] absolute top-0 left-0 !bg-cover bg-center bg-no-repeat z-[-1000] invisible',
            backgroundStyle.invitee,
          )}></div>
        <div
          className={clsx(
            'w-[100vw] h-[100vh] absolute top-0 left-0 !bg-cover bg-center bg-no-repeat z-[-1000] invisible',
            backgroundStyle.referral,
          )}></div>
        {isWeChatBrowser() && <WeChatGuide />}
      </>
    );
  };
});

export default Layout;
