'use client';

import { motion } from 'framer-motion';

const techStack = [
  {
    name: 'React.js',
    icon: (
      <svg viewBox="0 0 24 24" fill="#61DAFB" className="w-8 h-8">
        <path d="M11.954 18.064c-3.79-.19-7.23-1.616-9.67-3.903-1.28-1.2-2.09-2.61-2.28-4.161-.19-1.55.23-3.13 1.15-4.52 2.37-3.56 7-5.59 11.83-5.22 3.79.19 7.23 1.616 9.67 3.903 1.28 1.2 2.09 2.61 2.28 4.161.19 1.55-.23 3.13-1.15 4.52-1.92 2.89-5.36 4.7-9.06 5.12-.59.07-1.18.1-1.77.1zm-8.25-8.29c1.92 1.79 4.7 2.91 7.78 3.06 4.29.21 8.57-1.42 10.42-4.22.61-.92.89-1.96.77-3.01-.13-1.04-.67-2.01-1.52-2.8-1.92-1.79-4.7-2.91-7.78-3.06-4.29-.21-8.57 1.42-10.42 4.22-.61.92-.89 1.96-.77 3.01.13 1.05.67 2.02 1.52 2.8z"/>
        <path d="M11.95 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
      </svg>
    ),
  },
  {
    name: 'Next.js',
    icon: (
      <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-8 h-8">
        <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-22C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm6.208 15.3l-8.083-11.2h2.203l6.974 9.682-1.094 1.518zM9.014 6.703v10.595H7.491V6.703h1.523z"/>
      </svg>
    ),
  },
  {
    name: 'Node.js',
    icon: (
      <svg viewBox="0 0 24 24" fill="#339933" className="w-8 h-8">
        <path d="M11.896 0L.8 6v12.021l11.08 6 11.11-6.02L23.003 6l-11.1-6v-0zm7.14 16.48l-7.05 3.96-7.14-3.95V8.53l7.14-4.04 7.05 4.04v7.95zm-9.08-1.5v-3.32h5.5v1.2H11.5v2.22l-1.55-.1z"/>
      </svg>
    ),
  },
  {
    name: 'Python',
    icon: (
      <svg viewBox="0 0 24 24" fill="#3776AB" className="w-8 h-8">
        <path d="M12.04 0c-3.1 0-3.8.5-3.8.5l-.01 2.3h3.83v1.16H8.2c-2.32 0-3.35.8-3.7 2.4-.38 1.63-.38 2.61 0 4.26.31 1.45 1.05 2.14 3.7 2.14h1.16v-2.3c0-1.78 1.48-3.26 3.26-3.26h3.48c.63 0 1.16-.5 1.16-1.11V2.32S17 0 12.04 0zm-1.8 1.62c.32 0 .58.26.58.58 0 .32-.26.58-.58.58a.58.58 0 010-1.16zm5.8 4.79v2.32c0 1.78-1.48 3.26-3.26 3.26H9.3c-.63 0-1.16.5-1.16 1.1v3.83S8.14 24 11.24 24c3.1 0 3.8-.5 3.8-.5l.01-2.3h-3.83V20h3.86c2.32 0 3.35-.8 3.7-2.4.38-1.63.38-2.61 0-4.26-.31-1.45-1.05-2.14-3.7-2.14zM14 21.8c.32 0 .58.26.58.58 0 .32-.26.58-.58.58a.58.58 0 010-1.16z"/>
      </svg>
    ),
  },
  {
    name: 'AWS',
    icon: (
      <svg viewBox="0 0 24 24" fill="#FF9900" className="w-8 h-8">
        <path d="M8.07 19.46c2.51.98 5.76.84 8.24-.22-2.31 1.6-6.68 2.37-9.56-.37.38.3.87.56 1.32.59zM15.42 5.08c-.77-.42-1.73-.66-2.58-.66-2.92 0-4.7 1.83-4.7 4.29 0 2.21 1.61 3.26 3.4 3.26 1.76 0 2.63-1.02 3.12-1.6l-1.3-1.03c-.42.49-1 .82-1.73.82-1.1 0-1.7-.84-1.75-1.92h5.12v-.42c0-1.14-.38-2.22-1.25-2.74zm-3.69 1.11c.62 0 1.32.33 1.38 1.37h-2.82c.11-1.05.82-1.37 1.44-1.37zM20 7.85v3.88h-1.57v-3.6c0-1.51-.83-2.17-2.02-2.17-.67 0-1.32.26-1.79.79l.58 3.52 1.39-4.83h1.74l-2.06 6.55H14.7l-1.61-5.11-1.61 5.1h-1.64l2.06-6.54h1.76l-1.42 4.88-.61-3.66c-.46-.53-1.13-.8-1.81-.8-1.19 0-2.02.66-2.02 2.17v3.62H6.26v-3.9h1.56v3.6c0 .76.4 1.15 1 1.15.54 0 1.05-.28 1.33-.7l-.54-3.5 0 0v-4.9h1.57zm1.14 9.17c-1.87 1.25-5.26 1.94-8.8 1.94-3.6 0-7.05-.72-8.91-2.01l1.41-1.53c1.72 1.21 4.71 1.83 7.5 1.83 2.76 0 5.76-.64 7.42-1.8l1.38 1.57z"/>
      </svg>
    ),
  },
  {
    name: 'PostgreSQL',
    icon: (
      <svg viewBox="0 0 24 24" fill="#4169E1" className="w-8 h-8">
        <path d="M12.02 0C5.38 0 0 5.38 0 12s5.38 12 12.02 12c6.62 0 11.98-5.38 11.98-12S18.64 0 12.02 0zm0 18.06A6.06 6.06 0 1118.06 12a6.06 6.06 0 01-6.04 6.06h0c-.09 0-.17 0-.25 0z"/>
      </svg>
    ),
  },
];

export function TechStackMarquee() {
  return (
    <div className="relative w-full py-16 lg:py-24 bg-black overflow-hidden border-y border-white/[0.04]">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-teal/[0.03] rounded-[100%] blur-[100px] pointer-events-none" />

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-48 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-48 bg-gradient-to-l from-black to-transparent z-10" />

      <div className="text-center mb-10">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          Powered By Enterprise-Grade Technology
        </span>
      </div>

      <div className="flex z-0 relative">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 25, 
          }}
          className="flex gap-16 lg:gap-24 items-center whitespace-nowrap w-max pr-16 lg:pr-24"
        >
          {/* Double map for seamless infinite scrolling */}
          {[...techStack, ...techStack].map((tech, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 group cursor-default transition-all duration-300 hover:scale-105"
            >
              {/* Text Default, stays white */}
              <span className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-outfit)] text-white/80 group-hover:text-white transition-colors duration-300">
                {tech.name}
              </span>
              
              {/* Icon fades in via transform scale/opacity without triggering flex layout recalculations */}
              <div className="w-8 h-8 ml-2 flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform">
                {tech.icon}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
