import Guestbook from '@/components/sections/Guestbook';

export default function GuestbookTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🧪 Guestbook Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testing all Guestbook functionality including Firebase integration
          </p>
        </div>
        
        <Guestbook />
      </div>
    </div>
  );
}
