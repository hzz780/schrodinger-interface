'use client';

import dynamic from 'next/dynamic';
import { DynamicLoading } from 'components/DynamicLoading';

export default dynamic(() => import('pageComponents/referral'), { ssr: false, loading: () => <DynamicLoading /> });
