import { useResponsive } from 'ahooks';
import Loading from 'components/Loading';
import Image from 'next/image';

export default function NotFoundPage() {
  const responsive = useResponsive();
  return (
    <section className="w-full h-full flex justify-center items-center flex-col px-[16px]">
      <Image
        src={require('assets/img/notFound.svg').default}
        alt="404"
        width={responsive.md ? 400 : 240}
        height={responsive.md ? 240 : 144}
      />
      <span className="mt-[48px] text-[48px] leading-[56px] font-semibold text-[#1A1A1A]">404</span>
      <span className="mt-[16px] text-[18px] leading-[26px] font-medium text-[#919191] text-center">
        The Tier 2 domain name you are accessing does not exist.
      </span>
    </section>
  );
}
