import { url } from "inspector";

export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: "I prioritize client collaboration, fostering open communication ",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "Currently building different but interesting projects",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projectCategories = [
  { id: "web-app", title: "Professional Web Apps" },
];

export const projects = [
  {
    id: 8,
    category: "web-app",
    title: "bepay money IGPS Dashboard",
    des: "Business payments dashboard for fiat and stablecoin balances, deposits, payouts, beneficiaries and transaction tracking.",
    img: "/bepay_igps.png",
    iconLists: ["/next.svg", "/tail.svg", "/fm.svg"],
    link: "https://igps.bepay.money",
  },
  {
    id: 3,
    category: "web-app",
    title: "A clothing E-commerce site",
    des: "A seemless and minimalist apparel website, selling wide range of cloths to different customers.",
    img: "/project3.png",
    iconLists: ["/next.svg", "/tail.svg"],
    link: "https://e-commerce-cyan-nine-38.vercel.app/",
  },
  {
    id: 4,
    category: "web-app",
    title: "Animated Weather app for fun",
    des: "It is just a weather app bg changing with weathers and a little animation for better UI.",
    img: "/project4.png",
    iconLists: ["/re.svg"],
    link: "https://weatherapp-bysachinsingh.netlify.app",
  },
  {
    id: 6,
    category: "web-app",
    title: "Music Streaming App",
    des: "A Spotify-style music player built with React — upload songs with track and artist names, search them and listen right in the browser.",
    img: "/music_app.png",
    iconLists: ["/re.svg"],
    link: "https://music-app-seven-theta.vercel.app/",
  },
];

export const workExperience = [
  {
    id: 3,
    title: "Full Stack Developer",
    desc: "Currently working as a Full Stack Developer at bepay money, building fintech payment dashboards and APIs with Next.js, Node.js (Express), TypeScript and MongoDB.",
    className: "md:col-span-2",
    thumbnail: "/exp3.svg",
  },
  {
    id: 2,
    title: "Frontend Developer",
    desc: "Worked for 6 months as a Frontend Developer at Giakaa, building the Giakaa Innovate website with Next.js, Tailwind CSS and Framer Motion.",
    className: "md:col-span-2",
    thumbnail: "/exp2.svg",
  },
  {
    id: 1,
    title: "Frontend Engineer Intern",
    desc: "Worked for 6 months as an Intern at CreatedInAm a web-based services provider, using React.js and Next.js, enhancing interactivity and clean UI.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  // {
  //   id: 2,
  //   title: "Mobile App Dev - JSM Tech",
  //   desc: "Designed and developed mobile app for both iOS & Android platforms using React Native.",
  //   className: "md:col-span-2", // change to md:col-span-2
  //   thumbnail: "/exp2.svg",
  // },
  // {
  //   id: 3,
  //   title: "Freelance App Dev Project",
  //   desc: "Led the dev of a mobile app for a client, from initial concept to deployment on app stores.",
  //   className: "md:col-span-2", // change to md:col-span-2
  //   thumbnail: "/exp3.svg",
  // },
  // {
  //   id: 4,
  //   title: "Lead Frontend Developer",
  //   desc: "Developed and maintained user-facing features using modern frontend technologies.",
  //   className: "md:col-span-2",
  //   thumbnail: "/exp4.svg",
  // },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    url: 'https://github.com/Itssachinsingh'
  },
  {
    id: 3,
    img: "/link.svg",
    url: 'https://www.linkedin.com/in/sachinsingh--/'
  },
];
