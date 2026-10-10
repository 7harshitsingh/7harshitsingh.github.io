export interface Project {
  title: string;
  summary: string;
  href: string;
}

export interface Experience {
  role: string;
  organization: string;
  period: string;
  summary?: string;
}

export interface ExternalLink {
  label: string;
  href: string;
}

export interface SiteData {
  name: string;
  description: string;
  intro: string;
  focus: string[];
  projects: Project[];
  experience: Experience[];
  links: ExternalLink[];
}

export const site: SiteData = {
  name: 'Harshit Singh',
  description: 'Personal website of Harshit Singh.',
  intro: '',
  focus: [],
  projects: [],
  experience: [],
  links: [{ label: 'GitHub', href: 'https://github.com/7harshitsingh' }],
};
