export interface ResumeData {
  id: string;
  fileName: string;
  content: string;
  sections: {
    personalInfo?: PersonalInfo;
    summary?: string;
    experience?: Experience[];
    education?: Education[];
    skills?: string[];
    certifications?: string[];
    projects?: Project[];
  };
  uploadedAt: Date;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
  location?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  location?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface JobDescription {
  title: string;
  company?: string;
  content: string;
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
}

export interface ATSAnalysis {
  score: number;
  matches: {
    skill: string;
    found: boolean;
    importance: 'high' | 'medium' | 'low';
  }[];
  suggestions: string[];
  missingKeywords: string[];
  improvements: {
    section: string;
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}

export interface OptimizedResume {
  originalId: string;
  optimizedContent: ResumeData;
  atsAnalysis: ATSAnalysis;
  changes: {
    section: string;
    type: 'added' | 'modified' | 'removed';
    description: string;
  }[];
  createdAt: Date;
}
