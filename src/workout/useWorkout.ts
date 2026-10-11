import { useCallback, useEffect, useRef, useState } from 'react'
import type { Combo } from '../data/combos'
import type { WorkoutConfig } from '../engine/timeline'
import type { Settings } from '../store/storage'
import { setWorkoutBusy } from '../update'
import { WorkoutRunner, type WorkoutView } from './runner'

export function useWorkout() {
  const runner = useRef<WorkoutRunner | null>(null)
  const [view, setView] = useState<WorkoutView | null>(null)

  useEffect(() => {
    const onVisibility = () => runner.current?.onVisibility(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      runner.current?.stop()
    }
  }, [])

  /** Volat přímo z onClick — runner musí nastartovat zvuk v gestu. */
  const start = useCallback((config: WorkoutConfig, settings: Settings, pool: readonly Combo[]) => {
    runner.current?.stop()
    runner.current = new WorkoutRunner(config, settings, pool, setView)
    runner.current.start()
    setWorkoutBusy(true)
  }, [])

  const pause = useCallback(() => runner.current?.pause(), [])
  const resume = useCallback(() => runner.current?.resume(), [])
  const skip = useCallback(() => runner.current?.skip(), [])
  const setIntensity = useCallback(
    (i: WorkoutConfig['intensity']) => runner.current?.setIntensity(i),
    [],
  )
  const close = useCallback(() => {
    runner.current?.stop()
    runner.current = null
    setView(null)
    setWorkoutBusy(false)
  }, [])

  return { view, start, pause, resume, skip, setIntensity, close }
}
