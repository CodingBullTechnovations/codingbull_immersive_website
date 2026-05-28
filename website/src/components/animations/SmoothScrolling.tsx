'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'
import { useDevicePerformanceProfile } from '@/hooks/useDevicePerformanceProfile'

export default function SmoothScrolling({
  children,
}: {
  children: ReactNode
}) {
  const performanceProfile = useDevicePerformanceProfile()

  useEffect(() => {
    if (performanceProfile !== 'desktop') return
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    // Force GSAP to use Lenis's ticker if GSAP is loaded
    // We will handle GSAP scrollTrigger refresh there if needed.
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [performanceProfile])

  return <>{children}</>
}
