import * as amplitude from '@amplitude/analytics-browser';

import { isServer } from 'utils/isServer';

export const logEvent = (
  eventName: string,
  eventLocation: string,
  eventProperties: object = {},
) => {
  if (isServer()) return;

  const properties = {
    ...eventProperties,
    _event: eventLocation,
  };

  console.debug(eventName, properties);

  amplitude.track(eventName, properties);
};
