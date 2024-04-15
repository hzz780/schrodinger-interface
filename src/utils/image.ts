import { store } from 'redux/store';

const s3ImagePrefixTestnet = 'https://schrodinger-testnet.s3.amazonaws.com/watermarkimage';
const s3ImagePrefixMainnet = 'https://schrodinger.s3.amazonaws.com/watermarkimage';

const s3ImageUri = process.env.NEXT_PUBLIC_APP_ENV === 'test' ? s3ImagePrefixTestnet : s3ImagePrefixMainnet;

const ifpsDefaultPrefix = 'https://ipfs.io/ipfs';

export const getS3ImageURI = () => {
  const info = store.getState().info.cmsInfo;

  return info?.s3ImagePrefix || s3ImageUri;
};

export const getIPFSImageURI = () => {
  const info = store.getState().info.cmsInfo;

  return info?.ifpsPrefix || ifpsDefaultPrefix;
};
