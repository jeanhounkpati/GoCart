'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ClerkUserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id || hasSyncedRef.current) {
      return;
    }

    hasSyncedRef.current = true;

    fetch('/api/users/sync', {
      method: 'POST',
    }).catch((error) => {
      console.error('Failed to sync Clerk user:', error);
    });
  }, [isLoaded, isSignedIn, user?.id]);

  return null;
}
