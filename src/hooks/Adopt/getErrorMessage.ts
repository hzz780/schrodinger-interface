import { handleErrorMessage } from '@portkey/did-ui-react';
import { AdoptActionErrorCode } from './adopt';

const AdoptActionErrorMessage: { [x in `${AdoptActionErrorCode}`]: string } = {
  missingParams: 'Missing contractAddress or chainId',
  approveFailed: 'Approve failed',
  adoptFailed: 'Can not get adopt result!',
  parseEventLogsFailed: 'Parse Event logs error',
  cancel: 'user cancel',
};

export const getAdoptErrorMessage = (error: any, message?: string) => {
  const code = (typeof error === 'string' ? error : undefined) as `${AdoptActionErrorCode}`;
  if (code && AdoptActionErrorMessage[code]) return AdoptActionErrorMessage[code];
  const _error = error?.errorMessage?.message || error?.errorMessage || error?.message || error;
  return handleErrorMessage(_error, message);
};
