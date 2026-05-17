'use client'

import { useState } from 'react'
import type { PredictResponse } from '@/types'
import { Badge, Button, Panel, Spinner, StatusDot } from '@/components/ui'
import DropZone from '@/components/upload/DropZone'
import ScanAnimation from '@/components/analysis/ScanAnimation'
import ConfidenceGauge from '@/components/results/ConfidenceGauge'
import ProbabilityBars from '@/components/results/ProbabilityBars'
import HeatmapViewer from '@/components/results/HeatmapViewer'
import DiagnosticCard from '@/components/results/DiagnosticCard'

const TEST_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Felis_silvestris_silvestris_small_gradual_decrease.png/200px.png'
const PLACEHOLDER_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

const fakePreview = {
  objectUrl: TEST_IMAGE_URL,
  name: 'test.jpg',
  sizeKb: 204,
}

const mockResult: PredictResponse = {
  prediction: 'fractured',
  confidence: 0.9234,
  probabilities: {
    fractured: 0.9234,
    normal: 0.0766,
  },
  heatmap: PLACEHOLDER_B64,
}

export default function TestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [scanVisible, setScanVisible] = useState(true)

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-6 py-8">
      <section className="flex flex-col gap-3">
        <div className="mono-label">SECTION 3A · UI PRIMITIVES</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Panel variant="default" padding="md" className="flex items-center gap-4">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </Panel>

          <Panel variant="default" padding="md" className="flex flex-wrap items-center gap-3">
            <StatusDot status="checking" label="checking…" />
            <StatusDot status="online" label="backend online" />
            <StatusDot status="offline" label="backend offline" />
          </Panel>

          <Panel variant="default" padding="md" className="flex flex-wrap items-center gap-3">
            <Badge label="FRACTURED" variant="fracture" size="sm" />
            <Badge label="NORMAL" variant="normal" size="sm" />
            <Badge label="AI" variant="accent" size="xs" />
            <Badge label="HIGH CONF" variant="dim" size="xs" />
          </Panel>

          <Panel variant="default" padding="md" className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline" isLoading>
              Loading
            </Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>
            <Button variant="outline" leftIcon={<span>←</span>}>
              With Icon
            </Button>
          </Panel>

          <Panel variant="default" padding="md">
            <p>Default panel</p>
          </Panel>

          <Panel variant="bright" padding="md">
            <p>Bright panel</p>
          </Panel>

          <Panel variant="elevated" padding="md">
            <p>Elevated panel</p>
          </Panel>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="mono-label">SECTION 3B · LAYOUT</div>
        <Panel variant="default" padding="md">
          <p style={{ maxWidth: 720, color: 'var(--color-text-secondary)' }}>
            The app shell should already provide the background canvas and the sticky header with the health badge.
            This page adds enough vertical content to test the header blur while scrolling.
          </p>
          <div style={{ height: 280 }} />
        </Panel>
      </section>

      <section className="flex flex-col gap-3">
        <div className="mono-label">SECTION 3C · DROPZONE</div>
        <div className="grid gap-4 xl:grid-cols-3">
          <Panel variant="default" padding="md">
            <DropZone onFileSelect={setSelectedFile} disabled={false} preview={null} />
            <p className="mono-label mt-3">Selected file: {selectedFile ? selectedFile.name : 'none'}</p>
          </Panel>

          <Panel variant="default" padding="md">
            <DropZone onFileSelect={setSelectedFile} disabled preview={null} />
          </Panel>

          <Panel variant="default" padding="md">
            <DropZone onFileSelect={setSelectedFile} preview={fakePreview} />
          </Panel>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="mono-label">SECTION 3D · SCAN ANIMATION</div>
        <div className="flex flex-col gap-3">
          <Button variant="outline" onClick={() => setScanVisible((value) => !value)}>
            Toggle
          </Button>
          <div className="relative h-[400px] w-full overflow-hidden rounded-[16px] border border-[var(--color-border-dim)] bg-[var(--color-bg-surface)]">
            <ScanAnimation imageUrl={TEST_IMAGE_URL} isVisible={scanVisible} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="mono-label">SECTION 3E · CONFIDENCE GAUGE</div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <Panel variant="default" padding="md"><ConfidenceGauge value={0.9234} prediction="fractured" size={200} /></Panel>
          <Panel variant="default" padding="md"><ConfidenceGauge value={0.67} prediction="fractured" size={200} /></Panel>
          <Panel variant="default" padding="md"><ConfidenceGauge value={0.45} prediction="normal" size={200} /></Panel>
          <Panel variant="default" padding="md"><ConfidenceGauge value={0.98} prediction="normal" size={200} /></Panel>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="mono-label">SECTION 3F · PROBABILITY BARS</div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel variant="default" padding="md">
            <ProbabilityBars probabilities={{ fractured: 0.9234, normal: 0.0766 }} />
          </Panel>
          <Panel variant="default" padding="md">
            <ProbabilityBars probabilities={{ fractured: 0.31, normal: 0.69 }} />
          </Panel>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="mono-label">SECTION 3G · HEATMAP VIEWER</div>
        <Panel variant="default" padding="md">
          <HeatmapViewer originalUrl={TEST_IMAGE_URL} heatmapBase64={PLACEHOLDER_B64} />
        </Panel>
      </section>

      <section className="flex flex-col gap-3">
        <div className="mono-label">SECTION 3H · DIAGNOSTIC CARD</div>
        <DiagnosticCard
          result={mockResult}
          originalImageUrl={TEST_IMAGE_URL}
          durationMs={1234}
          onReset={() => console.log('reset called')}
        />
      </section>

      <div style={{ height: 480 }} />
    </main>
  )
}