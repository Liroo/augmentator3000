'use client';
import { Button } from 'antd';
import { signOut } from 'next-auth/react';

export default function AuthSignOut() {
  const onClick = () => {
    signOut();
  };

  return (
    <Button className="mt-[16px]" onClick={onClick}>
      Sign out
    </Button>
  );
}
