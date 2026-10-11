'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, DocumentReference } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { useIsFirebaseReady } from '../provider';

export function useDoc<T = any>(ref: DocumentReference | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isReady = useIsFirebaseReady();

  useEffect(() => {
    if (!ref || !isReady) {
      setData(null);
      setLoading(!isReady);
      return;
    }

    try {
      const unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          setData(snapshot.exists() ? (snapshot.data() as T) : null);
          setLoading(false);
          setError(null);
        },
        async (serverError) => {
          console.error(`[FORGE-FIRESTORE] Doc Read Failed at ${ref.path}:`, serverError);
          const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e: any) {
      console.error("[FORGE-FIRESTORE] useDoc internal crash:", e);
      setError(e);
      setLoading(false);
    }
  }, [ref?.path, isReady]);

  return { data, loading, error };
}