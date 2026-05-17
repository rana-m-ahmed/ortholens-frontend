'use client'

import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Columns2, Layers, SlidersHorizontal } from 'lucide-react'
import { base64ToDataUrl, cn } from '@/lib/utils'
import { Badge } from '@/components/ui'
import Panel from '@/components/ui/Panel'

type Props = {
  originalUrl: string
  heatmapBase64: string
}

type Mode = 'sidebyside' | 'blend'

function ViewerHeader({ mode, onModeChange }: { mode: Mode; onModeChange: (nextMode: Mode) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="mono-label">GRAD-CAM ANALYSIS</div>

      <div className="relative flex items-center gap-1 rounded-xl border border-[var(--color-border-dim)] bg-[var(--color-bg-surface)] p-1">
        <motion.div
          layoutId="mode-indicator"
          className="absolute top-1 bottom-1 rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-accent-dim)]"
          style={{ width: 'calc(50% - 4px)', left: 4 }}
          animate={{ x: mode === 'sidebyside' ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />

        <button
          type="button"
          onClick={() => onModeChange('sidebyside')}
          className={cn(
            'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors',
            'bg-transparent border border-transparent',
            mode === 'sidebyside' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
          )}
        >
          <Columns2 size={14} />
          Side by side
        </button>

        <button
          type="button"
          onClick={() => onModeChange('blend')}
          className={cn(
            'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors',
            'bg-transparent border border-transparent',
            mode === 'blend' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
          )}
        >
          <Layers size={14} />
          Blend compare
        </button>
      </div>
    </div>
  )
}

function PanelShell({ title, badgeLabel, children }: { title: string; badgeLabel: string; children: React.ReactNode }) {
  return (
    <Panel variant="elevated" padding="none">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border-dim)] px-3 py-2">
        <div className="mono-label">{title}</div>
        <Badge label={badgeLabel} variant="dim" size="xs" />
      </div>
      {children}
    </Panel>
  )
}

function ImageFrame({ src, alt, maxHeight, overlay = false }: { src: string; alt: string; maxHeight: number; overlay?: boolean }) {
  return (
    <div className="relative overflow-hidden" style={{ maxHeight }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          display: 'block',
          width: '100%',
          maxHeight,
          objectFit: 'contain',
        }}
      />
      {overlay ? <div className="scanlines absolute inset-0 pointer-events-none" /> : null}
    </div>
  )
}

function SideBySideView({ originalUrl, heatmapUrl }: { originalUrl: string; heatmapUrl: string }) {
  return (
    <motion.div
      className="grid gap-3 sm:grid-cols-2"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <PanelShell title="ORIGINAL X-RAY" badgeLabel="RAW">
          <ImageFrame src={originalUrl} alt="Original X-ray" maxHeight={320} overlay />
        </PanelShell>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      >
        <PanelShell title="GRAD-CAM OVERLAY" badgeLabel="AI">
          <ImageFrame src={heatmapUrl} alt="Grad-CAM heatmap overlay" maxHeight={320} overlay />
        </PanelShell>
      </motion.div>
    </motion.div>
  )
}

function BlendView({
  originalUrl,
  heatmapUrl,
  blendOpacity,
  setBlendOpacity,
}: {
  originalUrl: string
  heatmapUrl: string
  blendOpacity: number
  setBlendOpacity: (value: number) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Panel variant="elevated" padding="none">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border-dim)] px-3 py-2">
          <div className="mono-label">BLEND COMPARISON</div>
          <Badge label="AI" variant="dim" size="xs" />
        </div>

        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original X-ray"
            style={{
              display: 'block',
              width: '100%',
              maxHeight: 360,
              objectFit: 'contain',
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heatmapUrl}
            alt="Grad-CAM overlay"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: blendOpacity / 100,
            }}
          />
          <div className="scanlines absolute inset-0 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3 border-t border-[var(--color-border-dim)] px-4 py-3">
          <SlidersHorizontal size={14} color="var(--color-text-muted)" />
          <div className="mono-label">HEATMAP OPACITY</div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={blendOpacity}
            onChange={(event) => setBlendOpacity(Number(event.target.value))}
            style={{ flex: 1, accentColor: 'var(--color-accent)' }}
          />
          <div className="mono-value" style={{ width: 36, textAlign: 'right' }}>
            {blendOpacity}%
          </div>
        </div>
      </Panel>
    </motion.div>
  )
}

export default function HeatmapViewer({ originalUrl, heatmapBase64 }: Props) {
  const [mode, setMode] = useState<Mode>('sidebyside')
  const [blendOpacity, setBlendOpacity] = useState(72)

  const heatmapUrl = base64ToDataUrl(heatmapBase64)

  return (
    <div className="flex flex-col gap-3">
      <ViewerHeader mode={mode} onModeChange={setMode} />

      <LayoutGroup>
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'sidebyside' ? (
            <SideBySideView key="sidebyside" originalUrl={originalUrl} heatmapUrl={heatmapUrl} />
          ) : (
            <BlendView
              key="blend"
              originalUrl={originalUrl}
              heatmapUrl={heatmapUrl}
              blendOpacity={blendOpacity}
              setBlendOpacity={setBlendOpacity}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  )
}
