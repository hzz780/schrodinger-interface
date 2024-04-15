import styles from '../style.module.css';
import React from 'react';
import { ReactComponent as PointsSVG } from 'assets/img/points.svg';

function PointsItem({ checkAndRedirect }: { checkAndRedirect: (path: string) => void }) {
  return (
    <div className={styles.menuItem} onClick={() => checkAndRedirect('/points')}>
      <PointsSVG />
      <span>My Flux Points</span>
    </div>
  );
}

export default React.memo(PointsItem);
