'use client';
import { useGenerateNote } from '@/hooks/useGenerateNote';
import { Collapse, Divider, Input, Typography } from 'antd';
import ViewNoteV2 from './v2';

export default function ViewNote() {
  const { v1, v2 } = useGenerateNote();

  return (
    <section className="mt-[32px]">
      <Collapse
        size="small"
        items={[
          {
            key: '1',
            label: '🗒️ Weak Aura',
            children: (
              <>
                <ViewNoteV2 v2={v2} />

                <Divider />

                <Typography.Title level={5} className="mt-[16px]">
                  Weak Aura V1
                </Typography.Title>

                <p>
                  Use with that aura{' '}
                  <a href="https://wago.io/-0f1A1GEK" target="_blank">
                    https://wago.io/-0f1A1GEK
                  </a>{' '}
                  Copy within personal note
                  <br />
                  <span className="font-bold">
                    Please use default timer ONLY in order to use the weak aura
                    properly (with that note)
                  </span>
                </p>

                <div className="my-[16px]">
                  <Input.TextArea value={v1} />
                </div>
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
