'use client';

import { notification } from 'antd';
import { useEffect } from 'react';

const iteration = 2;

export default function UIUpdateAlert() {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const currentIteration = localStorage.getItem('iteration');
    if (currentIteration !== iteration.toString()) {
      api.info({
        message: 'Major update',
        description:
          'If you get any bug, please consider resetting the store (bottom right of the page). Sorry boys, I had to do it 😥',
        duration: 0,
      });
      localStorage.setItem('iteration', iteration.toString());
    }
  }, []);

  return <>{contextHolder}</>;
}
