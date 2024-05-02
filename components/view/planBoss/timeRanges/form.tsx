import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import defaultTimeRanges from '@/flux/plan/defaultTimeRanges';
import {
  removeTimeRangesByKey,
  setEncounterForm,
  setTimeRangesByKey,
} from '@/flux/plan/reducer';
import {
  selectPlanEncounterForm,
  selectPlanTimeRangesByKey,
  selectPlanTimeRangesKeys,
} from '@/flux/plan/selector';
import { CopyOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  InputRef,
  Popover,
  Select,
  Space,
} from 'antd';
import { useRef, useState } from 'react';

export default function ViewPlanBossTimeRangesForm() {
  const form = Form.useFormInstance();

  const planTimeRangesKeys = useAppSelector(selectPlanTimeRangesKeys);
  const { encounterID, zoneID, timeRangesKey } = useAppSelector(
    selectPlanEncounterForm,
  );
  const timeRanges = useAppSelector(selectPlanTimeRangesByKey(timeRangesKey));
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addConfig = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    if (!name) return;

    if (!planTimeRangesKeys.includes(name))
      dispatch(
        setTimeRangesByKey({
          key: name,
          timeRanges: defaultTimeRanges.default,
        }),
      );
    dispatch(setEncounterForm({ zoneID, encounterID, timeRangesKey: name }));
    form.setFieldsValue({ timeRangesKey: name });
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const removeConfig = (key: string) => {
    if (timeRangesKey === key) {
      dispatch(
        setEncounterForm({ zoneID, encounterID, timeRangesKey: 'default' }),
      );
      form.setFieldsValue({ timeRangesKey: 'default' });
    }
    dispatch(removeTimeRangesByKey(key));
  };
  const duplicateConfig = (key: string) => {
    // check if there a copy index such as `key (number)`
    const index = key.match(/ \(\d+\)$/);
    const copyIndex = index
      ? ` (${parseInt(index[0].slice(2, -1)) + 1})`
      : ' (1)';
    //  remove index from key
    const newKey = key.replace(/ \(\d+\)$/, '') + copyIndex;
    dispatch(setTimeRangesByKey({ key: newKey, timeRanges }));
    dispatch(setEncounterForm({ zoneID, encounterID, timeRangesKey: newKey }));
    form.setFieldsValue({ timeRangesKey: newKey });
  };

  return (
    <Space>
      <Form.Item name={'timeRangesKey'}>
        <Select
          style={{ width: '400px' }}
          placeholder="Select timers"
          options={planTimeRangesKeys.map((timeRangesKey) => ({
            label: timeRangesKey,
            value: timeRangesKey,
          }))}
          optionRender={(option) => {
            return (
              <Flex align="center" justify="space-between" className="w-full">
                <p>{option.data.label}</p>
                <div>
                  <Popover content="Duplicate" overlayStyle={{ zIndex: 1200 }}>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        duplicateConfig(option.value as string);
                      }}
                    />
                  </Popover>
                  {option.key !== 'default' && (
                    <Popover content="Remove" overlayStyle={{ zIndex: 1200 }}>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeConfig(option.value as string);
                        }}
                        className="text-[#f5222d]"
                      />{' '}
                    </Popover>
                  )}
                </div>
              </Flex>
            );
          }}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder="Please enter item"
                  ref={inputRef}
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button type="text" icon={<PlusOutlined />} onClick={addConfig}>
                  Add config
                </Button>
              </Space>
            </>
          )}
          onChange={(value: string) => {
            dispatch(
              setEncounterForm({ zoneID, encounterID, timeRangesKey: value }),
            );
          }}
        />
      </Form.Item>
    </Space>
  );
}
