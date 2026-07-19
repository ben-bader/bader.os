export const profile = {
  name: 'Bader Bennani',
  location: 'Meknès, Morocco',
  eyebrow: 'Full-stack engineer · Meknès, Morocco',
  headline: 'I architect secure, scalable web systems — and make them feel as good as they perform.',
  availability: 'Open to opportunities',
  email: 'bennanibader2006@gmail.com',
  phone: '+212 626 217 620',
  cv: '/resume.pdf',
  bio: [
    'I am a technician specializing in software engineering and computer security, with a practical focus on building dependable digital products.',
    'My work centers on React, Next.js, Laravel, and Spring Boot, bringing together thoughtful interfaces, sound architecture, and secure application flows.',
    'I am currently completing a DUT in Génie Informatique at École Supérieure de Technologie, Meknès (2024–2026).',
  ],
  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'French', level: 'B2' },
    { name: 'English', level: 'C1' },
  ],
} as const

export const projects = [
  { slug: 'atlashr', title: 'AtlasHR', role: 'HR Management System', description: 'Architected a robust REST API with stateless JWT authentication, modeled a complex relational schema in PostgreSQL, and built an admin dashboard with role-based access control.', tags: ['Next.js', 'PostgreSQL', 'JWT', 'REST API'], motif: 'hierarchy' },
  { slug: 'homely', title: 'Homely', role: 'Real Estate SaaS Platform', description: 'Architected a REST API with stateless JWT authentication, modeled a complex relational data structure in PostgreSQL, and built an admin dashboard with role management.', tags: ['Next.js', 'PostgreSQL', 'JWT', 'SaaS'], motif: 'building' },
  { slug: 'onee-sys', title: 'ONEE-SYS', role: 'Inventory Management System', description: 'Built a Laravel application in MVC architecture with full CRUD operations and validation for managing equipment and employee records.', tags: ['Laravel', 'MVC', 'SQLite'], motif: 'inventory' },
  { slug: 'innovex-tech-event-explorer', title: 'Innovex Tech Event Explorer', role: 'Full-stack event platform', description: 'Built a high-performance full-stack app using Next.js Server-Side Rendering and Prisma ORM, with NextAuth JWT authentication, deployed to production on Vercel.', tags: ['Next.js', 'Prisma', 'NextAuth', 'Vercel'], motif: 'burst' },
] as const

export const experience = [
  { organisation: '2SIS', title: 'Full-Stack Developer Intern', period: 'April–May 2026', description: 'Designed and built an HR platform in microservices architecture with Spring Boot, Next.js, and PostgreSQL as part of a team, strengthening full-stack development, software design, and team collaboration.' },
  { organisation: 'ONEE (Water Branch)', title: 'Software Developer Intern', period: 'June 2025', description: 'Designed and built a web-based inventory management platform with Laravel, Blade, and SQLite in MVC architecture as part of a team, reinforcing autonomy and rigor in a professional environment.' },
  { organisation: 'École Supérieure de Technologie, Meknès', title: 'DUT Génie Informatique', period: '2024–2026', description: 'Computer Engineering technical diploma.' },
] as const

export const skills = [
  { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Java', 'PHP', 'SQL', 'C', 'Python'] },
  { category: 'Frameworks', items: ['React.js', 'Next.js', 'Spring Boot', 'Laravel'] },
  { category: 'Tools & Infra', items: ['Git', 'GitHub', 'Docker', 'RabbitMQ', 'Prisma ORM', 'JWT', 'REST APIs', 'Tailwind CSS', 'Vercel', 'GSAP', 'Framer Motion'] },
  { category: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle'] },
] as const

export const socials = {
  github: { label: 'GitHub', url: 'https://github.com/ben-bader' },
  linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/bader-bennani' },
} as const
