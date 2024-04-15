import { useSelector } from 'react-redux';
import { getCustomTheme } from 'redux/reducer/customTheme';

const useGetCustomTheme = () => {
  const info = useSelector(getCustomTheme);
  return info.customTheme;
};

export default useGetCustomTheme;
