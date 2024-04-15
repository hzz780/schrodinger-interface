export default function Balance(props: {
  itemDesc?: string;
  className?: string;
  items?: {
    amount: string;
    suffix?: string;
    usd?: string;
  }[];
}) {
  const { itemDesc, items, className } = props;
  return (
    <div className={`flex justify-between p-[16px] rounded-lg bg-neutralHoverBg ${className}`}>
      <span className=" text-lg text-neutralPrimary font-medium">{itemDesc || 'Balance'}</span>
      <div>
        {items?.map((item, index) => {
          return (
            <span key={index} className="flex flex-col items-end justify-center mb-[8px]">
              <span className="text-neutralPrimary text-base font-medium">{`${item.amount} ${
                item?.suffix ? ` ${item.suffix}` : ''
              }`}</span>
              {item.usd && <span className="text-neutralSecondary text-base">{`$ ${item.usd}`}</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}
