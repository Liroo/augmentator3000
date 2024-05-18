import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { generateDefaultTimeRanges } from '@/flux/plan/defaultTimeRanges';
import {
  importTimeRangesManualPriorities,
  removeTimeRangesByKey,
  renameTimeRangesByKey,
  setEncounterForm,
  setTimeRangesByKey,
} from '@/flux/plan/reducer';
import {
  selectPlanEncounterForm,
  selectPlanTimeRangesByKey,
  selectPlanTimeRangesKeys,
} from '@/flux/plan/selector';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ImportOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  InputRef,
  Modal,
  Popover,
  Select,
  Space,
} from 'antd';
import { useRef, useState } from 'react';

export default function ViewPlanBossTimeRangesForm() {
  const form = Form.useFormInstance();
  const [renameForm] = Form.useForm();
  const [modalData, setModalData] = useState({ open: false, key: '' });

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
          timeRanges: generateDefaultTimeRanges(),
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
        setEncounterForm({
          zoneID,
          encounterID,
          timeRangesKey: `default-${encounterID}`,
        }),
      );
      form.setFieldsValue({ timeRangesKey: `default-${encounterID}` });
    }
    dispatch(removeTimeRangesByKey(key));
  };
  const duplicateConfig = (key: string) => {
    const newKey = new Date().getTime().toString();
    dispatch(setTimeRangesByKey({ key: newKey, timeRanges }));
    dispatch(setEncounterForm({ zoneID, encounterID, timeRangesKey: newKey }));
    form.setFieldsValue({ timeRangesKey: newKey });
  };

  return (
    <>
      <Space>
        <Form.Item name={'timeRangesKey'}>
          <Select
            style={{ width: '400px' }}
            placeholder="Select timers"
            options={planTimeRangesKeys
              .filter(
                (timeRangesKey) =>
                  !timeRangesKey.startsWith('default-') ||
                  timeRangesKey === `default-${encounterID}`,
              )
              .map((timeRangesKey) => ({
                label: timeRangesKey.startsWith('default-')
                  ? '📗 Boss default'
                  : timeRangesKey,
                value: timeRangesKey,
              }))}
            optionRender={(option) => {
              return (
                <Flex align="center" justify="space-between" className="w-full">
                  <p>{option.data.label}</p>
                  <div>
                    <Popover
                      content="Import priorities"
                      overlayStyle={{ zIndex: 1200 }}
                    >
                      <Button
                        type="text"
                        icon={<ImportOutlined />}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          dispatch(
                            importTimeRangesManualPriorities({
                              key: timeRangesKey,
                              importKey: option.value as string,
                            }),
                          );
                        }}
                        className="text-[#f5222d]"
                      />{' '}
                    </Popover>
                    {(option.key as string).startsWith('default-') ? null : (
                      <Popover content="Rename" overlayStyle={{ zIndex: 1200 }}>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            renameForm.setFieldsValue({ name: option.value });
                            setModalData({
                              open: true,
                              key: option.value as string,
                            });
                          }}
                          className="text-[#f5222d]"
                        />{' '}
                      </Popover>
                    )}
                    {option.key === timeRangesKey ? (
                      <Popover
                        content="Duplicate"
                        overlayStyle={{ zIndex: 1200 }}
                      >
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
                    ) : null}
                    {(option.key as string).startsWith('default-') ? null : (
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
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={addConfig}
                  >
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

      <Modal
        title=""
        open={modalData.open}
        onOk={() => {
          const { name } = renameForm.getFieldsValue();

          if (!planTimeRangesKeys.includes(name) && name) {
            dispatch(
              renameTimeRangesByKey({ key: modalData.key, newKey: name }),
            );
            if (timeRangesKey === modalData.key) {
              dispatch(setEncounterForm({ timeRangesKey: name }));
              form.setFieldsValue({ timeRangesKey: name });
            }
          }
          setModalData({ open: false, key: '' });
        }}
        onCancel={() => {
          setModalData({ open: false, key: '' });
        }}
      >
        <Form
          form={renameForm}
          name="renameTimeRangesKey"
          layout="inline"
          initialValues={{ name: modalData.key }}
        >
          <Form.Item
            name={'name'}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input style={{ width: 150 }} placeholder="Name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
