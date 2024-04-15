import { TRAIT_DATA, TRAIT_TYPE_DATA, TRAIT_LEVELS } from 'constants/traitData';
import BigNumber from 'bignumber.js';

export const getTraitPercent = (traitType: string, value: string) => {
  return TRAIT_DATA[traitType]?.[value] || 0;
};

export const getTraitTypePercent = (traitType: string) => {
  return TRAIT_TYPE_DATA[traitType] || 0;
};

const TRAIT_TYPE_MAP: any = {
  'Weapon(Left Hand)': 'Weapon',
  'Accessory(Right Hand)': 'Accessory',
  Wing: 'Wings',
  Moustauch: 'Mustache',
  Mustaches: 'Mustache',
};

export const getRarity = (typeArray: string[], valueArray: string[]) => {
  const levelsObject: any = {};
  TRAIT_LEVELS.forEach((level, index) => {
    levelsObject[index] = {
      amount: 0,
      rarity: new BigNumber(level).times(100).toString() + '%',
    };
  });
  typeArray.forEach((type, typeIndex) => {
    try {
      let typeRarity = TRAIT_TYPE_DATA[type];
      if (!typeRarity) {
        typeRarity = TRAIT_TYPE_DATA[TRAIT_TYPE_MAP[type]];
      }

      let traitData = TRAIT_DATA[type];
      if (!traitData) {
        traitData = TRAIT_DATA[TRAIT_TYPE_MAP[type]];
      }

      const valueRarity = traitData[valueArray[typeIndex]];
      const rarityBignumber = new BigNumber(typeRarity).times(valueRarity).div(100);
      const rarity = rarityBignumber.toNumber();
      // console.log('levels.indexOf(rarity):', levels.indexOf(rarity), rarity);
      levelsObject[TRAIT_LEVELS.indexOf(rarity)].amount += 1;
      console.info(
        `${typeIndex} Type ${type} rarity: ${typeRarity} %; Value ${valueArray[typeIndex]} rarity: ${new BigNumber(
          valueRarity,
        )
          .times(100)
          .toString()} %; total rarity: ${rarityBignumber.times(100).toNumber()} %, level: ${TRAIT_LEVELS.indexOf(
          rarity,
        )}`,
      );
    } catch (error) {
      console.error('getRarity item error:', type, ':', valueArray[typeIndex]);
    }
  });
  // console.info('rarityInfo', levelsObject);
  const levelsObjectFormatted: any = {};
  Object.keys(levelsObject).forEach((key) => {
    const item = levelsObject[key];
    levelsObjectFormatted[key] = `amount: ${item.amount}, rarity: ${item.rarity}`;
  });

  console.info('rarityInfo', JSON.stringify(levelsObjectFormatted, null, 4));
};
