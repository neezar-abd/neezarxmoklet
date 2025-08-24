"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FirebaseDebug() {
  const [status, setStatus] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirebase = async () => {
      let log = "🔍 Firebase Debug Report\n\n";

      try {
        // Test 1: Check Firebase connection
        log += "1️⃣ Testing Firebase connection...\n";
        const testRef = doc(db, "test", "connection");
        try {
          await getDoc(testRef);
          log += "✅ Firebase connected successfully\n\n";
        } catch (error: any) {
          log += `❌ Firebase connection failed: ${error.code}\n\n`;
        }

        // Test 2: Check guestbook collection access
        log += "2️⃣ Testing guestbook collection access...\n";
        try {
          const guestbookRef = collection(db, "guestbook");
          const snapshot = await getDocs(guestbookRef);
          log += `📊 Total documents in collection: ${snapshot.size}\n`;
          
          let approvedCount = 0;
          let unapprovedCount = 0;
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.approved === true) {
              approvedCount++;
            } else {
              unapprovedCount++;
            }
          });
          
          log += `✅ Approved messages: ${approvedCount}\n`;
          log += `⏳ Pending messages: ${unapprovedCount}\n\n`;
          
        } catch (error: any) {
          log += `❌ Collection access failed: ${error.code} - ${error.message}\n\n`;
        }

        // Test 3: Test approved query specifically
        log += "3️⃣ Testing approved messages query...\n";
        try {
          const q = query(
            collection(db, "guestbook"),
            where("approved", "==", true)
          );
          const snapshot = await getDocs(q);
          log += `✅ Approved query successful: ${snapshot.size} documents\n`;
          
          if (snapshot.size > 0) {
            log += "📝 Sample approved messages:\n";
            let count = 0;
            snapshot.forEach((doc) => {
              if (count < 3) { // Show first 3
                const data = doc.data();
                log += `   • ${data.username}: "${data.message}" (${data.createdAt ? 'has timestamp' : 'no timestamp'})\n`;
                count++;
              }
            });
          }
          log += "\n";
          
        } catch (error: any) {
          log += `❌ Approved query failed: ${error.code} - ${error.message}\n\n`;
        }

        // Test 4: Test unapproved query (should fail with secure rules)
        log += "4️⃣ Testing unapproved messages query (should fail)...\n";
        try {
          const q = query(
            collection(db, "guestbook"),
            where("approved", "==", false)
          );
          const snapshot = await getDocs(q);
          log += `⚠️ SECURITY ISSUE: Can read ${snapshot.size} unapproved messages!\n\n`;
        } catch (error: any) {
          log += `✅ Unapproved access blocked: ${error.code}\n\n`;
        }

        // Test 5: Environment check
        log += "5️⃣ Environment configuration:\n";
        log += `Firebase Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}\n`;
        log += `Firebase App ID: ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Set' : 'Missing'}\n`;
        log += `Firebase API Key: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing'}\n\n`;

        log += "🏁 Debug completed at " + new Date().toLocaleTimeString();

      } catch (error: any) {
        log += `💥 Critical error: ${error.message}\n`;
      }

      setStatus(log);
      setLoading(false);
    };

    checkFirebase();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">🐛 Firebase Debug</h1>
      
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span>Running diagnostics...</span>
        </div>
      ) : (
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap">
          {status}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Kemungkinan Penyebab:</h3>
        <ul className="text-sm space-y-1">
          <li>• Belum ada pesan yang approved di Firebase</li>
          <li>• Rules terlalu ketat (block read approved)</li>
          <li>• Index belum ready untuk orderBy query</li>
          <li>• Environment variables salah</li>
          <li>• Firebase project tidak sesuai</li>
        </ul>
      </div>
    </div>
  );
}
