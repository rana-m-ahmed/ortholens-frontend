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
			<div className="mono-label" style={{ marginBottom: 14, color: 'var(--color-text-muted)' }}>
				Analysis complete · {new Date().toLocaleTimeString()}
			</div>
			<Panel variant="default" padding="sm" style={{ borderLeft: `4px solid ${colors.text}` }}>
				<div className="flex flex-wrap items-center gap-4" style={{ padding: '16px 20px', gap: 16 }}>
					<div className="flex items-center gap-3">
						<span style={{ color: colors.text }}>{verdictIcon}</span>
						<h2 style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif', fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text-primary)' }}>
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
						<div className="verdict-stat">
							<span className="verdict-stat-label">Confidence</span>
							<span className="verdict-stat-value">{formatConfidence(result.confidence)}</span>
						</div>
						<div className="verdict-stat">
							<span className="verdict-stat-label">Duration</span>
							<span className="verdict-stat-value">{durationMs != null ? formatDuration(durationMs) : '—'}</span>
						</div>
					</div>
				</div>
			</Panel>

			<div style={{ padding: '20px 0' }}>
				<div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: 12, marginTop: 12 }}>
					<Panel variant="elevated" padding="md" style={{ padding: 20, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
						<div className="flex h-full items-center justify-center">
							<ConfidenceGauge value={result.confidence} prediction={result.prediction} size={200} />
						</div>
					</Panel>

					<Panel variant="elevated" padding="md" style={{ padding: 20, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
						<div className="flex flex-col gap-4">
							<div className="mono-label">CLASS PROBABILITIES</div>
							<ProbabilityBars probabilities={result.probabilities} />
						</div>
					</Panel>

					<Panel variant="elevated" padding="md" className="metadata-panel" style={{ padding: 20, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
						<div className="flex flex-col gap-4">
							<div className="mono-label">MODEL METADATA</div>
							<div className="flex flex-col">
								{[
									['MODEL', 'ResNet-50'],
									['INPUT', '512 × 512 px'],
									['CLAHE', 'Enabled'],
									['HEATMAP', 'Grad-CAM'],
									['DURATION', durationMs != null ? formatDuration(durationMs) : 'N/A'],
								].map(([label, value]) => (
									<div
										key={label}
										className="metric-row"
									>
										<span className="metric-key">{label}</span>
										<span className="metric-val">{value}</span>
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

			<div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 16 }}>
				<Button variant="outline" size="sm" leftIcon={<RotateCcw size={14} />} rightIcon={<RefreshCw size={14} />} onClick={onReset} style={{ minWidth: 200 }}>
					Analyse another X-ray
				</Button>
			</div>
			<style jsx>{`
				@media (max-width: 768px) {
					.metrics-grid {
						grid-template-columns: 1fr 1fr !important;
					}
					.metadata-panel {
						grid-column: 1 / -1 !important;
					}
				}
				@media (max-width: 480px) {
					.metrics-grid {
						grid-template-columns: 1fr !important;
					}
				}
			`}</style>
		</motion.div>
	)
}
