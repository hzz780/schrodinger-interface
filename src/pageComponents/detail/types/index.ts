// {
//   "name": "SGR-2",
//   "symbol": "SGR-2GEN1",
//   "imageUrl": "https://616pic.com/sucai/1l0ikm8qr.html",
//   "amount": "12",
//   "generation": 3,
//   "generationDesc": "one",
//   "traits":[{
//     "traitType": "Color",
//     "value": "Block",
//     "percent": 11.11
//   },{
//     "traitType": "Eye",
//     "value": "Eye of fire",
//     "percent": 2.34
//   },{
//     "traitType": "Tie",
//     "value": "Purple tie",
//     "percent": 1.25
//   }]
// }

export interface ISGRDetailRes {
  name: string;
  symbol: string;
  imageUrl: string;
  amount: string;
  generation: number;
  generationDesc: string;
  traits: ISGRDetailTrait[];
}

export interface ISGRDetailTrait {
  traitType: string;
  value: string;
  percent: number;
}

export enum PageFrom {
  ALL = 'from',
  MY = 'my',
}
