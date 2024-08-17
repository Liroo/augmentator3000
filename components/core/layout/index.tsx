'use client';

import { WarningOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import WCLCredentials from 'components/block/WCLCredentials';
import RegionSelect from 'components/block/regionSelect';
import initAmplitude from 'services/amplitude';

interface Props {
  children: React.ReactNode;
}

initAmplitude();

export default function CoreLayout({ children }: Props) {
  return (
    <div className="relative mx-[20px] flex h-full min-h-dvh flex-col text-white">
      <div className="my-[20px]">
        <h1 className="text-center text-[40px] font-bold text-[#33937F]">
          Augmentator3000
        </h1>
        <p className="mt-[-5px] text-center">Delete aug? Of course.. 😉</p>
      </div>

      <div className="absolute right-0 top-0 z-10">
        <RegionSelect />
      </div>

      <div className="absolute left-0 top-0 z-10">
        <Tooltip
          title="Work in progress. This will be ready for TWW. In any case, expect bugs as this is home made and mainly for personal use."
          placement="bottomRight"
        >
          <div className="ml-[40px] mt-[48px] flex cursor-pointer select-none items-center">
            <WarningOutlined size={40} />
            <Typography.Title level={5} className="!mb-0 ml-[4px]">
              Disclaimer
            </Typography.Title>
          </div>
        </Tooltip>
      </div>

      <WCLCredentials />

      <>{children}</>

      <div className="mt-auto py-[20px]">
        <div className="flex w-full justify-between">
          <Typography.Text>
            Made with ❤️ by{' '}
            <a href="https://github.com/Liroo" target="_blank">
              Liroo
            </a>
          </Typography.Text>
          <Typography.Text
            className="cursor-pointer select-none"
            onClick={() => {
              localStorage.removeItem('persist:augmentator3000-root');
              window.location.reload();
            }}
          >
            Reset the store
          </Typography.Text>
        </div>

        <div className="flex w-full justify-between">
          <Typography.Text>
            The source code of this website is available{' '}
            <a href="https://github.com/Liroo/auganalyzer" target="_blank">
              on github
            </a>
            .
          </Typography.Text>
          <Typography.Text>
            This website is not affiliated with WarcraftLogs.
          </Typography.Text>
        </div>
      </div>
    </div>
  );
}
