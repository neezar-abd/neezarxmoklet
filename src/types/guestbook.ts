import { Timestamp } from 'firebase/firestore';

export interface GuestbookEntry {
  id?: string;
  username: string;
  message: string;
  approved: boolean;
  createdAt: Timestamp;
  moderatedAt?: Timestamp;
  moderatedBy?: string;
}

export interface CreateGuestbookEntry {
  username: string;
  message: string;
  approved: boolean;
  createdAt: Timestamp;
}

export interface GuestbookFormData {
  username: string;
  message: string;
}
