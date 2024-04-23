import { setItemsFromLocal } from 'redux/reducer/info';
import { resetLoginStatus } from 'redux/reducer/loginStatus';
import { setWalletInfo } from 'redux/reducer/userInfo';
import { dispatch } from 'redux/store';
import { storages } from 'storages';

export const resetAccount = () => {
  localStorage.removeItem(storages.accountInfo);
  localStorage.removeItem(storages.walletInfo);
  dispatch(
    setWalletInfo({
      address: '',
      aelfChainAddress: '',
    }),
  );
  dispatch(setItemsFromLocal([]));
  dispatch(resetLoginStatus());
};
