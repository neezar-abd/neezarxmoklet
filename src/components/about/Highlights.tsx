'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Users, Target, Award, TrendingUp, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProjectHighlight {
  title: string;
  context: string;
  challenge: string;
  actions: string[];
  results: string[];
  impact: string;
  link?: string;
  tech: string[];
  year: string;
  isConfidential?: boolean;
}

interface HighlightsProps {
  highlights: ProjectHighlight[];
  className?: string;
}

const starCategories = [
  { key: 'context', label: 'Situasi', icon: Target, color: 'text-blue-600' },
  { key: 'challenge', label: 'Tantangan', icon: Users, color: 'text-orange-600' },
  { key: 'actions', label: 'Aksi', icon: TrendingUp, color: 'text-green-600' },
  { key: 'results', label: 'Hasil', icon: Award, color: 'text-purple-600' }
];

export function Highlights({ highlights, className }: HighlightsProps) {
  const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null);
  const [showConfidential, setShowConfidential] = useState(false);

  const visibleHighlights = highlights.filter(h => 
    showConfidential || !h.isConfidential
  );

  const confidentialCount = highlights.filter(h => h.isConfidential).length;

  return (
    <section className={cn("space-y-8", className)}>
      {/* Header with Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project Highlights</h2>
          <p className="text-muted-foreground mt-1">
            Pencapaian utama menggunakan metodologi STAR
          </p>
        </div>
        
        {confidentialCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfidential(!showConfidential)}
            className="gap-2"
          >
            {showConfidential ? (
              <>
                <EyeOff className="w-4 h-4" />
                Sembunyikan Confidential
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Tampilkan Confidential ({confidentialCount})
              </>
            )}
          </Button>
        )}
      </div>

      {/* Highlights Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {visibleHighlights.map((highlight, index) => (
          <HighlightCard
            key={index}
            highlight={highlight}
            index={index}
            isSelected={selectedHighlight === index}
            onToggle={() => setSelectedHighlight(
              selectedHighlight === index ? null : index
            )}
          />
        ))}
      </div>

      {/* STAR Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-xl"
      >
        {starCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <Icon className={cn("w-5 h-5", category.color)} aria-hidden="true" />
              <div>
                <div className="font-medium text-sm">{category.label}</div>
                <div className="text-xs text-muted-foreground">
                  {category.key === 'context' && 'Situasi & Tugas'}
                  {category.key === 'challenge' && 'Tantangan Utama'}
                  {category.key === 'actions' && 'Tindakan Konkret'}
                  {category.key === 'results' && 'Hasil Terukur'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

interface HighlightCardProps {
  highlight: ProjectHighlight;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
}

function HighlightCard({ highlight, index, isSelected, onToggle }: HighlightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      <Card className={cn(
        "p-6 cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:border-primary/50",
        isSelected && "border-primary shadow-lg",
        highlight.isConfidential && "border-orange-200 bg-orange-50/30 dark:bg-orange-950/20"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{highlight.title}</h3>
              {highlight.isConfidential && (
                <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                  Confidential
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{highlight.year}</span>
              <span>•</span>
              <span>{highlight.tech.slice(0, 2).join(', ')}</span>
              {highlight.tech.length > 2 && (
                <span>+{highlight.tech.length - 2} more</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {highlight.link && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(highlight.link, '_blank');
                }}
                aria-label={`Buka link project ${highlight.title}`}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-2"
              aria-label={isSelected ? "Tutup detail" : "Lihat detail"}
            >
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform duration-300",
                isSelected && "rotate-90"
              )} />
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {highlight.context}
          </p>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Award className="w-3 h-3" />
              <span className="font-medium">Impact:</span>
            </div>
            <p className="text-sm font-medium line-clamp-1">
              {highlight.impact}
            </p>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t space-y-6"
            >
              {/* Situation & Task */}
              <StarSection
                icon={Target}
                title="Situasi & Tantangan"
                color="text-blue-600"
                content={[highlight.context, highlight.challenge]}
              />

              {/* Actions */}
              <StarSection
                icon={TrendingUp}
                title="Tindakan yang Diambil"
                color="text-green-600"
                content={highlight.actions}
                isList
              />

              {/* Results */}
              <StarSection
                icon={Award}
                title="Hasil & Impact"
                color="text-purple-600"
                content={[...highlight.results, highlight.impact]}
                isList
              />

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2">
                {highlight.tech.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

interface StarSectionProps {
  icon: any;
  title: string;
  color: string;
  content: string[];
  isList?: boolean;
}

function StarSection({ icon: Icon, title, color, content, isList }: StarSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", color)} aria-hidden="true" />
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
      
      {isList ? (
        <ul className="space-y-1 ml-6">
          {content.map((item, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              • {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-2 ml-6">
          {content.map((paragraph, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
