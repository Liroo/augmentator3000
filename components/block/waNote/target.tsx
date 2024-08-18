import { Select, Typography } from 'antd';
import { useAppSelector } from 'flux/hooks';
import { selectRosterInUseListWithWCLCharacter } from 'flux/roster/selector';
import { selectWCLCharacterByCharacterKey } from 'flux/wcl/selector';
import { getClassById } from 'game/classes';
import { rosterCharacterToKey } from 'utils/key';

const RenderCharacterName = ({ value }: { value: string }) => {
  const WCLCharacter = useAppSelector(selectWCLCharacterByCharacterKey(value));

  if (!WCLCharacter) return null;
  const classColor = getClassById(WCLCharacter?.classID as number);

  return (
    <span className={`classID-${classColor?.id}`}>{WCLCharacter?.name}</span>
  );
};

type Props = {
  characterKey?: string;
  onChange: (characterKey: string | '') => void;
};

export default function WaNoteTarget({ characterKey, onChange }: Props) {
  const WCLCharacter = useAppSelector(
    selectWCLCharacterByCharacterKey(characterKey as string),
  );
  const roster = useAppSelector(selectRosterInUseListWithWCLCharacter);

  return (
    <Select
      size="small"
      allowClear
      style={{
        width: '100%',
      }}
      value={characterKey}
      options={[
        { value: '', label: 'none' },
        ...roster.map(({ rosterCharacter }) => ({
          value: rosterCharacterToKey(rosterCharacter),
          label: rosterCharacter.name,
        })),
      ]}
      onChange={(value) => {
        onChange(value as string);
      }}
      optionRender={(props) => (
        <RenderCharacterName value={props.value as string} />
      )}
      labelRender={({ value }) => {
        if (value === '') {
          if (!characterKey) return null;
          return (
            <Typography.Text>
              <span
                className={`classID-${getClassById(WCLCharacter?.classID as number)?.id}`}
              >
                {WCLCharacter?.name}
              </span>
            </Typography.Text>
          );
        } else return <RenderCharacterName value={value as string} />;
      }}
    />
  );
}
