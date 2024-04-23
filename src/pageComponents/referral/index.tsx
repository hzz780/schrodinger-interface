/* eslint-disable @next/next/no-img-element */
import { useTimeoutFn } from 'react-use';
import { GetJoinRecord } from 'contract/schrodinger';
import { useWalletService } from 'hooks/useWallet';
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useLoading from 'hooks/useLoading';
import { useCopyToClipboard } from 'react-use';
import { message } from 'antd';
import { QRCode } from 'react-qrcode-logo';
import { Button } from 'aelf-design';
import useResponsive from 'hooks/useResponsive';
import SkeletonImage from 'components/SkeletonImage';
import { PrimaryDomainName } from 'constants/common';
import clsx from 'clsx';
import { useJoinStatus } from 'redux/hooks';
import { appEnvironmentShare } from 'utils/appEnvironmentShare';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

function Referral() {
  const { wallet } = useWalletService();
  const { isLogin } = useGetLoginStatus();

  const [, setCopied] = useCopyToClipboard();
  const { isLG } = useResponsive();
  const isJoin = useJoinStatus();

  const { showLoading, closeLoading, visible } = useLoading();

  const router = useRouter();

  const checkJoined = useCallback(async () => {
    let isJoin = false;
    try {
      isJoin = await GetJoinRecord(wallet.address);
    } catch (error) {
      console.log('Referral-Record-error', error);
    } finally {
      closeLoading();
    }

    !isJoin && router.replace('/');
  }, [closeLoading, router, wallet.address]);

  const shareLink = useMemo(() => `${PrimaryDomainName}/invitee?referrer=${wallet.address}`, [wallet.address]);

  const onCopy = useCallback(() => {
    setCopied(shareLink);
    message.success('Copied');
  }, [setCopied, shareLink]);

  const onInvite = useCallback(() => {
    try {
      appEnvironmentShare({
        shareContent: shareLink,
      });
    } catch (error) {
      onCopy();
    }
  }, [onCopy, shareLink]);

  useTimeoutFn(() => {
    if (!isLogin) {
      closeLoading();
      router.replace('/');
    }
  }, 3000);

  useEffect(() => {
    showLoading();
    if (wallet.address && !isJoin) {
      checkJoined();
    } else {
      closeLoading();
    }
  }, [checkJoined, wallet.address, isJoin, showLoading, closeLoading]);

  if (visible) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1360px] pt-[24px] lg:pt-[48px] flex flex-col lg:flex-row justify-center items-center">
        <div className="w-screen flex-nowrap justify-between overflow-hidden flex xs:w-[500px] flex-row lg:flex-col lg:w-[452px] mr-0 mb-0 lg:mr-[40px]">
          <div className="min-w-[248px] flex-1 pl-[16px] xs:pl-0">
            <h1 className="text-3xl lg:text-5xl font-semibold text-neutralWhiteBg">
              Invite Friends to <span className="text-brandDefault">Schrödinger</span>
            </h1>
            <p className="text-sm lg:text-lg text-neutralDisable mt-[12px] lg:mt-[24px]">
              Share your referral link and invite friends to join Schrödinger, where both of you can earn Flux Points!
            </p>
          </div>
          <div
            className={clsx(
              'w-[160px] lg:w-[360px] h-[160px] lg:h-[360px] mt-[24px] flex justify-start items-center',
              isLG ? 'rotate-y-180' : '',
            )}>
            <SkeletonImage
              img={require('assets/img/inviteHomeLogo.png').default.src}
              width={360}
              height={360}
              className="w-[160px] lg:w-[360px] h-[160px] lg:h-[360px]"
            />
          </div>
        </div>
        <div className="w-full xs:w-[360px] max-w-[360px] lg:w-[452px] lg:max-w-[452px] mt-[6px] lg:mt-0 py-0 lg:py-[16px]">
          <div className="w-full rounded-lg bg-inviteCardBg px-[16px] lg:px-[32px] py-[24px] lg:py-[40px]">
            <p className="w-full text-base lg:text-xl text-neutralTitle font-semibold text-center">
              Referral QR Code & Referral Link
            </p>
            <div className="w-full flex justify-center items-center mt-[16px] lg:mt-[32px]">
              <div className="rounded-md overflow-hidden">
                <QRCode
                  value={shareLink}
                  size={160}
                  quietZone={8}
                  logoImage={require('assets/img/schrodingerLogo.png').default.src}
                  fgColor="#1A1A1A"
                  logoWidth={30}
                  logoHeight={30}
                />
              </div>
            </div>
            <div className="w-full mt-[16px] lg:mt-[24px] flex items-center rounded-md bg-neutralDefaultBg">
              <span className="flex-1 text-sm lg:text-lg text-neutralTitle truncate py-[16px] pl-[16px] pr-[4px] font-medium">
                {shareLink}
              </span>
              <div
                className="h-full flex items-center justify-center pr-[16px] pl-[4px] cursor-pointer"
                onClick={onCopy}>
                <img
                  src={require('assets/img/copy.svg').default}
                  alt="copy"
                  className="w-[16px] lg:w-[20px] h-[16px] lg:h-[20px]"
                />
              </div>
            </div>
            <Button type="primary" className="mt-[16px] lg:mt-[32px] w-full !rounded-lg" onClick={onInvite}>
              Invite Friends
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Referral;
