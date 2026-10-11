import { useEffect, useMemo, useState } from 'react'
import { loadVoice } from './audio/voice'
import { BUILTIN_COMBOS } from './data/combos'
import { voiceLang } from './data/voices'
import type { Intensity, IntensityChoice } from './engine/constants'
import { buildPool } from './engine/selector'
import type { WorkoutConfig } from './engine/timeline'
import {
  loadConfig,
  loadLibrary,
  loadPresets,
  loadSettings,
  sameConfig,
  saveConfig,
  saveLibrary,
  savePresets,
  saveSettings,
  type Preset,
} from './store/storage'
import { CombosScreen } from './ui/CombosScreen'
import { CustomCombosScreen } from './ui/CustomCombosScreen'
import { HomeScreen, type Screen } from './ui/HomeScreen'
import { PresetsScreen } from './ui/PresetsScreen'
import { SettingsScreen } from './ui/SettingsScreen'
import { WorkoutScreen } from './ui/WorkoutScreen'
import { useWorkout } from './workout/useWorkout'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [config, setConfig] = useState(loadConfig)
  const [settings, setSettings] = useState(loadSettings)
  const [library, setLibrary] = useState(loadLibrary)
  const [presets, setPresets] = useState(loadPresets)
  const workout = useWorkout()

  // Klipy vybraného hlasu načíst a dekódovat dopředu, ať první hlášení nečeká (kap. 8).
  useEffect(() => void loadVoice(settings.voice).catch(() => undefined), [settings.voice])
  useEffect(() => saveConfig(config), [config])
  useEffect(() => saveSettings(settings), [settings])
  useEffect(() => saveLibrary(library), [library])
  useEffect(() => savePresets(presets), [presets])

  const all = useMemo(() => [...BUILTIN_COMBOS, ...library.custom], [library.custom])
  const poolFor = (c: WorkoutConfig) => buildPool(all, new Set(library.disabled), c.level)
  const pool = useMemo(
    () => buildPool(all, new Set(library.disabled), config.level),
    [all, library.disabled, config.level],
  )
  const workoutName = presets.find((p) => sameConfig(p.config, config))?.name ?? 'Vlastní trénink'
  // Délky komb v seznamech: u stupňované intenzity Středním tempem (7.10).
  const listTempo: Intensity = config.intensity === 'ramp' ? 1 : config.intensity

  /** Volat přímo z ťuknutí — runner rozjede zvuk v gestu (R1). */
  const start = (c: WorkoutConfig) => workout.start(c, settings, poolFor(c))

  if (workout.view) {
    return (
      <WorkoutScreen
        view={workout.view}
        config={config}
        workoutName={workoutName}
        lang={voiceLang(settings.voice)}
        onPause={workout.pause}
        onResume={workout.resume}
        onSkip={workout.skip}
        onIntensity={(i: IntensityChoice) => {
          setConfig({ ...config, intensity: i })
          workout.setIntensity(i)
        }}
        onAgain={() => {
          workout.close()
          start(config)
        }}
        onClose={() => {
          workout.close()
          setScreen('home')
        }}
      />
    )
  }

  const home = () => setScreen('home')
  switch (screen) {
    case 'komba':
      return (
        <CombosScreen
          all={all}
          library={library}
          onLibrary={setLibrary}
          intensity={listTempo}
          voice={settings.voice}
          silentOverride={settings.silentOverride}
          onBack={home}
        />
      )
    case 'vlastni':
      return (
        <CustomCombosScreen
          all={all}
          library={library}
          onLibrary={setLibrary}
          intensity={listTempo}
          voice={settings.voice}
          silentOverride={settings.silentOverride}
          onBack={home}
        />
      )
    case 'treninky':
      return (
        <PresetsScreen
          presets={presets}
          onPresets={setPresets}
          config={config}
          onStart={(p: Preset) => {
            if (poolFor(p.config).length === 0) {
              setConfig(p.config)
              home()
              return
            }
            setConfig(p.config)
            start(p.config)
          }}
          onBack={home}
        />
      )
    case 'nastaveni':
      return (
        <SettingsScreen settings={settings} onSettings={setSettings} config={config} onConfig={setConfig} onBack={home} />
      )
    default:
      return (
        <HomeScreen
          config={config}
          workoutName={workoutName}
          poolSize={pool.length}
          counts={{ combos: all.length, custom: library.custom.length, presets: presets.length }}
          onStart={() => start(config)}
          onNavigate={setScreen}
        />
      )
  }
}
