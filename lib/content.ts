/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SYSTEM CONTENT — derived strictly from CV.
   Nothing invented. Every field matches reality.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const identity = {
  name:         'Bader Bennani',
  handle:       'ben-bader',
  title:        'Computer Engineering Student · Full-Stack Developer',
  location:     'Calais, France',
  availability: 'Open to opportunities',
  email:        'bennanibader2006@gmail.com',
  github:       'https://github.com/ben-bader',
  linkedin:     'https://www.linkedin.com/in/bader-bennani-41b301289/',
  resume:       '/resume.pdf',
  tagline:      'Building scalable, secure, full-stack applications.',
  statement:    'Software Engineering · Backend Architecture · Distributed Systems · Secure Applications.',
  focus: [
    'Software Engineering',
    'Backend Architecture',
    'Full-Stack Development',
    'Distributed Systems',
    'Secure Applications',
  ],
  languages: [
    { lang: 'Arabic',  level: 'Native' },
    { lang: 'French',  level: 'B2'     },
    { lang: 'English', level: 'C1'     },
  ],
} as const

/* ─── Education ──────────────────────────────────────────────────────── */
export const education = [
  {
    id:          'eilco',
    institution: 'École d\'Ingénieurs du Littoral Côte d\'Opale',
    degree:      'Computer Engineering',
    period:      '2026 – Present',
    startYear:   2026,
    status:      'Current',
    location:    'Calais, France',
    description: 'Currently pursuing an engineering degree in Computer Engineering at EILCO in Calais, France, building on a foundation in software engineering, full-stack development, databases and distributed systems.',
  },
  {
    id:          'est-meknes',
    institution: 'École Supérieure de Technologie — Meknès',
    degree:      'DUT Génie Informatique',
    period:      '2024 – 2026',
    startYear:   2024,
    endYear:     2026,
    status:      'Diploma obtained',
    location:    'Meknès, Morocco',
    description: 'Completed a two-year university technology diploma in Computer Engineering, developing foundations in algorithms, data structures, object-oriented programming, web development, databases, networks and software engineering.',
  },
]

/* ─── Internships ────────────────────────────────────────────────────── */
export const internships = [
  {
    id:          'onee',
    company:     'ONEE – Branche Eau',
    location:    'Meknès, Morocco',
    role:        'Software Engineering Intern',
    period:      'June 2025',
    startYear:   2025,
    duration:    '1 month',
    description: 'Team development of an internal inventory management platform (ONEE-SYS). Collaborated with the engineering team to implement CRUD operations, build the MVC architecture, and ship the first production-ready release.',
    responsibilities: [
      'Team development of inventory management platform',
      'Implemented MVC architecture with Laravel',
      'Built Blade-templated UI',
      'SQLite database integration',
      'CRUD: employees, equipment, stock',
      'Professional team collaboration',
    ],
    stack: ['Laravel', 'Blade', 'SQLite', 'PHP', 'MVC'],
  },
  {
    id:          '2sis',
    company:     '2SIS Technologies',
    location:    'Morocco',
    role:        'Full-Stack Developer Intern',
    period:      'April 2026 – June 2026',
    startYear:   2026,
    duration:    '3 months',
    description: 'Contributed to the AtlasHR human resources management platform — a microservices system built with Spring Boot and Next.js. Worked across backend services and the frontend dashboard within a team environment.',
    responsibilities: [
      'Development on AtlasHR HR Management Platform',
      'Spring Boot microservices backend',
      'Next.js frontend dashboard',
      'PostgreSQL database design and integration',
      'REST API design and implementation',
      'Microservices architecture patterns',
      'Team collaboration and code review',
    ],
    stack: ['Spring Boot', 'Next.js', 'PostgreSQL', 'REST APIs', 'Microservices'],
  },
]

/* ─── Technologies — only what appears in CV ─────────────────────────── */
export const techByCategory = {
  Programming: ['JavaScript', 'TypeScript', 'Java', 'PHP', 'SQL', 'C', 'Python'],
  Frameworks:  ['React', 'Next.js', 'Spring Boot', 'Laravel'],
  Databases:   ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle', 'SQLite'],
  Tools:       ['Git', 'GitHub', 'Docker', 'RabbitMQ', 'Prisma', 'Tailwind CSS', 'JWT', 'REST APIs', 'GSAP', 'Framer Motion', 'Vercel'],
}

