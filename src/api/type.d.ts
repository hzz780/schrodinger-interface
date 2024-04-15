interface ITokenParams {
  grant_type: string;
  scope: string;
  client_id: string;
  pubkey?: string;
  version?: string;
  signature?: string;
  timestamp?: number;
  accountInfo?: Array<{ chainId: string; address: string }>;
  source: string;
}

interface IUsersAddressReq {
  address: string;
}

interface IUsersAddressRes {
  address: string;
  fullAddress: string;
  name: string;
  profileImage: string;
  profileImageOriginal: string;
  bannerImage: string;
  email: string;
  twitter: string;
  instagram: string;
}

interface IBaseTrait {
  traitType: string;
  value: string;
}

interface IAdoptImageInfo {
  adoptImageInfo: {
    generation: number;
    attributes: (IBaseTrait & { percent: number })[];
    images: string[];
  };
}

interface IWaterImageRequest {
  image: string;
  adoptId: string;
}

interface IWaterImage {
  image: string;
  signature: string;
  imageUri: string;
}
interface IGetPointsParams {
  domain: string;
  address: string;
}

interface IPointItem {
  action: string;
  displayName: string;
  symbol: string;
  amount: number;
  rate: number;
  updateTime: number;
  inviteFollowersNumber: number;
  inviteRate: number;
  thirdFollowersNumber: number;
  thirdRate: number;
}

interface IGetPointsData {
  pointDetails: Array<IPointItem>;
}

interface ICatItemModel {
  name: string;
  symbol: string;
  image: string;
  amount: string;
  generation: number;
  blockTime: number;
  inscriptionInfo?: string; // if exists, it will be shown above the Image
  traits: Array<{
    traitType: string;
    value: string;
    percent: number;
  }>;
}

type TCatsRankProbabilityTraits = [[string[], string[]], [string[], string[]]];
interface ICatsRankProbabilityParams {
  catsTraits: TCatsRankProbabilityTraits[];
  address: string;
}

interface ICatsRankProbabilityData {
  rankGenOne: IRankGenInfo;
  rankTwoToNine: IRankGenInfo;
  rank: IRankInfo;
  levelInfo: ILevelInfo;
}

interface IRankInfo {
  rank: number;
  total: number;
  probability: string;
  percent: string;
  type: string;
  price: {
    elf: string;
    usd: string;
    sgr: string;
  };
}

interface IRankGenInfo {
  rank: number;
  total: number;
  probability: string;
  percent: string;
  traitsProbability: Record<string, number>;
  probabilityTypes: string[];
}

interface ILevelInfo {
  singleProbability: number | string;
  items: number | string;
  situation: number | string;
  totalProbability: number | string;
  token: string;
  classify: number | string;
  level: string;
  grade: number | string;
  star: number | string;
  describe: string;
  awakenPrice: string | number;
}

type TRankInfoAddLevelInfo = IRankInfo & {
  levelInfo?: ILevelInfo;
};

interface ICatsListParams {
  chainId: string;
  address?: string; // wallet address
  searchAddress?: string; // search address
  tick?: string;
  traits?: Array<{
    traitType: string;
    values: string[];
  }>;
  generations?: number[];
  skipCount?: number;
  maxResultCount?: number;
  keyword?: string;
  rarities?: string[];
}
