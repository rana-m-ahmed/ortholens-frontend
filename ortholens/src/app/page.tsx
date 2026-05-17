'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePredict } from '@/hooks/usePredict'
import BackgroundCanvas from '@/components/layout/BackgroundCanvas'
import Header from '@/components/layout/Header'
import DropZone from '@/components/upload/DropZone'
import ScanAnimation from '@/components/analysis/ScanAnimation'
import DiagnosticCard from '@/components/results/DiagnosticCard'
import { Button } from '@/components/ui'

export default function Home() {
  const { appState, result, error, uploadedFile, durationMs, predict, reset } = usePredict()
  const showBusy = appState === 'uploading' || appState === 'analyzing'

  return (
    <div className={cn('min-h-screen flex flex-col bg-bg-base')}>
      <BackgroundCanvas />
      <Header />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-start">
        <div className="flex w-full max-w-[860px] flex-col gap-8 px-6 py-10">
          <AnimatePresence mode="wait" initial={false}>
            {appState === 'result' ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DiagnosticCard
                  result={result!}
                  originalImageUrl={uploadedFile!.objectUrl}
                  durationMs={durationMs}
                  onReset={reset}
                />
              </motion.div>
            ) : (
              <motion.div
                key="idle-upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8"
              >
                {appState === 'idle' ? (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      OrthoLens
                    </h1>
                    <div className="mono-label" style={{ color: 'var(--color-accent)', marginTop: 8 }}>
                      Upload an X-ray · Detect fractures in seconds
                    </div>
                    <p style={{ marginTop: 14, maxWidth: 520, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                      Powered by a ResNet-50 classifier trained on the MURA musculoskeletal radiograph dataset. Grad-CAM visualisation highlights regions driving the prediction.
                    </p>
                  </motion.div>
                ) : null}

                <div className="relative">
                  <DropZone
                    onFileSelect={predict}
                    disabled={showBusy}
                    preview={uploadedFile ? { objectUrl: uploadedFile.objectUrl, name: uploadedFile.name, sizeKb: uploadedFile.sizeKb } : null}
                  />

                  <AnimatePresence>
                    {showBusy && uploadedFile ? <ScanAnimation imageUrl={uploadedFile.objectUrl} isVisible={true} /> : null}
                  </AnimatePresence>
                </div>

                {appState === 'error' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      background: 'var(--color-fracture-dim)',
                      border: '1px solid rgba(255,56,96,0.3)',
                      borderRadius: 10,
                      padding: '14px 18px',
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} color="var(--color-fracture)" />
                        <span style={{ color: 'var(--color-text-primary)' }}>{error ?? 'Something went wrong'}</span>
                      </div>
                      <Button variant="ghost" onClick={reset} className="ml-auto">
                        Try again
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
