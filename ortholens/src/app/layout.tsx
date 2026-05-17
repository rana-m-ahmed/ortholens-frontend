import type { ReactNode } from 'react'
import { DM_Sans, IBM_Plex_Mono, Space_Grotesk } from 'next/font/google'

import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata = {
  title: 'OrthoLens · AI Fracture Detection',
  description: 'Diagnostic AI for bone fracture analysis from X-ray imaging',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${ibmPlexMono.variable} font-sans antialiased bg-bg-base text-text-primary min-h-screen`}
      >
        {children}
      </body>
    </html>
  )
}