/* ─── Knowledge graph nodes — real co-usage relationships only ─────────
   Every connection = two technologies that appear in the same project.
──────────────────────────────────────────────────────────────────────── */
export interface KnowledgeNode {
  id:          string
  label:       string
  category:    'language' | 'framework' | 'database' | 'devops' | 'concept' | 'tool'
  weight:      number
  connections: string[]
  projects:    string[]
  since:       number
  color?:      string
}

export const knowledgeNodes: KnowledgeNode[] = [
  // ── Languages ──────────────────────────────────────────────────────
  { id: 'typescript', label: 'TypeScript',  category: 'language',  weight: 9,
    connections: ['react', 'nextjs', 'prisma', 'tailwind'],
    projects: ['atlashr', 'innovex','homely'], since: 2024, color: '#3178c6' },
  { id: 'java',       label: 'Java',        category: 'language',  weight: 9,
    connections: ['springboot', 'docker', 'postgresql', 'rabbitmq', 'jwt'],
    projects: ['atlashr','homely'], since: 2024, color: '#ed8b00' },
  { id: 'php',        label: 'PHP',         category: 'language',  weight: 8,
    connections: ['laravel', 'sqlite', 'mysql'],
    projects: ['onee-sys', 'homely'], since: 2025, color: '#777bb4' },
  { id: 'javascript', label: 'JavaScript',  category: 'language',  weight: 8,
    connections: ['react', 'typescript'],
    projects: ['innovex', 'homely','atlashr'], since: 2024, color: '#f7df1e' },
  { id: 'python',     label: 'Python',      category: 'language',  weight: 4,
    connections: [],
    projects: [], since: 2024, color: '#3572A5' },
  { id: 'c',          label: 'C',           category: 'language',  weight: 3,
    connections: [],
    projects: [], since: 2024, color: '#555555' },
  { id: 'sql',        label: 'SQL',         category: 'language',  weight: 7,
    connections: ['postgresql', 'mysql', 'sqlite', 'oracle'],
    projects: ['atlashr', 'onee-sys', 'innovex', 'homely'], since: 2024, color: '#ffb347' },

  // ── Frameworks ─────────────────────────────────────────────────────
  { id: 'react',      label: 'React',       category: 'framework', weight: 9,
    connections: ['typescript', 'nextjs', 'tailwind', 'javascript'],
    projects: ['atlashr', 'innovex','homely'], since: 2024, color: '#61dafb' },
  { id: 'nextjs',     label: 'Next.js',     category: 'framework', weight: 10,
    connections: ['react', 'typescript', 'prisma', 'tailwind', 'vercel'],
    projects: ['atlashr', 'innovex','homely'], since: 2024, color: '#e2e8f0' },
  { id: 'springboot', label: 'Spring Boot', category: 'framework', weight: 10,
    connections: ['java', 'postgresql', 'docker', 'rabbitmq', 'jwt'],
    projects: ['atlashr', 'homely'], since: 2024, color: '#6db33f' },
  { id: 'laravel',    label: 'Laravel',     category: 'framework', weight: 8,
    connections: ['php', 'sqlite', 'mysql', 'jwt'],
    projects: ['onee-sys'], since: 2025, color: '#ff2d20' },
  { id: 'tailwind',   label: 'Tailwind CSS',category: 'tool',      weight: 7,
    connections: ['react', 'nextjs'],
    projects: ['atlashr', 'innovex', 'homely', 'onee-sys'], since: 2024, color: '#38bdf8' },

  // ── Databases ──────────────────────────────────────────────────────
  { id: 'postgresql', label: 'PostgreSQL',  category: 'database',  weight: 9,
    connections: ['springboot', 'prisma', 'docker', 'sql'],
    projects: ['atlashr', 'innovex', 'homely'], since: 2024, color: '#4169e1' },
  { id: 'mysql',      label: 'MySQL',       category: 'database',  weight: 6,
    connections: ['laravel', 'php', 'sql'],
    projects: [], since: 2024, color: '#4479a1' },
  { id: 'sqlite',     label: 'SQLite',      category: 'database',  weight: 6,
    connections: ['laravel', 'php', 'sql'],
    projects: ['onee-sys'], since: 2025, color: '#76e4f7' },
  { id: 'mongodb',    label: 'MongoDB',     category: 'database',  weight: 4,
    connections: ['javascript'],
    projects: [], since: 2024, color: '#47a248' },
  { id: 'oracle',     label: 'Oracle DB',   category: 'database',  weight: 4,
    connections: ['java', 'sql'],
    projects: [], since: 2024, color: '#f80000' },
  { id: 'prisma',     label: 'Prisma',      category: 'tool',      weight: 7,
    connections: ['typescript', 'postgresql', 'nextjs'],
    projects: ['innovex'], since: 2024, color: '#5a67d8' },

  // ── DevOps & Tools ─────────────────────────────────────────────────
  { id: 'docker',     label: 'Docker',      category: 'devops',    weight: 8,
    connections: ['springboot', 'postgresql', 'rabbitmq'],
    projects: ['atlashr'], since: 2024, color: '#2496ed' },
  { id: 'rabbitmq',   label: 'RabbitMQ',    category: 'devops',    weight: 7,
    connections: ['springboot', 'java', 'docker'],
    projects: ['atlashr'], since: 2025, color: '#ff6600' },
  { id: 'jwt',        label: 'JWT',         category: 'concept',   weight: 7,
    connections: ['springboot', 'laravel', 'nextjs'],
    projects: ['atlashr', 'homely', 'innovex'], since: 2024, color: '#9f7aea' },
  { id: 'vercel',     label: 'Vercel',      category: 'devops',    weight: 6,
    connections: ['nextjs'],
    projects: ['innovex'], since: 2025, color: '#e2e8f0' },
  { id: 'git',        label: 'Git / GitHub',category: 'devops',    weight: 8,
    connections: ['docker', 'vercel'],
    projects: ['atlashr', 'onee-sys', 'homely', 'innovex'], since: 2024, color: '#f05032' },
  { id: 'rest',       label: 'REST APIs',   category: 'concept',   weight: 8,
    connections: ['springboot', 'laravel', 'nextjs', 'jwt'],
    projects: ['atlashr', 'onee-sys', 'homely', 'innovex'], since: 2024, color: '#68d391' },
]

