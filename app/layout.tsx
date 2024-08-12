import CoreLayout from '@/components/core/layout';
import UIAntdTheme from '@/components/ui/antd/theme';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import StoreProvider from '../providers/storeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Augmentator3000',
  description:
    'Generate note for your augmentation raid based on the raid composition',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body>
        <UIAntdTheme>
          <AntdRegistry>
            <StoreProvider>
              <CoreLayout>{children}</CoreLayout>
            </StoreProvider>
          </AntdRegistry>
        </UIAntdTheme>
      </body>
    </html>
  );
}
