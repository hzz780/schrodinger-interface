import { useCallback } from 'react';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { DeviceTypeEnum } from 'types';

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useCmsInfo = () => useAppSelector((state) => state.info.cmsInfo);
export const useJoinStatus = () => useAppSelector((state) => state.info.isJoin);

export const useTxFeeStore = () => useAppSelector((state) => state.assets.txFee);
export const useTokenPriceMapStore = () => useAppSelector((state) => state.assets.tokenPriceMap);
import { getDefaultCustomization, getAndroidCustomization, getIOSCustomization, getGlobalConfig } from 'api/request';
import { TCustomizationItemType } from 'redux/types/reducerTypes';

export enum CmsDeviceConfigEnum {
  Default = 'default',
  Android = 'android',
  iOS = 'ios',
}

const cmsRequestMap: Record<CmsDeviceConfigEnum, () => Promise<{ data: TCustomizationItemType }>> = {
  [CmsDeviceConfigEnum.Default]: getDefaultCustomization,
  [CmsDeviceConfigEnum.Android]: getAndroidCustomization,
  [CmsDeviceConfigEnum.iOS]: getIOSCustomization,
};

export const useRequestCms = () => {
  const getCmsInfo = useCallback(async () => {
    const { platform } = window?.portkeyShellApp?.deviceEnv ?? {};

    let requestDeviceConfig = cmsRequestMap.default;
    switch (platform) {
      case DeviceTypeEnum.Android:
        requestDeviceConfig = cmsRequestMap.android;
        break;
      case DeviceTypeEnum.iOS:
        requestDeviceConfig = cmsRequestMap.ios;
        break;
      case DeviceTypeEnum.Macos:
      case DeviceTypeEnum.Windows:
      case DeviceTypeEnum.Web:
        requestDeviceConfig = cmsRequestMap.default;
        break;
      default:
        break;
    }

    try {
      const [globalConfig, deviceConfig] = await Promise.all([getGlobalConfig(), requestDeviceConfig()]);
      return {
        ...(globalConfig.data || {}),
        ...(deviceConfig.data || {}),
      };
    } catch (error) {
      console.error('getCmsConfig err', error);
      return {};
    }
  }, []);

  return { getCmsInfo };
};
