"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function BasicFirebaseTest() {
  const [status, setStatus] = useState<string>('Ready');
  const [loading, setLoading] = useState(false);

  const testBasicConnection = async () => {
    setLoading(true);
    setStatus('Testing basic Firebase connection...');

    try {
      // Test Firebase config first
      const config = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + "..."
      };
      
      setStatus(`Config loaded: ${JSON.stringify(config, null, 2)}`);
      
      // Dynamic import to avoid SSR issues
      const { initializeApp } = await import('firebase/app');
      const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      
      // Initialize Firebase
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      
      setStatus('Firebase initialized successfully...');
      
      // Try to write to a simple collection
      const testRef = collection(db, 'test-connection');
      const docRef = await addDoc(testRef, {
        message: 'Hello from basic test',
        timestamp: serverTimestamp(),
        testId: Math.random().toString(36).substr(2, 9)
      });
      
      setStatus(`✅ SUCCESS! Document created with ID: ${docRef.id}`);
      
    } catch (error: any) {
      console.error('Basic Firebase test error:', error);
      setStatus(`❌ ERROR: ${error.code || error.message}\n\nFull error: ${JSON.stringify({
        code: error.code,
        message: error.message,
        name: error.name
      }, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔥 Basic Firebase Test</h1>
        
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Connection Status:</h2>
            <pre className={`p-4 rounded whitespace-pre-wrap text-sm ${
              status.includes('✅') ? 'bg-green-100 text-green-800' :
              status.includes('❌') ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {status}
            </pre>
          </div>

          <Button 
            onClick={testBasicConnection}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Basic Firebase Connection'}
          </Button>

          <div className="text-sm text-gray-600 space-y-1 mt-4">
            <h3 className="font-semibold">Debug Info:</h3>
            <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
            <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
            <p><strong>Has API Key:</strong> {!!process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Yes' : 'No'}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
