/* eslint-disable @next/next/no-img-element */
import React from 'react';

import { ReactComponent as Guide } from 'assets/img/weChat/guide.svg';

function WeChatGuide() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden bg-fillMask5 z-[101]">
      <div className="w-full flex items-center justify-end pt-[16px] px-[24px]">
        <Guide />
      </div>
      <div className="flex justify-center items-center px-[34px] mt-[8px]">
        <img
          src={require('assets/img/weChat/browser.png').default.src}
          width={44}
          height={44}
          className="w-[44px] h-[44px]"
          alt={'browser logo'}
        />
        <span className="text-base flex-1 max-w-max text-white font-medium pl-[10px]">
          Click &quot;...&quot; on the upper right corner and select &quot;
          <span className="text-brandDefault">Open in Browser</span>&quot;
        </span>
      </div>
    </div>
  );
}

export default React.memo(WeChatGuide);
