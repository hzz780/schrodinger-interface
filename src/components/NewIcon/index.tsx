import clsx from 'clsx';
import { ReactComponent as NewIconSVG } from 'assets/img/icons/new.svg';
interface INewIconProps {
  className?: string;
}

export default function NewIcon({ className }: INewIconProps) {
  return (
    <div className={clsx('flex justify-center items-center rounded-[4px] bg-[#3888FF] w-[32px] h-[16px]', className)}>
      <div className="flex justify-center rounded-[4px] border-solid border-[1px] border-[#9ec4fc] px-[2px] py-[2px]">
        <NewIconSVG />
      </div>
    </div>
  );
}
