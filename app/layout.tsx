import UIAntdTheme from '@/components/ui/antd/theme';
import UILayout from '@/components/ui/layout';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import './globals.css';
import StoreProvider from './StoreProvider';

export const metadata: Metadata = {
  title: 'AugAnalyzer',
  description:
    'Generate note for your augmentation raid based on the raid composition',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UIAntdTheme>
          <AntdRegistry>
            <StoreProvider>
              <UILayout>{children}</UILayout>
            </StoreProvider>
          </AntdRegistry>
        </UIAntdTheme>
      </body>
    </html>
  );
}
