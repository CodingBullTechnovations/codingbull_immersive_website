'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDevicePerformanceProfile } from '@/hooks/useDevicePerformanceProfile'

gsap.registerPlugin(ScrollTrigger);

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

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update)

    // Bind Lenis updates to GSAP ticker to share the same requestAnimationFrame loop
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000) // GSAP ticker provides time in seconds, Lenis expects milliseconds
    }
    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    // Force ScrollTrigger refresh to recalculate start/end trigger coordinates accurately
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(updateTicker)
      clearTimeout(timer)
    }
  }, [performanceProfile])

  return <>{children}</>
}
