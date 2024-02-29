export type InfoStateType = {
  isMobile?: boolean;
  isSmallScreen?: boolean;
  theme: string | undefined | null;
  baseInfo: {
    rpcUrl?: string;
    identityPoolID?: string;
    // some config
  };
  cmsInfo?: {
    networkTypeV2?: 'TESTNET' | 'MAIN';
    connectUrlV2?: string;
    portkeyServerV2?: string;
    graphqlServerV2?: string;
    curChain?: Chain;
    rpcUrlAELF?: string;
    rpcUrlTDVW?: string;
    rpcUrlTDVV?: string;
    [key: string]: any;
  };
  itemsFromLocal?: string[];
};

expect;
