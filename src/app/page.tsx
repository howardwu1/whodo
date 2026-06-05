'use client';

import { Navigation } from '@/components/Navigation';
import Blog from './blog/page';

export default function HomePage() {
  return (
    <div style={{ overflowY: 'hidden', height: '100vh' }}>
      <Navigation />
      <Blog />
    </div>
  );
}
