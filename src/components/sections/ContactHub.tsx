'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MessageCircle, 
  Linkedin, 
  Download, 
  Copy, 
  Check,
  Clock,
  Globe,
  Briefcase,
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ContactAction {
  id: string;
  label: string;
  href: string;
  icon: any;
  description: string;
  primary?: boolean;
  external?: boolean;
  download?: boolean;
  copyable?: boolean;
  copyText?: string;
}

const contactActions: ContactAction[] = [
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:nizarabdurr@gmail.com?subject=Halo%20Neezar&body=Halo%20Neezar%2C%0A%0ASaya%20tertarik%20untuk%20berdiskusi%20tentang%20%5Btopik%5D.%0A%0ATerima%20kasih%21',
    icon: Mail,
    description: 'Kirim email langsung',
    primary: true,
    copyable: true,
    copyText: 'nizarabdurr@gmail.com'
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/6283899200333?text=Halo%20Neezar%2C%20saya%20ingin%20berdiskusi%20tentang%20project%20atau%20kolaborasi.',
    icon: MessageCircle,
    description: 'Chat via WhatsApp',
    external: true
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/nizar-abdurr',
    icon: Linkedin,
    description: 'Connect di LinkedIn',
    external: true
  },
  {
    id: 'cv',
    label: 'Download CV',
    href: '/Neezar-CV.pdf',
    icon: Download,
    description: 'Download resume PDF',
    download: true
  }
];

const badges = [
  { icon: Clock, label: 'Respons cepat <24h', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { icon: Globe, label: 'GMT+7', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { icon: Briefcase, label: 'Open to Internship', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
];

export function ContactHub() {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = async (actionId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [actionId]: true }));
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [actionId]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleActionClick = (action: ContactAction, e: React.MouseEvent) => {
    if (action.download) {
      // Let the browser handle the download
      return;
    }
    
    if (action.external) {
      window.open(action.href, '_blank', 'noopener,noreferrer');
      e.preventDefault();
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Hubungi Saya
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mari berdiskusi mengenai kebutuhan Anda atau peluang magang yang tersedia.
          </p>
        </motion.div>

        {/* Contact Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {contactActions.map((action, index) => {
            const Icon = action.icon;
            const isCopied = copiedStates[action.id];

            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative group"
              >
                <Button
                  asChild={!action.copyable}
                  variant={action.primary ? 'default' : 'outline'}
                  size="lg"
                  className={cn(
                    "w-full h-auto min-h-[44px] p-4 flex-col gap-2 transition-all duration-300",
                    "hover:scale-105 hover:shadow-lg",
                    "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "group-hover:border-primary/50",
                    action.primary && "bg-primary hover:bg-primary/90"
                  )}
                  onClick={action.copyable ? undefined : (e) => handleActionClick(action, e)}
                  aria-label={`${action.label} - ${action.description}`}
                >
                  {action.copyable ? (
                    <div className="w-full flex flex-col items-center gap-2">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span className="font-medium text-sm">{action.label}</span>
                      <span className="text-xs text-muted-foreground text-center">
                        {action.description}
                      </span>
                    </div>
                  ) : (
                    <a
                      href={action.href}
                      className="w-full flex flex-col items-center gap-2"
                      {...(action.download && { download: true })}
                      {...(action.external && { 
                        target: '_blank', 
                        rel: 'noopener noreferrer' 
                      })}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span className="font-medium text-sm">{action.label}</span>
                      <span className="text-xs text-muted-foreground text-center">
                        {action.description}
                      </span>
                      {action.external && (
                        <ExternalLink className="w-3 h-3 absolute top-2 right-2 opacity-60" aria-hidden="true" />
                      )}
                    </a>
                  )}
                </Button>

                {/* Copy Button for Email */}
                {action.copyable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1 w-6 h-6"
                    onClick={() => handleCopy(action.id, action.copyText!)}
                    aria-label={`Copy ${action.label}`}
                  >
                    {isCopied ? (
                      <Check className="w-3 h-3 text-green-600" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3 h-3" aria-hidden="true" />
                    )}
                  </Button>
                )}

                {/* Copy feedback tooltip */}
                {action.copyable && isCopied && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap"
                  >
                    Email disalin!
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Status Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            
            return (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-xs font-medium",
                    "transition-all duration-300 hover:scale-105",
                    badge.color
                  )}
                >
                  <Icon className="w-3 h-3" aria-hidden="true" />
                  {badge.label}
                </Badge>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8 text-sm text-muted-foreground"
        >
          <p>
            Atau hubungi saya melalui platform lain yang Anda sukai. Saya aktif di berbagai channel komunikasi 
            dan selalu berusaha memberikan respon yang cepat dan helpful.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
