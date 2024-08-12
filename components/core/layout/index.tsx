'use client';

import WCLCredentials from '@/components/block/WCLCredentials';
import WCLRegion from '@/components/block/WCLregion';
import initAmplitude from '@/services/amplitude';
import { Typography } from 'antd';

interface Props {
  children: React.ReactNode;
}

initAmplitude();

export default function CoreLayout({ children }: Props) {
  return (
    <div className="relative mx-[20px] h-full min-h-dvh text-white">
      <div className="my-[20px]">
        <h1 className="text-center text-[40px] font-bold text-[#33937F]">
          Augmentator3000
        </h1>
        <p className="text-center">Delete aug? Of course.. 😉</p>
      </div>

      <div className="absolute right-0 top-0 z-10">
        <WCLRegion />
      </div>

      <WCLCredentials />

      <div>{children}</div>

      <div className="p-[20px]">
        <Typography.Text>
          Made with ❤️ by{' '}
          <a href="https://github.com/Liroo" target="_blank">
            Liroo
          </a>
        </Typography.Text>
        <br />
        <Typography.Text>
          The source code of this website is available{' '}
          <a href="https://github.com/Liroo/auganalyzer" target="_blank">
            on github
          </a>
          .
        </Typography.Text>
      </div>
    </div>
  );
}
