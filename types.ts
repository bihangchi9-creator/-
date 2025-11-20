export interface Experience {
  company: string;
  role: string;
  period: string;
  projects: Project[];
}

export interface Project {
  name: string;
  description?: string;
  details: string[];
  tags?: string[];
  period?: string;
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  period: string;
  details: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  contact: {
    phone: string;
    email: string;
    location: string;
    website: string;
  };
  education: Education;
  internships: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  awards: string[];
}

export enum ChatSender {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  timestamp: Date;
}