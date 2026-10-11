
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { firebaseApp, firestore, auth, storage, configError } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp ?? null}
      firestore={firestore ?? null}
      auth={auth ?? null}
      storage={storage ?? null}
      configError={configError}
    >
      {children}
    </FirebaseProvider>
  );
};
