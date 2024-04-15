import styles from '../style.module.css';
import { ReactComponent as WalletSVG } from 'assets/img/wallet.svg';
import { ReactComponent as CopySVG } from 'assets/img/copy.svg';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { message } from 'antd';
import { useCopyToClipboard } from 'react-use';
import React from 'react';

function CopyAddressItem({ address }: { address: string }) {
  const [, setCopied] = useCopyToClipboard();
  return (
    <div className={styles.menuItem}>
      <WalletSVG />
      <span>{getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS)}</span>
      <CopySVG
        onClick={() => {
          setCopied(addPrefixSuffix(address));
          message.success('Copied');
        }}
      />
    </div>
  );
}

export default React.memo(CopyAddressItem);
