import { Metadata } from 'next';
import ProjectsGrid from '@/components/sections/ProjectsGrid';

export const metadata: Metadata = {
  title: 'Proyek Neezar Abd — Studi Kasus & Teknologi',
  description: 'Tiga studi kasus yang menjelaskan konteks, peran, solusi teknis, dan hasil terukur. (Segera hadir.)',
};

export default function ProjectsPage() {
  return (
    <div className="container py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Proyek
          </h1>
          <p className="text-xl text-muted-foreground">
            Bagian ini akan menampilkan tiga studi kasus yang menjelaskan konteks, peran, solusi teknis, dan hasil terukur.
          </p>
          <p className="text-lg text-muted-foreground mt-4">
            Status: segera hadir.
          </p>
        </div>

        {/* Projects Grid with full features */}
        <ProjectsGrid 
          showSearch={true}
          showFilters={true}
        />
      </div>
    </div>
  );
}
