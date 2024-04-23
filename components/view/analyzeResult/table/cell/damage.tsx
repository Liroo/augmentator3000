import { useAppSelector } from '@/flux/hooks';
import { selectWCLCharacterByCanonicalID } from '@/flux/wcl/selector';
import { ResultEntry } from '@/types/result';
import { getClassById } from '@/wow/class';
import { Flex, Typography } from 'antd';

interface Props {
  entries: ResultEntry[];
  index: number;
}

export default function ViewAnalyzeResultTableCellDamage({
  entries,
  index,
}: Props) {
  const entry = entries[index];
  const character = useAppSelector(
    selectWCLCharacterByCanonicalID(entry?.canonicalID),
  );

  let textComponent = <span>-</span>;

  if (character) {
    const characterClass = getClassById(character.classID);

    textComponent = (
      <Typography.Text>
        <span className={`class-${characterClass}`}>{character.name}</span> -{' '}
        {new Intl.NumberFormat('en-US', {
          notation: 'compact',
          compactDisplay: 'short',
        }).format(entry.total)}
      </Typography.Text>
    );
  }
  return (
    <Flex justify="start" align="center" className="mr-[8px]">
      {textComponent}
    </Flex>
  );
}
