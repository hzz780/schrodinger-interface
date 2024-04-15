import { ICatsListData } from 'types/tokens';
import { TCustomizationItemType, TGlobalConfigType } from 'redux/types/reducerTypes';
import request, { cmsRequest, tokenRequest } from './axios';
import qs from 'qs';

export const checkDomain = async (): Promise<any> => {
  return request.get('/app/domain/check');
  // return 'Success';
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

export const fetchSchrodingerImagesByAdoptId = async ({ adoptId }: { adoptId: string }): Promise<IAdoptImageInfo> => {
  return request.get(`/app/schrodinger/imageInfo?adoptId=${adoptId}`);
};

export const fetchWaterImageRequest = async (data: IWaterImageRequest): Promise<IWaterImage> => {
  // const params = qs.stringify(data, { encode: false });
  return request.post(`/app/schrodinger/waterMarkImageInfo`, data, {
    headers: { Accept: 'text/plain;v=1.0', 'Content-Type': 'application/json' },
  });
};

export const getPoints = async (params: IGetPointsParams): Promise<IGetPointsData> => {
  return request.get('/app/my/points', { params });
};

export const checkAIService = () => request.get<boolean>('/app/schrodinger/IsOverloaded');

export const catsRankProbability = async (data: ICatsRankProbabilityParams): Promise<ICatsRankProbabilityData[]> => {
  return request.post('/app/item/level', data);
};

export const catsList = async (data: ICatsListParams): Promise<ICatsListData> => {
  return request.post('/app/cat/list', data);
};

export const getGlobalConfig = async (): Promise<{ data: TGlobalConfigType }> => {
  return cmsRequest.get('/items/schrodingerDefaultConfig');
};

export const getDefaultCustomization = async (): Promise<{ data: TCustomizationItemType }> => {
  return cmsRequest.get('/items/schrodingerCustomization');
};

export const getAndroidCustomization = async (): Promise<{ data: TCustomizationItemType }> => {
  return cmsRequest.get('/items/schrodingerAndroidCustomization');
};

export const getIOSCustomization = async (): Promise<{ data: TCustomizationItemType }> => {
  return cmsRequest.get('/items/schrodingerIOSCustomization');
};
