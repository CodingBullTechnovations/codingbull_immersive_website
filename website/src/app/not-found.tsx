'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.1),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl">
        {/* Logo */}
        <div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-12 opacity-50">
          <Image
            src="/images/logo/logo.png"
            alt="CodingBull"
            fill
            className="object-contain grayscale"
          />
        </div>

        <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-teal block mb-6">
          Error 404
        </span>
        
        <h1 className="text-4xl sm:text-6xl font-black font-[family-name:var(--font-outfit)] text-white mb-8 tracking-tight">
          System Path <span className="bg-gradient-to-r from-teal to-white bg-clip-text text-transparent italic">Not Found.</span>
        </h1>

        <p className="text-white/40 text-lg sm:text-xl font-light leading-relaxed mb-12 max-w-lg mx-auto">
          The architecture you&apos;re looking for doesn&apos;t exist or has been relocated to another vertical.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            label="Return Home"
            href="/"
            variant="primary"
            icon="arrow"
            size="large"
          />
          <Button
            label="View Services"
            href="/services"
            variant="secondary"
            size="large"
          />
        </div>

        <div className="mt-24 pt-8 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium">
            CodingBull Technovations Pvt. Ltd.
          </p>
        </div>
      </div>
    </div>
  );
}
