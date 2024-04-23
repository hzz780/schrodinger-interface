import Login from './components/Login';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { useCallback, useEffect, useState } from 'react';
import { useCheckJoined } from 'hooks/useJoin';
import useAccountModal from './useAccountModal';
import useLoading from 'hooks/useLoading';
import { useJoinStatus } from 'redux/hooks';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

export default function Invitee() {
  const isJoin = useJoinStatus();
  const { isLogin } = useGetLoginStatus();
  const { showLoading, closeLoading } = useLoading();
  const [showLogin, setShowLogin] = useState(true);
  const { checkLogin } = useCheckLoginAndToken();
  const { newUser, oldUser } = useAccountModal();
  const { getJoinStatus } = useCheckJoined();

  const toLogin = useCallback(() => {
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
