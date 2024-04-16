import { useAppDispatch } from '@/flux/hooks';
import { rosterAddCharacter } from '@/flux/roster/reducer';
import { getWCLCharacter } from '@/flux/wcl/action';
import { WowRealms } from '@/wow/realm';
import { WowRegion, WowRegions } from '@/wow/region';
import { Button, Form, Input, Select, Space } from 'antd';

export default function ViewEditRosterForm() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const serverRegion =
    (Form.useWatch('serverRegion', {
      form,
      preserve: true,
    }) as WowRegion) || WowRegions[0];

  const onFinish = (values: any) => {
    const { name } = values;
    const serverSlug = WowRealms[serverRegion].find(
      (realm) => realm.name === values.serverSlug,
    )!.slug;

    dispatch(
      rosterAddCharacter({
        name,
        serverSlug,
        serverRegion,
      }),
    );
    dispatch(
      getWCLCharacter({
        key: `${name}-${serverSlug}-${serverRegion}`,
        name,
        serverSlug,
        serverRegion,
      }),
    );
    form.setFieldValue('name', '');
  };

  return (
    <Form
      form={form}
      name="horizontal_login"
      layout="inline"
      onFinish={onFinish}
      initialValues={{ serverRegion: WowRegions[0] }}
    >
      <Form.Item
        name={'name'}
        rules={[{ required: true, message: 'Pseudo is required' }]}
      >
        <Input style={{ width: 150 }} placeholder="Pseudo" />
      </Form.Item>
      <Space.Compact>
        <Form.Item
          name={'serverSlug'}
          noStyle
          rules={[{ required: true, message: 'Realm is required' }]}
        >
          <Select
            showSearch
            style={{ width: 150 }}
            options={WowRealms[serverRegion].map((realm) => ({
              value: realm.name,
              label: realm.name,
            }))}
            placeholder="Realm"
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </Form.Item>
        <Form.Item
          name={'serverRegion'}
          rules={[{ required: true, message: 'Region is required' }]}
        >
          <Select
            style={{ width: 70 }}
            defaultValue={WowRegions[0]}
            options={WowRegions.map((region) => ({
              value: region,
              label: region,
            }))}
          />
        </Form.Item>
      </Space.Compact>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Character
        </Button>
      </Form.Item>
    </Form>
  );
}
