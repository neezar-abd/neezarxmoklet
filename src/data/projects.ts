export interface Project {
  slug: string;
  title: string;
  desc: string;
  year: number;
  stack: string[];
  links: {
    demo?: string;
    repo?: string;
  };
  featured?: boolean;
  shots?: string[];
}

export const projects: Project[] = [
  {
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    desc: 'Platform e-commerce modern dengan Next.js, TypeScript, dan Stripe integration untuk pembayaran yang aman dan scalable.',
    year: 2024,
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Prisma', 'PostgreSQL'],
    links: {
      demo: 'https://ecommerce-demo.vercel.app',
      repo: 'https://github.com/neezarxmoklet/ecommerce'
    },
    featured: true,
    shots: ['/images/projects/ecommerce-1.jpg', '/images/projects/ecommerce-2.jpg']
  },
  {
    slug: 'task-management-app',
    title: 'Task Management App',
    desc: 'Aplikasi manajemen tugas dengan real-time collaboration menggunakan Socket.io dan drag & drop interface yang intuitif.',
    year: 2024,
    stack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express', 'Tailwind CSS'],
    links: {
      demo: 'https://task-manager-demo.vercel.app',
      repo: 'https://github.com/neezarxmoklet/task-manager'
    },
    featured: true,
    shots: ['/images/projects/task-1.jpg', '/images/projects/task-2.jpg']
  },
  {
    slug: 'weather-dashboard',
    title: 'Weather Dashboard',
    desc: 'Dashboard cuaca interaktif dengan visualisasi data menggunakan Chart.js dan integrasi OpenWeather API untuk prediksi akurat.',
    year: 2023,
    stack: ['Vue.js', 'Chart.js', 'OpenWeather API', 'Vuetify', 'Axios'],
    links: {
      demo: 'https://weather-demo.vercel.app',
      repo: 'https://github.com/neezarxmoklet/weather-dashboard'
    },
    featured: false,
    shots: ['/images/projects/weather-1.jpg']
  },
  {
    slug: 'blog-cms',
    title: 'Blog CMS',
    desc: 'Content Management System untuk blog dengan editor WYSIWYG, SEO optimization, dan multi-user support.',
    year: 2023,
    stack: ['Next.js', 'Sanity', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    links: {
      demo: 'https://blog-cms-demo.vercel.app',
      repo: 'https://github.com/neezarxmoklet/blog-cms'
    },
    featured: true,
    shots: ['/images/projects/blog-1.jpg', '/images/projects/blog-2.jpg']
  },
  {
    slug: 'portfolio-v2',
    title: 'Portfolio Website v2',
    desc: 'Portfolio website dengan animasi advanced menggunakan Framer Motion dan glassmorphism design yang modern.',
    year: 2024,
    stack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'shadcn/ui'],
    links: {
      demo: 'https://portfolio-v2.vercel.app',
      repo: 'https://github.com/neezarxmoklet/portfolio-v2'
    },
    featured: false,
    shots: ['/images/projects/portfolio-1.jpg']
  },
  {
    slug: 'open-source-ui',
    title: 'Open Source UI Library',
    desc: 'Library komponen UI yang dapat digunakan kembali dengan dokumentasi lengkap dan storybook integration.',
    year: 2023,
    stack: ['React', 'TypeScript', 'Storybook', 'Rollup', 'Jest'],
    links: {
      repo: 'https://github.com/neezarxmoklet/ui-library'
    },
    featured: false,
    shots: ['/images/projects/ui-lib-1.jpg']
  }
];
