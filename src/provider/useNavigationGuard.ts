import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { resetCustomTheme, setCustomTheme } from 'redux/reducer/customTheme';
import { dispatch } from 'redux/store';
import { CustomThemeType } from 'redux/types/reducerTypes';

const needHideMenu = ['/invitee'];
const needSetUpCustomTheme = ['/referral', '/invitee'];

export const backgroundStyle: Record<string, string> = {
  invitee: 'bg-[url(../assets/img/referral/invitee.png)]',
  referral: 'bg-[url(../assets/img/referral/inviter.png)]',
};

const useNavigationGuard = () => {
  const pathname = usePathname();

  const setUpCustomTheme = (pathname: string) => {
    const hideMenu = needHideMenu.includes(pathname);
    const key = pathname.split('/')[1];
    if (needSetUpCustomTheme.includes(pathname)) {
      dispatch(
        setCustomTheme({
          layout: {
            backgroundStyle: backgroundStyle?.[key] || backgroundStyle.referral,
          },
          header: {
            theme: CustomThemeType.dark,
            hideMenu,
          },
          footer: {
            theme: CustomThemeType.dark,
          },
        }),
      );
    } else {
      dispatch(resetCustomTheme());
    }
  };

  useEffect(() => {
    setUpCustomTheme(pathname);
  }, [pathname]);
};

export default useNavigationGuard;
