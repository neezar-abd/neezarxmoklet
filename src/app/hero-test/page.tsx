import Hero from '@/components/sections/Hero';

export default function HeroTestPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Test sections to demonstrate scroll behavior */}
      <section id="projects" className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-8">Projects Section</h2>
          <p className="text-xl text-muted-foreground mb-8">
            This section demonstrates the scroll behavior from the Hero component.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">Project {i + 1}</h3>
                <p className="text-muted-foreground">Sample project description</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="min-h-[50vh] bg-background flex items-center justify-center">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Additional Content</h2>
          <p className="text-muted-foreground">
            More content to test the overall page flow and scroll behavior.
          </p>
        </div>
      </section>
    </div>
  );
}
