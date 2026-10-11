# DIREKT — dokumentace (specifikace)

Osobní trenér na boxovací pytel. Telefon leží u pytle, hlas během kola hlásí komba
**čísly** („jedna, dva, tři na tělo, úklon"), gong začíná a končí kola, mezi koly běží pauza.
Jen box. Stavíme pro **iPhone 15 Pro** jako web appku přidanou na plochu.

Tahle dokumentace je smlouva: stavba se drží jí. Co tu není, se nestaví. Změna plánu =
nejdřív úprava tohohle souboru, pak kód.

Stav: v9 (úvod, dotazník a plán podle předloh `design/onboarding/`), 11. 10. 2026.

---

## 1. Předloha: STRIKR

Ze screenshotu Instagramu `strikr.app` a researche:

| Co | STRIKR | DIREKT v1 |
|---|---|---|
| Hlas hlásí komba v reálném čase během kola | ano | **ano** (čísly; anglicky nebo česky podle hlasu) |
| Náhodný výběr z aktivních komb | ano | **ano** |
| Knihovna komb, vlastní komba, zapnout/vypnout | ano | **ano** |
| Délka kola 1–10 min, pauza, 3 intenzity | ano | **ano** |
| Úroveň (beginner/advanced) | ano | **ano** (3 úrovně) |
| Uložené tréninky | ano | **ano** |
| Gong, odpočty, zvukové efekty | ano | **ano** |
| Haptika | ano (nativní) | **ne** — iOS web ji nemá (viz R9) |
| Box + Muay Thai + kickbox | ano | **jen box** |
| Historie tréninků | ano | **ne** (rozhodnutí uživatele) |
| Plán z 11krokového onboardingu, předplatné 6,99 $/měs | ano | **plán ano** (4 otázky, 4 týdny, 7.11); předplatné ne |

Zdroje: [App Store listing](https://apps.apple.com/us/app/strikr-audio-striking-coach/id6761002692)
(STRIKR Pty Ltd, v1.3.4, 29. 9.), [getstrikr.app](https://getstrikr.app/),
[mergeek](https://mergeek.com/latest/gZdLEAReew5nO9B2). Doména `strikr.app` je zaparkovaná.

## 2. Rozhodnutí uživatele (10. 10. 2026)

- **Jen box.**
- **Název: DIREKT.**
- **Hlášení: čísla** (boxerské číslování). Původně česky českým hlasem; od hlasu v5 je
  výchozí angličtina, čeština zůstává jako volba (viz níže).
- **v1 = jádro + vlastní komba + obrana v kombech + uložené tréninky.** Bez historie.
- **Vzhled v2 podle návrhu uživatele** (8 obrazovek, dodáno 10. 10. 2026 odpoledne) →
  kap. 9 a 10. Návrh je vizuální směr. Kde jeho ukázkový obsah odporuje rozhodnutím výš
  (jména úderů „Jab – Cross" místo čísel, „Low Kick" z kickboxu), platí rozhodnutí.
- **Hlas v3: realistický mužský** (uživatel, 10. 10. 2026 večer; Zuzanu nechce a tlačítko
  Vyzkoušet hlas mu na iPhonu nehrálo). iPhone česky umí jen ženský hlas Zuzana (na Macu
  `say -v '?'` taky jediný český) → hlas jsou **předgenerované klipy** neurálního hlasu
  Microsoft **cs-CZ-AntoninNeural** (kap. 8). Výběr hlasu a rychlost hlasu odpadají.
- **Hlas v5: úderný, anglicky** (uživatel, 10. 10. 2026 večer: „chci hlas, co nabudí… dej ty
  hlášky anglicky, ať je to úderné"). Výkřiky trenérů z ElevenLabs (free účet, 0 Kč): **Harry**,
  **Charlie**, **Adam**; Antonín zůstává jako česká volba. Hlas se vybírá v Nastavení (kap. 9.6).
- **Vzhled v4** (uživatel, 10. 10. 2026 večer): nový design z balíčku `DIREKT-predani.zip`
  (`design/ZADANI.md` + 8 předloh). „To je jen nový design" → přebírá se vzhled, ne stack
  (Expo), Zuzana, low kick ani změny logiky ze zadání (kap. 9–10).
- **v6** (uživatel, 11. 10. 2026): **finiš** — posledních 10 s kola volné údery naplno
  místo komb (7.8); obrazovka Hotovo ukáže počet komb a úderů. Nic se neukládá, historie
  dál ne. Větší písmo komba v kole ne („to je v klidu, když to stejně poslouchám").
- **v7** (uživatel, 11. 10. 2026): trenér občas zavelí **„Znovu!"** = stejné kombo ještě jednou
  (7.9); **stupňované tempo** jako čtvrtá volba intenzity (7.10); „celkem" na Hotovo = jen čas
  v kolech; „Poslední kolo" až po gongu, ať ho gong nepřehluší.
- **v8** (uživatel, 11. 10. 2026: „bych tam přidal plán z úvodního dotazníku… hezké animace na
  začátek"): úvod s animací jen při prvním spuštění (9.0, kap. 10), **dotazník 3–4 otázky**,
  **plán na 4 týdny** (7.11). Ukládá se **jen postup plánu** („trénink 5 z 12"), žádná historie
  ani statistiky — dřívější „bez historie" tím platí dál. Vzhled navrhuju ve stylu v4.
- **v9** (uživatel, 11. 10. 2026: „zanechej 1 2 3 animaci… úvodní obrazovka ze souboru i ten
  dotazník a tvůj plán bude podle souboru graficky", balíček `DIREKT-uvod-dotaznik-2.zip` →
  `design/onboarding/`): z úvodu zůstává varianta **A (1-2-3)**, B a C pryč. Úvod, 3 otázky a
  Tvůj plán podle předloh. Rozhodnutí: 1-2-3 běží **hned a potichu** (iOS nepustí zvuk bez
  ťuknutí), **gong zazní na ťuk „Sestavit můj plán"**; dny v týdnu jsou **rozvrh, postup dál
  po pořadí** (vynechaný den nepropadne, „Dnes" jen když den sedí); „Přeskočit, chci rovnou
  trénovat" → **Domů bez plánu**. Plán se dál ukládá jen jako odpovědi + postup (ne
  `weeks`/`createdAt` z `ONBOARDING.md`).

## 3. Platforma a stack

- **Nativní appka nejde:** na Macu není Xcode (jen Command Line Tools). Cesta = **PWA**
  ze Safari → Sdílet → Přidat na plochu. Od iOS 26 se každá stránka přidaná na plochu
  otevírá jako web appka ([heise](https://heise.de/-10749652)).
- Stack stejný jako `~/dev/denni-check` a `~/dev/navrchol`: **Vite 8 + React 19 + TypeScript
  + čisté CSS + vite-plugin-pwa**, testy **vitest**, lint **oxlint**, Node 20 z nvm.
- **Žádný backend, žádný účet.** Data v `localStorage`. Pozor: appka na ploše má
  vlastní úložiště, oddělené od Safari.
- **Offline** po prvním načtení (service worker, precache).
- Deploy: **Vercel CLI** `npx vercel deploy --prod --yes` (bez `--prod` je preview za loginem).
- Hlasové klipy generuje `scripts/gen-voice.py` do `public/voice/<hlas>/` (Antonín přes edge-tts,
  angličtí trenéři přes ElevenLabs API, + ffmpeg); jdou do precache (offline). Klíč ElevenLabs je
  jen v `~/.config/elevenlabs.key` na Macu — appka ani repo ho nikdy nepotřebují.

## 4. Fakta o iOS z researche → pravidla stavby

| # | Fakt | Pravidlo | Zdroj |
|---|---|---|---|
| R1 | Zvuk (`AudioContext`, dřív i `speechSynthesis`) jde na iOS rozjet jen z gesta uživatele. | `resume()` přímo v handleru START a Vyzkoušet hlas; pak už hraje i bez gesta. | [Apple forum](https://developer.apple.com/forums/thread/49875), [Unity issue](https://issuetracker-mig.prd.it.unity3d.com/issues/webgl-web-speech-api-calls-do-not-return-audio-output-on-the-ios-safari-browser) |
| R2 | iOS zavře audio session ~2 s po konci zvuku. Studený start řeči: medián 311 ms, nejhůř 665 ms. S neslyšitelným WebAudio tónem: medián 15 ms, p95 24 ms (měřeno na iPhonu, Safari 26.5.2). WebAudio a řeč sdílí audio session. | Celý trénink hraje neslyšitelný **keep-alive tón**. Jedna sdílená `AudioContext` pro keep-alive, gong i pípání. | [AveReiDev/strikr PHASE0-REPORT](https://github.com/AveReiDev/strikr) |
| R3 | Ztišení hudby (ducking) při hlášení uměla jen systémová řeč. Klipy přes Web Audio se s hudbou mixují bez ztišení; web API na ducking neexistuje. | Klipy normalizované na −1 dBFS, přes kompresor na výstupu — hlas musí přehlušit hudbu sám. | tamtéž, PROJECT-STATUS; [WebKit 278598](https://bugs.webkit.org/show_bug.cgi?id=278598) |
| R4 | `AudioContext.resume()` umí na iOS viset donekonečna (appka na pozadí). | Na `resume()` se čeká max 1 s, start na něm nesmí viset. | AveReiDev/strikr PROJECT-STATUS |
| R5 | Wake Lock v appce na ploše funguje od iOS 18.4. Po odchodu z appky se uvolní. | Žádat při startu (neawaitovat), znovu při návratu do popředí, pustit na konci. Při selhání hláška „nastav Automatický zámek na Nikdy". | [WebKit 254545](https://bugs.webkit.org/show_bug.cgi?id=254545), [progressier](https://progressier.com/pwa-capabilities/screen-wake-lock) |
| R6 | Na pozadí / se zamčeným displejem jsou časovače a řeč nespolehlivé. | `visibilitychange → hidden` = **automatická pauza**. | AveReiDev/strikr SPEC |
| R7 | Tichý režim ztlumí WebAudio (výchozí session je „ambient"). Řeč podle hlášení vývojářů taky. `navigator.audioSession.type = 'playback'` (iOS 17+) hraje i v tichém režimu, ale je exkluzivní — zastaví hudbu. | Přepínač v Nastavení **„Hrát i v tichém režimu"** (vypne hudbu z telefonu), výchozí vypnuto. **Ověřit na telefonu.** | [WebKit 237322](https://bugs.webkit.org/show_bug.cgi?id=237322), [WebKit 251532](https://bugs.webkit.org/show_bug.cgi?id=251532), [MDN AudioSession.type](https://developer.mozilla.org/docs/Web/API/AudioSession/type) |
| R8 | iPhone má česky jen ženský hlas **Zuzana**; český mužský hlas Apple nenabízí. Proč na iPhonu nehrálo Vyzkoušet hlas, nevím jistě (tichý režim, nebo rozmar `speechSynthesis`). | Hlas = **nahrané klipy** přes Web Audio (kap. 8), žádné `speechSynthesis`; u tlačítka nápověda k tichému režimu. | `say -v '?'` na Macu |
| R9 | iOS Safari nemá `navigator.vibrate`. Trik se skrytým `<input type="checkbox" switch>` Apple podle všeho v iOS 26.5 zavřel. | **Bez haptiky.** | [iOS haptics tester](https://rapidtoolset.com/en/tool/ios-haptics-tester) |
| R10 | Konec klipu je přesně známý z délky bufferu (žádné nespolehlivé `onend` řeči). | Konec hlášení = součet délek klipů + mezery; plánuje se na hodinách `AudioContext`. | — |
| R11 | V režimu „na ploše" `100dvh` lže; `black-translucent` zkracuje výšku a na iOS 26 rozmazává horních ~110 px. Styl `default` dá neprůhlednou lištu. Čím ji iOS barví, se liší: iOS 27 podle `theme-color` i při změně za běhu (ověřeno na zařízení u volleybro), Safari 26 `theme-color` ignoruje a bere pozadí `html`/`body` nebo fixního prvku u horního okraje. Přepsání obsahu existující meta nestačilo (uživatel 10. 10. 2026: bílý pruh nad modrým kolem; lišta měla přesně barvu pozadí `body` #F3F2EE a modrý fixní rám ji neovlivnil → iOS bere pozadí `html`/`body`). | Rám `position: fixed; inset: 0`, safe-area přes `env()` v `--sat`/`--sab`, lišta `default`. Barva obrazovky se při každé změně nastaví **všemi cestami**: nová `<meta name="theme-color">` vložená na začátek `<head>` (staré pryč) + pozadí `html` i `body` + pozadí fixního rámu. Změna stylu lišty platí až po přeinstalaci ikony. | denni-check, [herdr-web-ui #199](https://github.com/devswha/herdr-web-ui/pull/199), [volleybro #427](https://github.com/andrewck24/volleybro/pull/427), [1ar.io: Safari 26](https://1ar.io/updates/safari-26-liquid-glass-web/), [deadhead #191](https://github.com/cevdetta/deadhead/issues/191) |
| R12 | Network-first načítání `index.html` dokázalo v gymu bez signálu viset 30–60 s. | Navigace se obsluhují **z precache** (cache-first). | AveReiDev/strikr PROJECT-STATUS |
| R13 | Hlášení jsou čísla. | Odpočty se **nikdy nevyslovují čísly** (pletly by se s komby) — jen pípají. | vlastní úvaha |
| R14 | `vite-plugin-pwa` v režimu `autoUpdate` po aktivaci nové verze volá `location.reload()` (ověřeno v `register.js`); háček `onNeedReload` ho nahradí. | Když běží trénink, reload se **odloží na jeho konec**; jinak proběhne hned. | `node_modules/vite-plugin-pwa/dist/client/build/register.js` |

## 5. Boxerské číslování a obrana

Postoj je jedno — mluví se o **přední** a **zadní** ruce.

| Kód | Úder | Vyslovuje se |
|---|---|---|
| `1` | přední direkt (jab) | „jedna" |
| `2` | zadní direkt (cross) | „dva" |
| `3` | přední hák | „tři" |
| `4` | zadní hák | „čtyři" |
| `5` | přední zvedák | „pět" |
| `6` | zadní zvedák | „šest" |
| `3t` | úder na tělo (přípona `t`, v angl. literatuře `b`) | „tři na tělo" |

Obrana (terminologie podle Klouda 2008, FTVS UK):

| Kód | Technika | Na displeji | Vyslovuje se |
|---|---|---|---|
| `uklon` | úklon — úhyb do strany (slip) | ÚKLON | „úklon" |
| `zaklon` | záklon — úhyb vzad (pull back) | ZÁKLON | „záklon" |
| `ponor` | ponoření pod úder (roll/duck) | PONOŘ | „ponoř" |
| `kryt` | kryt / blok | KRYT | „kryt" |
| `vzad` | únik krokem vzad | VZAD | „vzad" |
| `ukrok` | úkrok stranou (side step) | ÚKROK | „úkrok" |

Slova se mění na jednom místě (`src/data/moves.ts`).

Zdroje: [Evolve — číslování](https://evolve-mma.com/blog/boxing-fundamentals-understanding-the-boxing-punch-number-system/),
[straight2boxing](https://straight2boxing.com/2018/01/17/punch-numbering-system-in-boxing),
[Klouda: Metodika základních úderů a obran v boxu (2008)](https://dspace.cuni.cz/handle/20.500.11956/15675).

## 6. Vestavěná komba

Tři úrovně. Úroveň určuje, **z jakých komb** se losuje; tempo (kap. 7.2) určuje, **jak rychle**.
Komba převzatá ze zdrojů jsou označená: **[E]** [Evolve University, 19 advanced combos](https://evolve-university.com/blog/19-advanced-boxing-combinations-to-elevate-your-game/),
**[S]** [Sting Sports, beginner combos](https://stingsports.ca/blogs/news/boxing-combinations-for-beginners).
Bez značky = klasická komba boxerského tréninku. Finty, overhandy a „shovel hook" se do
číslování nevejdou → vynechané.

**Začátečník** (15)

| id | kombo | | id | kombo |
|---|---|---|---|---|
| z01 | 1 | | z09 | 1 2 1 2 |
| z02 | 1 1 | | z10 | 2 3 2 [S] |
| z03 | 1 2 [S] | | z11 | 1 2 kryt |
| z04 | 1 1 2 [S] | | z12 | 1 2 vzad |
| z05 | 1 2 1 | | z13 | 1 1 2 vzad |
| z06 | 1 2 3 [S] | | z14 | úklon 2 |
| z07 | 2 3 | | z15 | 1 3 |
| z08 | 3 2 | | | |

**Pokročilý** (18)

| id | kombo | | id | kombo |
|---|---|---|---|---|
| p01 | 1 2 3 2 [E][S] | | p10 | úklon 2 3 [S] |
| p02 | 3 2 3 [S] | | p11 | 1 2 úklon 2 |
| p03 | 1 6 3 [S] | | p12 | 1 2 3 ponoř |
| p04 | 1 6 3 2 | | p13 | 1 2 záklon 2 |
| p05 | 1 2 5 2 [E] | | p14 | 1 2 úkrok |
| p06 | 1 2 3t [E] | | p15 | 6 3 2 |
| p07 | 1 2 1t [S] | | p16 | 1 1 2 3 |
| p08 | 2t 3 2 [S] | | p17 | 2 3 2 vzad |
| p09 | 3t 3 [E] | | p18 | 1 2 3 2 kryt |

**Expert** (17)

| id | kombo | | id | kombo |
|---|---|---|---|---|
| e01 | 1 1 2 3 2 [E] | | e10 | 1 2 3 úklon 3t [E] |
| e02 | 3 2 3t [E] | | e11 | 1 2 úklon 2 3 2 |
| e03 | 2 3 2 ponoř 2 [E] | | e12 | záklon 2 3 2 |
| e04 | 6 3 3t [E] | | e13 | 1 2 3 2 ponoř 2 3 |
| e05 | 3 2 3 3t [E] | | e14 | 1 6 3 2 úkrok |
| e06 | 1 2 3 ponoř 3 [E] | | e15 | 1 2 5 2 3 vzad |
| e07 | 5 4 3t [E] | | e16 | 3t 3 2 |
| e08 | 2 3t úkrok 3 [E] | | e17 | 1 2 3t 3 2 |
| e09 | 1 6t 6 [E] | | | |

## 7. Engine

Čistý TypeScript bez DOM, plně testovaný (`src/engine/`).

### 7.1 Výběr komba

1. **Bazén** = zapnutá komba s úrovní ≤ zvolené úrovni (Začátečník bere jen začátečnická,
   Expert všechna).
2. **Úroveň** se losuje s vahami: zvolená 0,5 / o jednu nižší 0,3 / o dvě nižší 0,2,
   přepočteno jen na úrovně, které v bazénu něco mají.
3. **Kombo** v rámci úrovně rovnoměrně.
4. **Bez opakování:** posledních `min(3, velikost bazénu − 1)` komb se z losování vyřadí
   předem (ne „losuj znovu"). Bazén s 1 kombem tedy opakuje, se 2 komby střídá.
5. Prázdný bazén → START nejde zmáčknout, hláška „Zapni aspoň jedno kombo".
6. Náhoda přes seedovatelný generátor (mulberry32) → testy jsou deterministické.

### 7.2 Načasování hlášení

- **Mezera** (od konce řeči do dalšího hlášení) = `základ[tempo] + 700 ms × počet akcí`.
  Akce = každý úder i obranný pohyb. Tempo = zvolená intenzita, u stupňované tempo
  aktuálního kola (7.10).
- `základ`: **Lehké 2800 ms, Střední 1800 ms, Tvrdé 800 ms.** 700 ms na akci pro všechna
  tempa. (Konstanty doladěné na pytli — AveReiDev/strikr PROJECT-STATUS.)
- **Délka hlášení** = součet délek klipů (bez ticha na krajích) + 70 ms mezi slovy. Než se
  klipy načtou, odhad 450 ms na klip.
- **Konec kola:** kombo se nespustí, pokud do začátku finiše (7.8; kolo bez finiše = do
  konce kola) zbývá méně než `délka hlášení + 700 ms × akcí`. Radši ticho než useknuté kombo.
- První hlášení 1,5 s po startovním gongu.
- Všechny konstanty v `src/engine/constants.ts`.

### 7.3 Průběh tréninku (časová osa)

`PŘÍPRAVA → KOLO 1 → PAUZA → KOLO 2 → … → KOLO N → HOTOVO`

Čistá funkce `phaseAt(config, uplynuléMs)` vrátí fázi, kolo a zbývající čas. Hodiny
nepočítají pauzu. Zvukové události vznikají porovnáním dvou po sobě jdoucích stavů
(`eventsBetween(předchozí, další)`), takže každá padne právě jednou:

| Událost | Kdy | Zvuk |
|---|---|---|
| `beep` | 3, 2, 1 s před koncem přípravy a pauzy | krátké pípnutí |
| `roundStart` | začátek kola | gong ×1; v posledním kole (pokud kol > 1) hlas „Poslední kolo" 0,4 s po gongu (úder gongu by ho přehlušil) |
| `warning` | 10 s před koncem kola (jen kola ≥ 30 s) | 2× klepnutí (jako klapačka v gymu) + hlas „Naplno!" — začíná finiš (7.8) |
| `roundEnd` | konec kola | gong ×3 |
| `finish` | konec posledního kola | po gongu hlas „Hotovo. Dobrá práce." |

**Pauza (tlačítko):** zastaví hodiny, utne řeč. Po pokračování se čeká celá mezera
posledního komba, ne půlka. **Konec (✕):** dvě ťuknutí (první ukáže „Ukončit?" na 3 s).

### 7.4 Nastavení tréninku

| Pole | Rozsah | Krok | Výchozí |
|---|---|---|---|
| Kola | 1–12 | 1 | 3 |
| Délka kola | 1:00–10:00 | 0:30 (v UI čipy 1 2 3 4 5 6 7 8 10 min) | 3:00 |
| Pauza | 0:15–3:00 | 0:15 (v UI čipy 0:30 1:00 1:30 2:00 3:00) | 1:00 |
| Úroveň | Začátečník / Pokročilý / Expert | | Začátečník |
| Intenzita | Lehká / Střední / Tvrdá / Rostoucí (7.10) | | Střední |

3:00 kolo / 1:00 pauza = profesionální formát mužů; ženská a amatérská pravidla se
podle zdrojů liší, proto je vše nastavitelné.

### 7.5 Přeskočení (DALŠÍ, PŘESKOČIT PAUZU)

Hodiny skočí na konec aktuální fáze. Z událostí zazní jen ty přesně na hranici (konec
kola → 3× gong, začátek kola → gong); pípání a klepnutí uvnitř přeskočeného úseku ne.
Funguje i pozastavené — trénink zůstane pozastavený v nové fázi.

### 7.6 První kombo dopředu

První kombo se vylosuje už při startu, ukazuje se na obrazovce přípravy a je prvním
hlášením kola 1.

### 7.7 Automatická pauza (přepínač, výchozí zapnuto)

Zapnutá = R6. Vypnutá: hodiny běží dál i na pozadí; po návratu se zmeškané zvuky
nepřehrávají (jen se dorovná stav) a hlášení naváže 1,5 s po návratu.

### 7.8 Finiš (posledních 10 s kola)

- Začíná událostí `warning` (jen kola ≥ 30 s — kolo má min. 1:00, takže každé): 2× klepnutí,
  hlas „Naplno!" / „All out!" a od té chvíle **žádné kombo** — volné údery naplno do gongu.
- Komba se plánují tak, aby dohrála **před finišem** (7.2): okno pro komba = zbývající čas
  kola − 10 s.
- Pozastavení, pokračování ani návrat z pozadí ve finiši komba neobnoví; hláška se po pauze
  neopakuje.
- Obrazovka kola ve finiši ukazuje místo komba „NAPLNO" / „ALL OUT" (9.2).
- Čisté funkce `comboWindowMs` a `inFinisher` v `src/engine/timing.ts`, testované.

### 7.9 Znovu (opakování komba)

- Místo nového komba trenér s pravděpodobností **25 %** (trénink plánu Technika nebo Obrana
  **40 %**, 7.11) zavelí jen „Znovu!" / „Again!" — boxer
  zopakuje kombo, které právě udělal (jak se v boxerně drilují komba).
- Kombo jde **nejvýš 3× po sobě** (max. 2× „Znovu"), pak vždy nové. Jen v rámci kola — první
  hlášení kola je vždy kombo.
- Mezera po „Znovu" = mezera toho komba (7.2); platí i okno před finišem (7.8).
- Počty na Hotovo ho započítají jako další kombo s jeho údery (boxer ho opravdu udělal).
- Náhoda jde přes stejný seedovatelný generátor jako výběr (testy deterministické).
  Konstanty `REPEAT_CHANCE`, `MAX_REPEATS` v `src/engine/constants.ts`.

### 7.10 Stupňované tempo

- Čtvrtá volba intenzity **Rostoucí** („Stupňovaná" se do segmentu 83 px nevešla): první
  kolo Lehké, poslední Tvrdé, mezi nimi rovnoměrně: tempo kola r z N = `round(2 × (r − 1) / (N − 1))` (3 kola: Lehké, Střední,
  Tvrdé; 6 kol: L L S S T T). Jedno kolo = Střední.
- Úroveň komb se nemění, jen tempo (mezera mezi komby).
- Přepnutí na pevné tempo v panelu během kola platí od dalšího komba; zpět na Rostoucí
  vrátí tempo podle kola.
- Délky komb v seznamech (9.3) se u Rostoucí počítají Středním tempem.
- Čistá funkce `tempoForRound` v `src/engine/timing.ts`, testovaná.

### 7.11 Plán (`src/engine/plan.ts`, v9)

Dotazník (9.0) má 3 otázky podle předloh; **každá odpověď plán mění** (research: 3–5 otázek
s ukazatelem postupu, každá musí viditelně něco změnit —
[adapty](https://adapty.io/blog/markdown/how-to-fix-your-onboarding-flow.md)). Pravidla
vycházejí z `design/onboarding/ONBOARDING.md` a z researche níž.

**Zkušenost → základ tréninku:**

| | Začínám | Pár měsíců | Rok a víc | Závodím |
|---|---|---|---|---|
| Úroveň komb | Začátečník (jen základní) | Pokročilý | Pokročilý | Expert |
| Kolo / pauza | 2:00 / 1:00 | 2:00 / 1:00 | 3:00 / 1:00 | 3:00 / 1:00 |
| Tempo (7.2) | Lehké | Střední | Střední | Tvrdé |

**Cíle → typy tréninků** (vybraných může být víc; tréninky se jimi v plánu střídají po řadě
Kondice, Technika, Síla úderu, Rychlost, Obrana, Vyčistit hlavu):

| Trénink | Kolo | Pauza | Tempo | Komba | „Znovu" (7.9) | Nejkratší pauza |
|---|---|---|---|---|---|---|
| Kondice | základ | −0:15 | Rostoucí (7.10) | podle úrovně | 25 % | 0:30 |
| Technika | základ | základ | o stupeň pomalejší | podle úrovně | 40 % | 0:45 |
| Síla úderu | −0:30 (min. 1:00) | +0:30 | Lehké (čas na plný úder) | podle úrovně | 25 % | nezkracuje se |
| Rychlost | základ | základ | Tvrdé | podle úrovně | 25 % | 0:30 |
| Obrana | základ | základ | o stupeň pomalejší | jen komba s obranou | 40 % | 0:45 |
| Vyčistit hlavu | základ | základ | Střední | podle úrovně | 25 % | 0:45 |

- **Frekvence → dny** s odstupem: 2× Po Čt, 3× Po St Pá, 4× Po Út Čt Pá, 5× Po–Pá.
- **Délka → žádný trénink nepřesáhne zvolené minuty** (bez odpočtu). Start = nejvíc kol, co
  se vejde, mínus 2 (aspoň 2 kola) — zbývá místo na progresi.
- **Progrese:** 4 týdny; týden 2 a 4 **+1 kolo**, týden 3 **pauza −0:15**. Nikdy obojí najednou.
  Když krok nejde (čas, max. 12 kol, nejkratší pauza), zkusí se ten druhý; když nejde ani
  ten, týden zůstane stejný.
- **Postup po pořadí** (uživatel): dny jsou doporučený rozvrh. Na řadě je vždy první
  nehotový trénink; vynechaný den nepropadne. „Dnes" se ukáže, jen když dnešní den v týdnu
  sedí s dnem tréninku na řadě, jinak „Na řadě · středa".
- **Hotový trénink** = doběhl na Hotovo (i s přeskočenými úseky). Konec (✕) se nepočítá,
  „Znovu" na Hotovo trénink zopakuje mimo plán (nepočítá se podruhé).
- Ukládají se jen odpovědi a počet hotových tréninků (kap. 11); tréninky se z odpovědí vždy
  spočítají znovu (čistá funkce `buildPlan`, testovaná).
- Splněný plán → Domů zase ukazuje vlastní trénink, obrazovka Plán nabídne nový.
- Věta shrnutí: „Pro {začátečníka / mírně pokročilého / pokročilého / závodníka} na {cíle ve
  4. pádě: kondici, techniku, sílu úderu, rychlost, obranu, vyčištění hlavy}, {N}× týdně do
  {M} minut. Každý týden přidáme kolo, nebo zkrátíme pauzu."

Zdroje: [Boxing Insider](https://boxinginsider.com/training/heavy-bag-workout-guide/) (start
3 × 2:00 / 1:00 3× týdně; pokročilí až 8 × 3:00 / 0:30), [Legends Boxing](https://legendsboxing.com/blog/beginners-boxing-bag-workout)
(15–30 min 2–3× týdně, přidávat po týdnech, ne po dnech), [Gymdesk](https://gymdesk.com/blog/heavy-bag-workout)
(3:00 / 1:00, kolo navíc, když tři přestanou bolet), [boxprogramming](https://boxprogramming.com/work-to-rest)
(práce : odpočinek 3:1). Recenzovanou studii s týdenním rozpisem jsem nenašel — čísla jsou praxe
trenérů.

## 8. Zvuk a hlas (`src/audio/`)

- Vše hraje sdílená `AudioContext` z `context.ts` (výstup přes kompresor): hlas `voice.ts`,
  zvuky `sounds.ts`. `speechSynthesis` se nepoužívá (R8).
- **Hlasy = sady předgenerovaných klipů** v `public/voice/<hlas>/*.mp3`, seznam v
  `src/data/voices.ts`:

  | Hlas | Jazyk | Zdroj | Charakter |
  |---|---|---|---|
  | **harry** (výchozí) | angličtina | ElevenLabs „Harry – Fierce Warrior", eleven_v3 + `[shouts]` | bojovník, řve |
  | **charlie** | angličtina | ElevenLabs „Charlie – Deep, Energetic" | nabuzený, hluboký |
  | **adam** | angličtina | ElevenLabs „Adam – Dominant, Firm" | dominantní, nejsušší |
  | **antonin** | čeština | Microsoft cs-CZ-AntoninNeural (edge-tts, +10 %) | klidný hlasatel |

- Slovník (id klipu → čeština / angličtina): čísla `n1`–`n6` „Jedna!" / „One!" … ; úder na tělo
  jako celek `t1`–`t6` „Tři na tělo!" / „Three body!"; obrana `uklon zaklon ponor kryt vzad ukrok`
  „Úklon!" / „Slip!", „Záklon!" / „Pull!", „Ponoř!" / „Roll!", „Kryt!" / „Block!", „Vzad!" /
  „Back!", „Úkrok!" / „Pivot!"; hlášky `pripravse` „Připrav se!" / „Get ready!", `posledni`
  „Poslední kolo!" / „Last round!", `naplno` „Naplno!" / „All out!" (finiš 7.8), `znovu`
  „Znovu!" / „Again!" (7.9; zrychlený a s limitem délky jako slova komb), `hotovo`
  „Hotovo. Dobrá práce!" / „Time! Great work!".
- **Generování** (`scripts/gen-voice.py`): syntéza → ořez ticha (Edge −50 dB, ElevenLabs −38 dB
  kvůli dozvuku výkřiků) → mírná komprese → mono 24 kHz → špička −1 dBFS → MP3 64 kb/s.
  **Úderné tempo:** výkřiky z ElevenLabs jsou protáhlé (číslo ~0,7 s, Antonín ~0,4 s), proto
  se klipy do komb zrychlí 1,3× bez změny výšky (ffmpeg `rubberband`); hlášky (připrav se,
  poslední kolo, naplno, hotovo) ne. Jednotlivé klipy jde přegenerovat zvlášť
  (`--clip naplno`), ostatní zkontrolované klipy zůstanou. Rubberband nechá za slovem ~0,5 s ticha a na konci cvaknutí →
  konec ořízne `trim_end` (cvaknutí = úsek < 60 ms po ≥ 150 ms ticha; koncové t/p zůstane).
  ElevenLabs občas přidá citoslovce („Ha! Three") nebo slovo zkomolí, proto se **každý klip
  kontroluje převodem řeči na text** (scribe_v1) a délkou (číslo/obrana ≤ 0,65 s, na tělo
  ≤ 0,9 s, hlášky ≤ 1,2–2 s); nevyhovující se generuje znovu (max. 5×), bere se nejkratší
  správná verze. Výsledek: kombo „1 2 3T Ú" trvá ~2,3 s (Antonín 2,0 s, bez zrychlení 3,1 s).
  Výjimky nad limitem: Charlie „Four body" 1,16 s (zrychlený se vždy přepsal jako „bodies"),
  „Five/Six body" ~0,98 s. Hlas „Liam" vyřazen — ani na 4 pokusy neřekl „Five body".
  Cena: free účet ElevenLabs (0 Kč), 10 000 znaků/měsíc; sada i s opakováními ~900 znaků.
- Za běhu se klipy dekódují předem (vybraný hlas hned po startu appky, ostatní při poslechu)
  a na krajích se ještě odřízne ticho. Kombo = klipy za sebou s mezerou 70 ms, naplánované
  přesně na hodinách `AudioContext`. Text pro bublinu a čtečky je v jazyce hlasu
  („Jedna, dva, tři na tělo!" / „One, two, three body!").
- **Keep-alive:** oscilátor 30 Hz se ziskem 0,0005 běží od START do konce (R2).
- **Gong:** syntéza — součet nesouladných sinusových složek (základ ~830 Hz) s exponenciálním
  doznívání ~1,6 s + krátký šum úderu.
- **Klepnutí:** krátký šum přes pásmovou propust (~2 kHz), útlum ~50 ms.
- **Pípnutí:** sinus 880 Hz, 120 ms.
- **Start (v gestu):** vytvořit/obnovit `AudioContext` (max 1 s), nastavit
  `audioSession.type`, spustit keep-alive, říct „Připrav se", požádat o wake lock.
- **Tichý režim** (R7) platí pro hlas i gong stejně: buď hraje s hudbou a tichý režim ho
  ztlumí, nebo přepínač „Hrát i v tichém režimu" (hraje vždy, hudbu zastaví).
- Obrazovka dostává text posledního hlášení (bublina s reproduktorem) a příznak „mluví"
  (zvýraznění aktuálního úderu).

## 9. Obrazovky (v4 podle předloh `design/predlohy/`)

Zdroj pravdy pro vzhled: 8 HTML předloh 390 × 844 v `design/predlohy/` (z `design/ZADANI.md`,
`{{accent}}` = kobaltová). Rozměry, barvy, písmo a texty se berou odtud. **Ze zadání se přebírá
jen vzhled** (uživatel 10. 10. 2026: „to je jen nový design"). Funkce zůstávají podle kap. 1–8:
web appka, hlasy z kap. 8, jen box, 50 komb, odpočet s pípáním. Kde předloha ukazuje
ukázková data, zobrazují se data appky.

**Navigace:** kořen je Domů. Podobrazovky mají vlevo kulaté tlačítko zpět. Trénink je přes
celou obrazovku a podle fáze má podobu Odpočet → Kolo → Pauza → … → Hotovo.

### 9.0 Úvod a dotazník (v9, předlohy `design/onboarding/predlohy/`)
Zdroj pravdy pro vzhled: `Uvod.html`, `Otazka1–3.html`, `Plan.html` (390 × 844). Jen při prvním
spuštění (`settings.onboarded` < 2 — i u toho, kdo prošel úvodem v8).
- **1-2-3** (kap. 10.1): po otevření na kobaltové ploše dopadnou čísla 1 → 2 → 3, pak se složí
  úvodní obrazovka. Potichu (iOS nepustí zvuk bez ťuknutí). Ťuk kamkoli = skok na konec.
- **Úvod** (`Uvod.html`, accent): značka „pěst v pytli" visí z horního okraje (kompozice
  ikony), vlevo nahoře logotyp (SVG z předlohy), dole nadpis 44 px „PRVNÍ / KOLO / ZAČÍNÁ.",
  text „Trenér ti hlásí komba, hlídá kola i pauzy. Ty se soustředíš jen na údery.", bílá
  pilulka **Sestavit můj plán →** (v gestu zazní gong) a odkaz **Přeskočit, chci rovnou
  trénovat** (→ Domů bez plánu).
- **Otázky** (paper): zpět + „1 ze 3" uprostřed, RoundProgress 3 segmenty, nadpis 34 px,
  podtitul 15 px muted, dole PrimaryButton aktivní až po výběru. Předvyplněno minulými
  odpověďmi (Upravit odpovědi).
  1. **Jak dlouho boxuješ?** „Podle toho nastavím tempo a komba." — jedna ze 4: Začínám / Pár
     měsíců / Rok a víc / Závodím; bílé karty 64 px r20, vybraná ink s modrým zaškrtnutím.
     **Pokračovat**.
  2. **Co chceš zlepšit?** „Vyber klidně víc možností." — mřížka 2 × 3: Kondici, Techniku, Sílu
     úderu, Rychlost, Obranu, Vyčistit hlavu; dlaždice 64 px, vybraná accent se zaškrtnutím.
     **Pokračovat** (aspoň jeden cíl).
  3. **Kolik času máš?** — „Kolikrát týdně": kolečka 72 px 2×–5× (vybrané ink); „Jak dlouhý
     trénink": dlaždice 92 px 10 / 15 / 20 / 30 min (vybraná accent); pod čarou „To je
     **X minut boxu** týdně." **Sestavit plán**.
- Přechod mezi otázkami: další vyjede zprava, zpět zleva (10.1).
- Odkaz `?intro` ukáže úvod znovu (náhled, nic nemaže).

### 9.1 Domů (`Main.html`, pozadí paper)
- Hlavička: logo „DIREKT" (Archivo 125 % / 900 / 20 px), vpravo kulaté tlačítko Nastavení.
- Nadpis 46 px na 4 řádky „ŽÁDNÉ / ŘEČI. / JEN / ÚDERY." (poslední dva akcent). Uživatel 10. 10.
  2026: původní „Lepší kondice. Silnější ty." z předlohy „zní moc AI" → vybral tenhle.
- Karta **Dnešní trénink** (akcent, rádius 28) = celé tlačítko START (v gestu, R1):
  „Dnešní trénink" + celková délka „N min"; název = uložený trénink, se kterým se nastavení
  shoduje, jinak „Vlastní trénink"; meta „3 kola · 2:00 práce · 1:00 pauza"; RoundBar
  (bílá = kolo, bílá 30 % = pauza); „ZAČÍT" + bílé kolečko s play. Prázdný bazén → karta
  zašedlá a „Zapni aspoň jedno kombo".
- Menu (řádky s oddělovačem): **Plán** · „5/12" (bez plánu „—", ťuk → dotazník bez úvodu),
  Komba · počet, Vlastní komba · počet, Uložené tréninky · počet.
- **Běží plán** (nesplněný): karta ukazuje trénink na řadě — nahoře „Dnes · pondělí" (nebo
  „Na řadě · středa", 7.11) a délka, název tréninku („Kondice"), meta a RoundBar; START ho
  spustí.

### 9.2 Trénink běží
- **Odpočet** (`Odpocet.html`, paper): „PŘIPRAV SE" + „Název · kolo 1 ze N"; obří číslo
  zbývajících sekund v akcentu (1 číslice 520 px, 2 číslice zmenšit na šířku); dole
  RoundProgress (první segment ink), „První kombo" + sekvence (kap. 7.6) a pilulka
  **Přeskočit**. Navíc oproti předloze: × vpravo nahoře (ukončit) a při pauze pilulka
  „Pokračovat".
- **Kolo** (`Trenink.html`, celé v akcentu, bílý text): × (dialog „Ukončit trénink?"),
  „Kolo 1 ze 3", vpravo tlačítko **nastavení tréninku** = panel s Intenzitou (platí od
  dalšího komba); RoundProgress (aktuální kolo se plní); „Zbývá" / „Pozastaveno" + čas
  128 px `m:ss`; „Kombo" + „Úder k ze N"; sekvence slovy 34 px (čísla číslem, „3 TĚLO",
  „ÚKLON"; u anglického hlasu „3 BODY", „SLIP" — slova = přepis hlášky, v jazyce hlasu):
  odehrané průhlednost 0,45, **aktuální = bílá pilulka s akcentovým textem**,
  další bílé. Aktuální úder = ten, který hlas právě říká (časy klipů jsou přesné). Po
  dohlášení celá sekvence bíle a vpravo „N úderů". Řádek s reproduktorem a
  „„Jedna, dva, tři na tělo!"" / „„One, two, three body!"". Čipy v odpočtu a pauze
  („3T", „Ú") zůstávají zápisem appky (legenda v Kombech). Dole Další kolo (= přeskočit zbytek kola, 7.5) ·
  pauza/pokračovat (bílý kruh 84 px) · Konec (dialog).
  **Znovu** (7.9): řádek „Znovu" / „N úderů", sekvence téhož komba celá bíle (bez zvýraznění
  úderu — hlas říká jen „Znovu"), bublina „„Znovu!"" / „„Again!"".
  Panel intenzity u Rostoucí ukáže pod volbou „Kolo 2: Střední" (tempo kola).
  **Finiš** (7.8): řádek „Finiš" / „Do gongu", místo sekvence „NAPLNO" / „ALL OUT" v bílé
  pilulce (styl aktuálního úderu), bublina „„Naplno!"" / „„All out!"".
- **Pauza** (`Pauza.html`, ink): ×, „Kolo 1 ze 3 hotovo", RoundProgress (hotová kola
  bílá); „PAUZA", „Další kolo za" / „Pozastaveno", čas 128 px, pruh 8 px plněný akcentem;
  karta **Další kombo** (předem vylosované první kombo dalšího kola) s názvem a obrácenou
  sekvencí; kulaté pozastavení 60 px + bílá pilulka **Přeskočit pauzu**.
- **Hotovo** (není v předlohách, styl paper): „HOTOVO", obří počet kol v akcentu,
  „kola · celkem m:ss" (čas v kolech: bez přípravy, pauz mezi koly, pozastavení a přeskočených
  částí kol), pod tím
  „42 komb · 156 úderů" (ohlášená komba a údery v nich bez obrany; finiš se nepočítá; nic
  se neukládá), u tréninku plánu ještě „Plán: 6 z 12 hotovo", PrimaryButton **Znovu** (stejný
  trénink) a pilulka **Domů**.
- **Dialog „Ukončit trénink?"**: bílá karta r28, Pokračovat / Ukončit.

### 9.3 Komba (`Komba.html`, paper)
- Zpět + **vyhledávání** (pole pod hlavičkou, filtruje podle názvu a čísel). „KOMBA" + počet.
- Filtrovací pilulky **Vše · Začátečník · Pokročilý · Expert · Obrana** (úrovně appky místo
  ukázkových „Základní / Pokročilé"; řádek smí vodorovně rolovat).
- Legenda: „1 jab · 2 cross · 3 hák · 4 zadní hák · 5 zvedák · 6 zadní zvedák · T na tělo ·
  Ú úklon · Z záklon · P ponoř · K kryt · V vzad · ÚK úkrok".
- Řádek: **název** (generovaný z úderů: „Jab – Cross – Hák na tělo", vlastní kombo má svůj),
  PunchSequence S (28 px: číslo = ink kolečko, úder na tělo „3T" a obrana = akcentová
  obrysová pilulka se zkratkou); vpravo délka `m:ss` (hlášení + mezera při aktuální
  intenzitě) a úroveň. Vypnuté kombo je zesvětlené.
- Ťuk na řádek → **detail** (panel): velká sekvence, název, úroveň, ▶ Poslechnout (hlas ho
  řekne), přepínač „Zařadit do tréninku" (dřívější zapnout/vypnout), u vlastního Smazat.

### 9.4 Vlastní komba (`VlastniKomba.html`, paper)
- Zpět, vpravo „N komb". Nadpis „VLASTNÍ / KOMBA". Řádek: název 17/600 + délka, pod tím
  PunchSequence M (34 px). Ťuk → detail (9.3). **Swipe doleva → Smazat.**
- Prázdný stav „Zatím žádné kombo. Sestav první." Dole PrimaryButton **+ Sestavit kombo**
  → editor ve stejném stylu: název, náhled sekvence, klávesy 1–6, T (přepne poslední úder
  na tělo), obrana (Ú Z P K V ÚK), ⌫, úroveň, Uložit. Pravidla jako dřív (1–8 akcí,
  žádný duplikát).

### 9.5 Uložené tréninky (`Treninky.html`, paper)
- Zpět, vpravo „N uložených". Nadpis „TRÉNINKY". Řádek: název, meta
  „3 kola · 2:00 / 1:00 · Začátečník", RoundBar (kolo ink, u úrovně Expert akcent; pauza
  hairline), vpravo celková délka v minutách (34 px + „min"),
  `kola × kolo + (kola − 1) × pauza` zaokrouhleno.
- **Ťuk na řádek = spustí trénink** (jako v předloze; START v gestu). Swipe doleva → Smazat.
- PrimaryButton **+ Nový trénink** → formulář: název, počet kol, délka kola, pauza, úroveň
  (předvyplněno aktuálním nastavením).

### 9.6 Nastavení (`Nastaveni.html`, paper, skupiny na bílých kartách r20)
- **Hlas trenéra:** řádek pro každý hlas (jméno + „Angličtina · bojovník" apod.), ťuk na řádek
  = vybrat (kolečko vlevo), akcentové play vpravo = ukázka „One, two, three body, slip" v tom
  hlase. Poslední řádek „Nic neslyšíš?" rozbalí nápovědu k tichému režimu.
- **Intenzita:** segmenty Lehká / Střední / Tvrdá / Rostoucí (7.10).
- **Úroveň:** segmenty Začátečník / Pokročilý / Expert (navíc oproti předloze).
- **Kolo:** krokovače Počet kol, Délka kola (1:00–10:00 po 0:30), Pauza mezi koly
  (0:15–3:00 po 0:15), Odpočet (před startem, 5–60 s).
- Když běží plán, pod skupinou Kolo poznámka „Plán má vlastní kola a tempo. Tohle platí pro
  trénink mimo plán."
- **Přehrávání:** Hrát i v tichém režimu, Automatická pauza na pozadí.
- **O aplikaci** (rozbalí verzi s časem sestavení, např. „1.0.0 (10. 10. 19:45)" — podle něj jde
  na telefonu poznat, že už běží nová verze, a autory). Vše se ukládá hned.

### 9.7 Tvůj plán (v9, `Plan.html`, paper)
- Hlavička: zpět (v onboardingu na otázku 3, z menu Domů) a pilulka **Upravit odpovědi** (→
  otázka 1, předvyplněno; nový plán začne od začátku).
- Nadpis 40 px „TVŮJ PLÁN", pod ním věta shrnutí (7.11) 15 px muted.
- „Týden 1 ze 4" + „N min celkem"; pás Po–Ne: kolečka 42 px se zkratkou dne — trénink na řadě
  accent, další tréninkové dny ink, hotové tréninky týdne ink 40 %, volno obrys.
- Karta tréninku na řadě (accent, r28): „Dnes · pondělí" / „Na řadě · středa" + „N min", název
  24 px verzálkami, RoundBar, „3 kola · 2:00 / 1:00" + bílé kolečko 48 px s play. Ťuk = START
  (v gestu, → Odpočet).
- Pod ní další tréninky týdne: zkratka dne (15 px verzálky), název 16/600 + meta 13 muted, vpravo
  „N min"; řádky s čarou nahoře.
- **Navíc oproti předloze:** dole odkaz **Domů** (v onboardingu — jinak by šlo z plánu odejít
  jen tréninkem) a z menu odkaz **Ukončit plán** (dialog „Ukončit plán?" / „Postup se smaže.").
  Splněný plán: místo karty „Plán splněný." a PrimaryButton **Nový plán**.

## 10. Vzhled (v4)

- **Tokeny** jen v `:root` (`src/index.css`), v komponentách žádné hex hodnoty natvrdo:
  paper `#F3F2EE`, ink `#111111`, accent `#2C3BFF` (změna na jednom místě; alternativy
  `#FF3B2F`, `#0B8F5A`), white, muted `#6B6A66`, mutedOnDark `#A9A8A3`, fill `#E6E4DD`,
  hairline `#DCDAD3`, hairlineCard `#ECEAE4`, darkFill `#262624`, darkCard `#1E1E1C`,
  darkTrack `#3A3A37`, whiteA16, whiteA30, switch vypnuto `#D6D4CD`.
- **Písmo Archivo** (proměnné, osa šířky 62–125 %, váhy 100–900; licence OFL) lokálně
  v `public/fonts` (latin + latin-ext). Nadpisy a čísla `font-stretch: 125%` + 850/900,
  verzálky; text 400–600. Časovač 128 / 0.86, −3 %, tabular-nums; odpočet 520 / 0.78.
- Okraje 20 px, nahoře safe area + 20 px, dole safe area + 24–32 px. Rádiusy: pilulky 999,
  karty 28, skupiny 20, segmenty a pruhy 2. Dotyková plocha min. 44 × 44.
- **Žádné stíny, přechody, záře, fotky, emoji.** Ploché barvy, velká typografie.
- **Stavová lišta:** styl `default` → appka začíná pod neprůhlednou lištou v barvě
  obrazovky (paper / akcent v kole / ink v pauze). `useThemeColor` ji nastaví všemi cestami
  z R11: nová `theme-color` meta na začátku `<head>` (iOS 27) + pozadí `html` a `body`
  (Safari 26 bere tohle) — rám `.screen` je fixní s pozadím obrazovky. `black-translucent`
  ne (iOS 26 rozmazává horních ~110 px, dřív zkracoval výšku). iOS čte styl lišty jen při
  instalaci → **ikonu na ploše jednou smazat a přidat znovu**.
- **Ikona appky** = návrh uživatele v `design/ikona/` (abstraktní „d": bílá nožička shora, černý
  kruh s kobaltovou mezerou, kobaltové pozadí). `scripts/gen-icons.mjs` ji vykreslí vektorově
  (180 / 192 / 512); verze maskable je zmenšená na ~61 % do bezpečné zóny jako `adaptive-icon.png`.
  iOS si ikonu bere při přidání na plochu → po změně ikonu přidat znovu.

### 10.1 Pohyb (v8–v9)
- Design zakazuje stíny, přechody barev a záře — pohyb je proto jen **kinetická typografie** na
  plochých barvách.
- **Úvod (v9 = varianta A):** kobaltová plocha, uprostřed obří bílá čísla 1 → 2 → 3 dopadají
  v rytmu komba (po 280 ms; zmenšení z 1,6× za 140 ms). Pak spadne pytel z horního okraje
  (260 ms), objeví se logotyp, řádky nadpisu vyjedou po sobě (po 60 ms), text a tlačítka. Celé
  ~1,9 s; ťuk = skok na konec. Varianty B (odpočet) a C (údery) uživatel nevybral → smazané.
- **Dotazník:** další otázka vyjede 24 px zprava s opacity za 220 ms, zpět zleva.
- Animuje se **jen vnitřní obal**, nikdy `.screen` — transformace předka rozbije `position: fixed`
  (Sheet, dialogy).
- Jen `transform` a `opacity` (plynulé i na iPhonu). `prefers-reduced-motion: reduce` → bez
  pohybu, rovnou konečný stav.

## 11. Data (`localStorage`, prefix `direkt.v1.`)

| Klíč | Obsah |
|---|---|
| `config` | aktuální nastavení tréninku (7.4); `intensity` = 0 / 1 / 2 / `'ramp'` (Rostoucí) |
| `settings` | `prepSec`, `silentOverride`, `autoPause`, `voice` (id hlasu, výchozí harry; staré `voiceURI`, `rate` se ignorují), `onboarded` (verze úvodu, kterou už viděl: 0 nikdy, 1 = v8, 2 = v9; starší `true` = 1) |
| `combos` | `{ disabled: id[] (vypnutá komba, vestavěná i vlastní), custom: Combo[] }`; vlastní kombo má navíc `name` |
| `presets` | uložené tréninky `{ id, name, config }[]` |
| `plan` | `{ answers: { experience 0–3, goals: ('kondice' \| 'technika' \| 'sila' \| 'rychlost' \| 'obrana' \| 'hlava')[] (1–6), perWeek 2–5, minutes 10 \| 15 \| 20 \| 30 }, done }` nebo `null` — jen postup, tréninky se počítají z odpovědí (7.11). Plán z v8 (jiné odpovědi) se zahodí. |

Každý klíč se čte obranně: rozbitý JSON nebo hodnota mimo rozsah → výchozí hodnota,
nikdy pád. Vestavěná komba se do úložiště nepíšou (nová komba v update tak dorazí zapnutá).

## 12. Mimo rozsah v1

Muay Thai / kickbox, historie a statistiky, kalendář a připomínky plánu, účty a synchronizace,
haptika, běh se zamčeným displejem, ovládání hudby, tmavý režim, úprava už uloženého komba.

## 13. Ověření

**Automaticky (při každé fázi):**
- `npm test` — engine: deterministický výběr se seedem; váhy úrovní ≈ 50/30/20 u Experta
  (10 000 losů), 100 % u Začátečníka; okno bez opakování; bazén 1 a 2 komb; prázdný
  bazén; mezery pro všechna tempa; hlídání konce kola nikdy nepřetáhne; časová osa
  (hranice fází, celková délka); každá událost právě jednou i při velkém skoku času;
  text řeči; obranné čtení úložiště; přeskočení fáze pustí jen události na hranici; žádné
  kombo nepřetáhne do finiše; začátek a konec finiše; „Znovu" ≈ 25 % a nikdy víc než 2× po
  sobě; tempo stupňované po kolech; plán (všechny kombinace odpovědí): počet tréninků a dny,
  limity, čas ≤ zvoleným minutám, progrese po týdnech jen jedním krokem, střídání cílů, tabulky
  zkušenosti a cílů; bazén Obrany; obranné čtení `plan`.
- `npm run build` (tsc + vite) a `npm run lint` čisté.
- **Prohlížeč** (chrome-devtools, viewport iPhone 15 Pro 393 × 852, DPR 3, simulované
  safe-area 59/34 px): projet trénink 1 kolo × 1 min, žádné chyby v konzoli, hlášení
  běží, všechny obrazovky se vejdou a odpovídají předlohám (kap. 9) — porovnání vedle sebe
  se screenshoty vykreslených předloh 390 × 844.

**Na telefonu (uživatel):**
1. Safari → URL → Sdílet → Přidat na plochu → otevřít z plochy.
2. Nastavení → Hlas trenéra → poslechnout Harry / Charlie / Adam / Antonín, jeden vybrat.
3. Trénink 1 × 1:00: „Připrav se", pípání 3-2-1, gong, komba, v 0:10 klepnutí + „Naplno!"
   a do gongu žádné kombo, 3× gong; Hotovo ukáže počet komb a úderů a „celkem 1:00".
   Během tréninku občas „Again!" bez čísel.
   Trénink 3 × 1:00 s Rostoucí: kolo 1 znatelně volnější mezery než kolo 3.
9. Po aktualizaci první otevření z plochy: 1-2-3 → úvod → Sestavit můj plán (gong) → 3 otázky
   → Tvůj plán → Domů ukazuje „Dnes · …" / „Na řadě · …". Trénink doběhnout → „1/N" v menu.
4. S hudbou ze Spotify na obvyklou hlasitost: hudba se **neztiší** (R3 — web to neumí), hlas
   ji musí přehlušit sám. Ověřit, že jsou čísla slyšet od pytle během úderů. Když ne →
   nahlásit (řešení: hlasitější klipy / tvrdší kompresor, jinak ztlumit hudbu).
5. Tichý režim: s vypnutým přepínačem (R7) zjistit, jestli je slyšet; se zapnutým musí být
   (a hudba se zastaví).
6. 15 min tréninku: displej nezhasne.
7. Zamknout telefon uprostřed kola → po odemčení je trénink na pauze.
8. Režim letadlo → appka z plochy naběhne.

## 14. Postup stavby

1. Kostra projektu (stack podle denni-check) → `npm run build` projde.
2. Data + engine + testy → `npm test` zelené.
3. Zvuk a hlas → v prohlížeči bez chyb.
4. Obrazovky → screenshoty 393 × 852.
5. PWA (manifest, ikony, service worker) → build obsahuje `sw.js` a manifest.
6. Deploy na Vercel → URL vrací 200, manifest a SW se servírují.
7. README (instalace, ovládání) + předání.
8. **v2:** přestavba obrazovek podle návrhu (kap. 9–10), přeskočení, první kombo
   dopředu, automatická pauza jako přepínač, názvy vlastních komb, R14 → testy, build,
   screenshoty všech obrazovek, deploy.
9. **v3:** hlas jako klipy (Antonín) místo `speechSynthesis`, vršek fotky do černé, pozadí
   `#000` → testy, build, kontrola v prohlížeči (klipy se dekódují a hrají ve správném
   pořadí), deploy.
10. **v4:** vzhled podle předloh (kap. 9–10): tokeny, Archivo, komponenty, 8 obrazovek +
    Hotovo, dialog a editory; runner hlásí aktuální úder a další kombo; stavová lišta
    `default` + `theme-color` → testy, build, vedle sebe screenshoty předloh a appky
    (390 × 844), deploy, uživatel přeinstaluje ikonu.
11. **v5:** úderné anglické hlasy (ElevenLabs) + výběr hlasu v Nastavení → kontrola klipů
    přepisem, testy, build, deploy.
12. **v6:** git repozitář; finiš (7.8) + počty na Hotovo; klip `naplno` pro 4 hlasy (kontrola
    přepisem); oprava dokumentace a README podle skutečnosti → testy, build, kontrola
    v prohlížeči, deploy.
13. **v7:** „Znovu" (7.9) + klip `znovu` pro 4 hlasy; stupňované tempo (7.10); celkem = čas
    v kolech; „Poslední kolo" po gongu → testy, build, kontrola v prohlížeči, deploy.
14. **v8:** research (konkurence, progrese zátěže, délka dotazníku) → plán `buildPlan` + testy →
    úvod (3 varianty), dotazník, Plán, karta plánu na Domů → screenshoty, deploy; uživatel
    vybere variantu úvodu, ostatní se smažou.
15. **v9:** předlohy do `design/onboarding/` → plán z nových odpovědí (7.11) + testy → úvod
    (1-2-3 + Uvod.html), 3 otázky, Tvůj plán → vykreslené předlohy vedle appky 390 × 844,
    deploy.

## 15. Marketing (uživatel 10. 10. 2026: „kompletní materiály na FB post a IG story")

- **Sada:** FB post 1080 × 1350 (4:5, feed na mobilu; vyšší formát feed ořízne) + text
  příspěvku; IG story 3 snímky 1080 × 1920 (háček → jak to funguje → výzva s odkazem) +
  texty nálepek. Bezpečná zóna story: nahoře 250 px (profil, ukazatel), dole 340 px
  (odpověď) — důležité jen v pásu y 250–1580.
- **Vzhled = appka:** papír / ink / kobaltová `#2C3BFF`, Archivo (šířka 125 %, váha 850–900,
  verzálky, řádkování 0,92), ploché barvy, žádné přechody, stíny, fotky ani emoji. Ikona
  z `design/ikona/icon.svg`. Telefon = jednoduchý rám s Dynamic Island a skutečnými
  screenshoty appky (stav ukazuje zamýšlený vzhled, lišta v barvě obrazovky).
- **Texty:** česky, krátce, konkrétně, jako od trenéra z boxerny — žádné „posuň se na další
  level", „odemkni potenciál", řečnické otázky ani emoji (uživatel: „zní moc AI").
  Jen pravdivá tvrzení: zdarma, bez registrace, offline po prvním načtení, 50 komb,
  obrana, vlastní komba, uložené tréninky, gong a pauzy, 4 hlasy. Odkaz
  `direkt-indol.vercel.app`, na iPhonu Safari → Sdílet → Přidat na plochu.
- **Zdroje** v `marketing/` (HTML + `brand.css`, screenshoty v `marketing/shots/`),
  vykreslení přes Chrome v přesném rozměru; hotové PNG + `texty.txt` na plochu do
  `~/Desktop/DIREKT-marketing/`.
