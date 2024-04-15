'use client';

import dynamic from 'next/dynamic';
import { DynamicLoading } from 'components/DynamicLoading';

export default dynamic(() => import('pageComponents/strayCats'), { ssr: false, loading: () => <DynamicLoading /> });
