import React from 'react';
import { Button } from 'aelf-design';
import inviteHomeLogo from 'assets/img/inviteHomeLogo.png';
import Image from 'next/image';

interface ILoginProps {
  onClick?: () => void;
}

function Login({ onClick }: ILoginProps) {
  return (
    <div className="flex justify-center items-center pt-10 lg:pt-20">
      <div className="main:max-w-5xl lg:max-w-[994px] max-w-[500px] flex flex-col items-center gap-8 lg:gap-10 lg:flex-row">
        <div className="flex flex-col gap-8 lg:gap-10">
          <div className="flex flex-col gap-4 lg:gap-6 text-center lg:text-start">
            <div className=" font-semibold lg:text-[40px] lg:leading-[56px] text-white text-3xl">
              Unlock the Mystery of AI-Powered ACS-404 Inscriptions
            </div>
            <div className="text-lg text-neutralDisable">
              Join Schrödinger via this referral link to earn Flux Points for both you and the referrer.
            </div>
          </div>
          <Button className="lg:w-[286px] w-full" type="primary" onClick={onClick}>
            Log in
          </Button>
        </div>
        <Image
          className="lg:w-[360px] lg:h-[360px] w-[280px] h-[280px] rotate-y-180"
          src={inviteHomeLogo}
          alt="invite logo"
        />
      </div>
    </div>
  );
}

export default React.memo(Login);
