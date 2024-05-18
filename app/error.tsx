'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const resetStore = () => {
    localStorage.removeItem('persist:auganalyzer-root');
    window.location.reload();
  };

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => resetStore()}>Reset the store</button>
    </div>
  );
}
