import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NOT_NEED_AUTO_JOIN_PAGE } from 'constants/router';

export default function useAutoJoin() {
  const [notAutoJoin, setNotAutoJoin] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const path = '/' + pathname.split('/')[1];
    setNotAutoJoin(NOT_NEED_AUTO_JOIN_PAGE.includes(path));
  }, [pathname]);

  return [notAutoJoin];
}