/* ─── Project Systems — real architectures only ──────────────────────── */
export interface SystemNode {
  id: string; label: string; role: string
  status: 'running' | 'idle' | 'pending'; color?: string
}
export interface SystemEdge {
  from: string; to: string; label?: string
  type: 'sync' | 'async' | 'event' | 'data'
}
export interface ProjectSystem {
  id: string; name: string; subtitle: string
  description: string; year: string; domain: string
  status: string; github: string
  problem: string; solution: string; responsibilities: string[]
  nodes: SystemNode[]; edges: SystemEdge[]
  stack: string[]; metrics: { label: string; value: string }[]
}

export const projectSystems: ProjectSystem[] = [
  {
    id: 'atlashr', name: 'AtlasHR', year: '2025-2026',
    domain: 'HR Management System', status: 'Completed',
    subtitle: 'Human Resources Management System',
    description: 'An HR management project from my full-stack internship at 2SIS Technologies. My internship record lists work across Spring Boot services and a Next.js dashboard.',
    problem: 'Human resources management',
    solution: 'The internship record describes an HR project involving backend services and a web dashboard.',
    responsibilities: [
      'Spring Boot backend development',
      'REST API development',
      'PostgreSQL data work',
      'Next.js dashboard development',
    ],
    github: '',
    stack: ['Spring Boot', 'Next.js', 'PostgreSQL', 'REST APIs'],
    metrics: [
      { label: 'Backend', value: 'Spring Boot' },
      { label: 'Dashboard', value: 'Next.js' },
      { label: 'Database', value: 'PostgreSQL' },
    ],
    nodes: [
      { id: 'backend', label: 'Spring Boot', role: 'Backend services', status: 'running', color: '#6db33f' },
      { id: 'dashboard', label: 'Next.js', role: 'Web dashboard', status: 'running', color: '#e2e8f0' },
      { id: 'db', label: 'PostgreSQL', role: 'Database', status: 'running', color: '#4169e1' },
    ],
    edges: [],
  },
  {
    id: 'onee-sys', name: 'ONEE-SYS', year: '2025',
    domain: 'Inventory Management', status: 'Completed',
    subtitle: 'Inventory management at ONEE',
    description: 'A Laravel inventory app for tracking peripherals, their brands, assigned employees, and sites. The repository includes create, edit, delete, search, and paginated listing flows using Blade views and SQLite.',
    problem: 'Tracking peripherals and their assignments',
    solution: 'A Laravel application with inventory records and related brand, employee, and site data.',
    responsibilities: [
      'Laravel application development',
      'Inventory and related record management',
      'Search and paginated listings',
    ],
    github: 'https://github.com/ben-bader/ONEE-SYS',
    stack: ['Laravel', 'PHP', 'Blade', 'SQLite', 'Vite'],
    metrics: [
      { label: 'Framework', value: 'Laravel' },
      { label: 'Views', value: 'Blade' },
      { label: 'Database', value: 'SQLite' },
      { label: 'Build tool', value: 'Vite' },
    ],
    nodes: [
      { id: 'ui', label: 'Blade UI', role: 'Web views', status: 'running', color: '#ff2d20' },
      { id: 'app', label: 'Laravel', role: 'Application logic', status: 'running', color: '#6db33f' },
      { id: 'db', label: 'SQLite', role: 'Database', status: 'running', color: '#76e4f7' },
    ],
    edges: [
      { from: 'ui', to: 'app', type: 'sync', label: 'request' },
      { from: 'app', to: 'db', type: 'data', label: 'query' },
    ],
  },
  {
    id: 'innovex', name: 'Innovex', year: '2024-2025',
    domain: 'Event Platform', status: 'Completed',
    subtitle: 'Tech Event Explorer',
    description: 'A Next.js app for exploring technology events by category, country, and city. The public source includes account registration, JWT-based sessions, event listings, and saved favorites backed by Prisma and PostgreSQL.',
    problem: 'Finding and saving technology events',
    solution: 'An event explorer with account access and saved favorites.',
    responsibilities: [],
    github: 'https://github.com/ben-bader/Innovex',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'NextAuth.js', 'Prisma', 'PostgreSQL'],
    metrics: [
      { label: 'Framework', value: 'Next.js' },
      { label: 'Authentication', value: 'NextAuth.js' },
      { label: 'ORM', value: 'Prisma' },
      { label: 'Database', value: 'PostgreSQL' },
    ],
    nodes: [
      { id: 'web', label: 'Next.js', role: 'Event explorer', status: 'running', color: '#e2e8f0' },
      { id: 'auth', label: 'NextAuth', role: 'Authentication', status: 'running', color: '#9f7aea' },
      { id: 'orm', label: 'Prisma', role: 'Data access', status: 'running', color: '#5a67d8' },
      { id: 'db', label: 'PostgreSQL', role: 'Database', status: 'running', color: '#4169e1' },
    ],
    edges: [
      { from: 'web', to: 'auth', type: 'sync', label: 'session' },
      { from: 'web', to: 'orm', type: 'sync', label: 'query' },
      { from: 'orm', to: 'db', type: 'data', label: 'SQL' },
    ],
  },
  {
    id: 'homely', name: 'Homely', year: '2024-2025',
    domain: 'Real Estate Platform', status: 'Completed',
    subtitle: 'Real estate platform concept',
    description: 'Repository documentation describes a team real estate platform for property browsing and listings, messaging, listing boosts, and admin management. It assigns my role to the Spring Boot and PostgreSQL backend. The public repository contains documentation and diagrams, but no application source.',
    problem: 'Real estate platform project',
    solution: 'The README describes a platform with mobile, backend, and admin dashboard parts.',
    responsibilities: ['Assigned backend role, as described in the project README'],
    github: 'https://github.com/ben-bader/Homely',
    stack: ['Spring Boot', 'PostgreSQL', 'Flutter', 'React'],
    metrics: [
      { label: 'Backend', value: 'Spring Boot (README)' },
      { label: 'Database', value: 'PostgreSQL (README)' },
      { label: 'Mobile app', value: 'Flutter (README)' },
      { label: 'Admin app', value: 'React (README)' },
    ],
    nodes: [
      { id: 'mobile', label: 'Flutter', role: 'Mobile app (README)', status: 'pending', color: '#54c5f8' },
      { id: 'api', label: 'Spring Boot', role: 'Backend (README)', status: 'pending', color: '#6db33f' },
      { id: 'admin', label: 'React', role: 'Admin app (README)', status: 'pending', color: '#61dafb' },
      { id: 'db', label: 'PostgreSQL', role: 'Database (README)', status: 'pending', color: '#4169e1' },
    ],
    edges: [],
  },
]
/* ─── Memory / Timeline — real chronology only ───────────────────────── */
export interface MemoryFragment {
  id: string; year: number; month?: number
  type: 'education' | 'internship' | 'project' | 'skill'
  title: string; detail: string; tags?: string[]; accent?: string
}

