interface ITransactionResult {
  TransactionId: string;
  Status: string;
  Logs: ITransactionLog[];
  [props: string]: any;
}

interface IClaimDropResult {
  currentAmount: string;
  totalAmount: string;
  dropId: string;
  claimDetailList?: {
    value: IClaimDetailRecordList[];
  };
  TransactionId: string;
  address: string;
}

interface IConfirmAdoptParams {
  adoptId: string;
  image: string;
  signature: string;
  imageUri: string;
}

interface IRerollSGRParams {
  symbol: string;
  amount: string;
  domain: string;
}

interface IGetBalanceParams {
  symbol: string;
  owner: string;
}

interface IGetAllowanceParams {
  symbol: string;
  owner: string;
  spender: string;
}

interface IGetAllowanceResponse {
  symbol: string;
  owner: string;
  spender: string;
  allowance: number;
}

interface IApproveParams {
  spender: string;
  symbol: string;
  amount: number;
}
