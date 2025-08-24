import { SiteFooter } from '@/components/layout/SiteFooter';

export default function FooterTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Footer Component Test
        </h1>
        
        <div className="mb-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Features:</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Back-to-top button:</strong> Should appear when scrolled down 300px</li>
            <li>• <strong>Responsive design:</strong> 3 columns on desktop, 1 column on mobile</li>
            <li>• <strong>Gradient border:</strong> Subtle red gradient divider at top</li>
            <li>• <strong>Navigation links:</strong> Hover effects with gradient underlines</li>
            <li>• <strong>Social media:</strong> GitHub, LinkedIn, Email with proper rel attributes</li>
            <li>• <strong>Accessibility:</strong> ARIA labels, keyboard navigation, focus indicators</li>
            <li>• <strong>SEO:</strong> JSON-LD structured data for organization</li>
          </ul>
        </div>

        {/* Add content to enable scrolling */}
        <div className="space-y-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Content Section {i + 1}</h3>
              <p className="text-muted-foreground">
                This is a test content section to enable scrolling behavior. 
                Scroll down to see the back-to-top button appear after 300px of scrolling.
                The footer will be visible at the bottom of the page with all the professional
                features including brand section, navigation, social media links, and proper
                accessibility implementations.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
