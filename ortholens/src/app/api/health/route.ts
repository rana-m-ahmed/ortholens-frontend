import { NextResponse } from 'next/server'
import { BACKEND_BASE_URL } from '@/lib/constants'

export async function GET(): Promise<Response> {
  try {
    // Many backends (e.g. Hugging Face Spaces) don't expose a /health route.
    // Probe the `/predict` endpoint with GET — if the backend responds (even 405),
    // it's reachable. If the fetch throws, treat it as unreachable.
    const resp = await fetch(`${BACKEND_BASE_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })

    if (resp) {
      // Consider backend reachable if we received any HTTP response (status present)
      return NextResponse.json({ status: 'ok', backendStatus: resp.status }, { status: 200 })
    }

    return NextResponse.json({ status: 'unhealthy' }, { status: 502 })
  } catch {
    return NextResponse.json({ status: 'unreachable' }, { status: 503 })
  }
}
