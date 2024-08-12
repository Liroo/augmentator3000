'use client';

import { logEvent } from '@/services/amplitude/analytics';
import { useEffect } from 'react';

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
