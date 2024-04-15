'use client';
import StoreProvider from './store';
import { AELFDProvider } from 'aelf-design';
import WebLoginProvider from './webLoginProvider';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { store } from 'redux/store';

import { ConfigProvider, message } from 'antd';
import enUS from 'antd/lib/locale/en_US';

import { checkDomain } from 'api/request';
import NiceModal from '@ebay/nice-modal-react';
import { setCmsInfo } from 'redux/reducer/info';
import NotFoundPage from 'components/notFound';
import { AELFDProviderTheme } from './config';
import BigNumber from 'bignumber.js';
import { useEffectOnce } from 'react-use';
import { NotFoundType } from 'constants/index';
import Loading from 'components/PageLoading/index';
import { usePathname } from 'next/navigation';
import { forbidScale } from 'utils/common';
import dynamic from 'next/dynamic';
import { useRequestCms } from 'redux/hooks';

const Updater = dynamic(() => import('components/Updater'), { ssr: false });

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isCorrectDomain, setIsCorrectDomain] = useState(false);
  const pathname = usePathname();
  const { getCmsInfo } = useRequestCms();

  const checkHost = useCallback(async () => {
    try {
      const res = await checkDomain();
      if (res && res === 'Success') {
        setIsCorrectDomain(true);
        return true;
      } else {
        setIsCorrectDomain(false);
        return false;
      }
    } catch (err) {
      console.error('checkHost err', err);
      return false;
    }
  }, []);

  const fetchGlobalConfig = useCallback(async () => {
    const res = await getCmsInfo();
    store.dispatch(setCmsInfo(res));
    setLoading(false);
  }, [getCmsInfo]);

  const isNoNeedLoadingPage = useMemo(() => {
    return ['/privacy-policy'].includes(pathname);
  }, [pathname]);

  const initPageData = useCallback(async () => {
    if (isNoNeedLoadingPage) {
      setIsCorrectDomain(true);
      setLoading(false);
      return;
    }
    const hostCorrect = await checkHost();
    if (hostCorrect) {
      await fetchGlobalConfig();
    } else {
      setLoading(false);
    }
  }, [checkHost, fetchGlobalConfig, isNoNeedLoadingPage]);

  useEffect(() => {
    initPageData();
    forbidScale();
  }, [initPageData]);

  useEffectOnce(() => {
    BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
    message.config({
      maxCount: 1,
    });
  });

  return (
    <>
      <StoreProvider>
        <AELFDProvider theme={AELFDProviderTheme}>
          <ConfigProvider locale={enUS} autoInsertSpaceInButton={false}>
            {loading ? (
              <Loading content="Enrollment in progress"></Loading>
            ) : isCorrectDomain ? (
              <WebLoginProvider>
                <Updater />
                <NiceModal.Provider>{children}</NiceModal.Provider>
              </WebLoginProvider>
            ) : (
              <NotFoundPage type={isCorrectDomain ? NotFoundType.path : NotFoundType.domain} />
            )}
          </ConfigProvider>
        </AELFDProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
