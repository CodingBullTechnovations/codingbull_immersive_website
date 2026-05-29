'use client';

import { useEffect, useState } from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[120] pointer-events-none">
      {/* Horizontal Line - Visible everywhere */}
      <div className="w-full h-[3px] bg-white/[0.04] relative">
        <div 
          className="h-full bg-teal transition-all duration-75 shadow-[0_0_8px_rgba(45,212,191,0.5)]" 
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Floating Pill - Visible only on Mobile/Tablet */}
      <div className="fixed top-20 right-4 bg-black/85 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-[9px] font-mono text-teal font-bold shadow-xl lg:hidden">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
