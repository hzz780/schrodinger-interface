import styles from '../style.module.css';
import React from 'react';
import { ReactComponent as StrayCats } from 'assets/img/strayCats.svg';

function StrayCatsItem({ checkAndRedirect }: { checkAndRedirect: (path: string) => void }) {
  return (
    <div className={styles.menuItem} onClick={() => checkAndRedirect('/stray-cats')}>
      <StrayCats />
      <span>Stray Cats</span>
    </div>
  );
}

export default React.memo(StrayCatsItem);
