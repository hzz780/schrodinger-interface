import clsx from 'clsx';
import styles from './style.module.css';
import { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useResponsive } from 'hooks/useResponsive';
import { discordSvg, gitbookSvg, linktreeSvg, telegramSvg, twitterSvg } from 'assets/img/social';
import { openExternalLink } from 'utils/openlink';
import useGetCustomTheme from 'redux/hooks/useGetCustomTheme';

const MEDIA_LIST = [
  {
    icon: twitterSvg,
    link: 'https://twitter.com/ProjSchrodinger',
    name: 'twitter',
  },
  {
    icon: discordSvg,
    link: 'https://discord.com/invite/P8SuN7mzth',
    name: 'discord',
  },
  {
    icon: telegramSvg,
    link: 'https://t.me/projectschrodingercat',
    name: 'telegram',
  },
  {
    icon: gitbookSvg,
    link: 'https://schrodingernft.gitbook.io/schroedingers-cat/',
    name: 'gitbook',
  },
  {
    icon: linktreeSvg,
    link: 'https://linktr.ee/projectschrodinger',
    name: 'linktree',
  },
];

export default function Footer({ className }: { className?: string }) {
  const pathName = usePathname();
  const customTheme = useGetCustomTheme();

  const { isLG } = useResponsive();

  const showMargin = useMemo(() => {
    if (!isLG) return false;
    const path = pathName?.split('/')?.[1];
    return ['detail', ''].includes(path);
  }, [isLG, pathName]);

  const onMediaClick = useCallback((url: string) => {
    if (!url) return;
    openExternalLink(url, '_blank');
  }, []);

  return (
    <section
      className={clsx('flex-shrink-0', showMargin ? 'mb-[80px]' : 'mb-0', styles[customTheme.footer.theme], className)}>
      <div className={`${styles.footer}`}>
        <div className=" flex flex-row items-center gap-[24px] cursor-pointer">
          {MEDIA_LIST.map((item) => (
            <div
              onClick={() => onMediaClick(item.link)}
              key={item.name}
              className={clsx(styles.icon, styles[item.name], 'w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]')}>
              {<item.icon />}
            </div>
          ))}
        </div>
        <span className={styles['footer-text']}>Schrödinger@2024</span>
      </div>
    </section>
  );
}
