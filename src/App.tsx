import { useEffect, useMemo, useState } from 'react'
import { resumeContext, setSilentOverride } from './audio/context'
import { bell } from './audio/sounds'
import { loadVoice } from './audio/voice'
import { BUILTIN_COMBOS } from './data/combos'
import { voiceLang } from './data/voices'
import type { Intensity, IntensityChoice } from './engine/constants'
import { buildPlan, type PlanAnswers } from './engine/plan'
import { buildPool, focusPool } from './engine/selector'
import type { WorkoutConfig } from './engine/timeline'
import { setLang, t } from './i18n'
import {
  loadConfig,
  loadLibrary,
  loadPlan,
  loadPresets,
  loadSettings,
  ONBOARDING_VERSION,
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
import { presetName, sessionLabel } from './ui/format'
import { HomeScreen, type Screen } from './ui/HomeScreen'
import { IntroScreen } from './ui/IntroScreen'
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

/** `?intro` ukáže úvod znovu i po onboardingu (náhled, 9.0). */
const introPreview = new URLSearchParams(location.search).has('intro')

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [config, setConfig] = useState(loadConfig)
  const [settings, setSettings] = useState(loadSettings)
  const [library, setLibrary] = useState(loadLibrary)
  const [presets, setPresets] = useState(loadPresets)
  const [plan, setPlan] = useState(loadPlan)
  const [onboarding, setOnboarding] = useState<'intro' | 'quiz' | 'plan' | null>(() =>
    introPreview || settings.onboarded < ONBOARDING_VERSION ? 'intro' : null,
  )
  /** Dotazník z úvodu (→ plán v onboardingu), nebo z menu (→ plán z menu). */
  const [flow, setFlow] = useState<'onboarding' | 'menu'>('onboarding')
  const [quizStep, setQuizStep] = useState(0)
  const [introPlayed, setIntroPlayed] = useState(false)
  const [running, setRunning] = useState<Running | null>(null)
  const workout = useWorkout()
  // Jazyk rozhraní dřív, než se vykreslí obrazovky (9.8).
  setLang(settings.lang)

  // Klipy vybraného hlasu načíst a dekódovat dopředu, ať první hlášení nečeká (kap. 8).
  useEffect(() => void loadVoice(settings.voice).catch(() => undefined), [settings.voice])
  useEffect(() => {
    document.documentElement.lang = settings.lang
  }, [settings.lang])
  useEffect(() => saveConfig(config), [config])
  useEffect(() => saveSettings(settings), [settings])
  useEffect(() => saveLibrary(library), [library])
  useEffect(() => savePresets(presets), [presets])
  useEffect(() => savePlan(plan), [plan])

  const all = useMemo(() => [...BUILTIN_COMBOS, ...library.custom], [library.custom])
  const poolFor = (c: WorkoutConfig) => focusPool(buildPool(all, new Set(library.disabled), c.level), c.focus)
  const sessions = useMemo(() => (plan ? buildPlan(plan.answers) : []), [plan])
  const nextIndex = plan && plan.done < sessions.length ? plan.done : null
  const next = nextIndex === null ? null : sessions[nextIndex]
  // Délky komb v seznamech: u stupňované intenzity Středním tempem (7.10).
  const listTempo: Intensity = config.intensity === 'ramp' ? 1 : config.intensity

  const matching = presets.find((p) => sameConfig(p.config, config))
  /** Karta na Domů: další trénink plánu, jinak vlastní nastavení (9.1). */
  const card: Running = next
    ? { config: next.config, name: t().goal[next.goal], planIndex: nextIndex, persist: false }
    : {
        config,
        name: matching ? presetName(matching) : t().home.custom,
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

  const markOnboarded = () => {
    setSettings((s) => ({ ...s, onboarded: ONBOARDING_VERSION }))
    if (introPreview) history.replaceState(null, '', location.pathname)
  }
  const quiz = (from: 'onboarding' | 'menu', step = 0) => {
    setFlow(from)
    setQuizStep(step)
    setOnboarding('quiz')
  }
  const newPlan = (answers: PlanAnswers) => {
    setPlan({ answers, done: 0 })
    markOnboarded()
    if (flow === 'onboarding') {
      setOnboarding('plan')
    } else {
      setOnboarding(null)
      setScreen('plan')
    }
  }
  const leaveTo = (s: Screen) => {
    setOnboarding(null)
    setScreen(s)
  }

  if (workout.view && running) {
    return (
      <WorkoutScreen
        view={workout.view}
        config={running.config}
        workoutName={running.name}
        lang={voiceLang(settings.voice)}
        planNote={running.planIndex !== null && plan ? t().plan.progress(plan.done, sessions.length) : undefined}
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
          leaveTo('home')
        }}
      />
    )
  }

  if (onboarding === 'intro') {
    return (
      <IntroScreen
        animate={!introPlayed}
        onPlan={() => {
          // gong v gestu — iOS pustí zvuk jen z ťuknutí (R1, 9.0)
          setSilentOverride(settings.silentOverride)
          void resumeContext()
          bell(1)
          setIntroPlayed(true)
          quiz('onboarding')
        }}
        onSkip={() => {
          markOnboarded()
          leaveTo('home')
        }}
        lang={settings.lang}
        onLang={(lang) => setSettings((s) => ({ ...s, lang }))}
      />
    )
  }
  if (onboarding === 'quiz') {
    return (
      <QuizScreen
        initial={plan?.answers}
        initialStep={quizStep}
        onDone={newPlan}
        onClose={() => {
          setIntroPlayed(true)
          setOnboarding(flow === 'onboarding' ? 'intro' : null)
        }}
      />
    )
  }

  const home = () => setScreen('home')
  const planMode = onboarding === 'plan' ? 'onboarding' : screen === 'plan' ? 'menu' : null
  if (planMode && plan) {
    return (
      <PlanScreen
        plan={plan}
        mode={planMode}
        onStart={() => start(card)}
        onEdit={() => quiz(planMode)}
        onBack={planMode === 'onboarding' ? () => quiz('onboarding', 2) : home}
        onHome={() => leaveTo('home')}
        onEnd={() => {
          setPlan(null)
          leaveTo('home')
        }}
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
            start({ config: p.config, name: presetName(p), planIndex: null, persist: true })
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
          cardLabel={next ? sessionLabel(next.weekday) : t().home.today}
          poolSize={poolFor(card.config).length}
          planCount={plan ? `${plan.done}/${sessions.length}` : '—'}
          counts={{ combos: all.length, custom: library.custom.length, presets: presets.length }}
          onStart={() => start(card)}
          onNavigate={(s) => (s === 'plan' && !plan ? quiz('menu') : setScreen(s))}
        />
      )
  }
}
