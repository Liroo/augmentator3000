import { useAppSelector } from '@/flux/hooks';
import { selectWCLCharacter } from '@/flux/wcl/selector';
import { ResultEntry } from '@/types/result';
import { getClassById } from '@/wow/class';
import { Flex, Typography } from 'antd';

interface Props {
  entry: ResultEntry;
}

export default function ViewAnalyzeResultTableCellDamage({ entry }: Props) {
  const character = useAppSelector(
    selectWCLCharacter(entry?.name, entry?.serverSlug),
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
