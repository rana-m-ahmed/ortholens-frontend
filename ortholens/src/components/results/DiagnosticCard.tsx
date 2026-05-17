'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, RefreshCw, RotateCcw } from 'lucide-react'
import { Badge, Button, Panel } from '@/components/ui'
import ConfidenceGauge from '@/components/results/ConfidenceGauge'
import ProbabilityBars from '@/components/results/ProbabilityBars'
import HeatmapViewer from '@/components/results/HeatmapViewer'
import { getDiagnosticColors, getConfidenceLevel, formatConfidence, formatDuration, cn } from '@/lib/utils'
import { PREDICTION_LABELS, CONFIDENCE_LEVEL_LABELS } from '@/lib/constants'
import type { PredictResponse } from '@/types'

type Props = {
	result: PredictResponse
	originalImageUrl: string
	durationMs: number | null
	onReset: () => void
}

export default function DiagnosticCard({ result, originalImageUrl, durationMs, onReset }: Props) {
	const colors = getDiagnosticColors(result.prediction)
	const confidenceLevel = getConfidenceLevel(result.confidence)
	const confidenceBadgeVariant = confidenceLevel === 'high' ? 'normal' : confidenceLevel === 'medium' ? 'warning' : 'fracture'
	const verdictIcon = result.prediction === 'fractured' ? (
		<AlertTriangle size={22} />
	) : (
		<CheckCircle size={22} />
	)

	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.45, ease: 'easeOut' }}
			className={cn('flex flex-col gap-4')}
		>
			<Panel variant="default" padding="sm" style={{ borderLeft: `4px solid ${colors.text}` }}>
				<div className="flex flex-wrap items-center gap-4">
					<div className="flex items-center gap-3">
						<span style={{ color: colors.text }}>{verdictIcon}</span>
						<h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)' }}>
							{PREDICTION_LABELS[result.prediction]}
						</h2>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<Badge
							variant={result.prediction === 'fractured' ? 'fracture' : 'normal'}
							label={PREDICTION_LABELS[result.prediction]}
							size="sm"
						/>
						<Badge
							variant={confidenceBadgeVariant}
							label={CONFIDENCE_LEVEL_LABELS[confidenceLevel]}
							size="sm"
						/>
					</div>

					<div className="ml-auto flex flex-col items-end gap-1">
						<div className="flex items-center gap-2">
							<span className="mono-label">CONFIDENCE</span>
							<span className="mono-value">{formatConfidence(result.confidence)}</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="mono-label">DURATION</span>
							<span className="mono-value">{durationMs != null ? formatDuration(durationMs) : '—'}</span>
						</div>
					</div>
				</div>
			</Panel>

			<div style={{ padding: '20px 0' }}>
				<div className="grid gap-4 lg:grid-cols-[1fr_1.2fr_1fr]">
					<Panel variant="elevated" padding="md">
						<div className="flex h-full items-center justify-center">
							<ConfidenceGauge value={result.confidence} prediction={result.prediction} size={180} />
						</div>
					</Panel>

					<Panel variant="elevated" padding="md">
						<div className="flex flex-col gap-4">
							<div className="mono-label">CLASS PROBABILITIES</div>
							<ProbabilityBars probabilities={result.probabilities} />
						</div>
					</Panel>

					<Panel variant="elevated" padding="md">
						<div className="flex flex-col gap-4">
							<div className="mono-label">MODEL METADATA</div>
							<div className="flex flex-col">
								{[
									['MODEL', 'ResNet-50'],
									['INPUT', '512 × 512 px'],
									['CLAHE', 'Enabled'],
									['HEATMAP', 'Grad-CAM'],
									['DURATION', durationMs != null ? formatDuration(durationMs) : 'N/A'],
								].map(([label, value], index, rows) => (
									<div
										key={label}
										className="flex items-center justify-between gap-4"
										style={{
											padding: '6px 0',
											borderBottom: index === rows.length - 1 ? 'none' : '1px solid var(--color-border-dim)',
										}}
									>
										<span className="mono-label">{label}</span>
										<span className="mono-value">{value}</span>
									</div>
								))}
							</div>
						</div>
					</Panel>
				</div>
			</div>

			<div style={{ paddingTop: 4 }}>
				<HeatmapViewer originalUrl={originalImageUrl} heatmapBase64={result.heatmap} />
			</div>

			<div className="flex flex-wrap items-center gap-3" style={{ paddingTop: 16, borderTop: '1px solid var(--color-border-dim)' }}>
				<Button variant="outline" leftIcon={<RotateCcw size={14} />} rightIcon={<RefreshCw size={14} />} onClick={onReset}>
					Analyse another X-ray
				</Button>
			</div>
		</motion.div>
	)
}
