import { GenerationEnum } from 'constants/trait';

export type TBaseFilterTrait = {
  traitType: string;
  amount: number;
};

export type TFilterTrait = TBaseFilterTrait & {
  values: TFilterSubTrait[];
};

export type TFilterSubTrait = {
  value: string;
  amount: number;
};

export type TFilterGeneration = {
  generationName: GenerationEnum;
  generationAmount: number;
};
