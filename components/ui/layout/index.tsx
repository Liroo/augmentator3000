'use client';

import { Layout } from 'antd';

interface Props {
  children: React.ReactNode;
}

export default function UILayout({ children }: Props) {
  return (
    <Layout style={{ minHeight: '100dvh' }} className="h-full">
      {children}
    </Layout>
  );
}
