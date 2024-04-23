'use client';

import dynamic from 'next/dynamic';
import { DynamicLoading } from 'components/DynamicLoading';

export default dynamic(() => import('pageComponents/my-cats'), { ssr: false, loading: () => <DynamicLoading /> });
