import { Button } from 'aelf-design';
import CountDownModule from './components/CountDownModule';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { store } from 'redux/store';
import { timeStamp } from 'console';

export default function CountDownPage() {
  const { checkLogin, isOK } = useCheckLoginAndToken();
  const { isLogin } = useWalletService();

  const socialList = store.getState().info.cmsInfo;

  const handleJoinUs = () => {
    if (isOK) {
    } else {
      checkLogin();
    }
  };
  return (
    <section className="pt-[64px] md:pt-[80px] flex flex-col items-center w-full">
      <img
        src={require('assets/img/schrodinger.png').default.src}
        alt="schrodinger"
        className="rounded-lg md:rounded-xl w-[80px] h-[80px] md:w-[120px] md:h-[120px]"
      />
      <h1 className="mt-[24px] md:mt-[40px] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-semibold text-[#1A1A1A] text-center">
        The first aelf Al Inscriptions 404 coming soon...
      </h1>
      <section className="mt-[24px] md:mt-[40px]">
        <CountDownModule targetDate={'2024-02-30' as unknown as Date} />
      </section>
      <section className="mt-[64px] md:mt-[100px] mx-auto w-full">
        {!isLogin ? (
          <Button
            type="primary"
            size="ultra"
            className="w-full mx-auto max-w-[356px] md:!w-[356px]  !rounded-xl"
            onClick={handleJoinUs}
          >
            Join Us Now
          </Button>
        ) : (
          <div className="text-[#434343] text-[16px] leading-[24px] font-medium text-center">
            You are enrolled, please wait for CAT coming!
          </div>
        )}
      </section>
      <section className="mt-[32px] md:mt-[40px] flex justify-center gap-[16px]">
        {socialList?.map((item, index) => {
          return (
            <div className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-[24px] bg-white"></div>
          );
        })}
      </section>
    </section>
  );
}
