'use client'

import { motion } from 'framer-motion'
import type { PredictionClass } from '@/types'
import { formatConfidence, getDiagnosticColors } from '@/lib/utils'
import { PREDICTION_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui'
import { useCountUp } from '@/hooks/useCountUp'

type Props = {
  value: number
  prediction: PredictionClass
  size?: number
}

function polarToCartesian(cx: number, cy: number, radius: number, angleDegrees: number) {
  const radians = (angleDegrees * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy - radius * Math.sin(radians),
  }
}

export default function ConfidenceGauge({ value, prediction, size = 200 }: Props) {
  const safeValue = Math.min(Math.max(value, 0), 1)
  const cx = size / 2
  const cy = size / 2 + 20
  const radius = size / 2 - 20

  const startX = cx - radius
  const startY = cy
  const endX = cx + radius
  const endY = cy
  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`

  const totalLength = Math.PI * radius
  const filledLength = safeValue * totalLength

  const colors = getDiagnosticColors(prediction)
  const countUp = useCountUp(safeValue * 100, { decimals: 1, delay: 200 })
  const badgeVariant = prediction === 'fractured' ? 'fracture' : 'normal'

  const tickAngles = [180, 90, 0]

  return (
    <div className="flex flex-col items-center gap-3">
      <Badge label={PREDICTION_LABELS[prediction]} variant={badgeVariant} size="sm" />

      <svg
        width={size}
        height={size * 0.65}
        viewBox={`0 0 ${size} ${size * 0.65}`}
        role="img"
        aria-label={`Confidence: ${formatConfidence(safeValue)}, prediction: ${prediction}`}
      >
        <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round" />

        <motion.path
          d={arcPath}
          fill="none"
          stroke={colors.text}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${totalLength} ${totalLength}`}
          initial={{ strokeDashoffset: totalLength }}
          animate={{ strokeDashoffset: totalLength - filledLength }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
        />

        {tickAngles.map((angle) => {
          const inner = polarToCartesian(cx, cy, radius - 3, angle)
          const outer = polarToCartesian(cx, cy, radius + 3, angle)
          return (
            <line
              key={angle}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--color-border-soft)"
              strokeWidth="1"
            />
          )
        })}

        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 34 }}
        >
          {countUp.toFixed(1)}
          <tspan style={{ fontSize: 16 }} dy="-10">
            %
          </tspan>
        </text>

        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fill="var(--color-text-muted)"
          style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11 }}
        >
          confidence
        </text>
      </svg>
    </div>
  )
}
