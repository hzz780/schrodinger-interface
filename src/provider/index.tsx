'use client';
import StoreProvider from './store';
import { ConfigProvider } from 'antd';
import { AELFDProvider } from 'aelf-design';
import enUS from 'antd/lib/locale/en_US';
import WebLoginProvider from './webLoginProvider';

import { useEffect, useState } from 'react';
import { store } from 'redux/store';
import Loading from 'components/Loading';
import { setEthData } from 'redux/reducer/data';

import { fetchEtherscan } from 'api/request';

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const storeConfig = async () => {
    const { result } = await fetchEtherscan();
    store.dispatch(setEthData(result));
    setLoading(false);
  };
  useEffect(() => {
    storeConfig();
  }, []);
  return (
    <>
      <StoreProvider>
        <AELFDProvider>
          <ConfigProvider locale={enUS} autoInsertSpaceInButton={false}>
            {loading ? <Loading></Loading> : <WebLoginProvider>{children}</WebLoginProvider>}
          </ConfigProvider>
        </AELFDProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
