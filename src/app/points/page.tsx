'use client';

import dynamic from 'next/dynamic';
import { DynamicLoading } from 'components/DynamicLoading';

export default dynamic(() => import('pageComponents/points'), { ssr: false, loading: () => <DynamicLoading /> });
