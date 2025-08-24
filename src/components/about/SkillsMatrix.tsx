'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Skill {
  label: string;
  level: 1 | 2 | 3;
  example?: string;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

interface SkillsMatrixProps {
  categories: SkillCategory[];
  initialLimit?: number;
  className?: string;
}

const levelConfig = {
  1: { label: 'Dasar', opacity: 'opacity-40', heat: 'bg-blue-500/40' },
  2: { label: 'Menengah', opacity: 'opacity-70', heat: 'bg-orange-500/70' },
  3: { label: 'Lanjut', opacity: 'opacity-100', heat: 'bg-red-500/90' }
};

export function SkillsMatrix({ categories, initialLimit = 12, className }: SkillsMatrixProps) {
  const [showAll, setShowAll] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Flatten all skills for counting
  const allSkills = categories.flatMap(cat => cat.skills);
  const totalSkills = allSkills.length;
  const shouldShowToggle = totalSkills > initialLimit;

  // Get skills to display
  const getDisplaySkills = (skills: Skill[]) => {
    if (showAll) return skills;
    
    // If showing limited view, distribute skills across categories proportionally
    const remainingSlots = initialLimit;
    const skillsPerCategory = Math.floor(remainingSlots / categories.length);
    const extraSlots = remainingSlots % categories.length;
    
    const categoryIndex = categories.findIndex(cat => cat.skills === skills);
    const slotsForThisCategory = skillsPerCategory + (categoryIndex < extraSlots ? 1 : 0);
    
    return skills.slice(0, slotsForThisCategory);
  };

  return (
    <section className={cn("space-y-8", className)}>
      {/* Skills Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {categories.map((category, categoryIndex) => {
          const displaySkills = getDisplaySkills(category.skills);
          const hiddenCount = category.skills.length - displaySkills.length;

          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              className="space-y-4"
            >
              {/* Category Header */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {category.category}
                </h3>
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-red-500 rounded-full" />
              </div>

              {/* Skills Pills */}
              <div className="flex flex-wrap gap-3">
                <AnimatePresence mode="wait">
                  {displaySkills.map((skill, index) => (
                    <SkillPill
                      key={skill.label}
                      skill={skill}
                      index={index}
                      isHovered={hoveredSkill === skill.label}
                      onHover={setHoveredSkill}
                    />
                  ))}
                </AnimatePresence>
                
                {/* Hidden skills indicator */}
                {!showAll && hiddenCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-dashed"
                  >
                    +{hiddenCount} more
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Level Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-6 p-4 bg-muted/30 rounded-xl"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4" aria-hidden="true" />
          <span>Tingkat keahlian:</span>
        </div>
        {Object.entries(levelConfig).map(([level, config]) => (
          <div key={level} className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              config.heat
            )} />
            <span className="text-sm font-medium">{config.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Toggle Button */}
      {shouldShowToggle && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="group"
            aria-label={showAll ? "Tampilkan lebih sedikit skills" : "Lihat semua skills"}
          >
            {showAll ? (
              <>
                Tampilkan Lebih Sedikit
                <ChevronUp className="ml-2 w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              </>
            ) : (
              <>
                Lihat Semua Skills
                <ChevronDown className="ml-2 w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredSkill && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-xs"
          >
            <div className="bg-popover border rounded-lg shadow-lg p-3">
              <p className="text-sm font-medium">
                {allSkills.find(s => s.label === hoveredSkill)?.example || 'Pengalaman dalam proyek nyata'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

interface SkillPillProps {
  skill: Skill;
  index: number;
  isHovered: boolean;
  onHover: (skill: string | null) => void;
}

function SkillPill({ skill, index, isHovered, onHover }: SkillPillProps) {
  const config = levelConfig[skill.level];

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => onHover(skill.label)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(skill.label)}
      onBlur={() => onHover(null)}
      className={cn(
        "relative inline-flex items-center px-4 py-2 rounded-full text-sm font-medium",
        "bg-background border border-border",
        "hover:border-primary/50 hover:bg-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "transition-all duration-200",
        "motion-reduce:transition-none",
        config.opacity
      )}
      aria-label={`${skill.label} - Level ${config.label}${skill.example ? `: ${skill.example}` : ''}`}
    >
      {/* Heat indicator */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full transition-opacity duration-200",
          config.heat,
          isHovered ? "opacity-20" : "opacity-10"
        )}
        aria-hidden="true"
      />
      
      {/* Skill label */}
      <span className="relative z-10">{skill.label}</span>
      
      {/* Level indicator */}
      <div 
        className={cn(
          "ml-2 w-2 h-2 rounded-full",
          config.heat
        )}
        aria-hidden="true"
      />
    </motion.button>
  );
}
