import { ThemeConfig } from 'antd';

export const AELFDProviderTheme: ThemeConfig = {
  token: {
    colorPrimary: '#3888FF',
    colorPrimaryHover: '#5A9CFF',
    colorPrimaryActive: '#267AF8',
  },
  components: {
    Input: {
      borderRadius: 12,
      borderRadiusSM: 12,
      paddingInlineSM: 11,
    },
    Table: {
      headerColor: 'var(--neutral-secondary)',
      headerSplitColor: 'var(--neutral-white-bg)',
      headerBg: 'var(--neutral-white-bg)',
    },
    Layout: {
      bodyBg: 'var(--neutral-white-bg)',
    },
    Tooltip: {
      colorBgSpotlight: 'var(--fill-mask-2)',
      colorTextLightSolid: 'var(--neutral-white-bg)',
      borderRadius: 4,
    },
    Button: {
      borderColorDisabled: 'var(--neutral-hover-bg)',
      colorTextDisabled: 'var(--neutral-disable)',
      colorBgContainerDisabled: 'var(--neutral-hover-bg)',
      borderRadius: 12,
    },
  },
};
