import { selectAuthBearerToken } from '@/flux/auth/selector';
import { useAppSelector } from '@/flux/hooks';
import { Collapse, Divider } from 'antd';
import WCLCredentialsForm from './form';
import WCLCredentialsUsage from './usage';

export default function WCLCredentials() {
  const bearerToken = useAppSelector(selectAuthBearerToken);

  return (
    <Collapse
      activeKey={bearerToken ? undefined : 'WCLCredentials'}
      size="small"
      items={[
        {
          key: 'WCLCredentials',
          label: `🔑 WCL Credentials ${bearerToken ? '(done)' : '(required)'}`,
          children: (
            <>
              <WCLCredentialsUsage />
              <Divider />
              <WCLCredentialsForm />
            </>
          ),
        },
      ]}
    />
  );
}
