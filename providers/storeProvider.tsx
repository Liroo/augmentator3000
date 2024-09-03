'use client';
import { AppStore, makeStore } from 'flux/store';
import usePersistMigration from 'hooks/usePersistMigration';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

function PersistMigration() {
  usePersistMigration();

  return null;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current.store}>
      <PersistGate loading={null} persistor={storeRef.current.persistor}>
        <PersistMigration />
        {children}
      </PersistGate>
    </Provider>
  );
}
