'use client';

import dynamic from 'next/dynamic';

const hello = 'hi next lint';
console.log('hello, maybe a lint warning:', hello);

export default dynamic(() => import('pageComponents/tokensPage'), { ssr: false });
