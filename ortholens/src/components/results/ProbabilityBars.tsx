'use client'

import { motion } from 'framer-motion'
import type { PredictionClass } from '@/types'
import { getDiagnosticColors } from '@/lib/utils'
import { useCountUp } from '@/hooks/useCountUp'

type Props = {
  probabilities: { fractured: number; normal: number }
}

type RowProps = {
  cls: PredictionClass
  probability: number
  isHigher: boolean
}

function ProbabilityRow({ cls, probability, isHigher }: RowProps) {
  const prob = Math.min(Math.max(probability, 0), 1)
  const colors = getDiagnosticColors(cls)
  const animatedWidth = useCountUp(prob * 100, { decimals: 1, delay: 300 })

  const label = cls === 'fractured' ? 'FRACTURED' : 'NORMAL'

  return (
    <div className="flex items-center gap-[10px]">
      <div className="mono-label" style={{ width: 76, textAlign: 'right' }}>
        {label}
      </div>

      <div
        style={{
          flex: 1,
          height: 8,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            borderRadius: 4,
            background: colors.text,
            boxShadow: isHigher ? `2px 0 10px ${colors.glow}` : 'none',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${prob * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>

      <div
        style={{
          width: 46,
          textAlign: 'right',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 13,
          color: colors.text,
        }}
      >
        {animatedWidth.toFixed(1)}%
      </div>
    </div>
  )
}

export default function ProbabilityBars({ probabilities }: Props) {
  const maxProb = Math.max(probabilities.fractured, probabilities.normal)

  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      <ProbabilityRow
        cls="fractured"
        probability={probabilities.fractured}
        isHigher={probabilities.fractured >= maxProb}
      />

      <div style={{ height: 1, background: 'var(--color-border-dim)' }} />

      <ProbabilityRow
        cls="normal"
        probability={probabilities.normal}
        isHigher={probabilities.normal >= maxProb}
      />
    </div>
  )
}
