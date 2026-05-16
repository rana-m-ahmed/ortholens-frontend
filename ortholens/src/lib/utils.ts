import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PredictionClass, ConfidenceLevel, DiagnosticColors } from '@/types'
import { CONFIDENCE_THRESHOLDS, MAX_FILE_SIZE_BYTES, ACCEPTED_MIME_TYPES } from '@/lib/constants'

/**
 * Combines `clsx` and `twMerge` for consistent `className` building.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs))
}

/**
 * Clamp a number between `min` and `max`.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Format a confidence probability (0-1) as a percentage string with one decimal.
 * e.g. 0.923 -> '92.3%'
 */
export function formatConfidence(value: number): string {
  const v = clamp(Number.isFinite(value) ? value : 0, 0, 1)
  return `${(v * 100).toFixed(1)}%`
}

/**
 * Format bytes into a human readable string. Uses KB for < 1 MB.
 * Examples: '4.2 MB', '780 KB'
 */
export function formatFileSize(bytes: number): string {
  const b = Math.max(0, Math.floor(bytes))
  const MB = 1024 * 1024
  if (b >= MB) {
    return `${(b / MB).toFixed(1)} MB`
  }
  return `${Math.round(b / 1024)} KB`
}

/**
 * Format a duration in milliseconds to seconds with two decimals.
 * Example: 1240 -> '1.24 s'
 */
export function formatDuration(ms: number): string {
  const s = Math.max(0, Number(ms) || 0) / 1000
  return `${s.toFixed(2)} s`
}

/**
 * Validate an uploaded file against accepted MIME types and max size.
 * Returns a discriminated union with `valid: true` or `valid: false` and a reason.
 */
export function validateFile(file: File): { valid: true } | { valid: false; reason: string } {
  if (!ACCEPTED_MIME_TYPES.some((type) => type === file.type)) {
    return { valid: false, reason: 'Unsupported file type. Please upload a JPEG, PNG, or WebP image.' }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, reason: `File is too large. Maximum allowed size is ${formatFileSize(MAX_FILE_SIZE_BYTES)}.` }
  }
  return { valid: true }
}

/**
 * Map a numeric confidence (0-1) to a `ConfidenceLevel` using project thresholds.
 */
export function getConfidenceLevel(value: number): ConfidenceLevel {
  const v = clamp(Number.isFinite(value) ? value : 0, 0, 1)
  if (v >= CONFIDENCE_THRESHOLDS.high) return 'high'
  if (v >= CONFIDENCE_THRESHOLDS.medium) return 'medium'
  return 'low'
}

/**
 * Return diagnostic color tokens (CSS variable strings) for a prediction class.
 * Components should apply these directly as inline styles.
 */
export function getDiagnosticColors(prediction: PredictionClass): DiagnosticColors {
  if (prediction === 'fractured') {
    return {
      text: 'var(--color-fracture)',
      bg: 'var(--color-fracture-dim)',
      border: 'var(--color-border-soft)',
      glow: 'rgba(255,56,96,0.25)'
    }
  }
  return {
    text: 'var(--color-normal)',
    bg: 'var(--color-normal-dim)',
    border: 'var(--color-border-soft)',
    glow: 'rgba(0,214,143,0.25)'
  }
}

/**
 * Convert a raw base64 PNG string into a data URL. If the input already
 * looks like a data URL (starts with 'data:'), return it unchanged.
 */
export function base64ToDataUrl(base64: string): string {
  if (!base64) return base64
  const trimmed = base64.trim()
  if (trimmed.startsWith('data:')) return trimmed
  return `data:image/png;base64,${trimmed}`
}
