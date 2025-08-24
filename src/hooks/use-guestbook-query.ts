// Enhanced Guestbook with Index Detection
import { useEffect, useState } from 'react';
import { query, collection, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useGuestbookQuery() {
  const [indexReady, setIndexReady] = useState(false);

  // Try to detect if index is ready
  const createQuery = () => {
    if (indexReady) {
      // Full query with orderBy (requires index)
      return query(
        collection(db, "guestbook"),
        where("approved", "==", true),
        orderBy("createdAt", "desc"),
        limit(30)
      );
    } else {
      // Simplified query (no index needed)
      return query(
        collection(db, "guestbook"),
        where("approved", "==", true),
        limit(30)
      );
    }
  };

  return { createQuery, indexReady, setIndexReady };
}
