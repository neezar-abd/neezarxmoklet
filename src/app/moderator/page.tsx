"use client";

import { useState } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ModeratorPanel() {
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const loadPendingMessages = async () => {
    setLoading(true);
    setStatus("🔍 Loading pending messages...");
    
    try {
      const q = query(
        collection(db, "guestbook"),
        where("approved", "==", false)
      );
      const snapshot = await getDocs(q);
      
      const messages: any[] = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setPendingMessages(messages);
      setStatus(`📋 Found ${messages.length} pending messages`);
    } catch (error: any) {
      setStatus(`❌ Error loading: ${error.code} - ${error.message}`);
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveMessage = async (messageId: string) => {
    try {
      await updateDoc(doc(db, "guestbook", messageId), {
        approved: true
      });
      
      setStatus(`✅ Message ${messageId} approved!`);
      
      // Remove from pending list
      setPendingMessages(prev => prev.filter(msg => msg.id !== messageId));
      
    } catch (error: any) {
      setStatus(`❌ Failed to approve: ${error.code} - ${error.message}`);
      console.error("Approve error:", error);
    }
  };

  const rejectMessage = async (messageId: string) => {
    try {
      // For now, we just remove from pending list
      // In production, you might want to mark as rejected instead of approve
      setPendingMessages(prev => prev.filter(msg => msg.id !== messageId));
      setStatus(`🗑️ Message ${messageId} rejected (removed from queue)`);
      
    } catch (error: any) {
      setStatus(`❌ Failed to reject: ${error.code} - ${error.message}`);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "No timestamp";
    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta"
      }).format(date);
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">🛡️ Moderator Panel</h1>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          ⚠️ Temporary Moderator Tool
        </h2>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          Tool ini untuk testing. Di production, moderasi dilakukan manual di Firebase Console.
        </p>
      </div>

      <button
        onClick={loadPendingMessages}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium mb-6 disabled:opacity-50"
      >
        {loading ? "Loading..." : "📥 Load Pending Messages"}
      </button>

      {status && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-mono">{status}</p>
        </div>
      )}

      {pendingMessages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">⏳ Pending Messages ({pendingMessages.length})</h3>
          
          {pendingMessages.map((msg) => (
            <div key={msg.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-lg">{msg.username}</h4>
                  <p className="text-sm text-gray-500">{formatDate(msg.createdAt)}</p>
                </div>
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                  Pending
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "{msg.message}"
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => approveMessage(msg.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => rejectMessage(msg.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                >
                  ❌ Reject
                </button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                ID: {msg.id}
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingMessages.length === 0 && status.includes("Found") && (
        <div className="text-center py-8">
          <p className="text-gray-500">🎉 No pending messages!</p>
        </div>
      )}
    </div>
  );
}
