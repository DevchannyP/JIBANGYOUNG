// 📁 app/dashboard/MainSectionWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import SkeletonCard from './MainSection/components/SkeletonCard';

const MainSectionClient = dynamic(() => import('./MainSection/MainSection'), {
  ssr: false,
  loading: () => <SkeletonCard type="rank" />,
});

export default function MainSectionWrapper() {
  return (
    <Suspense fallback={<SkeletonCard type="rank" />}>
      <MainSectionClient />
    </Suspense>
  );
}
