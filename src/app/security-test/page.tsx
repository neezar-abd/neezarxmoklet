"use client";

import { useState } from "react";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  timestamp: string;
}

export default function SecurityTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, success: boolean, message: string) => {
    const result: TestResult = {
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setResults(prev => [result, ...prev]);
  };

  const runSecurityTests = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Read approved messages (should work)
    try {
      const q = query(
        collection(db, "guestbook"),
        where("approved", "==", true),
        limit(5)
      );
      const snapshot = await getDocs(q);
      addResult(
        "✅ Read Approved Messages", 
        true, 
        `Berhasil baca ${snapshot.size} pesan approved`
      );
    } catch (error: any) {
      addResult(
        "❌ Read Approved Messages", 
        false, 
        `Error: ${error.code} - ${error.message}`
      );
    }

    // Test 2: Try read unapproved messages (should fail)
    try {
      const q = query(
        collection(db, "guestbook"),
        where("approved", "==", false),
        limit(5)
      );
      const snapshot = await getDocs(q);
      addResult(
        "❌ Read Unapproved Messages (SHOULD FAIL)", 
        false, 
        `BAHAYA! Bisa baca ${snapshot.size} pesan unapproved`
      );
    } catch (error: any) {
      addResult(
        "✅ Read Unapproved Messages Blocked", 
        true, 
        `Bagus! Diblokir: ${error.code}`
      );
    }

    // Test 3: Create new message (should work)
    try {
      const docRef = await addDoc(collection(db, "guestbook"), {
        username: "SecurityTest",
        message: "Test message " + Date.now(),
        approved: false,
        createdAt: serverTimestamp(),
      });
      addResult(
        "✅ Create Message", 
        true, 
        `Berhasil buat pesan: ${docRef.id}`
      );

      // Test 4: Try to update message (should fail)
      try {
        await updateDoc(doc(db, "guestbook", docRef.id), {
          message: "Hacked message!"
        });
        addResult(
          "❌ Update Message (SHOULD FAIL)", 
          false, 
          "BAHAYA! Bisa update pesan!"
        );
      } catch (error: any) {
        addResult(
          "✅ Update Message Blocked", 
          true, 
          `Bagus! Update diblokir: ${error.code}`
        );
      }

      // Test 5: Try to delete message (should fail)
      try {
        await deleteDoc(doc(db, "guestbook", docRef.id));
        addResult(
          "❌ Delete Message (SHOULD FAIL)", 
          false, 
          "BAHAYA! Bisa hapus pesan!"
        );
      } catch (error: any) {
        addResult(
          "✅ Delete Message Blocked", 
          true, 
          `Bagus! Delete diblokir: ${error.code}`
        );
      }

      // Test 6: Try to create approved message directly (should fail)
      try {
        await addDoc(collection(db, "guestbook"), {
          username: "Hacker",
          message: "Auto approved hack!",
          approved: true, // Try to bypass moderation
          createdAt: serverTimestamp(),
        });
        addResult(
          "❌ Create Approved Message (SHOULD FAIL)", 
          false, 
          "BAHAYA! Bisa langsung approve pesan!"
        );
      } catch (error: any) {
        addResult(
          "✅ Auto-Approve Blocked", 
          true, 
          `Bagus! Auto approve diblokir: ${error.code}`
        );
      }

    } catch (error: any) {
      addResult(
        "❌ Create Message", 
        false, 
        `Error: ${error.code} - ${error.message}`
      );
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">🔒 Security Test - Firestore Rules</h1>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          ⚠️ Test Keamanan Firestore Rules
        </h2>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          Test ini akan mencoba berbagai operasi untuk memastikan rules bekerja dengan benar.
          Yang hijau ✅ = aman, yang merah ❌ = bermasalah.
        </p>
      </div>

      <button
        onClick={runSecurityTests}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium mb-6 disabled:opacity-50"
      >
        {loading ? "Testing..." : "🚀 Run Security Tests"}
      </button>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.success
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-medium ${
                  result.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                }`}>
                  {result.test}
                </h3>
                <p className={`text-sm mt-1 ${
                  result.success ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-300"
                }`}>
                  {result.message}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {result.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">📊 Summary</h3>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 dark:text-green-400">
              ✅ Passed: {results.filter(r => r.success).length}
            </span>
            <span className="text-red-600 dark:text-red-400">
              ❌ Failed: {results.filter(r => !r.success).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
