'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview ForgeOS Auth Kernel Hook
 * Standardized Firebase Auth state listener.
 */

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        console.info(`[FORGE-AUTH] Authority Verified: ${u.uid}`);
        setUser(u);
      } else {
        setUser(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("[FORGE-AUTH] State change interrupt:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
