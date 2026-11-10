// All of the site's content lives here.

export const profile = {
  name: "Sachin Singh",
  role: "Full-Stack Developer",
  location: "Dehradun, India",
  timezone: "IST (UTC+5:30)",
  email: "hi.itssachinsingh@gmail.com",
  resume: "/resume.pdf",
  github: "https://github.com/Itssachinsingh",
  linkedin: "https://www.linkedin.com/in/sachinsingh--/",
};

export const navLinks = [
  { name: "Work", href: "#work" },
  { name: "Experience", href: "#experience" },
  { name: "Stack", href: "#stack" },
  { name: "Contact", href: "#contact" },
];

type FeaturedProject = {
  id: string;
  label: string;
  title: string;
  summary: string;
  // optional: say exactly what you owned on this project, it's what recruiters look for
  role?: string;
  points: string[];
  // small print shown under the points, e.g. what an asterisk in the summary refers to
  footnote?: string;
  stack: string[];
  img: string;
  link?: string;
};

// products built at bepay money, shown as full case studies
export const professionalProjects: FeaturedProject[] = [
  {
    id: "igps",
    label: "Payments dashboard · Live",
    title: "bepay money IGPS",
    summary:
      "A cross-border payments platform. Businesses hold fiat and crypto in one balance and can send either to anyone, in any country.*",
    role: "Built the cross-border crypto and fiat payment flows and integrated the production REST APIs.",
    points: [
      "One combined balance across fiat (USD, EUR) and USDC / USDT on Ethereum, Solana and Polygon",
      "Deposit, get-paid and send flows, with saved beneficiaries for international payouts",
      "Transaction history filtered by pending, completed and failed, with a detail view for each transaction",
      "Organisation switching and team management for multi-user business accounts",
    ],
    footnote: "* A few countries aren't supported yet.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    img: "/bepay_igps.png",
    link: "https://igps.bepay.money",
  },
  {
    id: "merchant",
    label: "Merchant app · In development",
    title: "bepay business merchant app",
    summary:
      "Lets online stores and merchants accept crypto as payment, then track their sales, payouts and turnover from one dashboard.",
    role: "Built merchant onboarding and the crypto and fiat payment flows.",
    // TODO: add the stack; add a link once it launches
    points: [
      "Accept crypto from customers at checkout or through shareable payment links",
      "A merchant wallet with send, receive and swap, so earnings can be converted or paid out",
      "Payout and turnover summaries, with a monthly turnover chart by week, month, year or a custom range",
      "Payment history, a sandbox mode for testing and a preview of the upcoming loyalty programme",
    ],
    stack: [],
    img: "/merchant-app.png",
  },
  {
    id: "partner",
    label: "B2B platform · In development",
    title: "bepay money partner dashboard",
    summary:
      "A B2B platform that lets businesses launch their own branded crypto wallets on bepay's infrastructure. Partners connect through the bepay API to create wallets for their customers, then run the whole integration from one dashboard.",
    role: "Built the dashboard, including the sandbox and live modes, scoped API keys and webhooks.",
    // TODO: add the stack; add a link once it launches
    points: [
      "Sandbox and live environments, with a full-width warning whenever real funds and production keys are active",
      "API keys with scoped permissions (create, import and read wallets, read balances and history, send, swap and manage networks), issued as read-only or full access",
      "Webhooks and request logs, so partners can follow and debug every call their backend makes",
      "Wallets, transactions, custom networks and tokens, gas settings, team roles and an activity log",
    ],
    stack: [],
    img: "/bepay-partner-dashboard.png",
  },
  {
    id: "website",
    label: "Company website · Live",
    title: "bepay money website",
    summary:
      "bepay money's public website, presenting its products to people and businesses: IGPS, personal and business accounts, UPI, and the B2B infrastructure other brands use to launch their own wallets.",
    role: "Built the full-stack blog CMS that publishes to the live site.",
    // TODO: add the stack
    points: [
      "Product pages for IGPS, personal, business, UPI and B2B solutions",
      "A hero with a phone wallet and stablecoin card mockup",
      "Sales contact and live chat entry points throughout",
    ],
    stack: [],
    img: "/bepay-website.png",
    link: "https://bepay.money",
  },
];

type PersonalProject = {
  title: string;
  des: string;
  // small print under the description, e.g. availability
  note?: string;
  stack: string[];
  img: string;
  link?: string;
};

// things built on my own time, shown as a compact grid
export const personalProjects: PersonalProject[] = [
  {
    title: "Cortex",
    des: "A personal productivity app with an AI-picked task of the day, a procrastination radar that flags tasks you keep avoiding and explains why, goals, streaks and a focus score.",
    note: "I built it for my own use, so sign-ups aren't open yet. Public accounts are coming soon.",
    // TODO: add the stack
    stack: [],
    img: "/cortex.png",
    link: "https://cortex-aitool.vercel.app/dashboard",
  },
  {
    title: "Pulse",
    des: "A music streaming app for your own library: drop in audio files and their tags and cover art are read automatically, with search, favourites, recently played and a light-show mode.",
    stack: ["React"],
    img: "/pulse-music.png",
    link: "https://music-app-seven-theta.vercel.app/",
  },
  {
    title: "Clothing store",
    des: "A minimal apparel storefront with a product catalogue.",
    stack: ["Next.js", "Tailwind CSS"],
    img: "/project3.png",
    link: "https://e-commerce-cyan-nine-38.vercel.app/",
  },
];

// keep in step with public/resume.pdf
export const experience = [
  {
    company: "bepay money",
    role: "Full Stack Developer",
    period: "Feb 2026 – Present",
    current: true,
    des: "Primary frontend developer for bepay money's web products, working remotely. Built the IGPS cross-border payment flows on production REST APIs, the merchant app, the B2B partner dashboard and a blog CMS for the company website.",
    stack: ["Next.js", "Node.js", "Express", "TypeScript", "MongoDB"],
  },
  {
    company: "Giakaa Capital",
    role: "Frontend Developer",
    period: "Aug 2025 – Jan 2026",
    current: false,
    des: "Joined as an intern and went full time in November 2025. Built Next.js and React features for web products, including the Invest Payments & Banking Forum, and an astrology-consultation MVP with user and partner apps, booking, WebSocket chat and Agora voice calls.",
    stack: ["Next.js", "React", "WebSockets", "Flutter"],
  },
  {
    company: "CreatedInAm",
    role: "Frontend Developer Intern",
    period: "May 2024 – Oct 2024",
    current: false,
    des: "Built React and Next.js websites for businesses and NGOs, and a Redux e-commerce storefront.",
    stack: ["React", "Next.js", "Redux"],
  },
];

export const stackGroups = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Redux", "Framer Motion"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "REST APIs", "JWT", "WebSockets"],
  },
  {
    title: "Data",
    items: ["MongoDB", "PostgreSQL", "MySQL"],
  },
  {
    title: "Workflow",
    items: ["Git & GitHub", "Postman", "Vercel", "Render"],
  },
];

export const approach = [
  {
    step: "01",
    title: "Understand & plan",
    des: "I start with the problem, the users and the constraints, then turn them into a clear plan (data model, API contracts and UI flows) before writing code.",
  },
  {
    step: "02",
    title: "Build in small steps",
    des: "I build features end to end in small, reviewable pieces, with typed APIs, reusable components and tests, and share progress early so feedback arrives while changes are cheap.",
  },
  {
    step: "03",
    title: "Ship & improve",
    des: "I ship through CI/CD, watch real usage and errors after launch, and keep improving performance, security and the user experience.",
  },
];
