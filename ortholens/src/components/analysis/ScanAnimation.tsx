'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SCAN_STATUS_MESSAGES } from '@/lib/constants'

type Props = {
  imageUrl: string
  isVisible: boolean
}

const bracketBaseStyle: React.CSSProperties = {
  position: 'absolute',
  width: 24,
  height: 24,
}

export default function ScanAnimation({ imageUrl, isVisible }: Props) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const intervalId = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % SCAN_STATUS_MESSAGES.length)
    }, 1300)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isVisible])

  const currentMessage = useMemo(() => SCAN_STATUS_MESSAGES[messageIndex], [messageIndex])

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="scan-overlay"
          role="status"
          aria-label="Analysing X-ray image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            overflow: 'hidden',
            background: 'rgba(6,11,20,0.88)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="X-ray scan in progress"
              style={{
                objectFit: 'contain',
                width: '100%',
                height: '100%',
                filter: 'grayscale(0.3) brightness(0.6)',
              }}
            />

            <div
              className="scanlines"
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            />

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
              aria-hidden="true"
            >
              <defs>
                <pattern id="scan-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(0,229,255,0.07)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100" height="100" fill="url(#scan-grid)" />
            </svg>

            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                ...bracketBaseStyle,
                top: 12,
                left: 12,
                borderTop: '2px solid var(--color-accent)',
                borderLeft: '2px solid var(--color-accent)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                ...bracketBaseStyle,
                top: 12,
                right: 12,
                borderTop: '2px solid var(--color-accent)',
                borderRight: '2px solid var(--color-accent)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                ...bracketBaseStyle,
                bottom: 12,
                left: 12,
                borderBottom: '2px solid var(--color-accent)',
                borderLeft: '2px solid var(--color-accent)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                ...bracketBaseStyle,
                bottom: 12,
                right: 12,
                borderBottom: '2px solid var(--color-accent)',
                borderRight: '2px solid var(--color-accent)',
              }}
            />

            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 3,
                background:
                  'linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%)',
                boxShadow: '0 0 12px 4px rgba(0,229,255,0.3)',
              }}
              animate={{ y: ['0%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--color-border-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentMessage}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="mono-label"
                style={{ color: 'var(--color-accent)' }}
              >
                {currentMessage}
              </motion.span>
            </AnimatePresence>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                color: 'var(--color-accent)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 18,
              }}
              aria-hidden="true"
            >
              <span style={{ animation: 'fadeInOut 1.2s ease-in-out infinite', animationDelay: '0s' }}>·</span>
              <span style={{ animation: 'fadeInOut 1.2s ease-in-out infinite', animationDelay: '0.3s' }}>·</span>
              <span style={{ animation: 'fadeInOut 1.2s ease-in-out infinite', animationDelay: '0.6s' }}>·</span>
            </div>
          </div>

          <div
            style={{
              height: 2,
              background: 'var(--color-border-dim)',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '82%' }}
              transition={{ duration: 9, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'var(--color-accent)',
                borderRadius: 1,
                boxShadow: '0 0 6px var(--color-accent)',
              }}
            />
          </div>

          <style jsx>{`
            @keyframes fadeInOut {
              0%, 100% {
                opacity: 0.35;
              }
              50% {
                opacity: 1;
              }
            }
          `}</style>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
