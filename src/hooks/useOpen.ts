import { useCallback } from 'react';
import { openExternalLink } from 'utils/openlink';

export function useWindowOpen(url: string, target?: string) {
  const open = useCallback(() => openExternalLink(url, target), [target, url]);
  return open;
}
