import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { clean } from 'leo-profanity';
import type { GuestbookEntry, CreateGuestbookEntry, GuestbookFormData } from '@/types/guestbook';

// Collection reference
const COLLECTION_NAME = 'guestbook';
const guestbookRef = collection(db, COLLECTION_NAME);

/**
 * Validate guestbook entry data
 */
export function validateGuestbookEntry(data: GuestbookFormData): string[] {
  const errors: string[] = [];
  
  // Validate username
  if (!data.username || data.username.trim().length < 2) {
    errors.push('Username must be at least 2 characters long');
  }
  if (data.username.length > 20) {
    errors.push('Username must be 20 characters or less');
  }
  
  // Validate message
  if (!data.message || data.message.trim().length < 3) {
    errors.push('Message must be at least 3 characters long');
  }
  if (data.message.length > 280) {
    errors.push('Message must be 280 characters or less');
  }
  
  return errors;
}

/**
 * Clean profanity from text
 */
export function cleanProfanity(text: string): string {
  return clean(text);
}

/**
 * Submit a new guestbook entry (pending approval)
 */
export async function submitGuestbookEntry(data: GuestbookFormData): Promise<string> {
  try {
    // Validate input
    const errors = validateGuestbookEntry(data);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    // Clean profanity
    const cleanUsername = cleanProfanity(data.username.trim());
    const cleanMessage = cleanProfanity(data.message.trim());
    
    // Create entry (pending approval)
    const entryData: CreateGuestbookEntry = {
      username: cleanUsername,
      message: cleanMessage,
      approved: false, // Always pending approval
      createdAt: Timestamp.now()
    };
    
    // Add to Firestore
    const docRef = await addDoc(guestbookRef, entryData);
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting guestbook entry:', error);
    throw error;
  }
}

/**
 * Get approved guestbook entries (public read)
 */
export async function getApprovedGuestbookEntries(limitCount: number = 10): Promise<GuestbookEntry[]> {
  try {
    // Query only approved entries, ordered by creation date (newest first)
    const q = query(
      guestbookRef,
      where('approved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    const entries: GuestbookEntry[] = [];
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data()
      } as GuestbookEntry);
    });
    
    return entries;
  } catch (error) {
    console.error('Error fetching guestbook entries:', error);
    throw error;
  }
}

/**
 * Format timestamp for display
 */
export function formatGuestbookDate(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).format(date);
}
