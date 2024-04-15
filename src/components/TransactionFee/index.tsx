interface IProps {
  // TODO: number precision
  txFee?: string;
  usd?: string;
}

export default function TransactionFee({ txFee, usd }: IProps) {
  return (
    <div className="text-base">
      <div className="flex justify-between">
        <span className="text-[#919191]">Transaction Fee</span>
        <span className="font-medium">{txFee ?? '--'} ELF</span>
      </div>
      <div className="flex justify-end">
        <span className="text-[#919191]">$ {usd ?? '--'}</span>
      </div>
    </div>
  );
}
