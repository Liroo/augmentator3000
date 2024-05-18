'use client';
import { useAppSelector } from '@/flux/hooks';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { selectWCLCharacterByInternalId } from '@/flux/wcl/selector';
import { characterToInternalId } from '@/utils/wcl';
import { getClassById, getClassColor } from '@/wow/class';
import { Input, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';

type Props = {
  v2: string;
};

const OptionRender = ({ value }: { value: string | null }) => {
  const isDefault = !value;
  const character = useAppSelector(
    selectWCLCharacterByInternalId(value as string),
  );
  const characterClass = character
    ? getClassById(character.classID)
    : undefined;
  const classColor = getClassColor(characterClass);

  return (
    <p className="truncate">
      <span
        style={{
          color: classColor,
        }}
      >
        {isDefault ? 'default' : character?.name || '-'}
      </span>
    </p>
  );
};

export default function ViewNoteV2({ v2 }: Props) {
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced(false));
  const [defaultTargets, setDefaultTargets] = useState<string[]>([]);

  useEffect(() => {
    if (rosterListEnhanced.length > 0 && defaultTargets.length === 0) {
      setDefaultTargets([
        characterToInternalId(rosterListEnhanced[0]),
        characterToInternalId(rosterListEnhanced[1]),
        characterToInternalId(rosterListEnhanced[2]),
        characterToInternalId(rosterListEnhanced[3]),
      ]);
    }
  }, [rosterListEnhanced, defaultTargets]);

  return (
    <>
      <Typography.Title level={5} className="mt-[16px]">
        Weak Aura V2
      </Typography.Title>

      <p>
        Use with that aura{' '}
        <a href="https://wago.io" target="_blank">
          https://wago.io
        </a>
        <br />
        Copy within personal note
        <br />
      </p>

      <Typography.Title level={5} className="mt-[16px]">
        Default targets
      </Typography.Title>

      <div className="mt-[16px] flex">
        <Select
          style={{ width: '200px' }}
          value={defaultTargets[0]}
          options={[
            ...rosterListEnhanced.map((character) => {
              return {
                label: character.name,
                value: characterToInternalId(character),
              };
            }),
          ]}
          labelRender={({ value }) => {
            return <OptionRender value={value as string | null} />;
          }}
          optionRender={({ value }) => {
            return <OptionRender value={value as string} />;
          }}
          onChange={(value) => {
            setDefaultTargets((prev) => {
              const newTargets = [...prev];
              newTargets[0] = value as string;
              return newTargets;
            });
          }}
        />
        <Select
          style={{ width: '200px', marginLeft: '8px' }}
          value={defaultTargets[1]}
          options={[
            ...rosterListEnhanced.map((character) => {
              return {
                label: character.name,
                value: characterToInternalId(character),
              };
            }),
          ]}
          labelRender={({ value }) => {
            return <OptionRender value={value as string | null} />;
          }}
          optionRender={({ value }) => {
            return <OptionRender value={value as string} />;
          }}
          onChange={(value) => {
            setDefaultTargets((prev) => {
              const newTargets = [...prev];
              newTargets[1] = value as string;
              return newTargets;
            });
          }}
        />
        <Select
          style={{ width: '200px', marginLeft: '8px' }}
          value={defaultTargets[2]}
          options={[
            ...rosterListEnhanced.map((character) => {
              return {
                label: character.name,
                value: characterToInternalId(character),
              };
            }),
          ]}
          labelRender={({ value }) => {
            return <OptionRender value={value as string | null} />;
          }}
          optionRender={({ value }) => {
            return <OptionRender value={value as string} />;
          }}
          onChange={(value) => {
            setDefaultTargets((prev) => {
              const newTargets = [...prev];
              newTargets[2] = value as string;
              return newTargets;
            });
          }}
        />
        <Select
          style={{ width: '200px', marginLeft: '8px' }}
          value={defaultTargets[3]}
          options={[
            ...rosterListEnhanced.map((character) => {
              return {
                label: character.name,
                value: characterToInternalId(character),
              };
            }),
          ]}
          labelRender={({ value }) => {
            return <OptionRender value={value as string | null} />;
          }}
          optionRender={({ value }) => {
            return <OptionRender value={value as string} />;
          }}
          onChange={(value) => {
            setDefaultTargets((prev) => {
              const newTargets = [...prev];
              newTargets[3] = value as string;
              return newTargets;
            });
          }}
        />
      </div>

      <Typography.Title level={5} className="mt-[16px]">
        Note
      </Typography.Title>

      <div className="mt-[16px]">
        <Input.TextArea
          value={`lirAugStart
${defaultTargets
  .map((target) => {
    const character = rosterListEnhanced.find(
      (character) => characterToInternalId(character) === target,
    );
    return character?.name;
  })
  .join(' ')}
${v2}
lirAugEnd`}
        />
      </div>
    </>
  );
}
