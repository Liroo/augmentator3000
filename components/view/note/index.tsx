'use client';
import { useGenerateNote } from '@/hooks/useGenerateNote';
import { useGenerateNoteV2 } from '@/hooks/useGenerateNoteV2';
import { Card, Collapse, Input } from 'antd';

export default function ViewNote() {
  const noteLines = useGenerateNote();
  const noteV2Lines = useGenerateNoteV2();

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
                    properly (with that note)
                  </span>
                  <br />
                  <br />
                  Use with that aura{' '}
                  <a href="https://wago.io/-0f1A1GEK" target="_blank">
                    https://wago.io/-0f1A1GEK
                  </a>{' '}
                  Copy within personal note
                </Card>

                <div className="my-[16px]">
                  <Input.TextArea value={noteLines} />
                </div>

                <Card size="small">
                  WIP - This feature is still in development
                  <br />
                  <br />
                  <span className="font-bold">
                    That note is compatible with the following weak aura. It
                    should be more precise than the other one.
                  </span>
                  <br />
                  <br />
                  Use with that aura{' '}
                  <a href="https://wago.io" target="_blank">
                    https://wago.io
                  </a>{' '}
                  Copy within personal note
                </Card>

                <div className="mt-[16px]">
                  <Input.TextArea value={noteV2Lines} />
                </div>
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
