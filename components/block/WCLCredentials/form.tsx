import { authGenerateWCLBearerToken } from '@/flux/auth/action';
import {
  selectAuthBearerToken,
  selectAuthCredentials,
} from '@/flux/auth/selector';
import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { StatusEnum } from '@/flux/status/reducer';
import { selectStatusByActionTypeId } from '@/flux/status/selector';
import { logEvent } from '@/services/amplitude/analytics';
import { Alert, Button, Form, Input } from 'antd';
import { useEffect } from 'react';

export default function WCLCredentialsForm() {
  const dispatch = useAppDispatch();
  const credentials = useAppSelector(selectAuthCredentials);
  const bearerToken = useAppSelector(selectAuthBearerToken);
  const [form] = Form.useForm();
  const { status, error } = useAppSelector(
    selectStatusByActionTypeId(authGenerateWCLBearerToken.typePrefix),
  );

  const onFinish = async (values: any) => {
    logEvent('WCLCredentials', 'form_submit', { clientId: values.clientId });

    await dispatch(authGenerateWCLBearerToken(values));
  };

  useEffect(() => {
    dispatch(authGenerateWCLBearerToken(credentials));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {bearerToken && (
        <Alert
          type="success"
          message="Credentials are valid"
          banner
          className="!mb-[20px]"
        />
      )}
      {!!error && (
        <Alert
          type="error"
          message="Invalid credentials"
          banner
          className="!mb-[20px]"
        />
      )}
      <Form
        form={form}
        className="flex flex-col"
        name="WCLCredentials"
        onFinish={onFinish}
        initialValues={{
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
        }}
      >
        <Form.Item
          name="clientId"
          rules={[{ required: true, message: 'Client ID is required' }]}
        >
          <Input placeholder="clientID" />
        </Form.Item>
        <Form.Item
          name="clientSecret"
          rules={[{ required: true, message: 'Client Secret is required' }]}
        >
          <Input placeholder="clientSecret" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={status === StatusEnum.Pending}
        >
          Validate
        </Button>
      </Form>
    </>
  );
}
