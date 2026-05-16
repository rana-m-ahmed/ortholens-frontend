'use client'

import { useCallback, useState, type DragEventHandler, type KeyboardEventHandler } from 'react'

export function useDragDrop(onDrop: (file: File) => void): {
  isDragging: boolean
  getRootProps: () => {
    onDragOver: DragEventHandler
    onDragLeave: DragEventHandler
    onDrop: DragEventHandler
    role: 'button'
    tabIndex: 0
    onKeyDown: KeyboardEventHandler
  }
} {
  const [isDragging, setIsDragging] = useState(false)

  const onDragOver: DragEventHandler = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const onDragLeave: DragEventHandler = useCallback((e) => {
    const related = e.relatedTarget as Node | null
    if (related && e.currentTarget.contains(related)) {
      return
    }
    setIsDragging(false)
  }, [])

  const handleDrop: DragEventHandler = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) {
        onDrop(file)
      }
    },
    [onDrop]
  )

  const onKeyDown: KeyboardEventHandler = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      document.getElementById('file-input')?.click()
    }
  }, [])

  const getRootProps = useCallback(
    () => ({
      onDragOver,
      onDragLeave,
      onDrop: handleDrop,
      role: 'button' as const,
      tabIndex: 0 as const,
      onKeyDown,
    }),
    [handleDrop, onDragLeave, onDragOver, onKeyDown]
  )

  return {
    isDragging,
    getRootProps,
  }
}

export default useDragDrop
