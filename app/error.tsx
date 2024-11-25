'use client'; // Error components must be Client Components

import localforage from 'localforage';
import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const resetStore = async () => {
    localStorage.removeItem('persist:augmentator3000-root');
    await localforage.removeItem('persist:augmentator3000-root');
    window.location.reload();
  };

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => resetStore()}>Reset the store</button>
    </div>
  );
}
