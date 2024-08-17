import { useEffect } from 'react';
import { logEvent } from 'services/amplitude/analytics';

type CoreLogEventScreenProps = {
  location: string;
};

export default function CoreLogEventScreen({
  location,
}: CoreLogEventScreenProps) {
  useEffect(() => {
    logEvent(location, 'screen');
  }, [location]);

  return null;
}
