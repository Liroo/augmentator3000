import { Typography } from 'antd';
import { AnalysisTableRow } from 'flux/analysis/types';
import { useAppSelector } from 'flux/hooks';
import { selectWCLCharacterByCharacterKey } from 'flux/wcl/selector';
import { getClassById } from 'game/classes';

type Props = {
  row: AnalysisTableRow;
  index: number;
};

export default function AnalysisTableCellTimeTarget({ row, index }: Props) {
  const entry = row.entries[index];

  const WCLCharacter = useAppSelector(
    selectWCLCharacterByCharacterKey(entry?.characterKey),
  );

  if (!WCLCharacter) return null;

  const characterClass = getClassById(WCLCharacter?.classID);

  return (
    <div className="flex items-center justify-start">
      <Typography.Text>
        {new Intl.NumberFormat('en-US', {
          notation: 'compact',
          compactDisplay: 'short',
        }).format(entry.average)}{' '}
        -{' '}
        <span className={`classID-${characterClass?.id}`}>
          {WCLCharacter.name}
        </span>
      </Typography.Text>
    </div>
  );
}
