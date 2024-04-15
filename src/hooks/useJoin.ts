import { useModal } from '@ebay/nice-modal-react';
import { message } from 'antd';
import JoinModal from 'components/JoinModal';
import { GetJoinRecord, Join } from 'contract/schrodinger';
import { useCallback, useEffect, useState } from 'react';
import { IContractError } from 'types';
import { getDomain } from 'utils';
import { TransactionFeeNotEnough } from 'utils/formattError';
import useAutoJoin from './useAutoJoin';
import { useWebLogin } from 'aelf-web-login';
import { store } from 'redux/store';
import { setIsJoin } from 'redux/reducer/info';

export const useCheckJoined = () => {
  const JoinModalInit = useModal(JoinModal);
  const { wallet } = useWebLogin();
  const [notAutoJoin] = useAutoJoin();

  const toJoin = useCallback(async () => {
    return new Promise((resolve) => {
      JoinModalInit.show({
        buttonInfo: {
          openLoading: true,
          onConfirm: async () => {
            const domain = getDomain();
            try {
              const res = await Join({
                domain,
              });
              store.dispatch(setIsJoin(true));
              resolve(true);
              console.log(res, 'res==checkJoined');
            } catch (error) {
              resolve(false);
              const errorMessage = (error as IContractError).errorMessage?.message;
              if (errorMessage?.includes('Pre-Error: Transaction fee not enough')) {
                message.error(TransactionFeeNotEnough);
                return;
              }
              message.error(errorMessage);
              console.log(error, 'error===checkJoined');
            } finally {
              JoinModalInit.hide();
            }
          },
        },
        onCancel: () => {
          resolve(false);
          JoinModalInit.hide();
        },
      });
    });
  }, [JoinModalInit]);

  const getJoinStatus = useCallback(
    async (address?: string) => {
      try {
        const isJoin = await GetJoinRecord(address || wallet.address);
        store.dispatch(setIsJoin(isJoin));
        return isJoin;
      } catch (error) {
        console.log('getJoinStats-error', error);
        store.dispatch(setIsJoin(false));
        return false;
      }
    },
    [wallet.address],
  );

  const checkJoined = useCallback(
    async function (address: string) {
      if (!address) return;
      const isJoin = await getJoinStatus(address);
      if (isJoin || notAutoJoin) return isJoin;
      return await toJoin();
    },
    [getJoinStatus, notAutoJoin, toJoin],
  );

  return { checkJoined, toJoin, getJoinStatus };
};
