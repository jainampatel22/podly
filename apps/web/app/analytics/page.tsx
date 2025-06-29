'use client'
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const GA_MEASUREMENT_ID = 'G-SVZJMN8VLY' 

export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname])

  return null
}
