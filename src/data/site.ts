export interface Project {
  title: string;
  summary: string;
  category: string;
  tools: string[];
  href?: string;
  stats?: { stars: number; forks: number; asOf: string };
}

export interface Experience {
  role: string;
  organization: string;
  period: string;
  summary?: string;
  bullets?: string[];
}

export interface ExternalLink {
  label: string;
  href: string;
}

export interface SiteData {
  name: string;
  description: string;
  intro: string;
  education: { degree: string; institution: string; year: string };
  skills: string[];
  projects: Project[];
  experience: Experience[];
  links: ExternalLink[];
}

export const site: SiteData = {
  name: 'Harshit Singh',
  description: 'Harshit Singh (7harshitsingh) is an IIT Delhi (IITD) graduate, applied AI engineer and software engineer at L&T Finance, building AI agents and machine learning systems.',
  intro: 'building business-oriented production-ready AI systems',
  education: {
    degree: 'B.Tech, Textile & Fibre Engineering',
    institution: 'Indian Institute of Technology Delhi',
    year: '2021-2025',
  },
  skills: ['Python', 'PyTorch', 'Transformers', 'SLM finetuning', 'LangGraph', 'Agentic AI', 'RAG', 'MCP', 'Plugins', 'Skills'],
  projects: [
    {
      title: 'doc-qa',
      category: 'Featured · Open source',
      summary: 'DSPy routes each query by intent. A filesystem agent combines BM25 and Markdown section routing to gather cited evidence; a orchestrated code agent utilizes that context to generates charts and analyse tables.',
      tools: ['BM25', 'Vectorless retrieval', 'Filesystem memory', 'Docker sandbox'],
      href: 'https://github.com/7harshitsingh/doc-qa',
    },
    {
      title: 'Handwritten equations to LaTeX',
      category: 'Machine learning',
      summary: 'CNN encoder extracts handwritten symbols; LSTM decoder generates LaTeX sequences, evaluated with BLEU.',
      tools: ['PyTorch', 'CNN', 'LSTM'],
    },
    {
      title: 'DriveSmart',
      category: 'Data science',
      summary: 'Lag and rolling-window features feed PCA and KMeans, GMM, and DBSCAN clustering to identify risky and drowsy driving patterns.',
      tools: ['Python', 'Time series', 'Clustering'],
    },
    {
      title: 'DevClub Summer of Code 2024',
      category: 'Community · DevClub IIT Delhi',
      summary: 'Five-week build program across app, backend, frontend, and ML tracks, centered on a shared point-of-sale system.',
      tools: ['Community', 'Machine learning'],
      href: 'https://github.com/devclub-iitd/summer-of-code-2024',
      stats: { stars: 37, forks: 209, asOf: 'Oct 2026' },
    },
  ],
  experience: [
    {
      role: 'AI Platforms Engineer',
      organization: 'L&T Finance',
      period: 'Jul 2025 – Present',
      bullets: [
        'Gemma 3 4B: Leading SFT, RLHF, and GRPO post-training for NBFC use cases; evaluating with DCLM benchmarks and domain metrics and optimizing vLLM/llama.cpp inference.',
        'TW Nostradamus agentic AI platform: Built LangGraph workflows over BigQuery credit-risk and collections data via MCP, surfacing default risk, delinquency trends, and branch KPIs; cut report analysis time by about 70%.',
        'SMS and WhatsApp monitoring: Automated hourly vendor checks, eliminating manual monitoring and reducing collection drops by 10%.',
        'Vendor operations: Managed 8+ vendors and ₹8L+ in monthly payouts; optimized a cost matrix that saved ₹0.53 Cr per month.',
      ],
    },
    {
      role: 'Software Development Intern',
      organization: 'LegalTrustNetwork',
      period: 'May 2024 – Jul 2024',
      bullets: [
        'Designed and built gRPC APIs with REST access through gRPC-Gateway; integrated new services and product features into a Next.js app.',
      ],
    },
    {
      role: 'Project Lead',
      organization: 'DevClub IIT Delhi',
      period: 'Aug 2023 – Apr 2024',
      summary: 'Led student engineering projects and mentored developers across IIT Delhi.',
    },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/7harshitsingh' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/7harshitsingh/' },
    { label: 'Hugging Face', href: 'https://huggingface.co/7harshitsingh' },
  ],
};
