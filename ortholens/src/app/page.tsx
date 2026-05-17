'use client'

import { AlertCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePredict } from '@/hooks/usePredict'
import BackgroundCanvas from '@/components/layout/BackgroundCanvas'
import Header from '@/components/layout/Header'
import DropZone from '@/components/upload/DropZone'
import ScanAnimation from '@/components/analysis/ScanAnimation'
import DiagnosticCard from '@/components/results/DiagnosticCard'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

export default function Home() {
  const { appState, result, error, uploadedFile, durationMs, predict, reset } = usePredict()
  const isBusy = appState === 'uploading' || appState === 'analyzing'

  return (
    <div className={cn('min-h-screen flex flex-col bg-bg-base')}>
      <BackgroundCanvas />
      <Header />

      <main
        style={{
          minHeight: 'calc(100vh - 56px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 24px 64px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 860 }}>
          <AnimatePresence mode="wait">
            {(appState === 'idle' || appState === 'uploading' || appState === 'analyzing' || appState === 'error') && (
              <motion.div
                key="upload-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence>
                  {appState === 'idle' && (
                    <motion.div
                      key="hero"
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      style={{ marginBottom: 36 }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          marginBottom: 14,
                        }}
                      >
                        <div style={{ width: 28, height: 1, background: 'var(--color-accent)' }} />
                        <span
                          style={{
                            fontFamily: 'IBM Plex Mono, monospace',
                            fontSize: 10,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent)',
                          }}
                        >
                          Diagnostic AI · Musculoskeletal Imaging
                        </span>
                      </div>

                      <h1
                        style={{
                          fontFamily: 'Space Grotesk, system-ui, sans-serif',
                          fontSize: 'clamp(32px, 5vw, 52px)',
                          fontWeight: 600,
                          letterSpacing: '-0.025em',
                          lineHeight: 1.05,
                          color: 'var(--color-text-primary)',
                          marginBottom: 14,
                        }}
                      >
                        Fracture Detection
                      </h1>

                      <p
                        style={{
                          fontFamily: 'DM Sans, system-ui, sans-serif',
                          fontSize: 15,
                          fontWeight: 400,
                          lineHeight: 1.65,
                          color: 'var(--color-text-secondary)',
                          maxWidth: 480,
                        }}
                      >
                        Upload an X-ray. A ResNet-50 model classifies bone fractures in under 2 seconds and generates a Grad-CAM heatmap highlighting the regions driving the prediction.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ position: 'relative' }}>
                  <DropZone
                    onFileSelect={predict}
                    disabled={isBusy}
                    preview={uploadedFile ? { objectUrl: uploadedFile.objectUrl, name: uploadedFile.name, sizeKb: uploadedFile.sizeKb } : null}
                  />

                  <AnimatePresence>
                    {isBusy && uploadedFile && <ScanAnimation imageUrl={uploadedFile.objectUrl} isVisible={true} />}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {appState === 'error' && (
                    <motion.div
                      key="error-banner"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        marginTop: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 18px',
                        background: 'var(--color-fracture-dim)',
                        border: '1px solid rgba(255,56,96,0.3)',
                        borderRadius: 8,
                      }}
                    >
                      <AlertCircle size={16} style={{ color: 'var(--color-fracture)', flexShrink: 0 }} />
                      <span
                        style={{
                          fontFamily: 'DM Sans, system-ui, sans-serif',
                          fontSize: 13,
                          color: 'var(--color-text-secondary)',
                          flex: 1,
                        }}
                      >
                        {error ?? 'Something went wrong'}
                      </span>
                      <Button variant="ghost" size="sm" onClick={reset}>
                        Try again
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {appState === 'result' && result && uploadedFile && (
              <motion.div
                key="result-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DiagnosticCard
                  result={result}
                  originalImageUrl={uploadedFile.objectUrl}
                  durationMs={durationMs}
                  onReset={reset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