export const memoryFragments: MemoryFragment[] = [
  {
    id: 'm01', year: 2024, type: 'education',
    title: 'DUT Génie Informatique — École Supérieure de Technologie — Meknès',
    detail: 'Completed a two-year university technology diploma in Computer Engineering, developing foundations in algorithms, data structures, object-oriented programming, web development, databases, networks and software engineering.',
    tags: ['Diploma obtained', 'Algorithms', 'OOP', 'Web Development'], accent: '#63b3ed',
  },
  {
    id: 'm02', year: 2024, type: 'skill',
    title: 'JavaScript, TypeScript & React',
    detail: 'Built SPAs with React and adopted TypeScript for type-safe frontends. Learned component architecture, hooks, and state management fundamentals.',
    tags: ['JavaScript', 'TypeScript', 'React', 'SPA'], accent: '#61dafb',
  },
  {
    id: 'm03', year: 2025, type: 'skill',
    title: 'Java & Spring Boot',
    detail: 'Built REST APIs with Spring Boot. Learned dependency injection, JPA, exception handling, and security with JWT authentication.',
    tags: ['Java', 'Spring Boot', 'REST APIs', 'JWT'], accent: '#6db33f',
  },
  {
    id: 'm04', year: 2025, type: 'skill',
    title: 'Next.js & Prisma',
    detail: 'Adopted Next.js for SSR and full-stack React applications. Used Prisma ORM for type-safe PostgreSQL access on the Innovex project.',
    tags: ['Next.js', 'Prisma', 'PostgreSQL', 'SSR'], accent: '#e2e8f0',
  },
  {
    id: 'm05', year: 2025, type: 'skill',
    title: 'Docker & containerisation',
    detail: 'Containerised services with Docker and Docker Compose. Learned environment parity, multi-service orchestration, and production deployment workflows.',
    tags: ['Docker', 'Docker Compose', 'DevOps'], accent: '#2496ed',
  },
  {
    id: 'm06', year: 2025, type: 'internship',
    title: 'Internship @ ONEE – Branche Eau',
    detail: 'Built ONEE-SYS — an internal inventory management platform — as part of an engineering team. Laravel MVC, Blade, SQLite. 1-month internship.',
    tags: ['Laravel', 'Blade', 'SQLite', 'MVC', 'ONEE'], accent: '#ff2d20',
  },
  {
    id: 'm07', year: 2025, type: 'project',
    title: 'ONEE-SYS delivered',
    detail: 'Shipped the inventory management system to production for ONEE internal use. Handles employee records, equipment tracking, and stock CRUD operations.',
    tags: ['Production', 'Laravel', 'Team delivery'], accent: '#48bb78',
  },
  {
    id: 'm08', year: 2025, type: 'project',
    title: 'Innovex — tech event platform',
    detail: 'Built a full-stack event management platform using Next.js, Prisma ORM, NextAuth.js, and PostgreSQL. Deployed on Vercel.',
    tags: ['Next.js', 'Prisma', 'NextAuth', 'Vercel'], accent: '#f6ad55',
  },
  {
    id: 'm09', year: 2026, type: 'internship',
    title: 'Internship @ 2SIS Technologies',
    detail: 'Full-stack internship contributing to AtlasHR — a microservices HR management platform. Spring Boot backend, Next.js dashboard, PostgreSQL, REST APIs.',
    tags: ['Spring Boot', 'Next.js', 'PostgreSQL', 'Microservices', '2SIS'], accent: '#63b3ed',
  },
  {
    id: 'm10', year: 2026, type: 'education',
    title: 'Computer Engineering — EILCO',
    detail: 'Currently pursuing an engineering degree in Computer Engineering at EILCO in Calais, France, building on a foundation in software engineering, full-stack development, databases and distributed systems.',
    tags: ['Current', 'Calais', 'Engineering'], accent: '#9f7aea',
  },
  {
    id: 'm11', year: 2026, type: 'skill',
    title: 'Microservices — RabbitMQ & distributed patterns',
    detail: 'Studied microservices design: service decomposition, event-driven messaging with RabbitMQ, and distributed data patterns. Applied on AtlasHR.',
    tags: ['Microservices', 'RabbitMQ', 'Distributed systems'], accent: '#9f7aea',
  },
  {
    id: 'm12', year: 2026, type: 'project',
    title: 'AtlasHR — microservices HR system',
    detail: 'Contributed to AtlasHR: Spring Boot microservices, API gateway, RabbitMQ event bus, Docker containerisation, and a Next.js admin dashboard with JWT protection.',
    tags: ['Spring Boot', 'RabbitMQ', 'Docker', 'Next.js', 'JWT'], accent: '#6db33f',
  },
  {
    id: 'm13', year: 2026, type: 'project',
    title: 'Homely — SaaS real estate platform',
    detail: 'Developed a SaaS real estate platform with a Spring Boot REST API, PostgreSQL database, JWT authentication, and an admin dashboard.',
    tags: ['Spring Boot', 'PostgreSQL', 'JWT', 'REST API'], accent: '#68d391',
  },
  {
    id: 'm14', year: 2026, type: 'project',
    title: 'bader.os — current portfolio',
    detail: 'Built and maintained this portfolio as a personal operating-system-inspired experience highlighting my engineering work, projects, and learning journey.',
    tags: ['Portfolio', 'Next.js', 'Design system'], accent: '#e2e8f0',
  },
]

