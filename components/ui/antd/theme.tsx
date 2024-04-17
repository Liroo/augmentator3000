'use client';

import { ConfigProvider } from 'antd';
import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function UIAntdTheme({ children }: Props) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            cellPaddingBlock: 8,
            cellPaddingBlockMD: 8,
            cellPaddingInline: 8,
          },
        },
      }}
      renderEmpty={() => (
        <div style={{ textAlign: 'center' }}>
          <p>Data Not Found</p>
        </div>
      )}
    >
      {children}
    </ConfigProvider>
  );
}
