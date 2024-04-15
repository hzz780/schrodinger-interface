'use client';
import { Modal, Button, Tooltip } from 'antd';
import { getSecondHostName, dotString } from 'utils/common';
import { useMemo, useState } from 'react';
import styles from './style.module.css';
import useResponsive from 'hooks/useResponsive';
import useGetCustomTheme from 'redux/hooks/useGetCustomTheme';
import clsx from 'clsx';

export function NavHostTag() {
  const [open, setOpen] = useState(false);
  const hostName = useMemo(() => getSecondHostName(), []);
  const { isLG } = useResponsive();
  const customTheme = useGetCustomTheme();

  const hostStr = useMemo(() => dotString(hostName, !isLG ? 16 : 10), [hostName, isLG]);

  return (
    <>
      {hostName && (
        <>
          <div className={clsx(styles.navHostTag, styles[customTheme.header.theme])} onClick={() => setOpen(true)}>
            {!isLG ? (
              <Tooltip color="black" title={hostName} overlayInnerStyle={{ color: 'white' }}>
                <p className="w-full truncate">{hostStr}</p>
              </Tooltip>
            ) : (
              <p className="w-full truncate max-w-max">{hostStr}</p>
            )}
          </div>
          {!isLG ? null : (
            <Modal
              centered
              open={open}
              footer={
                <Button type="primary" className={styles.modalBtn} onClick={() => setOpen(false)}>
                  OK
                </Button>
              }
              onCancel={() => setOpen(false)}>
              {hostName}
            </Modal>
          )}
        </>
      )}
    </>
  );
}

export function HomeHostTag() {
  const [open, setOpen] = useState(false);
  const hostName = useMemo(() => getSecondHostName(), []);
  const { isLG } = useResponsive();

  const hostStr = useMemo(() => 'Invited by ' + dotString(hostName, !isLG ? 16 : 10), [hostName, isLG]);

  return (
    <>
      {hostName && (
        <>
          <div className={styles.homeHostTag} onClick={() => setOpen(true)}>
            {!isLG ? (
              <Tooltip title={hostName} color="black" overlayInnerStyle={{ color: 'white' }}>
                {hostStr}
              </Tooltip>
            ) : (
              hostStr
            )}
          </div>
          {!isLG ? null : (
            <Modal
              title="Invited by"
              centered
              open={open}
              footer={
                <Button type="primary" className={styles.modalBtn} onClick={() => setOpen(false)}>
                  OK
                </Button>
              }
              onCancel={() => setOpen(false)}>
              {hostName}
            </Modal>
          )}
        </>
      )}
    </>
  );
}
