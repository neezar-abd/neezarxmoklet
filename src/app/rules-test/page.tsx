"use client";

import { useState } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RulesTest() {
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);

  const testCurrentRules = async () => {
    setLoading(true);
    let log = "🔍 Testing Current Firebase Rules...\n\n";

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

    // Test 2: Read unapproved messages
    try {
      const q = query(
        collection(db, "guestbook"),
        where("approved", "==", false)
      );
      const snapshot = await getDocs(q);
      log += `⚠️ Read unapproved messages: SUCCESS (${snapshot.size} docs) - SHOULD BE BLOCKED\n`;
    } catch (error: any) {
      log += `✅ Read unapproved blocked: GOOD (${error.code})\n`;
    }

    // Test 3: Create message
    try {
      const docRef = await addDoc(collection(db, "guestbook"), {
        username: "RulesTest",
        message: "Testing rules " + Date.now(),
        approved: false,
        createdAt: serverTimestamp(),
      });
      log += `✅ Create message: SUCCESS (${docRef.id})\n`;
    } catch (error: any) {
      log += `❌ Create message: FAILED (${error.code})\n`;
    }

    log += `\n📋 Current rules analysis:\n`;
    log += `- Read approved: ${log.includes("Read approved messages: SUCCESS") ? "✅ Working" : "❌ Blocked"}\n`;
    log += `- Read unapproved: ${log.includes("Read unapproved blocked: GOOD") ? "✅ Blocked (secure)" : "⚠️ Allowed (insecure)"}\n`;
    log += `- Create message: ${log.includes("Create message: SUCCESS") ? "✅ Working" : "❌ Blocked"}\n`;

    setResults(log);
    setLoading(false);
  };

  const suggestRules = () => {
    const recommendedRules = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Guestbook rules
    match /guestbook/{document} {
      // Public dapat membaca pesan yang sudah approved
      allow read: if resource.data.approved == true;
      
      // Public dapat membuat pesan baru (akan pending approval)
      allow create: if request.auth == null && 
                   request.resource.data.approved == false &&
                   request.resource.data.keys().hasAll(['username', 'message', 'approved', 'createdAt']) &&
                   request.resource.data.username is string &&
                   request.resource.data.message is string &&
                   request.resource.data.approved == false;
      
      // Hanya admin yang bisa read/update pesan unapproved
      // Untuk development, kita comment dulu bagian ini
      // allow read, update: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Block semua akses lain
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;

    setResults(prev => prev + "\n\n🔧 RECOMMENDED RULES:\n" + recommendedRules);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">🔧 Rules Diagnostic</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testCurrentRules}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mr-4"
        >
          {loading ? "Testing..." : "🧪 Test Current Rules"}
        </button>
        
        <button
          onClick={suggestRules}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          📋 Show Recommended Rules
        </button>
      </div>

      {results && (
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap">
          {results}
        </div>
      )}

      <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
          ⚠️ Masalah Saat Ini:
        </h3>
        <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
          <li>• Rules terlalu ketat - block semua read operation</li>
          <li>• Moderator tidak bisa akses pesan pending</li>
          <li>• Public tidak bisa baca pesan approved</li>
          <li>• Perlu rules yang lebih spesifik</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
          ✅ Solusi:
        </h3>
        <ol className="text-green-700 dark:text-green-300 text-sm space-y-1">
          <li>1. Test rules saat ini dengan tombol di atas</li>
          <li>2. Copy rules yang recommended</li>
          <li>3. Paste ke Firebase Console Rules tab</li>
          <li>4. Publish rules</li>
          <li>5. Test lagi - seharusnya approved messages bisa dibaca</li>
        </ol>
      </div>
    </div>
  );
}
