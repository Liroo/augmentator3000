import UIAntdTheme from '@/components/ui/antd/theme';
import UILayout from '@/components/ui/layout';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import AuthProvider from './authProvider';
import './globals.css';
import StoreProvider from './storeProvider';

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
            <AuthProvider>
              <StoreProvider>
                <UILayout>{children}</UILayout>
              </StoreProvider>
            </AuthProvider>
          </AntdRegistry>
        </UIAntdTheme>
      </body>
    </html>
  );
}
