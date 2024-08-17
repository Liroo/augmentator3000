import { createListenerMiddleware, isRejected } from '@reduxjs/toolkit';
import { logEvent } from 'services/amplitude/analytics';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isRejected,
  effect: async (action) => {
    const actionType = action.type.replace('/rejected', '');

    const arg: any = {};
    if (action.meta.arg) {
      Object.keys(action.meta.arg).forEach((key) => {
        if (
          ['string', 'number', 'boolean', 'null'].includes(
            (typeof (action.meta.arg as any)[key]).toLowerCase(),
          )
        )
          arg[key] = (action.meta.arg as any)[key];
        else arg[key] = JSON.stringify((action.meta.arg as any)[key]);
      });
    }

    logEvent('technical', 'thunk-error', {
      actionType,
      error: {
        message: action.error.message,
        code: action.error.code,
        name: action.error.name,
      },
      arg,
    });
  },
});

export default listenerMiddleware;
