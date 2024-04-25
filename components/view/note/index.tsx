'use client';
import { useGenerateNote } from '@/hooks/useGenerateNote';
import { Card, Input, Typography } from 'antd';

export default function ViewNote() {
  const noteLines = useGenerateNote();

  return (
    <section className="mt-[32px]">
      <Typography.Title level={5}>🗒️ Use note</Typography.Title>

      <Card size="small">
        <span className="font-bold">
          Please use default timer ONLY in order to use the weak aura properly
          (it is temporary)
        </span>
        <br />
        <br />
        Use with that aura{' '}
        <a href="https://wago.io/-0f1A1GEK" target="_blank">
          https://wago.io/-0f1A1GEK
        </a>{' '}
        Copy within personal note
      </Card>

      <div className="mt-[16px]">
        <Input.TextArea value={noteLines} />
      </div>
    </section>
  );
}
