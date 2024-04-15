import { ITrait } from 'types/tokens';
import { formatTokenPrice } from './format';

export const getRankInfoToShow = (rankInfo: IRankInfo, prefix = '') => {
  try {
    return rankInfo?.rank ? `${prefix ? `${prefix}: ` : ''}${formatTokenPrice(rankInfo?.rank)}` : '';
  } catch (error) {
    return '';
  }
};

const map: {
  [key: string]: string;
} = {
  'Weapon(Left Hand)': 'Weapon',
  'Accessory(Right Hand)': 'Accessory',
  Wing: 'Wings',
  Moustauch: 'Mustache',
  Mustaches: 'Mustache',
};

const getTraitsValue = (value: string) => {
  return map[value.trim()] || value.replace(/\(.*\)/, '').trim();
};

export const formatTraits: (traits: ITrait[]) => TCatsRankProbabilityTraits | false = (traits: ITrait[]) => {
  if (!traits || traits?.length < 3) {
    return false;
  }
  const genOne = traits.slice(0, 3).reduce(
    (acc: [string[], string[]], v: ITrait) => {
      acc[0].push(getTraitsValue(v.traitType));
      acc[1].push(getTraitsValue(v.value));
      return acc;
    },
    [[], []],
  );
  const genTwoToNine = traits.slice(3).reduce(
    (acc: [string[], string[]], v: ITrait) => {
      acc[0].push(getTraitsValue(v.traitType));
      acc[1].push(getTraitsValue(v.value));
      return acc;
    },
    [[], []],
  );

  return [genOne, genTwoToNine];
};
