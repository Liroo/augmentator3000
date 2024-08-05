'use client';
import { Button } from 'antd';
import { signIn } from 'next-auth/react';

export default function AuthSignIn() {
  const onClick = () => {
    signIn('warcraftLogs');
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h1 className="text-xl font-bold">Augmentator3000</h1>
      <p className="mt-[8px] text-center">
        A warcraftlogs account is required to access this website.
        <br />
        This ensure the website is available to everyone without rate limit.
      </p>
      <Button className="mt-[16px]" onClick={onClick}>
        Sign in with WarcraftLogs
      </Button>
    </div>
  );
}
