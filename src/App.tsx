import './App.css'
import { useMemo, useState } from 'react'

import BigOVisualizer from './components/complexity/BigOVisualizer'
import AlgorithmSelector from './components/controls/AlgorithmSelector'
import { algorithms } from './config/algorithms'

function App() {
  const defaultAlgorithmId = algorithms[0]?.items[0]?.id ?? ''
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState(defaultAlgorithmId)

  const selectedComponent = useMemo(() => {
    const allItems = algorithms.flatMap((group) => group.items)
    return allItems.find((item) => item.id === selectedAlgorithmId)?.component ?? null
  }, [selectedAlgorithmId])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
        <div className="flex items-center justify-center">
          <AlgorithmSelector
            value={selectedAlgorithmId}
            onChange={setSelectedAlgorithmId}
            algorithms={algorithms}
          />
        </div>

        <main className="space-y-10">
          {selectedComponent}
          <div className="mx-auto mt-20 mb-20 max-w-200">
            <BigOVisualizer />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
