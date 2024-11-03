import { Button, Input, notification, Typography } from 'antd';
import { setDefaultTargets } from 'flux/analysis/reducer';
import {
  selectAnalysisTableWithExcludedAndPriority,
  selectDefaultTargets,
} from 'flux/analysis/selector';
import { selectCustomEbonMightTableWithExcludedAndPriority } from 'flux/customEbonMight/selector';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { RosterCharacter } from 'flux/roster/types';
import { useMemo, useState } from 'react';
import { getDataFromRosterCharacterKey, rosterCharacterToKey } from 'utils/key';
import WaNoteTarget from './target';

export default function WaNote() {
  const defautlTargets = useAppSelector(selectDefaultTargets);
  const dispatch = useAppDispatch();
  const [api, contextHolder] = notification.useNotification();
  const analysisTable = useAppSelector(
    selectAnalysisTableWithExcludedAndPriority,
  );
  const customAnalysisTable = useAppSelector(
    selectCustomEbonMightTableWithExcludedAndPriority,
  );
  const [showNote, setShowNote] = useState<boolean>(false);

  const note = useMemo(() => {
    return `lirAugStart
${defautlTargets.map((target) => (target?.WCLCharacter ? target?.WCLCharacter.name : '')).join(' ')}
${analysisTable
  .map((row) => {
    return row.subEntries
      .map((subRow) => {
        return `${subRow.startTime}:${subRow.endTime} ${subRow.entries
          .map((entry) => {
            return `${getDataFromRosterCharacterKey(entry.characterKey).name}:${entry.priority ? '1' : '0'}:${Math.round(entry.average / 1000) || '0'}`;
          })
          .join(' ')}`;
      })
      .join('\n');
  })
  .join('\n')}
lirAugEnd
lirCustomAugStart
${customAnalysisTable
  .map((row) => {
    return `${row.startTime}:${row.endTime} ${row.entries
      .map((entry) => {
        return `${getDataFromRosterCharacterKey(entry.characterKey).name}:${entry.priority ? '1' : '0'}:${Math.round(entry.average / 1000) || '0'}`;
      })
      .join(' ')}`;
  })
  .join('\n')}
lirCustomAugEnd
    `;
  }, [analysisTable, defautlTargets]);

  const onClickCopyNote = () => {
    navigator.clipboard.writeText(note);
    api.success({
      message: 'Note copied',
    });
  };

  const changeDefaultTargetForIndex = (characterKey: string, index: number) => {
    const newDefaultTargets = new Array(4).fill(null).map((_, i) => {
      if (i === index) return characterKey;
      return defautlTargets[i]?.rosterCharacter
        ? rosterCharacterToKey(
            defautlTargets[i]?.rosterCharacter as RosterCharacter,
          )
        : '';
    });
    dispatch(setDefaultTargets(newDefaultTargets));
  };

  return (
    <div className="flex flex-col items-start">
      {contextHolder}
      <Typography.Title level={5}>🕹️ WeakAura</Typography.Title>
      <div>
        <Typography.Text>
          You can set default targets for the WeakAura when there is no more
          data
        </Typography.Text>
        <div className="mt-[4px] flex gap-[8px]">
          <WaNoteTarget
            characterKey={
              defautlTargets[0]
                ? rosterCharacterToKey(defautlTargets[0]?.rosterCharacter)
                : undefined
            }
            onChange={(characterKey) => {
              changeDefaultTargetForIndex(characterKey, 0);
            }}
          />
          <WaNoteTarget
            characterKey={
              defautlTargets[1]
                ? rosterCharacterToKey(defautlTargets[1]?.rosterCharacter)
                : undefined
            }
            onChange={(characterKey) => {
              changeDefaultTargetForIndex(characterKey, 1);
            }}
          />
          <WaNoteTarget
            characterKey={
              defautlTargets[2]
                ? rosterCharacterToKey(defautlTargets[2]?.rosterCharacter)
                : undefined
            }
            onChange={(characterKey) => {
              changeDefaultTargetForIndex(characterKey, 2);
            }}
          />
          <WaNoteTarget
            characterKey={
              defautlTargets[3]
                ? rosterCharacterToKey(defautlTargets[3]?.rosterCharacter)
                : undefined
            }
            onChange={(characterKey) => {
              changeDefaultTargetForIndex(characterKey, 3);
            }}
          />
        </div>
      </div>
      <div className="mt-[8px]">
        <Typography.Text>
          The following note is used with{' '}
          <a href="https://wago.io/-0f1A1GEK" target="_blank">
            this WeakAura
          </a>{' '}
          I made.
        </Typography.Text>
      </div>
      <div className="mt-[4px] flex gap-[8px]">
        <Button onClick={onClickCopyNote} size="small">
          Copy Note
        </Button>
        <Button
          onClick={() => {
            setShowNote(!showNote);
          }}
          size="small"
        >
          {showNote ? 'Hide note' : 'Show note'}
        </Button>
      </div>

      {showNote && (
        <div className="mt-[8px] w-full">
          <Input.TextArea value={note} />
        </div>
      )}
    </div>
  );
}
