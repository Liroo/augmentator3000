import { Button, Form, Input, notification } from 'antd';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { toggleCustomReportFightsSelected } from 'flux/plan/reducer';
import { selectStatusByActionTypeIsLoading } from 'flux/status/selector';
import { getWCLReportWithFights } from 'flux/wcl/action';

export default function LogsSelectCustomReportForm() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const isLoading = useAppSelector(
    selectStatusByActionTypeIsLoading(getWCLReportWithFights.typePrefix),
  );

  const onFinish = async (values: any) => {
    let { url } = values;

    // remove query or hash from url
    url = url.split('?')[0].split('#')[0];
    const code = url.split('/').pop();

    try {
      const reportWithFights = await dispatch(
        getWCLReportWithFights({ code }),
      ).unwrap();
      form.setFieldsValue({ url: '' });

      dispatch(
        toggleCustomReportFightsSelected(
          (reportWithFights.fights || []).map(
            (f) => `${reportWithFights.code}-${f.id}`,
          ),
        ),
      );
    } catch (_) {
      api.error({
        message: 'Report not found',
        description: 'Please check the url and try again',
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="customReportForm"
        layout="inline"
        onFinish={onFinish}
      >
        <Form.Item
          name="url"
          rules={[
            { required: true, message: 'An url is required', type: 'url' },
          ]}
        >
          <Input style={{ width: 500 }} placeholder="WarcraftLogs Report Url" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isLoading}
          loading={isLoading}
        >
          Add Custom Report
        </Button>
      </Form>
    </>
  );
}
