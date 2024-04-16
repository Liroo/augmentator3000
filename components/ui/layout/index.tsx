'use client';

import { Layout } from 'antd';

interface Props {
  children: React.ReactNode;
}

export default function UILayout({ children }: Props) {
  return (
    <Layout style={{ minHeight: '100dvh' }}>
      {/* <Layout.Sider
        theme="light"
        className="border-r border-white border-opacity-40"
      >
        <Flex className="m-[20px]" align="center" justify="center">
          <Typography.Title level={4}>AugAnalyzer</Typography.Title>
        </Flex>
      </Layout.Sider> */}
      <Layout>{children}</Layout>
    </Layout>
  );
}
