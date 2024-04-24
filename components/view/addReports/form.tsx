import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { StatusEnum } from '@/flux/status/reducer';
import { selectStatusByActionTypeId } from '@/flux/status/selector';
import { getWCLReportWithFights } from '@/flux/wcl/action';
import { WowRegions } from '@/wow/region';
import { Button, Form, Input } from 'antd';

export default function ViewAddReportsForm() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { status } = useAppSelector(
    selectStatusByActionTypeId(getWCLReportWithFights.typePrefix),
  );
  const isLoading = status === StatusEnum.Pending;

  const onFinish = async (values: any) => {
    let { url } = values;

    // remove query or hash from url
    url = url.split('?')[0].split('#')[0];
    const code = url.split('/').pop();

    await dispatch(getWCLReportWithFights({ code })).unwrap();
  };

  return (
    <Form
      form={form}
      name="addReports"
      layout="inline"
      onFinish={onFinish}
      initialValues={{ serverRegion: WowRegions[0] }}
    >
      <Form.Item
        name={'url'}
        rules={[{ required: true, message: 'An url is required', type: 'url' }]}
      >
        <Input style={{ width: 500 }} placeholder="WarcraftLogs Report Url" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={isLoading}>
          Add Report
        </Button>
      </Form.Item>
    </Form>
  );
}
