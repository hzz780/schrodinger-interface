import request, { tokenRequest } from './axios';
import qs from 'qs';
export const fetchEtherscan = async (): Promise<any> => {
  return request.get(
    'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YourApiKeyToken',
  );
};

export const fetchToken = async (data: ITokenParams) => {
  return tokenRequest.post<
    ITokenParams,
    {
      access_token: string;
      expires_in: number;
    }
  >('/token', qs.stringify(data) as any);
};
