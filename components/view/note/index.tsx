'use client';
import { useGenerateNote } from '@/hooks/useGenerateNote';
import { Card, Collapse, Input } from 'antd';

export default function ViewNote() {
  const noteLines = useGenerateNote();

  return (
    <section className="mt-[32px]">
      <Collapse
        size="small"
        items={[
          {
            key: '1',
            label: '🗒️ Use note',
            children: (
              <>
                <Card size="small">
                  <span className="font-bold">
                    Please use default timer ONLY in order to use the weak aura
                    properly (it is temporary)
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
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
