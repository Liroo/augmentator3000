'use client';
import { Typography } from 'antd';
import ViewSelectBossForm from './form';

export default function ViewSelectBoss() {
  return (
    <section className="mt-[32px]">
      <Typography.Title level={5}>👉🏼 Select Boss</Typography.Title>

      <ViewSelectBossForm />
    </section>
  );
}
