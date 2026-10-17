// České texty rozhraní (DOKUMENTACE.md 9.8). en.ts má stejný tvar; slova úderů jsou v data/moves.ts.
import type { Level } from '../data/combos'
import type { VoiceId } from '../data/voices'
import type { IntensityChoice } from '../engine/constants'
import type { Experience, Goal, PlanAnswers } from '../engine/plan'

/** Český tvar podle počtu: 1 kolo, 2–4 kola, 5+ kol. */
const plural = (n: number, one: string, few: string, many: string): string =>
  n === 1 ? one : n >= 2 && n <= 4 ? few : many

const roundsWord = (n: number): string => plural(n, 'kolo', 'kola', 'kol')
const combosWord = (n: number): string => plural(n, 'kombinace', 'kombinace', 'kombinací')
const punchesWord = (n: number): string => plural(n, 'úder', 'údery', 'úderů')

/** Číslovky, před kterými se píše „ze" (dv-, tř-, čt-, s-, š-), u ostatních „z" (9.9, IJP). */
const ZE = new Set([2, 3, 4, 6, 7, 12, 13, 14, 16, 17, 20])
/** Předložka před číslem podle výslovnosti číslovky: „ze 3", „z 5". */
export const z = (n: number): string => (ZE.has(n) ? 'ze' : 'z')

const FOR_WHOM = ['začátečníka', 'mírně pokročilého', 'pokročilého', 'závodníka'] as const
const GOAL_ACC: Record<Goal, string> = {
  kondice: 'kondici',
  technika: 'techniku',
  sila: 'sílu úderu',
  rychlost: 'rychlost',
  obrana: 'obranu',
  hlava: 'vyčištění hlavy',
}

