import { NextResponse } from 'next/server'
import { BACKEND_BASE_URL, MAX_FILE_SIZE_BYTES } from '@/lib/constants'

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const record = payload as Record<string, unknown>
  const detail = record.detail
  const error = record.error
  if (typeof detail === 'string' && detail.trim()) return detail
  if (typeof error === 'string' && error.trim()) return error
  return null
}

function isValidPredictPayload(payload: unknown): payload is {
  prediction: unknown
  confidence: unknown
  probabilities: unknown
  heatmap: unknown
} {
  if (!payload || typeof payload !== 'object') return false
  const record = payload as Record<string, unknown>
  return (
    'prediction' in record &&
    'confidence' in record &&
    'probabilities' in record &&
    'heatmap' in record
  )
}

export async function GET(): Promise<Response> {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function POST(request: Request): Promise<Response> {
  const token = process.env.HF_API_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Server misconfigured: missing API token' }, { status: 500 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 })
  }

  const fileField = form.get('file')
  if (!fileField || !(fileField instanceof Blob)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const file = fileField
  if (!file.type || !file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 })
  }

  const forward = new FormData()
  if (file instanceof File) {
    forward.append('file', file, file.name)
  } else {
    forward.append('file', file, 'upload-image')
  }

  try {
    const resp = await fetch(`${BACKEND_BASE_URL}/predict`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: forward,
      signal: AbortSignal.timeout(50_000),
    })

    if (!resp.ok) {
      let parsed: unknown = null
      try {
        parsed = await resp.json()
      } catch {}
      const message = extractErrorMessage(parsed) ?? 'Backend error'
      return NextResponse.json({ error: message }, { status: resp.status })
    }

    const body: unknown = await resp.json()
    if (!isValidPredictPayload(body)) {
      return NextResponse.json({ error: 'Unexpected backend response shape' }, { status: 502 })
    }

    return NextResponse.json(body, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Could not reach backend' }, { status: 503 })
  }
}
