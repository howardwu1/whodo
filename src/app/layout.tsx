import type { Metadata } from 'next';
import ThemeRegistry from '@/lib/registry';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'WhoDo',
  description: 'WhoDo project management and billing',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
