import { setTheme } from 'redux/reducer/info';
import { dispatch, useSelector } from 'redux/store';

export const useTheme = (): [string, (theme: string) => void] => {
  const { theme: storeTheme } = useSelector((store) => store.info);
  const theme = storeTheme || 'light';
  const changeTheme = (theme: string) => {
    dispatch(setTheme(theme));
  };
  return [theme, changeTheme];
};
