import { useEffect, useState } from 'react';

export default function useSafeAreaHeight() {
  const [topSafeHeight, setTopSafeHeight] = useState<number>(0);
  const [bottomSafeHeight, setBottomSafeHeight] = useState<number>(0);

  useEffect(() => {
    const { statusBarHeight = 0, bottomBarHeight = 0 } = window?.portkeyShellApp?.deviceEnv ?? {};
    setTopSafeHeight(statusBarHeight);
    setBottomSafeHeight(bottomBarHeight);
  }, []);
  return { topSafeHeight, bottomSafeHeight };
}
