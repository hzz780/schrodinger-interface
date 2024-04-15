// import { scheme } from '@portkey/utils';

export function isPortkeyApp() {
  const ua = navigator.userAgent;
  return ua.indexOf('Portkey did Mobile') !== -1;
}

export type TParamsType<T> = T extends (...arg: infer P) => any ? P : T;

export const openExternalLink: Window['open'] = (url, target, features) => {
  if (!url) return null;
  if (isPortkeyApp()) {
    if (typeof url !== 'string') url = url.toString();
    window.location.href = url;
    // const href = scheme.formatScheme({
    //   action: 'linkDapp',
    //   domain: window.location.host,
    //   custom: {
    //     url,
    //   },
    // });
    // window.open(href);
    return null;
  } else {
    return window.open(url, target, features);
  }
};
