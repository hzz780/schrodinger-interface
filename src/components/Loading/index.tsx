import Lottie from 'lottie-react';
import LoadingAnimation from 'assets/img/loading-animation.json';
import LoadingAnimationBlue from 'assets/img/loading-animation-blue.json';
import { useMemo } from 'react';
import React from 'react';

const loadingImg = {
  white: LoadingAnimation,
  blue: LoadingAnimationBlue,
};

interface IProps {
  color?: 'white' | 'blue';
}

function Loading({ color = 'blue' }: IProps) {
  const options = useMemo(() => {
    return {
      animationData: loadingImg[color],
      loop: true,
      autoplay: true,
    };
  }, [color]);

  return <Lottie {...options} className="w-[40px] h-[40px]" />;
}

export default React.memo(Loading);
