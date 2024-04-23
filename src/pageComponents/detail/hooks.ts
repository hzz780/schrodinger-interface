import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { PageFrom } from './types';

export function usePageForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || PageFrom.ALL;

  const fromListAll = useMemo(() => from !== PageFrom.MY, [from]);

  return [fromListAll];
}
