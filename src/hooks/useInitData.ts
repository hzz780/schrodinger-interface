import useEffectOnce from 'react-use/lib/useEffectOnce';
import { useAssets } from './useAssets';

export const useInitData = () => {
  const { init } = useAssets();

  useEffectOnce(() => {
    init();
  });
};
