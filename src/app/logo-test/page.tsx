import { Logo } from '@/components/branding/Logo';

export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-12">
          Logo Component Test
        </h1>
        
        <div className="space-y-12">
          {/* Test variations */}
          <div className="bg-card rounded-lg p-8 border">
            <h2 className="text-2xl font-semibold mb-6">Size Variations</h2>
            <div className="flex flex-wrap items-center gap-8">
              <div className="text-center">
                <Logo size={16} />
                <p className="text-sm text-muted-foreground mt-2">16px</p>
              </div>
              <div className="text-center">
                <Logo size={24} />
                <p className="text-sm text-muted-foreground mt-2">24px</p>
              </div>
              <div className="text-center">
                <Logo size={32} />
                <p className="text-sm text-muted-foreground mt-2">32px</p>
              </div>
              <div className="text-center">
                <Logo size={48} />
                <p className="text-sm text-muted-foreground mt-2">48px</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 border">
            <h2 className="text-2xl font-semibold mb-6">With Text Variations</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Logo Only</h3>
                <Logo size={32} alt="Neezar Abd Portfolio" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Logo with Text</h3>
                <Logo size={32} withText alt="Neezar Abd - Full Stack Developer" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 border">
            <h2 className="text-2xl font-semibold mb-6">Theme Testing</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-background rounded-lg">
                <h3 className="text-lg font-medium mb-4">Light Theme</h3>
                <Logo size={48} withText alt="Light theme logo" />
              </div>
              <div className="p-6 bg-foreground text-background rounded-lg">
                <h3 className="text-lg font-medium mb-4">Dark Background</h3>
                <Logo size={48} withText alt="Dark background logo" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 border">
            <h2 className="text-2xl font-semibold mb-6">Interactive States</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                • Hover over the logo to see the scale and rotation animation
              </p>
              <p className="text-muted-foreground">
                • Tab to the logo to see the focus ring
              </p>
              <p className="text-muted-foreground">
                • Click to navigate to home page
              </p>
              <div className="pt-4">
                <Logo size={64} withText alt="Interactive logo test" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 border">
            <h2 className="text-2xl font-semibold mb-6">Accessibility Features</h2>
            <div className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Logo uses <code>currentColor</code> for theme-aware coloring</li>
                <li>Proper ARIA labels and roles for screen readers</li>
                <li>Keyboard navigation support with focus indicators</li>
                <li>Respects <code>prefers-reduced-motion</code> for animations</li>
                <li>Semantic HTML structure with proper Link component</li>
                <li>Screen reader friendly text for logo wordmark</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
