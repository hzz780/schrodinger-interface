import styles from '../style.module.css';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ReactComponent as AssetSVG } from 'assets/img/asset.svg';

function AssetItem({ closeMenuModal }: { closeMenuModal: () => void }) {
  const router = useRouter();
  return (
    <div
      className={styles.menuItem}
      onClick={() => {
        router.push('/assets');
        closeMenuModal();
      }}>
      <AssetSVG />
      <span>My Assets</span>
    </div>
  );
}

export default React.memo(AssetItem);
