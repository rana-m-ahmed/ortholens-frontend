 'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppState, PredictResponse, UploadedFile } from '@/types'
import { PredictError } from '@/types'
import { predictFracture } from '@/lib/api'
import { validateFile } from '@/lib/utils'

export function usePredict() {
  const [appState, setAppState] = useState<AppState>('idle')
  const [result, setResult] = useState<PredictResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [durationMs, setDurationMs] = useState<number | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const uploadedFileRef = useRef<UploadedFile | null>(null)

  useEffect(() => {
    uploadedFileRef.current = uploadedFile
  }, [uploadedFile])

  const reset = useCallback(() => {
    abortRef.current?.abort()

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const currentUpload = uploadedFileRef.current
    if (currentUpload?.objectUrl) {
      URL.revokeObjectURL(currentUpload.objectUrl)
    }
    uploadedFileRef.current = null

    setAppState('idle')
    setResult(null)
    setError(null)
    setUploadedFile(null)
    setDurationMs(null)
  }, [])

  const predict = useCallback(async (file: File) => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    const validation = validateFile(file)
    if (!validation.valid) {
      setError(validation.reason)
      setAppState('error')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const existingUpload = uploadedFileRef.current
    if (existingUpload?.objectUrl) {
      URL.revokeObjectURL(existingUpload.objectUrl)
    }

    setUploadedFile({ file, objectUrl, name: file.name, sizeKb: Math.round(file.size / 1024) })
    uploadedFileRef.current = { file, objectUrl, name: file.name, sizeKb: Math.round(file.size / 1024) }
    setAppState('uploading')

    timeoutRef.current = window.setTimeout(() => {
      setAppState('analyzing')
      timeoutRef.current = null
    }, 350)

    try {
      const { data, durationMs } = await predictFracture(file, ac.signal)
      setResult(data)
      setDurationMs(durationMs)
      setAppState('result')
    } catch (error: unknown) {
      if (error instanceof PredictError && error.code === 'ABORTED') {
        return
      }
      const msg = error instanceof Error ? error.message : 'Unknown error'
      setError(msg)
      setAppState('error')
    }
  }, [])

  useEffect(() => {
    return reset
  }, [reset])

  return {
    appState,
    result,
    error,
    uploadedFile,
    durationMs,
    predict,
    reset,
  }
}

export default usePredict
