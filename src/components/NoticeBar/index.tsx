import { ReactComponent as ExclamationCircleSVG } from 'assets/img/exclamationCircle.svg';

interface INoticeBar {
  text: string;
}

export default function NoticeBar({ text }: INoticeBar) {
  return (
    <div className="bg-[#FFF3E0] px-[12px] py-[16px] rounded-md flex gap-[8px]">
      <ExclamationCircleSVG className="w-[20px] h-[20px] flex-none" />
      <span className="text-[14px] leading-[22px]">{text}</span>
    </div>
  );
}
