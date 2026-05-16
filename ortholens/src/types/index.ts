// TODO: Prompt 2

export type Prediction = {
  fracture: number
  normal: number
  heatmapUrl?: string
}
// ── App state machine ──────────────────────────────────────────
export type AppState = 'idle' | 'uploading' | 'analyzing' | 'result' | 'error'

// ── Domain types ───────────────────────────────────────────────
export type PredictionClass = 'fractured' | 'normal'
export type ConfidenceLevel  = 'high' | 'medium' | 'low'

export interface PredictResponse {
  prediction:    PredictionClass
  confidence:    number   // 0–1 probability of predicted class
  probabilities: {
    fractured: number
    normal:    number
  }
  heatmap:       string   // raw base64 PNG string (NO data-URL prefix)
}

export class PredictError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: 'INVALID_FILE' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'ABORTED'
  ) {
    super(message)
    this.name = 'PredictError'
  }
}

// ── Upload state ───────────────────────────────────────────────
// usePredict owns the objectUrl lifecycle (create + revoke).
// DropZone receives this as a prop — it never calls URL.createObjectURL itself.
export interface UploadedFile {
  file:       File
  objectUrl:  string   // created by usePredict, revoked on reset
  name:       string
  sizeKb:     number
}

// ── Diagnostic colour tokens ───────────────────────────────────
// Keyed to CSS variable names so components stay decoupled from hex values.
export interface DiagnosticColors {
  text:   string   // e.g. 'var(--color-fracture)'
  bg:     string   // e.g. 'var(--color-fracture-dim)'
  border: string   // e.g. 'var(--color-border-soft)'
  glow:   string   // e.g. 'rgba(255,56,96,0.25)'
}
