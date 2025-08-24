"use client";

import { useState } from 'react';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function FirebaseTestPage() {
  const [status, setStatus] = useState<string>('Ready');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Starting comprehensive Firebase test...');

    try {
      // Test 0: Check config
      setStatus('Test 0: Checking Firebase configuration...');
      const config = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
      };
      console.log('Firebase Config:', config);
      setStatus(`Config OK: Project=${config.projectId}, Auth=${config.authDomain}`);

      // Test 1: Simple collection reference
      setStatus('Test 1: Creating collection reference...');
      const testRef = collection(db, 'test');
      setStatus('✅ Collection reference created successfully');

      // Test 2: Try to write to a test collection first
      setStatus('Test 2: Writing to test collection...');
      const testDoc = await addDoc(testRef, {
        message: 'Hello from test',
        timestamp: serverTimestamp()
      });
      setStatus(`✅ Test write successful! Doc ID: ${testDoc.id}`);

      // Test 3: Try to read from test collection
      setStatus('Test 3: Reading from test collection...');
      const testSnapshot = await getDocs(testRef);
      setStatus(`✅ Test read successful! Found ${testSnapshot.size} documents`);

      // Test 4: Now try guestbook collection
      setStatus('Test 4: Testing guestbook collection...');
      const guestbookRef = collection(db, 'guestbook');
      
      // Test 5: Write to guestbook
      setStatus('Test 5: Writing to guestbook collection...');
      const guestbookDoc = await addDoc(guestbookRef, {
        username: 'Test User',
        message: 'Test message from comprehensive test',
        approved: false,
        createdAt: serverTimestamp(),
      });
      setStatus(`✅ Guestbook write successful! Doc ID: ${guestbookDoc.id}`);

      // Test 6: Read from guestbook
      setStatus('Test 6: Reading from guestbook collection...');
      const guestbookSnapshot = await getDocs(guestbookRef);
      setStatus(`✅ ALL TESTS PASSED! Guestbook has ${guestbookSnapshot.size} documents`);

    } catch (error: any) {
      console.error('Firebase test error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      let errorMsg = `❌ Error: ${error.code}`;
      let suggestion = '';
      
      if (error.code === 'permission-denied') {
        suggestion = `
🔧 Permission Denied Solutions:
1. Firebase Console → Firestore → Rules
2. Replace ALL rules with: allow read, write: if true;
3. Click Publish and wait 30 seconds
4. Make sure you're in the right project: neezar-next`;
      } else if (error.code === 'failed-precondition') {
        suggestion = '\n⏳ Index still building. Wait 2-3 minutes.';
      } else if (error.code === 'unavailable') {
        suggestion = '\n🌐 Network issue. Check internet connection.';
      }
      
      setStatus(`${errorMsg}\n${error.message}${suggestion}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔥 Firebase Connection Test</h1>
        
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Connection Status:</h2>
            <p className={`p-3 rounded ${
              status.includes('✅') ? 'bg-green-100 text-green-800' :
              status.includes('❌') ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {status}
            </p>
          </div>

          <Button 
            onClick={testConnection}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Firebase Connection'}
          </Button>

          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
            <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
