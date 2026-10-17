// Příručka úderů a obrany (DOKUMENTACE.md 9.11). Technika: Klouda 2008 a MUNI (kap. 5),
// videa ověřená 17. 10. 2026 (vložení povolené autory). Pořadí = jak to trenér hlásí.
import type { Lang } from '../i18n'
import type { Move } from './moves'

export interface GuideVideo {
  /** YouTube id. */
  id: string
  /** Kde ukázka začíná (s). */
  start: number
  coach: string
}

export interface GuideText {
  title: string
  summary: string
  how: string[]
  mistakes: string[]
}

export interface GuideItem {
  /** Čip a slovo, které trenér řekne (kap. 5). */
  move: Move
  group: 'punch' | 'defense'
  video: GuideVideo
  text: Record<Lang, GuideText>
}

const FIGHTCAMP = 'FightCamp'
const JEFFRIES = 'Tony Jeffries'

export const GUIDE: readonly GuideItem[] = [
  {
    move: '1',
    group: 'punch',
    video: { id: 'YsFK1MMDQgk', start: 60, coach: FIGHTCAMP },
    text: {
      cs: {
        title: 'Direkt',
        summary: 'Rovný úder přední rukou. Nejrychlejší a nejčastější úder — měří vzdálenost a otevírá kombinace.',
        how: [
          'Ze střehu vystřel přední ruku rovně k cíli, impuls dá zadní noha.',
          'Na konci přetoč pěst hřbetem nahoru a zasáhni celou úderovou plochou (klouby prstů).',
          'Zadní ruka zůstává u brady, loket u žeber.',
          'Ruku hned vrať po stejné dráze zpátky — jako žihadlo.',
        ],
        mistakes: [
          'Prodlužování úderu předklonem — ztratíš rovnováhu a nastavíš hlavu.',
          'Pomalý návrat ruky nebo ruka spuštěná po úderu.',
          'Zadní ruka odpadne od brady.',
        ],
      },
      en: {
        title: 'Jab',
        summary: 'A straight punch with the lead hand. The fastest and most used punch — it finds the range and starts combos.',
        how: [
          'Shoot the lead hand straight from your guard; the drive comes from the back foot.',
          'Turn the fist palm-down at the end and land with the whole punching surface (the knuckles).',
          'Keep the rear hand at your chin and the elbow by your ribs.',
          'Snap the hand straight back along the same line.',
        ],
        mistakes: [
          'Reaching by leaning forward — you lose balance and offer your head.',
          'A slow return, or the hand dropping after the punch.',
          'The rear hand leaving the chin.',
        ],
      },
    },
  },
  {
    move: '2',
    group: 'punch',
    video: { id: 'YsFK1MMDQgk', start: 133, coach: FIGHTCAMP },
    text: {
      cs: {
        title: 'Zadní direkt',
        summary: 'Rovný úder zadní, silnější rukou. Jeden z nejtvrdších úderů, nejčastěji hned po direktu (1-2).',
        how: [
          'Odraz ze zadní nohy: pata se vytočí ven, špička zůstává na zemi.',
          'Bok a rameno se točí dopředu, váha přejde k přední noze.',
          'Paže se propne rovně k cíli, rameno kryje bradu.',
          'Přední ruka zůstává před bradou, po úderu se zadní vrátí zpátky.',
        ],
        mistakes: [
          'Zadní chodidlo se odlepí od země.',
          'Dosah z předklonu místo z otočení trupu.',
          'Ruka se po úderu nevrátí k bradě.',
        ],
      },
      en: {
        title: 'Cross',
        summary: 'A straight punch with the rear, stronger hand. One of the hardest punches, most often right after the jab (1-2).',
        how: [
          'Drive off the back foot: the heel turns out, the ball of the foot stays down.',
          'Hip and shoulder turn forward, your weight moves to the front foot.',
          'The arm extends straight to the target, the shoulder covers your chin.',
          'The lead hand stays in front of your chin; bring the rear hand straight back.',
        ],
        mistakes: [
          'The back foot coming off the floor.',
          'Reaching by leaning instead of turning the body.',
          'The hand not coming back to the chin.',
        ],
      },
    },
  },
  {
    move: '3',
    group: 'punch',
    video: { id: '1ZZncRfkt0A', start: 35, coach: FIGHTCAMP },
    text: {
      cs: {
        title: 'Hák',
        summary: 'Boční úder přední rukou pokrčenou v lokti. Krátká dráha, přichází ze strany — těžko se vidí.',
        how: [
          'Loket pokrčený zhruba do pravého úhlu, zvedá se nejvýš do výšky ramene.',
          'Síla jde z přední nohy a boků: pata přední nohy se vytočí, trup se otočí.',
          'V dopadu je předloktí vodorovně se zemí.',
          'Zadní ruka kryje bradu, pěst se vrátí nejkratší cestou.',
        ],
        mistakes: [
          'Nápřah — ruka jde nejdřív dozadu a soupeř úder vidí.',
          'Úder jen z ruky, bez otočení boků.',
          'Spuštěná zadní ruka.',
        ],
      },
      en: {
        title: 'Lead hook',
        summary: 'A side punch with the bent lead arm. A short path from the side — hard to see coming.',
        how: [
          'Elbow bent to about a right angle, raised no higher than your shoulder.',
          'Power comes from the lead leg and hips: the lead heel turns out and the body rotates.',
          'At impact the forearm is level with the floor.',
          'The rear hand guards your chin; the fist returns the shortest way.',
        ],
        mistakes: [
          'Winding up — the hand goes back first and your opponent sees it.',
          'Punching with the arm only, without turning the hips.',
          'Dropping the rear hand.',
        ],
      },
    },
  },
  {
    move: '4',
    group: 'punch',
    video: { id: '1ZZncRfkt0A', start: 106, coach: FIGHTCAMP },
    text: {
      cs: {
        title: 'Zadní hák',
        summary: 'Boční úder zadní rukou. Jeden z nejtvrdších, patří po předním úderu, když se soupeři otevře kryt.',
        how: [
          'Nohy a trup pracují jako u zadního direktu: odraz ze zadní nohy, otočení boků.',
          'Paže je pokrčená, pěst se vytočí hřbetem vzhůru.',
          'Na konci je předloktí v úrovni obličeje.',
          'Přední ruka zůstává u brady.',
        ],
        mistakes: [
          'Široký švih — dlouhá dráha, soupeř úder vidí.',
          'Úder jen rukou, bez otočení.',
          'Přední ruka odpadne od brady.',
        ],
      },
      en: {
        title: 'Rear hook',
        summary: 'A side punch with the rear hand. One of the hardest punches — throw it after a lead punch opens the guard.',
        how: [
          'Legs and body work like the cross: drive off the back foot, turn the hips.',
          'The arm stays bent, the fist turns palm-down.',
          'At the end the forearm is at face level.',
          'The lead hand stays at your chin.',
        ],
        mistakes: [
          'A wide swing — a long path your opponent sees.',
          'Arm only, no rotation.',
          'The lead hand leaving the chin.',
        ],
      },
    },
  },
  {
    move: '5',
    group: 'punch',
    video: { id: 'KcagWYVfvBg', start: 0, coach: FIGHTCAMP },
    text: {
      cs: {
        title: 'Zvedák',
        summary: 'Úder přední rukou zespodu nahoru. Na střední a krátkou vzdálenost, špatně se vidí i kryje.',
        how: [
          'Mírně pokrč kolena, předloktí klesne, loket svírá zhruba pravý úhel.',
          'Úder jde zespodu nahoru celým tělem — nohy se z pokrčení propínají.',
          'Pěst končí v úrovni brady, dlaní k sobě.',
          'Zadní ruka kryje bradu.',
        ],
        mistakes: [
          'Nápřah dolů — ruka klesne k pasu a soupeř úder čte.',
          'Úder jen rukou, bez nohou a boků.',
          'Předklon nad úder.',
        ],
      },
      en: {
        title: 'Lead uppercut',
        summary: 'A lead-hand punch from below. For mid and short range — hard to see and hard to block.',
        how: [
          'Bend the knees a little, drop the forearm, keep the elbow at about a right angle.',
          'Punch upward with the whole body — the legs straighten from the bend.',
          'The fist finishes at chin height, palm facing you.',
          'The rear hand guards your chin.',
        ],
        mistakes: [
          'Winding down — the hand drops to the waist and telegraphs the punch.',
          'Arm only, no legs or hips.',
          'Leaning over the punch.',
        ],
      },
    },
  },
  {
    move: '6',
    group: 'punch',
    video: { id: 'KcagWYVfvBg', start: 0, coach: FIGHTCAMP },
    text: {
      cs: {
        title: 'Zadní zvedák',
        summary: 'Zvedák zadní rukou — častější a silnější než přední. V sériích a jako kontra.',
        how: [
          'Předloktí klesne k hrudníku, v lokti zhruba pravý úhel.',
          'Odraz ze špičky zadní nohy, boky se točí dopředu jako u zadního direktu.',
          'Pěst jde zespodu nahoru na bradu.',
          'Přední ruka kryje.',
        ],
        mistakes: [
          'Spuštěná přední ruka — po zadním zvedáku jsi otevřený na hák.',
          'Dlouhý nápřah dolů.',
          'Úder bez práce nohou.',
        ],
      },
      en: {
        title: 'Rear uppercut',
        summary: 'An uppercut with the rear hand — used more than the lead one and harder. In combos and as a counter.',
        how: [
          'Drop the forearm to chest level, elbow at about a right angle.',
          'Drive off the ball of the back foot, turn the hips like a cross.',
          'The fist travels up to the chin.',
          'The lead hand stays on guard.',
        ],
        mistakes: [
          'Dropping the lead hand — you are open to a hook.',
          'A long wind-up.',
          'No legs in the punch.',
        ],
      },
    },
  },
  {
    move: '3t',
    group: 'punch',
    video: { id: 'WsDx6kIKNbU', start: 0, coach: FIGHTCAMP },
    text: {
      cs: {
        title: 'Na tělo',
        summary: '„Na tělo“ za číslem = stejný úder, jen na trup: „tři na tělo“ je hák na tělo (v čipu 3T).',
        how: [
          'Sniž těžiště pokrčením kolen — ne předklonem v pase.',
          'Trup se mírně předkloní a vykloní mimo osu soupeřova úderu.',
          'Cíl: kraj žeber, solar, u háku játra.',
          'Ruka, která neútočí, kryje bradu.',
        ],
        mistakes: [
          'Hluboký předklon pod pas soupeře — zakázané a nebezpečné.',
          'Ztráta očního kontaktu se soupeřem.',
          'Spuštěné ruce od hlavy.',
        ],
      },
      en: {
        title: 'To the body',
        summary: '“Body” after a number means the same punch to the torso: “three body” is a body hook (chip 3B).',
        how: [
          'Lower your level by bending the knees — not by bending at the waist.',
          'Lean the torso slightly forward and off your opponent’s line.',
          'Targets: the side of the ribs, the solar plexus, the liver with the hook.',
          'The hand that is not punching guards your chin.',
        ],
        mistakes: [
          'Ducking below your opponent’s belt — illegal and dangerous.',
          'Losing sight of your opponent.',
          'Hands dropping away from your head.',
        ],
      },
    },
  },
  {
    move: 'uklon',
    group: 'defense',
    video: { id: '-cfSa-gBxtc', start: 0, coach: FIGHTCAMP },
    text: {
      cs: {
        title: 'Úklon',
        summary: 'Úhyb hlavou do strany z dráhy rovného úderu. Ruce zůstanou volné na kontru.',
        how: [
          'Malý pohyb — hlava jde z osy jen tolik, aby úder minul.',
          'Pohyb dělá trup a kolena, ne krk: vykloň se mírně vpřed stranou.',
          'Ruce nahoře, oči na soupeři.',
          'Hned navaž úderem — třeba úklon, 2.',
        ],
        mistakes: [
          'Úklon do směru soupeřova úderu.',
          'Moc velký úklon — ztratíš rovnováhu i pozici na kontru.',
          'Spuštěné ruce.',
        ],
      },
      en: {
        title: 'Slip',
        summary: 'Move your head to the side, out of the path of a straight punch. Your hands stay free to counter.',
        how: [
          'Small movement — just enough for the punch to miss.',
          'Move with the body and knees, not the neck: lean slightly forward and to the side.',
          'Hands up, eyes on your opponent.',
          'Answer right away — for example slip, 2.',
        ],
        mistakes: [
          'Slipping into the punch.',
          'Slipping too far — you lose balance and your counter position.',
          'Dropping your hands.',
        ],
      },
    },
  },
  {
    move: 'zaklon',
    group: 'defense',
    video: { id: '7Pli4dauWSE', start: 89, coach: JEFFRIES },
    text: {
      cs: {
        title: 'Záklon',
        summary: 'Úhyb trupem vzad — úder dopadne krátce. Proti rovným úderům a hákům na hlavu.',
        how: [
          'Váha přejde na zadní nohu, zadní koleno se pokrčí.',
          'Bradu přitáhni k hrudníku, ruce zůstávají nahoře.',
          'Jen tolik, abys byl z dosahu, pak se vrať s úderem — třeba 2.',
        ],
        mistakes: [
          'Zvednutá brada.',
          'Moc daleko dozadu — ztratíš rovnováhu.',
          'Pořád stejný záklon — soupeř si na něj počká.',
        ],
      },
      en: {
        title: 'Pull back',
        summary: 'Lean the upper body back so the punch falls short. Against straight punches and hooks to the head.',
        how: [
          'Shift your weight to the back foot and bend the back knee.',
          'Keep your chin tucked and your hands up.',
          'Just out of range, then come back with a punch — for example a 2.',
        ],
        mistakes: [
          'Lifting your chin.',
          'Leaning too far back and losing balance.',
          'Pulling back the same way every time — your opponent will wait for it.',
        ],
      },
    },
  },
  {
    move: 'ponor',
    group: 'defense',
    video: { id: 'mLKrcE0mo4E', start: 0, coach: FIGHTCAMP },
    text: {
      cs: {
        title: 'Dolů (ponor)',
        summary: 'Ponor pod boční úder: pokrčíš kolena a hlava projde pod hákem do strany.',
        how: [
          'Snižuj se v kolenou, ne předklonem v pase.',
          'Hlava jde pod úderem obloukem do strany a zpátky nahoru do střehu.',
          'Uhýbej ve směru úderu.',
          'Ruce u hlavy, oči na soupeři.',
        ],
        mistakes: [
          'Vystrčená hlava dopředu.',
          'Ponor na opačnou stranu, než přichází úder.',
          'Moc hluboko — pomalý návrat a soupeře nevidíš.',
        ],
      },
      en: {
        title: 'Roll',
        summary: 'Roll under a hook: bend your knees and move your head under the punch to the side.',
        how: [
          'Go down with the knees, not by bending at the waist.',
          'The head travels under the punch in an arc and back up into your guard.',
          'Roll with the direction of the punch.',
          'Hands by your head, eyes on your opponent.',
        ],
        mistakes: [
          'Sticking your head forward.',
          'Rolling the wrong way, into the punch.',
          'Going too deep — slow to come back and you lose sight of your opponent.',
        ],
      },
    },
  },
  {
    move: 'kryt',
    group: 'defense',
    video: { id: '_wlSoYWIrbI', start: 21, coach: FIGHTCAMP },
    text: {
      cs: {
        title: 'Kryt',
        summary: 'Zachycení úderu rukavicí nebo předloktím. Nejjednodušší obrana — zůstaneš na místě a můžeš hned odpovědět.',
        how: [
          'Na hlavu: rukavice těsně u čela, v dopadu paži zpevni.',
          'Na hák zvedni loket a předloktí ke spánku, na tělo stáhni loket k žebrům.',
          'Po krytu hned odpověz úderem.',
        ],
        mistakes: [
          'Rukavice daleko od obličeje — úder ti ji vrazí do tváře.',
          'Zavřené oči a schovávání za ruce.',
        ],
      },
      en: {
        title: 'Block',
        summary: 'Catch the punch on your glove or forearm. The simplest defense — you stay in place and can answer right away.',
        how: [
          'To the head: glove right against your forehead, tense the arm on impact.',
          'Against a hook raise the elbow and forearm to your temple; to the body pull the elbow to your ribs.',
          'Punch back right after the block.',
        ],
        mistakes: [
          'Glove away from your face — the punch knocks it into you.',
          'Closing your eyes and hiding behind your hands.',
        ],
      },
    },
  },
  {
    move: 'vzad',
    group: 'defense',
    video: { id: 'nWG5Q8TPGeo', start: 79, coach: JEFFRIES },
    text: {
      cs: {
        title: 'Vzad',
        summary: 'Krok vzad z dosahu — úder nedoletí. Pak se vrať zpátky s úderem.',
        how: [
          'Odraz z přední nohy, první jde zadní noha, přední ji následuje.',
          'Krátký krok, chodidla zůstanou v šířce střehu.',
          'Ruce nahoře, pak se vrať dovnitř s direktem.',
        ],
        mistakes: [
          'První krok přední nohou — ztratíš rovnováhu.',
          'Váha jen na zadní noze.',
          'Pořád jen rovně dozadu — přidej i krok stranou.',
        ],
      },
      en: {
        title: 'Step back',
        summary: 'Step back out of range so the punch falls short, then come back in with a punch.',
        how: [
          'Push off the front foot; the back foot moves first, the front foot follows.',
          'A short step — keep your feet at stance width.',
          'Hands up, then step back in with a jab.',
        ],
        mistakes: [
          'Moving the front foot first — you lose balance.',
          'All your weight on the back foot.',
          'Always straight back — add a step to the side.',
        ],
      },
    },
  },
  {
    move: 'ukrok',
    group: 'defense',
    video: { id: 'nWG5Q8TPGeo', start: 13, coach: JEFFRIES },
    text: {
      cs: {
        title: 'Stranou',
        summary: 'Úkrok stranou z linie útoku — změníš úhel a jsi hned v pozici na úder.',
        how: [
          'Krok do strany, druhá noha hned dorovná střeh.',
          'Nebo otočka na přední noze: zadní noha opíše oblouk.',
          'Hned odpověz — z nového úhlu je soupeř otevřený.',
        ],
        mistakes: [
          'Překřížené nohy — ztratíš rovnováhu.',
          'Spuštěné ruce během kroku.',
        ],
      },
      en: {
        title: 'Pivot',
        summary: 'Step or pivot off the line of attack — you change the angle and are ready to punch.',
        how: [
          'Step to the side and let the other foot restore your stance.',
          'Or pivot on the front foot: the back foot swings around in an arc.',
          'Punch right away — from the new angle your opponent is open.',
        ],
        mistakes: [
          'Crossing your feet — you lose balance.',
          'Dropping your hands while you move.',
        ],
      },
    },
  },
]
