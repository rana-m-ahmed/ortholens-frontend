// TODO: Prompt 2

export const API_ENDPOINT = '/api/predict'
import type { ConfidenceLevel } from '@/types'

export const BACKEND_BASE_URL  = 'https://rana-m-ahmed-ortholens-backend.hf.space'
export const PREDICT_API_ROUTE = '/api/predict'   // our Next.js proxy
export const HEALTH_URL        = `${BACKEND_BASE_URL}/health`

export const MAX_FILE_SIZE_MB    = 10
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const CONFIDENCE_THRESHOLDS = {
  high:   0.85,
  medium: 0.60,
} as const

// Labels shown in the UI — change copy here, not in components
export const PREDICTION_LABELS: Record<string, string> = {
  fractured: 'FRACTURE DETECTED',
  normal:    'NO FRACTURE DETECTED',
}
export const CONFIDENCE_LEVEL_LABELS: Record<ConfidenceLevel, string> = {
  high:   'HIGH CONFIDENCE',
  medium: 'MODERATE CONFIDENCE',
  low:    'LOW CONFIDENCE',
}

// Scan animation status messages (cycles in order)
export const SCAN_STATUS_MESSAGES = [
  'Preprocessing X-ray image…',
  'Applying CLAHE enhancement…',
  'Extracting bone features…',
  'Running fracture classifier…',
  'Generating Grad-CAM heatmap…',
] as const
