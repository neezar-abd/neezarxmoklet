'use client';

import { useState, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { projects, Project } from '@/data/projects';
import { cn } from '@/lib/utils';

// Get unique tech stack for filter chips
const getAllTechStack = (projects: Project[]) => {
  const techSet = new Set<string>();
  projects.forEach(project => {
    project.stack.forEach(tech => techSet.add(tech));
  });
  return Array.from(techSet).sort();
};

interface ProjectCardProps {
  project: Project;
  index: number;
  onQuickView?: (project: Project) => void;
}

function ProjectCard({ project, index, onQuickView }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="group h-full"
    >
      <Card className="relative overflow-hidden rounded-2xl border-0 bg-white/5 backdrop-blur-md dark:bg-white/[0.02] transition-all duration-300 hover:shadow-[0_0_24px_rgba(230,0,17,.12)] h-full flex flex-col">
        {/* Gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#e60011] via-[#c10018] to-[#e60011] p-[1px]">
          <div className="h-full w-full rounded-2xl bg-background/90 backdrop-blur-md" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{project.year}</span>
                {project.featured && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            
            <CardTitle className="text-xl font-display font-bold group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
            
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {project.desc}
            </p>
          </CardHeader>

          <CardContent className="pt-0 flex-1 flex flex-col justify-between">
            {/* Tech Stack */}
            <div className="mb-4">
              <div className="flex items-center gap-1 mb-2">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.slice(0, 4).map((tech) => (
                  <Badge 
                    key={tech} 
                    variant="outline" 
                    className="text-xs px-2 py-0.5 border-primary/20 text-primary/80 hover:bg-primary/10"
                  >
                    {tech}
                  </Badge>
                ))}
                {project.stack.length > 4 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-muted-foreground/20">
                    +{project.stack.length - 4}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {project.links.demo && (
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link 
                    href={project.links.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Demo
                  </Link>
                </Button>
              )}
              
              {project.links.repo && (
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link 
                    href={project.links.repo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-3 w-3" />
                    Code
                  </Link>
                </Button>
              )}
              
              {onQuickView && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => onQuickView(project)}
                  className="flex-1"
                >
                  Detail
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

interface ProjectsGridProps {
  onQuickView?: (project: Project) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  limit?: number;
}

export default function ProjectsGrid({ 
  onQuickView, 
  showSearch = true, 
  showFilters = true,
  limit 
}: ProjectsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  const allTechStack = useMemo(() => getAllTechStack(projects), []);
  
  const filteredProjects = useMemo(() => {
    let filtered = projects;
    
    // Apply search filter
    if (deferredSearchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        project.desc.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        project.stack.some(tech => 
          tech.toLowerCase().includes(deferredSearchTerm.toLowerCase())
        )
      );
    }
    
    // Apply tech stack filter
    if (selectedTech.length > 0) {
      filtered = filtered.filter(project =>
        selectedTech.every(tech => project.stack.includes(tech))
      );
    }
    
    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  }, [deferredSearchTerm, selectedTech, limit]);

  const toggleTechFilter = (tech: string) => {
    setSelectedTech(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="sticky top-20 z-30 bg-background/80 backdrop-blur-md rounded-2xl border p-4 shadow-sm"
        >
          {/* Search Bar */}
          {showSearch && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari proyek berdasarkan nama atau teknologi..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search projects"
              />
            </div>
          )}
          
          {/* Filter Chips */}
          {showFilters && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Filter by Technology:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTechStack.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTechFilter(tech)}
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                      "border border-primary/20 hover:border-primary/40",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      selectedTech.includes(tech)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-primary/5 text-muted-foreground hover:text-primary"
                    )}
                    aria-pressed={selectedTech.includes(tech)}
                    aria-label={`Filter by ${tech}`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Results Counter */}
          <div className="mt-3 text-xs text-muted-foreground">
            {filteredProjects.length} proyek ditemukan
            {selectedTech.length > 0 && (
              <span> dengan teknologi: {selectedTech.join(', ')}</span>
            )}
          </div>
        </motion.div>
      )}

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 ? (
          <motion.div
            key="projects-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            role="grid"
            aria-label="Projects grid"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                onQuickView={onQuickView}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">Tidak ada proyek ditemukan</h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah kata kunci pencarian atau filter teknologi
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedTech([]);
              }}
            >
              Reset Filter
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
