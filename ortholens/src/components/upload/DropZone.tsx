'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileImage, AlertCircle } from 'lucide-react'
import { Button, Panel } from '@/components/ui'
import { cn, validateFile, formatFileSize } from '@/lib/utils'
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_MB } from '@/lib/constants'
import type { UploadedFile } from '@/types'
import { useDragDrop } from '@/hooks/useDragDrop'

type Props = {
  onFileSelect: (file: File) => void
  disabled?: boolean
  preview?: Pick<UploadedFile, 'objectUrl' | 'name' | 'sizeKb'> | null
  className?: string
}

const motionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
}

export default function DropZone({ onFileSelect, disabled = false, preview = null, className }: Props) {
  const [localError, setLocalError] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      const result = validateFile(file)
      if (!result.valid) {
        setLocalError(result.reason)
        return
      }
      setLocalError(null)
      onFileSelect(file)
    },
    [onFileSelect]
  )

  const { isDragging, getRootProps } = useDragDrop(handleFile)
  const isPreviewState = Boolean(preview)
  const stateKey = disabled ? 'disabled' : isPreviewState ? 'preview' : 'empty'

  return (
    <div {...getRootProps()} className={cn('w-full', className)}>
      <input
        id="file-input"
        type="file"
        accept={ACCEPTED_MIME_TYPES.join(',')}
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
          e.target.value = ''
        }}
      />

      <AnimatePresence mode="wait">
        {stateKey === 'empty' ? (
          <motion.div key="empty" {...motionProps}>
            <Panel
              variant="default"
              padding="none"
              className="flex flex-col items-center justify-center gap-4"
              style={{
                minHeight: 280,
                borderRadius: 16,
                border: isDragging
                  ? '2px solid var(--color-accent)'
                  : '2px dashed var(--color-border-dim)',
                background: isDragging ? 'var(--color-accent-dim)' : undefined,
                transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              <Upload
                size={48}
                className={cn(isDragging ? 'animate-pulse-glow' : undefined)}
                style={{ color: isDragging ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              />
              <h3 style={{ fontSize: 20, color: 'var(--color-text-primary)', fontWeight: 500 }}>
                Drop your X-ray here
              </h3>
              <p className="mono-label">JPEG · PNG · WebP · Max {MAX_FILE_SIZE_MB} MB</p>
              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById('file-input')?.click()
                }}
              >
                Browse files
              </Button>
            </Panel>

            {localError ? (
              <div
                className="mt-3 flex items-center gap-2"
                style={{
                  background: 'var(--color-fracture-dim)',
                  border: '1px solid rgba(255,56,96,0.3)',
                  borderRadius: 8,
                  padding: '10px 14px',
                }}
              >
                <AlertCircle size={16} style={{ color: 'var(--color-fracture)' }} />
                <span style={{ fontSize: 13 }}>{localError}</span>
              </div>
            ) : null}
          </motion.div>
        ) : (
          <motion.div key={stateKey} {...motionProps}>
            <Panel
              variant="default"
              padding="none"
              className="overflow-hidden"
              style={{
                minHeight: 280,
                borderRadius: 16,
                border: '1px solid var(--color-border-soft)',
                opacity: disabled ? 0.4 : 1,
                pointerEvents: disabled ? 'none' : 'auto',
                userSelect: disabled ? 'none' : 'auto',
              }}
            >
              <div className="relative" style={{ padding: 12 }}>
                {preview ? (
                  <img
                    src={preview.objectUrl}
                    alt="X-ray preview"
                    style={{ objectFit: 'contain', maxHeight: 240, width: '100%', borderRadius: 8 }}
                  />
                ) : (
                  <div style={{ height: 240 }} />
                )}
                <div className="scanlines absolute inset-0 pointer-events-none" />
              </div>

              <div
                className="flex items-center justify-between"
                style={{
                  padding: '10px 14px',
                  background: 'var(--color-bg-elevated)',
                  borderTop: '1px solid var(--color-border-dim)',
                }}
              >
                <div className="flex items-center gap-2" style={{ fontSize: 13 }}>
                  <FileImage size={14} />
                  <span className="mono-label" style={{ fontSize: 13 }}>
                    {preview?.name ?? 'No file selected'} · {formatFileSize((preview?.sizeKb ?? 0) * 1024)}
                  </span>
                </div>
                <span />
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
