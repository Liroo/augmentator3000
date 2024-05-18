'use client';
import { useGenerateNote } from '@/hooks/useGenerateNote';
import { Collapse } from 'antd';
import ViewNoteV2 from './v2';

export default function ViewNote() {
  const v2 = useGenerateNote();

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
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
