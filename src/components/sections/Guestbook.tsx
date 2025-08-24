"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Clock, User } from "lucide-react";

interface GuestbookEntry {
  id: string;
  username: string;
  message: string;
  approved: boolean;
  createdAt: any;
}

export default function Guestbook() {
  // Form state
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<GuestbookEntry[]>([]);
  
  // UI state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [canSubmit, setCanSubmit] = useState(true);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Safe profanity filter functions
  const checkProfanity = (text: string): boolean => {
    try {
      // Dynamic import leo-profanity
      const leoProfanity = require("leo-profanity");
      return leoProfanity.check ? leoProfanity.check(text) : false;
    } catch (error) {
      console.warn("Profanity check failed:", error);
      return false;
    }
  };

  const cleanProfanity = (text: string): string => {
    try {
      // Dynamic import leo-profanity
      const leoProfanity = require("leo-profanity");
      return leoProfanity.clean ? leoProfanity.clean(text) : text;
    } catch (error) {
      console.warn("Profanity clean failed:", error);
      return text;
    }
  };

  // Check cooldown on mount
  useEffect(() => {
    checkCooldown();
  }, []);

  // Fetch approved messages realtime
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const setupFirestore = async () => {
      try {
        // Try with orderBy first (if index ready), fallback to simple query
        let q;
        try {
          // Attempt full query with orderBy
          q = query(
            collection(db, "guestbook"),
            where("approved", "==", true),
            orderBy("createdAt", "desc"),
            limit(30)
          );
        } catch (indexError) {
          // Fallback to simple query if index not ready
          console.log("Index not ready, using simple query");
          q = query(
            collection(db, "guestbook"),
            where("approved", "==", true),
            limit(30)
          );
        }

        unsubscribe = onSnapshot(
          q, 
          (snapshot) => {
            const entries: GuestbookEntry[] = [];
            snapshot.forEach((doc) => {
              entries.push({
                id: doc.id,
                ...doc.data()
              } as GuestbookEntry);
            });
            
            // Always sort client-side (safe approach)
            entries.sort((a, b) => {
              if (!a.createdAt || !b.createdAt) return 0;
              return b.createdAt.toMillis() - a.createdAt.toMillis();
            });
            
            setItems(entries);
            console.log(`✅ Loaded ${entries.length} approved guestbook entries`);
          },
          (error) => {
            console.error("Firestore listener error:", error);
            
            if (error.code === 'permission-denied') {
              showNotification("error", "Rules masih belum tepat. Check Firebase Console.");
            } else if (error.code === 'failed-precondition') {
              showNotification("error", "Index masih building. Tunggu 2-3 menit lagi.");
            } else {
              showNotification("error", "Gagal memuat pesan. Refresh halaman.");
            }
          }
        );
      } catch (error) {
        console.error("Firestore setup error:", error);
        showNotification("error", "Koneksi database bermasalah. Coba lagi nanti.");
      }
    };

    setupFirestore();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Check cooldown timer
  const checkCooldown = () => {
    const lastSubmit = localStorage.getItem("gb:last");
    if (lastSubmit) {
      const elapsed = Date.now() - parseInt(lastSubmit);
      const remaining = 60000 - elapsed; // 60 seconds

      if (remaining > 0) {
        setCanSubmit(false);
        setCooldownTime(Math.ceil(remaining / 1000));
        
        const timer = setInterval(() => {
          const newRemaining = 60000 - (Date.now() - parseInt(lastSubmit));
          if (newRemaining <= 0) {
            setCanSubmit(true);
            setCooldownTime(0);
            clearInterval(timer);
          } else {
            setCooldownTime(Math.ceil(newRemaining / 1000));
          }
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  };

  // Validation
  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!username.trim() || username.length < 2) {
      errors.push("Username minimal 2 karakter");
    }
    if (username.length > 20) {
      errors.push("Username maksimal 20 karakter");
    }
    if (!message.trim() || message.length < 3) {
      errors.push("Pesan minimal 3 karakter");
    }
    if (message.length > 280) {
      errors.push("Pesan maksimal 280 karakter");
    }
    
    return errors;
  };

  // Show notification
  const showNotification = (type: "success" | "error", msg: string) => {
    setNotification({ type, message: msg });
    setTimeout(() => setNotification(null), 5000);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) {
      showNotification("error", `Tunggu ${cooldownTime} detik lagi`);
      return;
    }

    // Validate
    const errors = validateForm();
    if (errors.length > 0) {
      showNotification("error", errors.join(", "));
      return;
    }

    // Check profanity
    if (checkProfanity(username) || checkProfanity(message)) {
      showNotification("error", "Pesan mengandung kata yang tidak pantas");
      return;
    }

    setLoading(true);

    try {
      // Clean text
      const cleanUsername = cleanProfanity(username.trim());
      const cleanMessage = cleanProfanity(message.trim());

      console.log("Submitting to Firestore:", { cleanUsername, cleanMessage });

      // Submit to Firestore
      const docRef = await addDoc(collection(db, "guestbook"), {
        username: cleanUsername,
        message: cleanMessage,
        approved: false,
        createdAt: serverTimestamp(),
      });

      console.log("Document written with ID: ", docRef.id);

      // Success
      setMessage("");
      setUsername("");
      localStorage.setItem("gb:last", Date.now().toString());
      setCanSubmit(false);
      checkCooldown();
      
      showNotification("success", "Masuk antrean moderasi ✅");
    } catch (error: any) {
      console.error("Error submitting:", error);
      
      // More specific error messages
      let errorMessage = "Gagal mengirim pesan. Coba lagi.";
      
      if (error?.code === 'permission-denied') {
        errorMessage = "Akses ditolak. Periksa konfigurasi Firestore Rules.";
      } else if (error?.code === 'unavailable') {
        errorMessage = "Database tidak tersedia. Coba lagi nanti.";
      } else if (error?.code === 'invalid-argument') {
        errorMessage = "Data tidak valid. Periksa input Anda.";
      }
      
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta"
    }).format(date);
  };

  return (
    <section className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MessageSquare className="w-8 h-8 text-[#e60011]" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bincang / Guestbook
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Tinggalkan pesan singkat atau umpan balik. Pesan yang relevan akan ditampilkan setelah kurasi.
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <div 
          className={`mb-6 p-4 rounded-lg border ${
            notification.type === "success" 
              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
          }`}
          role="alert"
          aria-live="polite"
        >
          {notification.message}
        </div>
      )}

      {/* Form */}
      <Card className="rounded-2xl border bg-white/60 dark:bg-white/5 backdrop-blur p-4 sm:p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Nama/Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Siapa nama kamu?"
                maxLength={20}
                className="w-full pl-10 pr-4 py-3 min-h-[44px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#e60011] focus:border-transparent"
                aria-invalid={username.length > 0 && (username.length < 2 || username.length > 20)}
                disabled={loading}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>2-20 karakter</span>
              <span>{username.length}/20</span>
            </div>
          </div>

          {/* Message */}
          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Pesan
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan, saran, atau feedback kamu di sini..."
              maxLength={280}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#e60011] focus:border-transparent resize-none"
              aria-invalid={message.length > 0 && (message.length < 3 || message.length > 280)}
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>3-280 karakter</span>
              <span>{message.length}/280</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full min-h-[44px] bg-[#e60011] hover:bg-[#c10018] text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mengirim...
              </div>
            ) : !canSubmit ? (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tunggu {cooldownTime}s
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Kirim Pesan
              </div>
            )}
          </Button>

          {/* Info */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Pesan tampil setelah disetujui • Cooldown 60 detik
          </p>
        </form>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pesan dari Teman-teman
          </h3>
          <Badge variant="secondary" className="ml-auto">
            {items.length} pesan
          </Badge>
        </div>

        {items.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada pesan. Jadilah yang pertama! 🎉
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#e60011] to-[#c10018] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {item.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.username}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 break-words">
                      {item.message}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