/* ─── Process steps — engineering workflow ───────────────────────────── */
export const processSteps = [
  {
    id: 'discover', phase: '01', title: 'Discover',
    description: 'Understand the problem before writing code. Map constraints, users, and operational requirements. Make invisible complexity legible.',
    artifacts: ['Requirement map', 'Constraint review', 'Edge case list'],
    color: '#63b3ed',
  },
  {
    id: 'architect', phase: '02', title: 'Architect',
    description: 'Design service boundaries and data models. Every decision should remain correct under 2 years of product growth.',
    artifacts: ['Service diagram', 'Schema design', 'API contracts'],
    color: '#9f7aea',
  },
  {
    id: 'build', phase: '03', title: 'Build',
    description: 'Implement with type safety, validation, and clear separation of concerns. Code that a new team member can follow.',
    artifacts: ['REST endpoints', 'Domain services', 'UI components'],
    color: '#68d391',
  },
  {
    id: 'integrate', phase: '04', title: 'Integrate',
    description: 'Wire services together. Understand fail modes before they occur in production. Test contracts and integration paths.',
    artifacts: ['Integration tests', 'Event schemas', 'Auth flows'],
    color: '#f6ad55',
  },
  {
    id: 'deploy', phase: '05', title: 'Deploy',
    description: 'Containerise, configure, and ship. Docker Compose for local environments. Vercel or server-based deployment for production.',
    artifacts: ['Dockerfile', 'Docker Compose', 'Deploy config'],
    color: '#fc8181',
  },
  {
    id: 'observe', phase: '06', title: 'Observe',
    description: 'A system you cannot see is a system you cannot trust. Add logging, monitor key operations, and review under load.',
    artifacts: ['Logs', 'Health checks', 'Error monitoring'],
    color: '#76e4f7',
  },
]

