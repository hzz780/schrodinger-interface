import { WebLoginState, useWebLogin } from 'aelf-web-login';
import { useEffect } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { setLoginStatus } from 'redux/reducer/loginStatus';
import { dispatch } from 'redux/store';
import { storages } from 'storages';
import { useGetToken } from './useGetToken';
import { resetAccount } from 'utils/resetAccount';

const useUpdateLoginStatus = () => {
  const { loginState } = useWebLogin();
  const { hasToken } = useGetLoginStatus();
  const { checkTokenValid } = useGetToken();

  useEffect(() => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    let hasLocalToken = !!accountInfo.token && checkTokenValid();
    const isConnectWallet = loginState === WebLoginState.logined;
    if (!isConnectWallet) {
      resetAccount();
      hasLocalToken = false;
      return;
    }
    dispatch(
      setLoginStatus({
        walletStatus: loginState,
        isConnectWallet,
        hasToken: hasLocalToken,
        isLogin: isConnectWallet && hasLocalToken,
      }),
    );
  }, [loginState, hasToken, checkTokenValid]);
};

export default useUpdateLoginStatus;
