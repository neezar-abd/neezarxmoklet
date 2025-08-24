"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc,
  writeBatch
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PendingMessage {
  id: string;
  username: string;
  message: string;
  createdAt: any;
  approved: boolean;
}

export default function BulkModerator() {
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadPendingMessages();
  }, []);

  const loadPendingMessages = async () => {
    setLoading(true);
    setStatus("🔍 Loading pending messages...");
    
    try {
      const q = query(
        collection(db, "guestbook"),
        where("approved", "==", false)
      );
      const snapshot = await getDocs(q);
      
      const messages: PendingMessage[] = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        } as PendingMessage);
      });
      
      // Sort by newest first
      messages.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
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

  const toggleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const selectAll = () => {
    setSelectedMessages(pendingMessages.map(msg => msg.id));
  };

  const deselectAll = () => {
    setSelectedMessages([]);
  };

  const bulkApprove = async () => {
    if (selectedMessages.length === 0) {
      setStatus("❌ No messages selected");
      return;
    }

    setLoading(true);
    setStatus(`🚀 Approving ${selectedMessages.length} messages...`);

    try {
      // Use batch for better performance
      const batch = writeBatch(db);
      
      selectedMessages.forEach(messageId => {
        const docRef = doc(db, "guestbook", messageId);
        batch.update(docRef, { approved: true });
      });
      
      await batch.commit();
      
      setStatus(`✅ Successfully approved ${selectedMessages.length} messages!`);
      
      // Remove approved messages from pending list
      setPendingMessages(prev => 
        prev.filter(msg => !selectedMessages.includes(msg.id))
      );
      setSelectedMessages([]);
      
    } catch (error: any) {
      setStatus(`❌ Failed to approve: ${error.code} - ${error.message}`);
      console.error("Bulk approve error:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveAllSafe = async () => {
    // Filter out any potentially unsafe messages
    const safeMessages = pendingMessages.filter(msg => 
      msg.username && 
      msg.message && 
      msg.username.length <= 20 && 
      msg.message.length <= 280 &&
      !msg.message.toLowerCase().includes('spam') &&
      !msg.message.toLowerCase().includes('test hack')
    );
    
    if (safeMessages.length === 0) {
      setStatus("❌ No safe messages to approve");
      return;
    }

    setLoading(true);
    setStatus(`🛡️ Auto-approving ${safeMessages.length} safe messages...`);

    try {
      const batch = writeBatch(db);
      
      safeMessages.forEach(msg => {
        const docRef = doc(db, "guestbook", msg.id);
        batch.update(docRef, { approved: true });
      });
      
      await batch.commit();
      
      setStatus(`✅ Auto-approved ${safeMessages.length} safe messages!`);
      
      // Remove approved from list
      setPendingMessages(prev => 
        prev.filter(msg => !safeMessages.some(safe => safe.id === msg.id))
      );
      
    } catch (error: any) {
      setStatus(`❌ Auto-approve failed: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "No date";
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
    <div className="container mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold mb-6">⚡ Bulk Moderator Tool</h1>
      
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-green-800 dark:text-green-200 mb-2">
          🎯 Bulk Approval Tool
        </h2>
        <p className="text-green-700 dark:text-green-300 text-sm">
          Select multiple messages and approve them all at once. Much faster than one-by-one!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={loadPendingMessages}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>
        
        <button
          onClick={selectAll}
          disabled={pendingMessages.length === 0}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          ☑️ Select All ({pendingMessages.length})
        </button>
        
        <button
          onClick={deselectAll}
          disabled={selectedMessages.length === 0}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          ⬜ Deselect All
        </button>
        
        <button
          onClick={bulkApprove}
          disabled={loading || selectedMessages.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          ✅ Approve Selected ({selectedMessages.length})
        </button>
        
        <button
          onClick={approveAllSafe}
          disabled={loading || pendingMessages.length === 0}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          🛡️ Auto-Approve Safe Messages
        </button>
      </div>

      {/* Status */}
      {status && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-mono">{status}</p>
        </div>
      )}

      {/* Messages List */}
      {pendingMessages.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">
            ⏳ Pending Messages ({pendingMessages.length})
          </h3>
          
          {pendingMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMessages.includes(msg.id)
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => toggleSelectMessage(msg.id)}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedMessages.includes(msg.id)}
                  onChange={() => toggleSelectMessage(msg.id)}
                  className="mt-1 w-4 h-4 text-green-600"
                />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{msg.username}</h4>
                      <p className="text-sm text-gray-500">{formatDate(msg.createdAt)}</p>
                    </div>
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                      Pending
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    "{msg.message}"
                  </p>
                  
                  <div className="mt-2 text-xs text-gray-400">
                    ID: {msg.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold mb-2">No Pending Messages!</h3>
          <p className="text-gray-500">All messages have been processed.</p>
        </div>
      )}
    </div>
  );
}
