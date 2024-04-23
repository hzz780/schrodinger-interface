'use client';
import { Modal, Button, Tooltip } from 'antd';
import { getSecondHostName, dotString } from 'utils/common';
import { useMemo, useState } from 'react';
import styles from './style.module.css';
import useResponsive from 'hooks/useResponsive';
import useGetCustomTheme from 'redux/hooks/useGetCustomTheme';
import clsx from 'clsx';
import { Popover } from 'antd-mobile';

export function NavHostTag() {
  const hostName = useMemo(() => getSecondHostName(), []);
  const { isLG } = useResponsive();
  const customTheme = useGetCustomTheme();

  const hostStr = useMemo(() => dotString(hostName, !isLG ? 16 : 10), [hostName, isLG]);

  return (
    <>
      {hostName && (
        <>
          <div className={clsx(styles.navHostTag, styles[customTheme.header.theme])}>
            {!isLG ? (
              <Tooltip color="black" title={hostName} overlayInnerStyle={{ color: 'white' }}>
                <p className="w-full truncate">{hostStr}</p>
              </Tooltip>
            ) : (
              <Popover content={hostName} trigger="click" mode="dark">
                <p className="w-full truncate max-w-max">{hostStr}</p>
              </Popover>
            )}
          </div>
        </>
      )}
    </>
  );
}

export function HomeHostTag() {
  const hostName = useMemo(() => getSecondHostName(), []);
  const { isLG } = useResponsive();

  const hostStr = useMemo(() => 'Invited by ' + dotString(hostName, !isLG ? 16 : 10), [hostName, isLG]);

  return (
    <>
      {hostName && (
        <>
          <div className={styles.homeHostTag}>
            {!isLG ? (
              <Tooltip title={hostName} color="black" overlayInnerStyle={{ color: 'white' }}>
                {hostStr}
              </Tooltip>
            ) : (
              <Popover content={`Invited by ${hostName}`} trigger="click" mode="dark">
                <>{hostStr}</>
              </Popover>
            )}
          </div>
        </>
      )}
    </>
  );
}
