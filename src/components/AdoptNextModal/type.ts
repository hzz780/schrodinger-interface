import { ISGRTokenInfoProps } from 'components/SGRTokenInfo';
import { ITrait } from 'types/tokens';

export interface IAdoptNextData {
  SGRToken: ISGRTokenInfoProps;
  allTraits: ITrait[];
  images: string[];
  inheritedTraits: ITrait[];
  transaction: {
    txFee?: string;
    usd?: string;
  };
  ELFBalance: {
    amount?: string;
    usd?: string;
  };
}
