import { useResponsive } from 'hooks/useResponsive';
import { useMemo } from 'react';

export function useLatestColumns() {
  const { isMD, isLG } = useResponsive();
  const columns = useMemo(() => (isMD ? 2 : isLG ? 3 : 4), [isLG, isMD]);
  return columns;
}

export function useLatestGutter() {
  const { isLG, isMin } = useResponsive();
  const gutter = useMemo(() => (isMin ? 12 : isLG ? 16 : 24), [isLG, isMin]);
  return gutter;
}
