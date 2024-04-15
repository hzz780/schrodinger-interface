'use client';

import { DynamicLoading } from 'components/DynamicLoading';
import dynamic from 'next/dynamic';

export default dynamic(() => import('pageComponents/detail'), {
  ssr: false,
  loading: () => <DynamicLoading />,
});
