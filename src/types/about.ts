export interface AboutData {
  kpi: Array<{
    label: string;
    value: string;
  }>;
  skills: Array<{
    category: string;
    skills: Array<{
      label: string;
      level: 1 | 2 | 3;
      example: string;
    }>;
  }>;
  highlights: Array<{
    title: string;
    context: string;
    challenge: string;
    actions: string[];
    results: string[];
    impact: string;
    tech: string[];
    year: string;
    link?: string;
    isConfidential?: boolean;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
    category: string;
    skills: string[];
    verifyUrl: string;
    badgeUrl?: string;
    credentialId?: string;
  }>;
  timeline: Array<{
    year: string;
    title: string;
    organization: string;
    location: string;
    type: 'work' | 'education' | 'achievement' | 'project';
    description: string;
    highlights?: string[];
    tech?: string[];
    isOngoing?: boolean;
  }>;
}