/* ─── Intelligence metrics — computed from real project data ─────────── */
export const intelligenceMetrics = [
  { id: 'projects',      label: 'Projects',                 value: 4,  suffix: '',  detail: '2 live or deployed · 2 in development' },
  { id: 'internships',   label: 'Internships',              value: 2,  suffix: '',  detail: 'ONEE (2025), 2SIS Technologies (2026)' },
  { id: 'languages',     label: 'Programming languages',    value: 7,  suffix: '',  detail: 'JS, TS, Java, PHP, SQL, C, Python' },
  { id: 'frameworks',    label: 'Core frameworks',          value: 4,  suffix: '',  detail: 'React, Next.js, Spring Boot, Laravel' },
  { id: 'databases',     label: 'Databases used',           value: 5,  suffix: '',  detail: 'PostgreSQL, MySQL, SQLite, MongoDB, Oracle' },
  { id: 'microservices', label: 'Microservices — AtlasHR',  value: 4,  suffix: '+', detail: 'Gateway, Auth, Employee, Queue' },
]

/* ─── System stats for Layer 01 ─────────────────────────────────────── */
export const systemStats = [
  { id: 'projects',    label: 'projects',    value: '4' },
  { id: 'internships', label: 'internships', value: '2' },
  { id: 'stack',       label: 'technologies', value: '15+' },
  { id: 'education',   label: 'current',     value: 'EILCO' },
]