/** „kondici, techniku a obranu" */
const joinAnd = (xs: readonly string[]): string =>
  xs.length < 2 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} a ${xs[xs.length - 1]}`

export const cs = {
  back: 'Zpět',
  close: 'Zavřít',
  resume: 'Pokračovat',
  done: 'Hotovo',
  homeLink: 'Domů',
  delete: 'Smazat',
  deleteItem: (name: string) => `Smazat ${name}`,
  less: (label: string) => `${label}: méně`,
  more: (label: string) => `${label}: více`,
  level: { 0: 'Začátečník', 1: 'Pokročilý', 2: 'Expert' } as Record<Level, string>,
  intensity: { 0: 'Lehká', 1: 'Střední', 2: 'Tvrdá', ramp: 'Rostoucí' } as Record<IntensityChoice, string>,
  levelCaption: 'Úroveň',
  intensityCaption: 'Intenzita',
  roundsWord,
  combosWord,
  punchesWord,
  nRounds: (n: number) => `${n} ${roundsWord(n)}`,
  nCombos: (n: number) => `${n} ${combosWord(n)}`,
  nPunches: (n: number) => `${n} ${punchesWord(n)}`,
  roundCount: 'Počet kol',
  roundLength: 'Délka kola',
  restBetween: 'Pauza mezi koly',
  /** Název tréninku plánu. */
  goal: {
    kondice: 'Kondice',
    technika: 'Technika',
    sila: 'Síla úderu',
    rychlost: 'Rychlost',
    obrana: 'Obrana',
    hlava: 'Vyčistit hlavu',
  } as Record<Goal, string>,
  /** Vestavěné tréninky podle id; uložené názvy jsou česky (kap. 11), tady jen pevná mezera za „o“
   *  (jednopísmenná předložka nesmí zůstat na konci řádku, detail 9.5). */
  presetName: {
    'titul-zeny': 'Zápas o\u00a0titul – ženy',
    'titul-muzi': 'Zápas o\u00a0titul – muži',
  } as Record<string, string>,

  home: {
    settings: 'Nastavení',
    title: ['Žádné', 'řeči.', 'Jen', 'údery.'],
    today: 'Dnešní trénink',
    custom: 'Vlastní trénink',
    startAria: (name: string) => `Začít: ${name}`,
    go: 'Začít',
    meta: (rounds: string, work: string, rest: string) => `${rounds} · ${work} práce · ${rest} pauza`,
    poolEmpty: 'Zapni aspoň jednu kombinaci pro tuhle úroveň.',
    menu: 'Hlavní menu',
    plan: 'Plán',
    combos: 'Kombinace',
    customCombos: 'Vlastní kombinace',
    presets: 'Uložené tréninky',
  },

  intro: {
    title: ['První', 'kolo', 'začíná.'],
    text: 'Trenér ti hlásí kombinace, hlídá kola i pauzy. Ty se soustředíš jen na údery.',
    cta: 'Sestavit můj plán',
    skip: 'Přeskočit, chci rovnou trénovat',
  },

  quiz: {
    step: (n: number, total: number) => `${n} ${z(total)} ${total}`,
    q1: ['Jak dlouho', 'boxuješ?'],
    q1Note: 'Podle toho nastavím tempo a kombinace.',
    experienceAria: 'Zkušenost',
    experience: { 0: 'Začínám', 1: 'Pár měsíců', 2: 'Rok a víc', 3: 'Závodím' } as Record<Experience, string>,
    q2: ['Co chceš', 'zlepšit?'],
    q2Note: 'Vyber klidně víc možností.',
    goalsAria: 'Cíle',
    /** Dlaždice cílů (Otazka2.html). */
    goalTile: {
      kondice: 'Kondici',
      technika: 'Techniku',
      sila: 'Sílu úderu',
      rychlost: 'Rychlost',
      obrana: 'Obranu',
      hlava: 'Vyčistit hlavu',
    } as Record<Goal, string>,
    q3: ['Kolik času', 'máš?'],
    perWeek: 'Kolikrát týdně',
    perWeekAria: (n: number) => `${n}krát týdně`,
    length: 'Jak dlouhý trénink',
    lengthAria: 'Délka tréninku',
    /** „To je **60 minut boxu** týdně." — prostřední část tučně. */
    total: (min: number): [string, string, string] => ['To je ', `${min} minut boxu`, ' týdně.'],
    next: 'Pokračovat',
    build: 'Sestavit plán',
  },

  plan: {
    edit: 'Upravit odpovědi',
    title: 'Tvůj plán',
    week: (w: number, total: number) => `Týden ${w} ${z(total)} ${total}`,
    weekAria: (w: number) => `Týden ${w}`,
    weekTotal: (min: number) => `${min} min celkem`,
    dayShort: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
    dayName: ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota', 'neděle'],
    dayState: { next: 'trénink na řadě', train: 'trénink', done: 'hotovo', rest: 'volno' },
    today: 'Dnes',
    upNext: 'Na řadě',
    complete: 'Plán splněný.',
    newPlan: 'Nový plán',
    end: 'Ukončit plán',
    endTitle: 'Ukončit plán?',
    endText: 'Postup se smaže.',
    endConfirm: 'Ukončit',
    progress: (done: number, total: number) => `Plán: ${done} ${z(total)} ${total} hotovo`,
    /** Shrnutí odpovědí jednou větou (Plan.html, 7.11). */
    summary: (a: PlanAnswers) =>
      `Pro ${FOR_WHOM[a.experience]} se zaměřením na ${joinAnd(a.goals.map((g) => GOAL_ACC[g]))}, ${a.perWeek}× týdně do ${a.minutes} minut. ` +
      'Každý týden přidáme kolo, nebo zkrátíme pauzu.',
  },

  workout: {
    endTitle: 'Ukončit trénink?',
    endText: 'Odboxovaná kola se nikam neukládají.',
    endConfirm: 'Ukončit',
    wakeLock: 'Displej může zhasnout — Nastavení → Zobrazení a jas → Uzamčení → Nikdy',
    doneTitle: 'Hotovo',
    goodWork: 'Dobrá práce.',
    boxed: (rounds: number, time: string) => `${roundsWord(rounds)} · celkem ${time}`,
    again: 'Znovu',
    endAria: 'Ukončit trénink',
    paused: 'Pozastaveno',
    getReady: 'Připrav se',
    prepSub: (name: string, rounds: number) => `${name} · kolo 1 ${z(rounds)} ${rounds}`,
    startingIn: (sec: number) => `Začínáme za ${sec} s`,
    firstCombo: 'První kombinace',
    skip: 'Přeskočit',
    roundDone: (round: number, rounds: number) => `Kolo ${round} ${z(rounds)} ${rounds} hotovo`,
    rest: 'Pauza',
    nextRoundIn: 'Další kolo za',
    nextCombo: 'Další kombinace',
    pauseRest: 'Pozastavit pauzu',
    skipRest: 'Přeskočit pauzu',
    closeAria: 'Zavřít trénink',
    round: (round: number, rounds: number) => `Kolo ${round} ${z(rounds)} ${rounds}`,
    quickAria: 'Nastavení tréninku',
    remaining: 'Zbývá',
    currentCombo: 'Aktuální kombinace',
    finisher: 'Finiš',
    repeat: 'Znovu',
    combo: 'Kombinace',
    toBell: 'Do gongu',
    punchOf: (k: number, n: number) => `Úder ${k} ${z(n)} ${n}`,
    listen: 'Poslouchej trenéra.',
    nextRound: 'Další kolo',
    pause: 'Pozastavit',
    rampRound: (round: number, tempo: string) => `Kolo ${round}: ${tempo}`,
    fromNext: 'Platí od další kombinace.',
  },
  /** Obrázek výsledku z Hotovo (9.10). */
  share: {
    aria: 'Sdílet výsledek',
    title: 'Hotovo.',
    boxed: 'V kolech',
    /** „13. 10. 2026" */
    date: (d: Date) => `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`,
    file: 'direkt-hotovo.png',
  },

  combos: {
    search: 'Hledat kombinaci',
    title: 'Kombinace',
    placeholder: 'Hledat (např. hák, 1 2 3)',
    filter: 'Filtr',
    all: 'Vše',
    defense: 'Obrana',
    legend:
      '1 direkt · 2 zadní direkt · 3 hák · 4 zadní hák · 5 zvedák · 6 zadní zvedák · T na tělo · Ú úklon · Z záklon · D dolů (ponor) · K kryt · V vzad · S stranou (úkrok)',
    noneTitle: 'Nic nenalezeno.',
    noneText: 'Zkus jiný název nebo filtr.',
    inRound: (time: string) => `${time} v kole`,
    listenAria: 'Poslechnout kombinaci',
    listen: 'Poslechnout',
    include: 'Zařadit do tréninku',
    delete: 'Smazat kombinaci',
  },

  custom: {
    title: ['Vlastní', 'kombinace'],
    build: 'Sestavit kombinaci',
    emptyTitle: 'Zatím žádná kombinace.',
    emptyText: 'Sestav první.',
    fallbackName: 'Vlastní kombinace',
    defaultName: (n: number) => `Moje ${n}`,
  },

  builder: {
    title: 'Nová kombinace',
    nameAria: 'Název kombinace',
    hint: 'Ťukej údery a obranu',
    bodyAria: 'Poslední úder na tělo',
    body: 'T · na tělo',
    deleteLast: 'Smazat poslední',
    duplicate: 'Tuhle kombinaci už máš.',
    save: 'Uložit kombinaci',
  },

  presets: {
    title: 'Tréninky',
    new: 'Nový trénink',
    emptyTitle: 'Zatím žádný trénink.',
    emptyText: 'Ulož si první.',
    namePlaceholder: 'Název, např. Ranní 6 × 3',
    nameAria: 'Název tréninku',
    save: 'Uložit trénink',
    start: 'Začít',
    tempo: (label: string) => `intenzita ${label.toLowerCase()}`,
  },

  settings: {
    title: 'Nastavení',
    language: 'Jazyk aplikace',
    commandLang: 'Jazyk povelů',
    commandLangNote: 'Jazyk, ve kterém trenér hlásí kombinace. Aplikace může být v jiném.',
    voice: 'Hlas trenéra',
    voiceStyle: { harry: 'bojovník', charlie: 'nabuzený', adam: 'dominantní', antonin: 'klidný' } as Record<VoiceId, string>,
    playing: (name: string) => `Přehrávám ukázku: ${name}`,
    play: (name: string) => `Přehrát ukázku: ${name}`,
    cantHear: 'Nic neslyšíš?',
    cantHearText:
      'iPhone je asi v tichém režimu — vypni ho, nebo níž zapni „Hrát i v tichém režimu“ (zastaví ale hudbu z telefonu).',
    pause: 'Pauza po kombinaci',
    pauseNote: 'Odpočinek, než zazní další kombinace. Lehká intenzita přidá 1 s, Tvrdá 1 s ubere.',
    actionTime: 'Čas na úder',
    seconds: (ms: number) => `${String(ms / 1000).replace('.', ',')} s`,
    actionTimeNote: 'Na každý úder i pohyb obrany. Kratší = svižnější kombinace.',
    round: 'Kolo',
    countdown: 'Odpočet',
    planNote: 'Plán má vlastní kola a tempo. Tohle platí pro trénink mimo plán.',
    playback: 'Přehrávání',
    silent: 'Hrát i v tichém režimu',
    autoPause: 'Automatická pauza na pozadí',
    about: 'O aplikaci',
    aboutText: (version: string) =>
      `DIREKT ${version} — trenér na boxovací pytel. Hlasy: ElevenLabs (Harry, Charlie, Adam) a Microsoft ` +
      'Antonín. Písmo: Archivo (OFL). Na plochu: Safari → Sdílet → Přidat na plochu.',
  },
}

export type Strings = typeof cs
