import type { PredictResponse } from '@/types'
import { PredictError } from '@/types'
import { PREDICT_API_ROUTE } from '@/lib/constants'

export async function predictFracture(
  file: File,
  signal?: AbortSignal
): Promise<{ data: PredictResponse; durationMs: number }> {
  if (signal?.aborted) {
    throw new PredictError('Request aborted', undefined, 'ABORTED')
  }

  const start = performance.now()
  const body = new FormData()
  body.append('file', file)

  let resp: Response
  try {
    resp = await fetch(PREDICT_API_ROUTE, { method: 'POST', body, signal })
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new PredictError('Request aborted', undefined, 'ABORTED')
    }
    throw new PredictError('Network error', undefined, 'NETWORK_ERROR')
  }

  if (!resp.ok) {
    let parsed: unknown = null
    try {
      parsed = await resp.json()
    } catch {}

    const message =
      parsed && typeof parsed === 'object' && 'error' in parsed && typeof parsed.error === 'string'
        ? parsed.error
        : 'Server error'

    throw new PredictError(message, resp.status, 'SERVER_ERROR')
  }

  const data: PredictResponse = await resp.json()
  const durationMs = Math.max(0, performance.now() - start)
  return { data, durationMs }
}
