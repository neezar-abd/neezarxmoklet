'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, Building, GraduationCap, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  year: string;
  title: string;
  organization: string;
  location: string;
  type: 'work' | 'education' | 'achievement' | 'project';
  description: string;
  highlights?: string[];
  tech?: string[];
  isOngoing?: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const typeConfig = {
  work: { icon: Building, label: 'Karir', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950' },
  education: { icon: GraduationCap, label: 'Pendidikan', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-950' },
  achievement: { icon: Award, label: 'Prestasi', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-950' },
  project: { icon: Calendar, label: 'Project', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-950' }
};

export function Timeline({ events, className }: TimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.type === filter
  );

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const eventTypes = Array.from(new Set(events.map(e => e.type)));

  return (
    <section className={cn("space-y-8", className)} ref={containerRef}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Timeline Perjalanan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Kronologi pengalaman, pendidikan, dan pencapaian dari masa ke masa
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="gap-2"
        >
          Semua ({events.length})
        </Button>
        {eventTypes.map(type => {
          const config = typeConfig[type];
          const count = events.filter(e => e.type === type).length;
          const Icon = config.icon;
          
          return (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(type)}
              className="gap-2"
            >
              <Icon className="w-4 h-4" />
              {config.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 w-0.5 h-full bg-border">
          <motion.div
            className="w-full bg-primary origin-top"
            style={{ height: lineHeight }}
          />
        </div>

        {/* Timeline Events */}
        <div className="space-y-8">
          {filteredEvents.map((event, index) => (
            <TimelineItem
              key={`${event.year}-${index}`}
              event={event}
              index={index}
              isExpanded={expandedItems.has(index)}
              onToggle={() => toggleExpanded(index)}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-xl"
      >
        {Object.entries(typeConfig).map(([type, config]) => {
          const Icon = config.icon;
          const count = events.filter(e => e.type === type).length;
          
          return (
            <div key={type} className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", config.bg)}>
                <Icon className={cn("w-4 h-4", config.color)} aria-hidden="true" />
              </div>
              <div>
                <div className="font-medium text-sm">{config.label}</div>
                <div className="text-xs text-muted-foreground">{count} item</div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function TimelineItem({ event, index, isExpanded, onToggle }: TimelineItemProps) {
  const config = typeConfig[event.type];
  const Icon = config.icon;
  const hasDetails = event.highlights || event.tech;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative flex gap-6"
    >
      {/* Timeline Dot */}
      <div className="relative z-10 flex-shrink-0">
        <motion.div
          whileHover={{ scale: 1.2 }}
          className={cn(
            "w-16 h-16 rounded-full border-4 border-background shadow-lg flex items-center justify-center",
            config.bg
          )}
        >
          <Icon className={cn("w-6 h-6", config.color)} aria-hidden="true" />
        </motion.div>
        
        {/* Ongoing indicator */}
        {event.isOngoing && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <Card className={cn(
          "p-6 transition-all duration-300",
          "hover:shadow-lg hover:border-primary/50",
          isExpanded && "border-primary shadow-lg"
        )}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-xs", config.color)}>
                  {event.year}
                  {event.isOngoing && " - Sekarang"}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {config.label}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground">
                {event.title}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" aria-hidden="true" />
                  <span>{event.organization}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            {hasDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="ml-4"
                aria-label={isExpanded ? "Tutup detail" : "Lihat detail"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Expanded Content */}
          {hasDetails && (
            <motion.div
              initial={false}
              animate={{
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t space-y-4">
                {/* Highlights */}
                {event.highlights && event.highlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Key Highlights
                    </h4>
                    <ul className="space-y-1 ml-6">
                      {event.highlights.map((highlight, hIndex) => (
                        <li key={hIndex} className="text-sm text-muted-foreground">
                          • {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                {event.tech && event.tech.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.tech.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
