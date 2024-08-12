import * as amplitude from '@amplitude/analytics-browser';

import { isServer } from 'utils/isServer';

const initAmplitude = () => {
  if (!isServer()) {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
      defaultTracking: false,
    });
  }
};

export default initAmplitude;
