'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, Query } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { useIsFirebaseReady } from '../provider';

export function useCollection<T = any>(query: Query | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isReady = useIsFirebaseReady();

  useEffect(() => {
    if (!query || !isReady) {
      setData([]);
      setLoading(!isReady);
      return;
    }

    try {
      const unsubscribe = onSnapshot(
        query,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            ...(doc.data() as T),
            id: doc.id,
          }));
          setData(items);
          setLoading(false);
          setError(null);
        },
        async (serverError) => {
          console.error("[FORGE-FIRESTORE] Collection Read Failed:", serverError);
          const permissionError = new FirestorePermissionError({
            path: 'collection_query',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e: any) {
      console.error("[FORGE-FIRESTORE] useCollection internal crash:", e);
      setError(e);
      setLoading(false);
    }
  }, [query, isReady]);

  return { data, loading, error };
}