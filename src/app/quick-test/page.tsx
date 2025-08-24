"use client";

import { useState } from "react";
import { 
  collection, 
  doc,
  getDoc,
  getDocs,
  query, 
  where, 
  addDoc, 
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function QuickTest() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const testRules = async () => {
    setLoading(true);
    setStatus("🔍 Testing current Firestore Rules...\n\n");

    let log = "🔍 Testing current Firestore Rules...\n\n";

    // Test 1: Read approved messages
    try {
      const q = query(
        collection(db, "guestbook"),
        where("approved", "==", true)
      );
      const snapshot = await getDocs(q);
      log += `✅ Read approved messages: SUCCESS (${snapshot.size} docs)\n`;
    } catch (error: any) {
      log += `❌ Read approved messages: FAILED (${error.code})\n`;
    }

    // Test 2: Try read unapproved
    try {
      const q = query(
        collection(db, "guestbook"),
        where("approved", "==", false)
      );
      const snapshot = await getDocs(q);
      log += `⚠️ Read unapproved messages: DANGER! (${snapshot.size} docs visible)\n`;
    } catch (error: any) {
      log += `✅ Read unapproved blocked: GOOD (${error.code})\n`;
    }

    // Test 3: Create new message
    try {
      const docRef = await addDoc(collection(db, "guestbook"), {
        username: "TestUser",
        message: "Quick security test " + Date.now(),
        approved: false,
        createdAt: serverTimestamp(),
      });
      log += `✅ Create message: SUCCESS (${docRef.id})\n`;

      // Test 4: Try update that message
      try {
        await updateDoc(doc(db, "guestbook", docRef.id), {
          message: "Modified!"
        });
        log += `⚠️ Update message: DANGER! (should be blocked)\n`;
      } catch (error: any) {
        log += `✅ Update blocked: GOOD (${error.code})\n`;
      }

      // Test 5: Try delete that message  
      try {
        await deleteDoc(doc(db, "guestbook", docRef.id));
        log += `⚠️ Delete message: DANGER! (should be blocked)\n`;
      } catch (error: any) {
        log += `✅ Delete blocked: GOOD (${error.code})\n`;
      }

    } catch (error: any) {
      log += `❌ Create message: FAILED (${error.code})\n`;
    }

    // Test 6: Try create pre-approved message
    try {
      await addDoc(collection(db, "guestbook"), {
        username: "Hacker",
        message: "Auto approved hack",
        approved: true, // This should be blocked
        createdAt: serverTimestamp(),
      });
      log += `⚠️ Create approved message: DANGER! (bypass detected)\n`;
    } catch (error: any) {
      log += `✅ Auto-approve blocked: GOOD (${error.code})\n`;
    }

    log += `\n📊 Test completed at ${new Date().toLocaleTimeString()}\n`;
    log += `\n💡 Rules yang aman harus memblokir: read unapproved, update, delete, auto-approve`;

    setStatus(log);
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">⚡ Quick Security Test</h1>
      
      <button
        onClick={testRules}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg mb-4 disabled:opacity-50"
      >
        {loading ? "Testing..." : "🔒 Test Rules Security"}
      </button>

      {status && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
          {status}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">📋 Expected Results (Secure Rules):</h3>
        <ul className="text-sm space-y-1">
          <li>✅ Read approved messages: SUCCESS</li>
          <li>✅ Read unapproved blocked: GOOD</li>
          <li>✅ Create message: SUCCESS</li>
          <li>✅ Update blocked: GOOD</li>
          <li>✅ Delete blocked: GOOD</li>
          <li>✅ Auto-approve blocked: GOOD</li>
        </ul>
      </div>
    </div>
  );
}
