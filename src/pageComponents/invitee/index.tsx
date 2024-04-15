import Login from './components/Login';
import { store } from 'redux/store';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { useCallback, useEffect, useState } from 'react';
import { setLoginTrigger } from 'redux/reducer/info';
import { useCheckJoined } from 'hooks/useJoin';
import useAccountModal from './useAccountModal';
import useLoading from 'hooks/useLoading';
import { useJoinStatus } from 'redux/hooks';

export default function Invitee() {
  const isJoin = useJoinStatus();
  const { isLogin } = useWalletService();
  const { showLoading, closeLoading } = useLoading();
  const [showLogin, setShowLogin] = useState(true);
  const { checkLogin } = useCheckLoginAndToken();
  const { newUser, oldUser } = useAccountModal();
  const { getJoinStatus } = useCheckJoined();

  const toLogin = useCallback(() => {
    store.dispatch(setLoginTrigger('login'));
    checkLogin();
  }, [checkLogin]);

  const checkJoin = useCallback(async () => {
    if (!isLogin || !showLogin) return;
    let joined = isJoin;
    if (!joined) {
      showLoading();
      joined = await getJoinStatus();
      closeLoading();
    }

    setShowLogin(false);
    joined ? oldUser() : newUser();
  }, [closeLoading, getJoinStatus, isJoin, isLogin, newUser, oldUser, showLoading, showLogin]);

  useEffect(() => {
    if (isLogin) {
      checkJoin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  return <>{showLogin && <Login onClick={toLogin} />}</>;
}
