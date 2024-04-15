import { useSelector } from 'react-redux';
import { selectInfo } from 'redux/reducer/info';

const useGetStoreInfo = () => {
  const info = useSelector(selectInfo);
  return {
    cmsInfo: info.cmsInfo,
    loginTrigger: info.loginTrigger,
    hasToken: info.hasToken,
  };
};

export default useGetStoreInfo;