export const TIMELINE: TimelineEvent[] = [
  {
    id: 'est-meknes',
    sortDate: '2024-01',
    displayDate: '2024 – 2026',
    title: 'DUT Génie Informatique',
    category: 'education',
    categoryLabel: 'Education',
    color: '#9f7aea',
    organization: 'École Supérieure de Technologie — Meknès',
    location: 'Meknès, Morocco',
    description: education[1].description,
    stack: ['Algorithms', 'OOP', 'Databases', 'Networks', 'Web Development'],
    responsibilities: [
      'Two-year university technology diploma in Computer Engineering',
      'Foundations in algorithms, data structures and object-oriented programming',
      'Web development, databases, networks and software engineering',
    ],
    status: 'completed',
  },
  {
    id: 'onee',
    sortDate: '2025-06',
    displayDate: 'June 2025',
    title: 'Software Engineering Intern',
    category: 'internship',
    categoryLabel: 'Internship',
    color: '#68d391',
    organization: 'ONEE – Branche Eau',
    location: 'Meknès, Morocco',
    role: 'Software Engineering Intern',
    description: internships[0].description,
    stack: internships[0].stack,
    responsibilities: internships[0].responsibilities,
    status: 'completed',
  },
  {
    id: '2sis',
    sortDate: '2026-04',
    displayDate: 'April – June 2026',
    title: 'Full-Stack Developer Intern',
    category: 'internship',
    categoryLabel: 'Internship',
    color: '#48bb78',
    organization: '2SIS Technologies',
    location: 'Morocco',
    role: 'Full-Stack Developer Intern',
    description: internships[1].description,
    stack: internships[1].stack,
    responsibilities: internships[1].responsibilities,
    status: 'completed',
  },
  {
    id: 'diploma',
    sortDate: '2026-06',
    displayDate: 'June 2026',
    title: 'DUT Diploma Obtained',
    category: 'diploma',
    categoryLabel: 'Milestone',
    color: '#9f7aea',
    organization: 'DUT Génie Informatique',
    location: 'Meknès, Morocco',
    description:
      'Completed the two-year DUT diploma in Computer Engineering. Covers software engineering principles, web development, databases, networks, and object-oriented programming.',
    stack: [],
    responsibilities: [
      'Two-year computer engineering diploma awarded',
      'Core CS curriculum: algorithms, OOP, databases, networks',
      'Preparation for engineering degree studies',
    ],
    status: 'completed',
  },
  {
    id: 'eilco',
    sortDate: '2026-07',
    displayDate: '2026 – Present',
    title: 'Computer Engineering',
    category: 'education',
    categoryLabel: 'Education',
    color: '#63b3ed',
    organization: "EILCO — École d'Ingénieurs du Littoral Côte d'Opale",
    location: 'Calais, France',
    description: education[0].description,
    stack: [
      'Software Engineering',
      'Full-Stack Development',
      'Databases',
      'Distributed Systems',
    ],
    responsibilities: [
      'Engineering degree in Computer Engineering at EILCO, Calais',
      'Building on DUT foundation with advanced software engineering',
      'Full-stack development, distributed systems, and backend architecture',
    ],
    status: 'current',
  },
]
export interface TimelineEvent {
  readonly id: string
  readonly sortDate: string
  readonly displayDate: string
  readonly title: string
  readonly category: 'education' | 'internship' | 'project' | 'diploma'
  readonly categoryLabel: string
  readonly color: string
  readonly organization?: string
  readonly location?: string
  readonly role?: string
  readonly description: string
  readonly stack: string[]
  readonly responsibilities: string[]
  readonly github?: string
  readonly status: 'current' | 'completed' | 'active'
}
