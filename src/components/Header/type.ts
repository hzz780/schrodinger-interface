export enum RouterItemType {
  Out = 'out',
  Inner = 'link',
  MarketModal = 'marketModal',
  ExternalLink = 'externalLink',
}

export interface ICompassProps {
  show?: boolean;
  title?: string;
  schema?: string;
  type?: RouterItemType; // default is inner
  items?: Array<ICompassProps>;
}
