import { Suspense } from 'react';
import CompareClient from './CompareClient';

export const dynamic = 'force-dynamic'; // optional but safe

export default function Page() {
  return (
    <Suspense fallback={<div>Loading comparison...</div>}>
      <CompareClient />
    </Suspense>
  );
}