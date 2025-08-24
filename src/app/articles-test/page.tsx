import { ArticlesResponsive } from '@/components/sections/ArticlesResponsive';

export default function ArticlesTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Articles Responsive Component Test
        </h1>
        
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Test Instructions:</h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• <strong>Mobile (≤md):</strong> Should show horizontal scroll-snap carousel with ~85vw card width</li>
            <li>• <strong>Desktop (≥lg):</strong> Should show the original grid layout from Prompt A</li>
            <li>• <strong>Carousel features:</strong> Edge gradient masks, momentum scroll, prev/next controls</li>
            <li>• <strong>Accessibility:</strong> aria-live announcements, keyboard navigation, proper ARIA labels</li>
          </ul>
        </div>
      </div>
      
      <ArticlesResponsive />
    </div>
  );
}
