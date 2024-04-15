'use client';
import { useWalletService } from 'hooks/useWallet';
import TokensInfo from './components/TokensInfo';
import OwnedItems from './components/OwnedItems';
import TokensHome from './components/TokensHome';
import styles from './styles.module.css';

export default function TokensPage() {
  const { isLogin } = useWalletService();

  return (
    <>
      {!isLogin ? (
        <TokensHome />
      ) : (
        <div className={styles.tokensPageContainer}>
          <TokensInfo />
          <OwnedItems />
        </div>
      )}
    </>
  );
}
