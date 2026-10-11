import { useEffect, useMemo, useState } from 'react'
import { loadVoice } from './audio/voice'
import { BUILTIN_COMBOS } from './data/combos'
import { voiceLang } from './data/voices'
import type { Intensity, IntensityChoice } from './engine/constants'
import { buildPlan, type PlanAnswers } from './engine/plan'
import { buildPool } from './engine/selector'
import type { WorkoutConfig } from './engine/timeline'
import {
  loadConfig,
  loadLibrary,
  loadPlan,
  loadPresets,
  loadSettings,
  sameConfig,
  saveConfig,
  saveLibrary,
  savePlan,
  savePresets,
  saveSettings,
  type Preset,
} from './store/storage'
import { CombosScreen } from './ui/CombosScreen'
import { CustomCombosScreen } from './ui/CustomCombosScreen'
import { FOCUS_LABEL } from './ui/format'
import { HomeScreen, type Screen } from './ui/HomeScreen'
import { IntroScreen, type IntroVariant } from './ui/IntroScreen'
import { PlanScreen } from './ui/PlanScreen'
import { PresetsScreen } from './ui/PresetsScreen'
import { QuizScreen } from './ui/QuizScreen'
import { SettingsScreen } from './ui/SettingsScreen'
import { WorkoutScreen } from './ui/WorkoutScreen'
import { useWorkout } from './workout/useWorkout'

/** Co právě běží: nastavení, název a jestli je to trénink plánu (index v plánu). */
interface Running {
  config: WorkoutConfig
  name: string
  planIndex: number | null
  /** Změna intenzity v kole se uloží i do nastavení (ne u plánu). */
  persist: boolean
}

/** `?intro=a|b|c` ukáže úvod v dané variantě i po onboardingu (náhled, 9.0). */
const introParam = new URLSearchParams(location.search).get('intro')
const introPreview = ['a', 'b', 'c'].includes(introParam ?? '') ? (introParam as IntroVariant) : null

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [config, setConfig] = useState(loadConfig)
  const [settings, setSettings] = useState(loadSettings)
  const [library, setLibrary] = useState(loadLibrary)
  const [presets, setPresets] = useState(loadPresets)
  const [plan, setPlan] = useState(loadPlan)
  const [onboarding, setOnboarding] = useState<'intro' | 'quiz' | null>(() =>
    introPreview || !settings.onboarded ? 'intro' : null,
  )
  const [running, setRunning] = useState<Running | null>(null)
  const workout = useWorkout()

  // Klipy vybraného hlasu načíst a dekódovat dopředu, ať první hlášení nečeká (kap. 8).
  useEffect(() => void loadVoice(settings.voice).catch(() => undefined), [settings.voice])
  useEffect(() => saveConfig(config), [config])
  useEffect(() => saveSettings(settings), [settings])
  useEffect(() => saveLibrary(library), [library])
  useEffect(() => savePresets(presets), [presets])
  useEffect(() => savePlan(plan), [plan])

  const all = useMemo(() => [...BUILTIN_COMBOS, ...library.custom], [library.custom])
  const poolFor = (c: WorkoutConfig) => buildPool(all, new Set(library.disabled), c.level)
  const sessions = useMemo(() => (plan ? buildPlan(plan.answers) : []), [plan])
  const nextIndex = plan && plan.done < sessions.length ? plan.done : null
  const next = nextIndex === null ? null : sessions[nextIndex]
  // Délky komb v seznamech: u stupňované intenzity Středním tempem (7.10).
  const listTempo: Intensity = config.intensity === 'ramp' ? 1 : config.intensity

  /** Karta na Domů: další trénink plánu, jinak vlastní nastavení (9.1). */
  const card: Running = next
    ? { config: next.config, name: `Týden ${next.week} · ${FOCUS_LABEL[next.focus]}`, planIndex: nextIndex, persist: false }
    : {
        config,
        name: presets.find((p) => sameConfig(p.config, config))?.name ?? 'Vlastní trénink',
        planIndex: null,
        persist: true,
      }

  /** Volat přímo z ťuknutí — runner rozjede zvuk v gestu (R1). */
  const start = (r: Running) => {
    setRunning(r)
    // Doběhl na Hotovo → posun v plánu; opakování („Znovu", planIndex null) se nepočítá (7.11).
    const index = r.planIndex
    const onFinish =
      index === null ? undefined : () => setPlan((p) => (p && p.done === index ? { ...p, done: p.done + 1 } : p))
    workout.start(r.config, settings, poolFor(r.config), onFinish)
  }

  const endOnboarding = () => {
    setSettings((s) => ({ ...s, onboarded: true }))
    setOnboarding(null)
    if (introPreview) history.replaceState(null, '', location.pathname)
  }
  const newPlan = (answers: PlanAnswers) => {
    setPlan({ answers, done: 0 })
    endOnboarding()
    setScreen('home')
  }

  if (workout.view && running) {
    return (
      <WorkoutScreen
        view={workout.view}
        config={running.config}
        workoutName={running.name}
        lang={voiceLang(settings.voice)}
        planNote={running.planIndex !== null && plan ? `Plán: ${plan.done} z ${sessions.length} hotovo` : undefined}
        onPause={workout.pause}
        onResume={workout.resume}
        onSkip={workout.skip}
        onIntensity={(i: IntensityChoice) => {
          setRunning({ ...running, config: { ...running.config, intensity: i } })
          if (running.persist) setConfig({ ...config, intensity: i })
          workout.setIntensity(i)
        }}
        onAgain={() => {
          workout.close()
          start({ ...running, planIndex: null })
        }}
        onClose={() => {
          workout.close()
          setRunning(null)
          setScreen('home')
        }}
      />
    )
  }

  if (onboarding === 'intro') {
    return (
      <IntroScreen variant={introPreview ?? 'a'} onPlan={() => setOnboarding('quiz')} onSkip={endOnboarding} />
    )
  }
  if (onboarding === 'quiz') {
    return (
      <QuizScreen
        initial={plan?.answers}
        onDone={newPlan}
        onClose={settings.onboarded && !introPreview ? () => setOnboarding(null) : endOnboarding}
      />
    )
  }

  const home = () => setScreen('home')
  if (screen === 'plan' && plan) {
    return (
      <PlanScreen
        plan={plan}
        onNew={() => setOnboarding('quiz')}
        onEnd={() => {
          setPlan(null)
          home()
        }}
        onBack={home}
      />
    )
  }
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
            setConfig(p.config)
            if (poolFor(p.config).length === 0) {
              home()
              return
            }
            start({ config: p.config, name: p.name, planIndex: null, persist: true })
          }}
          onBack={home}
        />
      )
    case 'nastaveni':
      return (
        <SettingsScreen
          settings={settings}
          onSettings={setSettings}
          config={config}
          onConfig={setConfig}
          planActive={next !== null}
          onBack={home}
        />
      )
    default:
      return (
        <HomeScreen
          config={card.config}
          workoutName={card.name}
          cardLabel={nextIndex !== null ? `Plán · trénink ${nextIndex + 1} z ${sessions.length}` : 'Dnešní trénink'}
          poolSize={poolFor(card.config).length}
          planCount={plan ? `${plan.done}/${sessions.length}` : '—'}
          counts={{ combos: all.length, custom: library.custom.length, presets: presets.length }}
          onStart={() => start(card)}
          onNavigate={(s) => (s === 'plan' && !plan ? setOnboarding('quiz') : setScreen(s))}
        />
      )
  }
}
