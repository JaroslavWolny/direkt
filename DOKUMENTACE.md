# DIREKT — dokumentace (specifikace)

Osobní trenér na boxovací pytel. Telefon leží u pytle, hlas během kola hlásí komba
**čísly** („jedna, dva, tři na tělo, úklon"), gong začíná a končí kola, mezi koly běží pauza.
Jen box. Stavíme pro **iPhone 15 Pro** jako web appku přidanou na plochu.

Tahle dokumentace je smlouva: stavba se drží jí. Co tu není, se nestaví. Změna plánu =
nejdřív úprava tohohle souboru, pak kód.

Stav: v13 (sdílení výsledku z Hotovo 9.10, kolo bez tlačítka Konec 9.2), 13. 10. 2026.

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
- **v11** (uživatel, 11. 10. 2026: „přidělej tam i EN možnost kompletně"): **celé rozhraní i
  anglicky** — úvod, dotazník, plán, všechny obrazovky, názvy komb, zkratky, vestavěné tréninky.
  Jazyk rozhraní je volba nezávislá na hlasu; slova v kole dál v jazyce hlasu (9.2). Pravidla 9.8.
- **v12** (uživatel, 11. 10. 2026: „ta čeština je úplně všude správně? jsou tam opravdu názvy, jaké
  se používají v boxu v tréninku trenéry?"): čeština podle české boxerské terminologie (kap. 5,
  9.9). Uživatel vybral názvy komb **„Direkt – Zadní direkt – Hák"** místo „Jab – Cross – Hák"
  z návrhu a **„kombinace"** místo „kombo" ve všech textech appky. Obrana = **povely, jaké trenér
  zařve na lapech** („chci názvy, co by řval trenér na lapech"): uživatel vybral **„Dolů!"** (ponor),
  **„Vzad!"** a **„Stranou!"** (úkrok); úklon, záklon a kryt zůstávají.
- **v13** (uživatel, 13. 10. 2026, z rad k vylepšení): v kole **jen jedno ukončení** — tlačítko
  Konec dole pryč, končí se × nahoře (9.2); obří číslo na Hotovo **přetéká okraj schválně**;
  **sdílení výsledku z Hotovo** jako obrázek do IG story (9.10). Nic se dál neukládá.

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
| R5 | Wake Lock v appce na ploše funguje od iOS 18.4. Po odchodu z appky se uvolní. | Žádat při startu (neawaitovat), znovu při návratu do popředí, pustit na konci. Při selhání hláška „Nastavení → Zobrazení a jas → Uzamčení → Nikdy" (české názvy v iOS, 9.9). | [WebKit 254545](https://bugs.webkit.org/show_bug.cgi?id=254545), [progressier](https://progressier.com/pwa-capabilities/screen-wake-lock) |
| R6 | Na pozadí / se zamčeným displejem jsou časovače a řeč nespolehlivé. | `visibilitychange → hidden` = **automatická pauza**. | AveReiDev/strikr SPEC |
| R7 | Tichý režim ztlumí WebAudio (výchozí session je „ambient"). Řeč podle hlášení vývojářů taky. `navigator.audioSession.type = 'playback'` (iOS 17+) hraje i v tichém režimu, ale je exkluzivní — zastaví hudbu. | Přepínač v Nastavení **„Hrát i v tichém režimu"** (vypne hudbu z telefonu), výchozí vypnuto. **Ověřit na telefonu.** | [WebKit 237322](https://bugs.webkit.org/show_bug.cgi?id=237322), [WebKit 251532](https://bugs.webkit.org/show_bug.cgi?id=251532), [MDN AudioSession.type](https://developer.mozilla.org/docs/Web/API/AudioSession/type) |
| R8 | iPhone má česky jen ženský hlas **Zuzana**; český mužský hlas Apple nenabízí. Proč na iPhonu nehrálo Vyzkoušet hlas, nevím jistě (tichý režim, nebo rozmar `speechSynthesis`). | Hlas = **nahrané klipy** přes Web Audio (kap. 8), žádné `speechSynthesis`; u tlačítka nápověda k tichému režimu. | `say -v '?'` na Macu |
| R9 | iOS Safari nemá `navigator.vibrate`. Trik se skrytým `<input type="checkbox" switch>` Apple podle všeho v iOS 26.5 zavřel. | **Bez haptiky.** | [iOS haptics tester](https://rapidtoolset.com/en/tool/ios-haptics-tester) |
| R10 | Konec klipu je přesně známý z délky bufferu (žádné nespolehlivé `onend` řeči). | Konec hlášení = součet délek klipů + mezery; plánuje se na hodinách `AudioContext`. | — |
| R11 | V režimu „na ploše" `100dvh` lže; `black-translucent` zkracuje výšku a na iOS 26 rozmazává horních ~110 px. Styl `default` dá neprůhlednou lištu. **Za běhu ji iOS 27 přebarví jen podle fixního prvku u horního okraje, který není přes celou obrazovku** (test na zařízení uživatele 11. 10. 2026, iOS 27: nová/přepsaná `theme-color` meta, barva v `rgb()`, pozadí `html`/`body`, `pushState` ani posun stránky nic; fixní pruh 140 px nahoře ano; fixní rám přes celou obrazovku ne a lišta si nechá poslední zachycenou barvu). `theme-color` + pozadí `html`/`body` určují barvu při spuštění. | Rám `position: fixed; inset: 0`, safe-area přes `env()` v `--sat`/`--sab`, lišta `default`. Každá `.screen` má první potomek `.screen-edge`: fixní pruh 140 px u horního okraje, `background: inherit` (barva obrazovky), `z-index: -1` → leží pod obsahem, nic nepřekryje, a protože horních 20 px obrazovky je prázdných, iOS u okraje trefí právě jeho. `useThemeColor` dál nastavuje `theme-color` + pozadí `html`/`body` (barva při spuštění, Android). Změna stylu lišty platí až po přeinstalaci ikony. | denni-check, [herdr-web-ui #199](https://github.com/devswha/herdr-web-ui/pull/199), [volleybro #427](https://github.com/andrewck24/volleybro/pull/427), [1ar.io: Safari 26](https://1ar.io/updates/safari-26-liquid-glass-web/), [deadhead #191](https://github.com/cevdetta/deadhead/issues/191), [cluckwork #974](https://github.com/mforce/cluckwork/issues/974) |
| R12 | Network-first načítání `index.html` dokázalo v gymu bez signálu viset 30–60 s. | Navigace se obsluhují **z precache** (cache-first). | AveReiDev/strikr PROJECT-STATUS |
| R13 | Hlášení jsou čísla. | Odpočty se **nikdy nevyslovují čísly** (pletly by se s komby) — jen pípají. | vlastní úvaha |
| R14 | `vite-plugin-pwa` v režimu `autoUpdate` po aktivaci nové verze volá `location.reload()` (ověřeno v `register.js`); háček `onNeedReload` ho nahradí. | Když běží trénink, reload se **odloží na jeho konec**; jinak proběhne hned. | `node_modules/vite-plugin-pwa/dist/client/build/register.js` |
| R15 | Šířku písma (`fontStretch`) v canvasu WebKit správně neumí (otevřená chyba z 5/2024); u proměnného písma tak na iPhonu hrozí obyčejná šířka místo 125 %. | Obrázek ke sdílení kreslí **statickými řezy** Archiva (šířka a váha zapečené ve fontu, 9.10), ne proměnným písmem. | [WebKit 274147](https://bugs.webkit.org/show_bug.cgi?id=274147), [MDN fontStretch](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fontStretch) |
| R16 | `navigator.share()` musí přijít z ťuknutí; Safari po delší asynchronní práci ťuknutí „zapomene" a sdílení odmítne. Po „Uložit obrázek" iOS slib občas nikdy nevyřeší; v iOS 16.2+ se hlásilo, že „Uložit obrázek" v listu chybí. | Obrázek se vyrobí **předem**, hned po zobrazení Hotovo; ťuk už jen sdílí. Sdílí se **jen soubor** (bez textu a odkazu — adresa je v obrázku). Výsledek slibu se ignoruje. Bez Web Share se obrázek stáhne. | [WebKit 231995](https://bugs.webkit.org/show_bug.cgi?id=231995), [WebKit 255544](https://bugs.webkit.org/show_bug.cgi?id=255544), [Apple forum](https://developer.apple.com/forums/thread/729782) |
| R17 | WebKit v `measureText()` hlásí `actualBoundingBoxLeft` / `Right` jen jako přesah kresby za okraj znaku — když kresba začíná až za počátkem, vrací 0 (Chrome vrací skutečný odstup). Na iPhonu tak „HOTOVO." na obrázku začínalo o 12 px vpravo od okraje mřížky (fotka z telefonu uživatele 13. 10. 2026). Svislé míry (`actualBoundingBoxAscent`) sedí. | Vodorovné okraje kresby se **měří z pixelů** na zkušebním plátně (200 px, výsledek se pamatuje); ověřeno v Safari 26.5.2 a Chromu — okraje shodně na 80 px. | měření obrázku z iPhonu proti Chromu |

## 5. Boxerské číslování a obrana

Postoj je jedno — mluví se o **přední** a **zadní** ruce (česká terminologie: „přední/zadní ruka",
„přední/zadní úder"; levý/pravý jen u konkrétního střehu).

| Kód | Úder (česky podle učebnic) | Název v kombinaci (9.3) | Vyslovuje se |
|---|---|---|---|
| `1` | přední direkt (přímý úder přední rukou; angl. jab) | Direkt | „jedna" |
| `2` | zadní direkt (angl. cross) | Zadní direkt | „dva" |
| `3` | přední hák (boční úder pokrčenou paží) | Hák | „tři" |
| `4` | zadní hák | Zadní hák | „čtyři" |
| `5` | přední zvedák (spodní úder zespodu nahoru) | Zvedák | „pět" |
| `6` | zadní zvedák | Zadní zvedák | „šest" |
| `3t` | úder na tělo (přípona `t`, v angl. literatuře `b`) | Hák na tělo | „tři na tělo" |

- **Názvy v kombinaci (v12):** přední úder bez přívlastku, zadní s „Zadní" — jako „Hák" / „Zadní
  hák" v předlohách. „Jab" a „Cross" z návrhu pryč: české učebnice je nepoužívají a **„kros" je
  v české terminologii jiný úder** (křižný, přes ruku soupeře), ne zadní direkt.
- **Na tělo:** učebnice píšou „na trup" i „na tělo"; na tréninku se říká „na tělo" → appka „na tělo".

Obrana: technika podle Klouda 2008 a učebních opor MUNI, ale appka všude používá **povel, který
trenér zařve na lapech** (v12, vybral uživatel) — stejné slovo hlas, slova v kole, název kombinace
i čip; legenda u povelu, který se liší od názvu techniky, ho v závorce vysvětlí:

| Kód | Technika (učebnice) | Povel = na displeji | Čip | Vyslovuje se |
|---|---|---|---|---|
| `uklon` | úklon — úhyb trupem do strany (slip) | ÚKLON | Ú | „úklon" |
| `zaklon` | záklon — úhyb vzad (pull back) | ZÁKLON | Z | „záklon" |
| `ponor` | ponor / ponoření pod úder (ducking, roll) | DOLŮ | D | „dolů" |
| `kryt` | kryt / krytí, blok | KRYT | K | „kryt" |
| `vzad` | únik vzad | VZAD | V | „vzad" |
| `ukrok` | úkrok stranou (side step) | STRANOU | S | „stranou" |

- **Proč povely:** sepsané české povely z lap jsem nenašel — učebnice znají jen názvy technik a
  české články píšou anglicky „slip", „roll". Učebnicové „Ponor!" nebo „Úkrok!" by na lapech nikdo
  nekřičel; dřívější „Ponoř!" bylo navíc chybně (sloveso je zvratné, „ponořit se").
  Interní kódy (`ponor`, `ukrok`) zůstávají kvůli uloženým vlastním kombinacím.

Slova se mění na jednom místě (`src/data/moves.ts`).

Zdroje: [Evolve — číslování](https://evolve-mma.com/blog/boxing-fundamentals-understanding-the-boxing-punch-number-system/),
[straight2boxing](https://straight2boxing.com/2018/01/17/punch-numbering-system-in-boxing),
[Klouda: Metodika základních úderů a obran v boxu (2008)](https://dspace.cuni.cz/handle/20.500.11956/15675)
(terminologie s. 16: hák, zvedák, přímý úder, kros = „úder vedený přes ruku soupeře", ponoření,
úhyb = úklon nebo záklon, únik, blokování, srážení; „kombinace úderů", „série úderů"),
[MUNI — terminologie boxu](https://www.fsps.muni.cz/inovace-SEBS-ASEBS/elearning/box/terminologie),
[MUNI — přímé údery](https://www.fsps.muni.cz/inovace-SEBS-ASEBS/elearning/box/technicke-prostredky/udery/prime)
(„přední direkt", „zadní direkt", „na tělo"), [MUNI — obrany](https://www.fsps.muni.cz/inovace-SEBS-ASEBS/elearning/box/technicke-prostredky/obrany)
(„ponor (ducking)", blok, úhyb, únik). Číslování komb (1–2, 1–2–3) používají i české články o boxu
([Hop-Sport](https://hop-sport.cz/blog/jak-boxovat-do-pytle-technika-trenink-a-vyber-spravneho-boxovaciho-pytle),
[Senteso](https://www.senteso.cz/a/boxersky-trenink-doma-bez-vybaveni-kompletni-pruvodce)).

## 6. Vestavěná komba

Tři úrovně. Úroveň určuje, **z jakých komb** se losuje; tempo (kap. 7.2) určuje, **jak rychle**.

**Pravidlo (v14, uživatel 17. 10. 2026: „najdi si kombinace úderů, které opravdu trenéři
dělají"):** každá vestavěná kombinace je doslova od jmenovaného trenéra nebo trenérské školy.
Co žádný trenér neuvádí, v appce není.

| Značka | Trenér | Zdroj |
|---|---|---|
| **[U x.y]** | **Yodsanan Sityodtong** (mistr světa WBA, hlavní trenér boxu Evolve); lekce 1.20, 2.20, 3.19 a 3.20 **Saenghirun Lookbanyai** (mistr světa v boxu) | Evolve University, videolekce „Level x: Combination y" a „Block And Cross / Block And Left Hook" — přesná sekvence je v popisu lekce, např. [Level 1: Combination 8](https://evolve-university.com/library/boxing/beginner/video-level-1-combination-8/), přehled [beginner](https://evolve-university.com/library/boxing/beginner/), [intermediate](https://evolve-university.com/library/boxing/intermediate/), [advanced](https://evolve-university.com/library/boxing/advanced/) |
| **[F]** | **Drian Francisco** (mistr světa WBA, trenér Evolve MMA) | [15 Basic Boxing Combinations](https://evolve-mma.com/blog/15-basic-boxing-combinations-you-should-master-first/) |
| **[E]** | Evolve University (škola mistrů světa; článek bez podpisu) | [19 Advanced Boxing Combinations](https://evolve-university.com/blog/19-advanced-boxing-combinations-to-elevate-your-game/) |
| **[M]** | Evolve MMA (redakce) | [5 Basic Combinations](https://evolve-mma.com/blog/the-5-basic-yet-effective-combinations-all-boxers-need-to-know/), [Slip And Rip](https://evolve-mma.com/blog/boxing-101-slip-and-rip/) (po úklonu ven zadní direkt) |
| **[J]** | **Johnny Nguyen** (ExpertBoxing) | [Johnny's Punching Combinations](https://expertboxing.com/johnnys-punching-combinations) (sekce Common, Starters, Tricky Starters, Power/Evasive Enders, Advanced, In-Fighting, Evasive Combos), [7 Basic Boxing Combinations](https://expertboxing.com/7-basic-boxing-combinations) |
| **[D]** | **Tommy Duquette** (reprezentant USA, trenér s licencí USA Boxing; FightCamp) | [What Is a Roll in Boxing](https://blog.joinfightcamp.com/training/what-is-a-roll-in-boxing-boxing-defense-101/) |

- **Převod zápisu trenérů na povely appky (kap. 5):** slip vlevo/vpravo → úklon; duck, roll,
  weave → ponor („Dolů"); block → kryt („left block, right block" = 2× kryt); lean back →
  záklon; back step (Johnny „bs") → vzad; pivot, step left/right (Johnny „p", „rs") → úkrok
  („Stranou"). Stranu úhybu appka nerozlišuje. U Johnnyho „/1/" = úklon před soupeřovým
  direktem, „{3}" = ponor pod hák; „b" = na tělo (v appce `t`).
- **Vynecháno:** finty a „tap" (Johnny „f", „t"), overhand a shovel hook (nevejdou se do
  číslování), „body shot" bez určení ruky (EU 2.13, 2.21, 4.6, 4.7), sekvence nad 8 akcí
  (limit appky, 9.4), série „block ×4", seznamy pro boj proti opačnému střehu a Roachovo
  „1-3-5" pro Pacquiaa (primární článek nešel otevřít, nepřebírám z druhé ruky).
- **Úroveň:** kombinace z v1 si ji nechávají. Nové: ze základních seznamů (Johnny Common,
  Starters a 7 basic, Francisco 15 basic, Evolve MMA 5 basic, Block And…) podle délky —
  1–3 akce Začátečník, 4–5 Pokročilý, 6–8 Expert; z ostatních sekcí (Johnny Tricky Starters,
  Enders, Advanced, In-Fighting, Evasive; EU Level 3–4) aspoň Pokročilý.
- **v14 vyřazeno** 22 kombinací bez trenérského zdroje: z08 z11 z12 z13 z15 p02 p07 p08 p10
  p12–p18 e12–e17. Mezi nimi všechna komba jen ze **Sting Sports** (článek bez trenéra —
  autor bez uvedené praxe); co Sting uváděl a má i trenér, zůstalo se značkou trenéra.
- **id se nikdy znovu nepoužije:** vypnutá komba se ukládají podle id (kap. 11), staré id by
  vypnulo cizí kombinaci. Nová id pokračují za nejvyšším (z16, p19, e18 …).
- Zdroj se v appce neukazuje — jen tady a v komentáři `src/data/combos.ts`.

**Začátečník** (23)

| id | kombinace | | id | kombinace |
|---|---|---|---|---|
| z01 | 1 [J] | | z18 | 1t 2 [M][J] |
| z02 | 1 1 [J] | | z19 | 1 4 [F][M] |
| z03 | 1 2 [J][F] | | z20 | 5 2 [F] |
| z04 | 1 1 2 [J][F] | | z21 | 5 2 3 [F] |
| z05 | 1 2 1 [J][F] | | z22 | 6 3 [F][J] |
| z06 | 1 2 3 [J][F] | | z23 | 1 2 5 [F] |
| z07 | 2 3 [F] | | z24 | 6 5 3 [F] |
| z09 | 1 2 1 2 [J] | | z25 | 3 4 2 [F] |
| z10 | 2 3 2 [J][F] | | z26 | 2 3 6 [F] |
| z14 | úklon 2 [M] | | z27 | kryt 2 [U Block And Cross] |
| z16 | 1 6t [J] | | z28 | kryt 3 [U Block And Left Hook] |
| z17 | 2 1 [J] | | | |

**Pokročilý** (36)

| id | kombinace | | id | kombinace |
|---|---|---|---|---|
| p01 | 1 2 3 2 [J][E] | | p30 | 4t úkrok [J] |
| p03 | 1 6 3 [F] | | p31 | 1t vzad [J] |
| p04 | 1 6 3 2 [J] | | p32 | 1 vzad 1 [J] |
| p05 | 1 2 5 2 [J][E] | | p33 | 1 vzad 1 2 [J] |
| p06 | 1 2 3t [E] | | p34 | 4t 6 3 2 [J] |
| p09 | 3t 3 [E] | | p35 | 6 3 úkrok [J] |
| p11 | 1 2 úklon 2 [J] | | p36 | úkrok 5 [J] |
| p19 | 1 3 2 [J] | | p37 | 4t 3t 2 1 2 [J] |
| p20 | 1 2t [J] | | p38 | 1 4t 3t 6 1 [J] |
| p21 | 1 2t 3 [J] | | p39 | 6 5 2 1 úkrok [J] |
| p22 | 4 1t [J] | | p40 | 1 2 ponor 2 [J] |
| p23 | 2 2 [J] | | p41 | 1 úklon 2 1 1 [J] |
| p24 | 6 2 [J] | | p42 | 1 úklon 2 3 2 [J] |
| p25 | vzad 2 [J] | | p43 | úklon 2 3 2 [U 1.1] |
| p26 | 1 úkrok [J] | | p44 | 2 úklon 2 3 ponor [U 1.13] |
| p27 | 1 úkrok 2 [J] | | p45 | úklon úklon 2 3 2 [U 1.19] |
| p28 | 2 úkrok 2 [J] | | p46 | 2 záklon 2 3 2 [U 1.24] |
| p29 | 3 úkrok [J] | | p47 | úklon 6t 5t 5 3 [U 3.19] |

**Expert** (46)

| id | kombinace | | id | kombinace |
|---|---|---|---|---|
| e01 | 1 1 2 3 2 [E] | | e30 | 1 2 3 ponor 5 ponor 6 ponor [U 1.4] |
| e02 | 3 2 3t [E] | | e31 | 1 2 5 2 3 ponor 3 [U 2.1] |
| e03 | 2 3 2 ponor 2 [E] | | e32 | 2 5 ponor 2 5t 3 2 [U 2.10] |
| e04 | 6 3 3t [E] | | e33 | 1 1 1 6 ponor 2 [U 2.12] |
| e05 | 3 2 3 3t [E] | | e34 | 1 2 3 kryt kryt 6 3 ponor [U 2.17] |
| e06 | 1 2 3 ponor 3 [E] | | e35 | 1 2 úkrok 5t úkrok 2 3 [U 2.18] |
| e07 | 5 4 3t [E] | | e36 | 1 2 kryt ponor 3 2 [U 2.20] |
| e08 | 2 3t úkrok 3 [E] | | e37 | úklon 5 5 ponor 2 5t [U 2.3] |
| e09 | 1 6t 6 [E] | | e38 | 2 kryt kryt ponor 2 3 ponor 6t [U 2.6] |
| e10 | 1 2 3 úklon 3t [E] | | e39 | úklon úklon 5 ponor 2 3 ponor [U 2.8] |
| e11 | 1 2 úklon 2 3 2 [J] | | e40 | 2 úklon 2 3 úklon 5t 3 2 [U 2.9] |
| e18 | 1 2 3t úkrok 4t 4 1 [J] | | e41 | 2 ponor 2 3 ponor 5 [U 3.1] |
| e19 | 1 2 ponor úklon 3 2 [J] | | e42 | 1 2 6t ponor 3 2 [U 3.2] |
| e20 | 1 2 ponor 3 2 3 [J] | | e43 | 1 2 úklon 6t ponor 3 2 [U 3.12] |
| e21 | 1 2 3 ponor 3 2 [J] | | e44 | 1 1 2 kryt kryt 3 2 [U 3.13] |
| e22 | 2 3 ponor 3 2 ponor [D] | | e45 | 2 ponor 2 3 ponor 6 [U 3.17] |
| e23 | 6 ponor 2 5 ponor 3 [U 1.10] | | e46 | 1 1 1 úklon 2 úklon 2 3 [U 3.18] |
| e24 | 5t 5 3 ponor 2 ponor [U 1.11] | | e47 | 1 5 3 úklon úklon 2 3 [U 3.20] |
| e25 | 6 6 2 3 2 ponor 3 2 [U 1.17] | | e48 | 5 5 5t 3 2 úkrok 6t [U 3.4] |
| e26 | 5t 6t úklon 2 úklon 3 2 [U 1.18] | | e49 | 2 5t 5t 5 2 3 [U 3.5] |
| e27 | 5 6 5 6 ponor 3 [U 1.2] | | e50 | 5t 5t ponor 2 3 ponor 5t [U 3.7] |
| e28 | 1 úklon 2 3 2 5t [U 1.20] | | e51 | 1 2 5 ponor 3 2 ponor [U 3.8] |
| e29 | 1 2 úklon úklon ponor ponor [U 1.3] | | e52 | 1 2 5 ponor 3 ponor 2 3 [U 4.8] |

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
5. Prázdný bazén → START nejde zmáčknout, hláška „Zapni aspoň jednu kombinaci".
6. Náhoda přes seedovatelný generátor (mulberry32) → testy jsou deterministické.

### 7.2 Načasování hlášení

- **Mezera** (od konce řeči do dalšího hlášení) = `základ[tempo] + čas na úder × počet akcí`.
  Akce = každý úder i obranný pohyb. Tempo = zvolená intenzita, u stupňované tempo
  aktuálního kola (7.10).
- `základ`: **Lehké 2800 ms, Střední 1800 ms, Tvrdé 800 ms.** (Doladěné na pytli —
  AveReiDev/strikr PROJECT-STATUS.)
- **Čas na úder** (v14, uživatel 17. 10. 2026: „app dává dlouhý čas na tu kombinaci, chci to
  svižnější… možnost volby v nastavení"): volba v Nastavení (9.6) **0,3 / 0,4 / 0,5 / 0,6 /
  0,7 s**, **výchozí 0,5 s**, stejný pro všechna tempa. Dřív pevně 0,7 s (STRIKR) — s dlouhými
  kombinacemi trenérů (kap. 6) to dělalo u 8 akcí 5,6 s čekání navíc. Měření: závodní boxeři
  dali 4 údery střídavě od 1. do 4. zásahu za 1,06 ± 0,46 s (≈ 0,35 s na úder), stejnou rukou
  za 1,35 s; samotný přímý úder od pohybu po zásah 0,36 s, hák 0,48 s
  ([Piorkowski et al. 2011, Sports Biomechanics](https://clok.uclan.ac.uk/3757/1/piorkowski-et-al-2011-punch-kinematics.pdf)).
  0,3 s = závodník naplno, 0,5 s = svižně s rezervou na techniku, 0,7 s = původní chování.
- **Délka hlášení** = součet délek klipů (bez ticha na krajích) + 70 ms mezi slovy. Než se
  klipy načtou, odhad 450 ms na klip.
- **Konec kola:** kombo se nespustí, pokud do začátku finiše (7.8; kolo bez finiše = do
  konce kola) zbývá méně než `délka hlášení + čas na úder × akcí`. Radši ticho než useknuté kombo.
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
- Věta shrnutí: „Pro {začátečníka / mírně pokročilého / pokročilého / závodníka} se zaměřením na {cíle ve
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
  „Úklon!" / „Slip!", „Záklon!" / „Pull!", „Dolů!" / „Roll!", „Kryt!" / „Block!", „Vzad!" /
  „Back!", „Stranou!" / „Pivot!"; hlášky `pripravse` „Připrav se!" / „Get ready!", `posledni`
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
  text „Trenér ti hlásí kombinace, hlídá kola i pauzy. Ty se soustředíš jen na údery.", bílá
  pilulka **Sestavit můj plán →** (v gestu zazní gong) a odkaz **Přeskočit, chci rovnou
  trénovat** (→ Domů bez plánu). Pod ním přepínač jazyka (9.8): v češtině odkaz „English",
  v angličtině „Čeština" — přepne hned, úvod zůstane (bez nové animace).
- **Otázky** (paper): zpět + „1 ze 3" uprostřed, RoundProgress 3 segmenty, nadpis 34 px,
  podtitul 15 px muted, dole PrimaryButton aktivní až po výběru. Předvyplněno minulými
  odpověďmi (Upravit odpovědi).
  1. **Jak dlouho boxuješ?** „Podle toho nastavím tempo a kombinace." — jedna ze 4: Začínám / Pár
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
  zašedlá a „Zapni aspoň jednu kombinaci".
- Menu (řádky s oddělovačem): **Plán** · „5/12" (bez plánu „—", ťuk → dotazník bez úvodu),
  Kombinace · počet, Vlastní kombinace · počet, Uložené tréninky · počet.
- **Běží plán** (nesplněný): karta ukazuje trénink na řadě — nahoře „Dnes · pondělí" (nebo
  „Na řadě · středa", 7.11) a délka, název tréninku („Kondice"), meta a RoundBar; START ho
  spustí.

### 9.2 Trénink běží
- **Odpočet** (`Odpocet.html`, paper): „PŘIPRAV SE" + „Název · kolo 1 ze N"; obří číslo
  zbývajících sekund v akcentu (1 číslice 520 px, 2 číslice zmenšit na šířku); dole
  RoundProgress (první segment ink), „První kombinace" + sekvence (kap. 7.6) a pilulka
  **Přeskočit**. Navíc oproti předloze: × vpravo nahoře (ukončit) a při pauze pilulka
  „Pokračovat".
- **Kolo** (`Trenink.html`, celé v akcentu, bílý text): × (dialog „Ukončit trénink?"),
  „Kolo 1 ze 3", vpravo tlačítko **nastavení tréninku** = panel s Intenzitou (platí od
  dalšího komba); RoundProgress (aktuální kolo se plní); „Zbývá" / „Pozastaveno" + čas
  128 px `m:ss`; „Kombinace" + „Úder k z/ze N" (jen údery, obrana se nepočítá — v12); sekvence slovy 34 px (čísla číslem, „3 TĚLO",
  „ÚKLON"; u anglického hlasu „3 BODY", „SLIP" — slova = přepis hlášky, v jazyce hlasu):
  odehrané průhlednost 0,45, **aktuální = bílá pilulka s akcentovým textem**,
  další bílé. Aktuální úder = ten, který hlas právě říká (časy klipů jsou přesné). Po
  dohlášení celá sekvence bíle a vpravo „N úderů". Řádek s reproduktorem a
  „„Jedna, dva, tři na tělo!"" / „„One, two, three body!"". Čipy v odpočtu a pauze
  („3T", „Ú") zůstávají zápisem appky (legenda v Kombech). Dole pauza/pokračovat (bílý kruh 84 px)
  uprostřed a vpravo od ní Další kolo (= přeskočit zbytek kola, 7.5); levá třetina řady zůstává
  prázdná. **v13:** tlačítko Konec z předlohy pryč — dělalo totéž co × nahoře (dialog). Další kolo
  je vpravo, protože ⏭ patří vpravo od ▶ (přehrávače) a na Pauze je přeskočení taky vpravo.
  **Znovu** (7.9): řádek „Znovu" / „N úderů", sekvence téhož komba celá bíle (bez zvýraznění
  úderu — hlas říká jen „Znovu"), bublina „„Znovu!"" / „„Again!"".
  Panel intenzity u Rostoucí ukáže pod volbou „Kolo 2: Střední" (tempo kola).
  **Finiš** (7.8): řádek „Finiš" / „Do gongu", místo sekvence „NAPLNO" / „ALL OUT" v bílé
  pilulce (styl aktuálního úderu), bublina „„Naplno!"" / „„All out!"".
- **Pauza** (`Pauza.html`, ink): ×, „Kolo 1 ze 3 hotovo", RoundProgress (hotová kola
  bílá); „PAUZA", „Další kolo za" / „Pozastaveno", čas 128 px, pruh 8 px plněný akcentem;
  karta **Další kombinace** (předem vylosované první kombo dalšího kola) s názvem a obrácenou
  sekvencí; kulaté pozastavení 60 px + bílá pilulka **Přeskočit pauzu**.
- **Hotovo** (není v předlohách, styl paper): „HOTOVO" a vpravo od něj kulaté tlačítko
  **Sdílet** (ikona sdílení z iOS, 9.10), obří počet kol v akcentu — **přetéká okraj displeje
  schválně** (uživatel 13. 10. 2026), neopravovat —,
  „kola · celkem m:ss" (čas v kolech: bez přípravy, pauz mezi koly, pozastavení a přeskočených
  částí kol), pod tím
  „42 kombinací · 156 úderů" (ohlášená komba a údery v nich bez obrany; finiš se nepočítá; nic
  se neukládá), u tréninku plánu ještě „Plán: 6 z 12 hotovo", PrimaryButton **Znovu** (stejný
  trénink) a pilulka **Domů**.
- **Dialog „Ukončit trénink?"**: bílá karta r28, Pokračovat / Ukončit.

### 9.3 Komba (`Komba.html`, paper)
- Zpět + **vyhledávání** (pole pod hlavičkou, filtruje podle názvu a čísel). „KOMBINACE" + počet.
- Filtrovací pilulky **Vše · Začátečník · Pokročilý · Expert · Obrana** (úrovně appky místo
  ukázkových „Základní / Pokročilé"; řádek smí vodorovně rolovat).
- Legenda: „1 direkt · 2 zadní direkt · 3 hák · 4 zadní hák · 5 zvedák · 6 zadní zvedák · T na tělo ·
  Ú úklon · Z záklon · D dolů (ponor) · K kryt · V vzad · S stranou (úkrok)" (kap. 5).
- Řádek: **název** (generovaný z úderů: „Direkt – Zadní direkt – Hák na tělo", kap. 5; vlastní kombinace má svůj),
  PunchSequence S (28 px: číslo = ink kolečko, úder na tělo „3T" a obrana = akcentová
  obrysová pilulka se zkratkou); vpravo délka `m:ss` (hlášení + mezera při aktuální
  intenzitě) a úroveň. Vypnuté kombo je zesvětlené.
- Ťuk na řádek → **detail** (panel): velká sekvence, název, úroveň, ▶ Poslechnout (hlas ho
  řekne), přepínač „Zařadit do tréninku" (dřívější zapnout/vypnout), u vlastního Smazat.

### 9.4 Vlastní komba (`VlastniKomba.html`, paper)
- Zpět, vpravo kulaté **+** (Sestavit kombinaci). Nadpis „VLASTNÍ / KOMBINACE" a hned za ním počet
  (jako u Komb). Řádek: název 17/600 + délka, pod tím
  PunchSequence M (34 px). Ťuk → detail (9.3). **Swipe doleva → Smazat.**
- Prázdný stav „Zatím žádná kombinace. Sestav první." **+** nahoře
  → editor ve stejném stylu: název, náhled sekvence, klávesy 1–6, T (přepne poslední úder
  na tělo), obrana (Ú Z D K V S), ⌫, úroveň, Uložit. Pravidla jako dřív (1–8 akcí,
  žádný duplikát).

### 9.5 Uložené tréninky (`Treninky.html`, paper)
- Zpět, vpravo kulaté **+** (Nový trénink). Nadpis „TRÉNINKY" a vedle počet (jako u Komb). Řádek: název, meta
  „3 kola · 2:00 / 1:00 · Začátečník", RoundBar (kolo ink, u úrovně Expert akcent; pauza
  hairline), vpravo celková délka v minutách (34 px + „min"),
  `kola × kolo + (kola − 1) × pauza` zaokrouhleno.
- **Ťuk na řádek = spustí trénink** (jako v předloze; START v gestu). Swipe doleva → Smazat.
- **+** nahoře → formulář: název, počet kol, délka kola, pauza, úroveň
  (předvyplněno aktuálním nastavením).
- **Vestavěné tréninky** (v10 rozšířeno ze 3 na 9; formáty z pravidel a trenérských webů,
  zdroje níže). Hodnoty musí sedět do LIMITS (kolo 1–10 min po 30 s, pauza 15 s–3 min):

  | Trénink | Kola | Kolo / pauza | Úroveň | Tempo | Proč |
  |---|---|---|---|---|---|
  | Rozcvička | 3 | 2:00 / 1:00 | Začátečník | Lehké | začátečnický formát 3 × 2 min (Boxing Insider, Gymdesk) |
  | Amatérský zápas | 3 | 3:00 / 1:00 | Pokročilý | Střední | amatéři elite/youth 3 × 3 min, pauza 1 min (IBA) |
  | Profi kola | 6 | 3:00 / 1:00 | Expert | Tvrdé | kratší profi zápas |
  | Technika | 4 | 3:00 / 1:00 | Pokročilý | Lehké | technická kola 4 × 3 min — drilovat, dokud je tělo čerstvé (Ross Boxing) |
  | Kondice | 5 | 3:00 / 1:00 | Pokročilý | Rostoucí | „The Grind" 5 × 3 min, poslední kolo naplno (Boxing Insider) |
  | Silové minuty | 10 | 1:00 / 1:00 | Pokročilý | Tvrdé | silová kola 60–90 s naplno, 10 × 1 min (Ross Boxing) |
  | Vypalovák | 8 | 3:00 / 0:30 | Expert | Tvrdé | „The Burner" 8 × 3 min s pauzou 30 s (Boxing Insider) |
  | Zápas o titul – ženy | 10 | 2:00 / 1:00 | Expert | Střední | titulový zápas žen 10 × 2 min (WBC) |
  | Zápas o titul – muži | 12 | 3:00 / 1:00 | Expert | Rostoucí | titulový zápas mužů 12 × 3 min |

  Kdo už má seznam uložený (appka ho zapíše při prvním spuštění), dostane nové tréninky
  **jednou na konec** podle `presetsVersion` (kap. 11); smazané vestavěné se nevrací.
  Zdroje: [IBA přes IABA](https://iaba.ie/rule-change-introduced-u22-championships/),
  [England Boxing](https://englandboxing.org/?p=1671),
  [Boxing Insider](https://boxinginsider.com/training/heavy-bag-workout-guide/),
  [Gymdesk](https://gymdesk.com/blog/heavy-bag-workout),
  [Ross Boxing](https://www.rossboxing.com/thegym/thegym24.htm),
  [The Ringer: WBC 10 × 2](https://www.theringer.com/2018/07/11/mma/women-boxing-wbc-round-length-restriction).

### 9.6 Nastavení (`Nastaveni.html`, paper, skupiny na bílých kartách r20)
- **Jazyk** (v11, první skupina): segmenty Čeština / English (jméno jazyka v něm samém);
  nadpis skupiny v aktuálním jazyce („Jazyk" / „Language"). Platí hned (9.8).
- **Hlas trenéra:** řádek pro každý hlas (jméno + „Angličtina · bojovník" apod.), ťuk na řádek
  = vybrat (kolečko vlevo), akcentové play vpravo = ukázka „One, two, three body, slip" v tom
  hlase. Poslední řádek „Nic neslyšíš?" rozbalí nápovědu k tichému režimu.
- **Intenzita:** segmenty Lehká / Střední / Tvrdá / Rostoucí (7.10).
- **Čas na úder** (v14, 7.2): segmenty 0,3 s · 0,4 s · 0,5 s · 0,6 s · 0,7 s (anglicky s tečkou),
  pod nimi poznámka „Na každý úder i pohyb obrany. Kratší = svižnější kombinace." Platí
  všude, i v plánu (je to rychlost boxera, ne parametr tréninku); délky kombinací v seznamech
  (9.3) se počítají s ním. V panelu v kole není.
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

### 9.8 Angličtina (v11)
- **Jazyk rozhraní** `settings.lang` = `cs` / `en`, nezávislý na hlasu. Slova v kole a bublina jsou
  dál přepis hlášky v jazyce hlasu (9.2) — anglický text s Antonínem ukáže „3 TĚLO", český s Harrym
  „3 BODY". Čipy, legenda, názvy komb a vše ostatní jsou v jazyce rozhraní.
- **První spuštění:** jazyk zařízení z `navigator.languages[0]` — `cs` a `sk` → čeština, jinak
  angličtina. **iOS appka na ploše jazyk někdy hlásí špatně** (vrací `en-GB`, i když je telefon
  německy — [Apple forum](https://developer.apple.com/forums/thread/775530)); pole `lang`
  v manifestu iOS nečte ([firt.dev](https://firt.dev/notes/pwa-ios/)). Proto **přepínač už na
  úvodu** (9.0) a v Nastavení (9.6). Kdo appku už měl (uložené nastavení bez `lang`) → čeština.
- **Kde jsou texty:** `src/i18n/cs.ts` a `en.ts` se stejným tvarem (TypeScript pohlídá, že
  angličtině nic nechybí), `src/i18n/index.ts` drží aktuální jazyk (`t()`, nastavuje ho App při
  každém vykreslení). Slova úderů a obrany dál jen v `src/data/moves.ts` (kap. 5), pro oba jazyky.
  `<html lang>` podle jazyka. Manifest a `meta description` zůstávají česky (iOS je nikde neukazuje).
- **Vestavěné tréninky** jsou v úložišti česky (kap. 11); zobrazují se přeložené podle `id`.
  Vlastní názvy (komba, tréninky, výchozí „Moje 3" / „My combo 3") se nepřekládají.
- **Angličtina** — terminologie boxu, číslování podle anglických zdrojů z kap. 5 (přípona `b` =
  body), zkratky obrany = první písmena slov, která říká hlas (kap. 8):

  | Česky | Anglicky |
  |---|---|
  | Údery 1–6 (název kombinace): Direkt · Zadní direkt · Hák · Zadní hák · Zvedák · Zadní zvedák | Jab · Cross · Hook · Rear hook · Uppercut · Rear uppercut |
  | Na tělo (čip „3T", slovo „3 TĚLO") | Body: čip „3B", slovo „3 BODY", v názvu „Body hook", „Rear body hook" |
  | Úklon Ú · Záklon Z · Dolů D · Kryt K · Vzad V · Stranou S | Slip S · Pull PL · Roll R · Block BL · Back BK · Pivot PV |
  | Začátečník / Pokročilý / Expert | Beginner / Intermediate / Expert |
  | Lehká / Střední / Tvrdá / Rostoucí | Easy / Medium / Hard / Rising |
  | Kolo · Pauza · Odpočet · Finiš / Do gongu | Round · Rest · Countdown · Finisher / To the bell |
  | Kombinace · Vlastní kombinace · Uložené tréninky · Plán | Combos · Custom combos · Saved workouts · Plan |
  | Kondice · Technika · Síla úderu · Rychlost · Obrana · Vyčistit hlavu | Conditioning · Technique · Power · Speed · Defense · Clear your head |
  | Začínám · Pár měsíců · Rok a víc · Závodím | Just starting · A few months · A year or more · I compete |
  | Rozcvička · Amatérský zápas · Profi kola · Technika · Kondice · Silové minuty · Vypalovák · Zápas o titul – ženy / muži | Warm-up · Amateur bout · Pro rounds · Technique · Conditioning · Power minutes · The Burner („The Burner" z Boxing Insider, 9.5) · Women's / Men's title fight |

- **Nadpisy** (styl jako česky — krátce, jazykem boxu, kap. 15): Domů „NO / TALK. / JUST /
  PUNCHES." (= „Žádné řeči. Jen údery.", poslední dva akcent), úvod „ROUND / ONE / BEGINS.",
  text „The coach calls the combos and keeps time. You just throw punches."
- iOS cesty v angličtině tak, jak je iPhone ukazuje: Settings → Display & Brightness → Auto-Lock →
  Never; Safari → Share → Add to Home Screen; Silent mode.

### 9.9 Čeština (v12)
- **Terminologie boxu** podle kap. 5: přední/zadní direkt, hák, zvedák, na tělo; obrana povely
  z lap úklon, záklon, dolů, kryt, vzad, stranou; **kombinace** (ne „kombo") — tak píšou učebnice (Klouda 2008:
  „kombinace úderů", „série úderů") i české články o boxu. Slovo „kombo" zůstává jen jako
  technický název v dokumentaci a kódu (`Combo`).
- **Kolo, pauza, gong, odpočet, finiš** zůstávají: „kolo" a „gong" jsou terminologie, „pauza" je
  běžná mluva tréninku (pravidla píšou „přestávka", na tréninku a v článcích se říká „pauza").
- **Předložka z/ze před číslem** podle výslovnosti číslovky ([IJP ÚJČ — vokalizace předložek](https://prirucka.ujc.cas.cz/?id=770)):
  „ze" před dv-, tř-, čt-, s-, š- (2, 3, 4, 6, 7, 12, 13, 14, 16, 17, 20), jinak „z" (1, 5, 8, 9,
  10, 11, 15, 18, 19): „Kolo 1 ze 3", „Kolo 1 z 5", „Plán: 6 ze 12 hotovo". Dřív všude „ze" →
  „Kolo 1 ze 5" bylo chybně. Pomocník `z()` v `src/i18n/cs.ts`, testovaný.
- **Názvy v iOS** česky tak, jak je iPhone ukazuje: Nastavení → Zobrazení a jas → Uzamčení → Nikdy
  ([Letem světem Applem](https://www.letemsvetemapplem.eu/?p=672150)); Safari → Sdílet → Přidat na
  plochu; tichý režim.
- **Uvozovky** české „…“, ne "…".

### 9.10 Sdílení výsledku (v13)
- Na Hotovo kulaté tlačítko **Sdílet** vpravo od nadpisu (vzor iOS: sdílení v horní liště,
  `aria-label` „Sdílet výsledek" / „Share result"). Ťuk otevře systémový list sdílení s obrázkem
  (Instagram, Zprávy, Uložit obrázek…). Kde Web Share se souborem nejde (desktop Firefox),
  obrázek se stáhne. Zavření listu bez volby = nic.
- **Obrázek** = plakát obrazovky Hotovo pro IG story: PNG **1080 × 1920**, pozadí paper, okraje
  80 px, všechno podstatné v pásu y 250–1580 (bezpečná zóna story, kap. 15). Ploché barvy z tokenů
  (kap. 10), žádné stíny, přechody ani emoji. Shora:
  1. Hlavička: ikona appky 72 px (kompozice `design/ikona/icon.svg`, rádius 16) + „DIREKT";
     vpravo datum („13. 10. 2026" / „13 Oct 2026", muted).
  2. „HOTOVO." / „DONE." verzálkami, ink, zmenšené na šířku mřížky; pod ním název tréninku
     (muted, zmenšený na šířku).
  3. Čára (hairline) a pod ní tři údaje číslo + popisek (verzálky, muted, tvar podle počtu):
     čas v kolech („9:00 / V KOLECH" / „ROUND TIME"), kombinace („42 / KOMBINACÍ"), údery
     („156 / ÚDERŮ"). Všechna tři čísla mají stejnou velikost — tu, při které se nejdelší vejde.
     Obří **počet kol v akcentu** s popiskem „KOLA" / „ROUNDS" pod sebou:
     - **1 číslice:** údaje vlevo pod sebou, číslo vpravo přes celou výšku kolony; nejširší
       číslice **přetéká pravý okraj obrázku o 7 %** — stejné gesto jako na Hotovo, schválně
       (velikost nezávisí na číslici, úzká „1" okraj nepřetéká).
     - **10–12 kol:** v kolony by bylo číslo malé → číslo přes celou šířku, údaje pod ním v řádku.
  4. Patička: čára a adresa appky (`location.host`, tedy `direkt-indol.vercel.app`) — kdo story
     uvidí, ví, kde appku najít; účaří 1562, nad dolní hranou bezpečné zóny.
- Údaje jsou tytéž jako na Hotovo (9.2), popisky v jazyce rozhraní. Poznámka plánu na obrázku
  není. Nic se neukládá — obrázek žije jen v paměti obrazovky Hotovo.
- **Písmo** (R15, R17): statické řezy Archiva v `public/fonts/archivo-share-*.woff2` — `x900` (šířka
  125 %, váha 900) na čísla a nadpisy, `500` (šířka 100 %, váha 500) na popisky; latin +
  latin-ext jako u hlavního písma. Vyrobené z proměnného Archiva:
  `fonttools varLib.instancer archivo-latin.woff2 wght=900 wdth=125 --static -o archivo-share-x900-latin.woff2`
  (venv s `fonttools` + `brotli`). Načítají se přes `FontFace` až pro obrázek; jsou v precache
  (offline).
- **Postup** (R16): po zobrazení Hotovo se obrázek hned vyrobí (`src/ui/shareCard.ts`); ťuk
  ho jen předá `navigator.share({ files })` — bez textu a odkazu (adresa je v obrázku).
  Soubor `direkt-hotovo.png` / `direkt-done.png`.

## 10. Vzhled (v4)

- **Tokeny** jen v `:root` (`src/index.css`), v komponentách žádné hex hodnoty natvrdo:
  paper `#F3F2EE`, ink `#111111`, accent `#2C3BFF` (změna na jednom místě; alternativy
  `#FF3B2F`, `#0B8F5A`), white, muted `#6B6A66`, mutedOnDark `#A9A8A3`, fill `#E6E4DD`,
  hairline `#DCDAD3`, hairlineCard `#ECEAE4`, darkFill `#262624`, darkCard `#1E1E1C`,
  darkTrack `#3A3A37`, whiteA16, whiteA30, switch vypnuto `#D6D4CD`.
- **Písmo Archivo** (proměnné, osa šířky 62–125 %, váhy 100–900; licence OFL) lokálně
  v `public/fonts` (latin + latin-ext). Nadpisy a čísla `font-stretch: 125%` + 850/900,
  verzálky; text 400–600. Časovač 128 / 0.86, −3 %, tabular-nums; odpočet 520 / 0.78.
- Okraje 20 px, nahoře safe area + 20 px, dole safe area + 24–32 px. **Rolující obsah** (Domů,
  Komba, Vlastní komba, Tréninky, Nastavení, Plán) sahá až k dolnímu okraji obrazovky a spodní okraj má uvnitř — jinak se
  poslední řádek usekne nad prázdným pruhem (uživatel 11. 10. 2026, Domů s řádkem Plán). Rádiusy: pilulky 999,
  karty 28, skupiny 20, segmenty a pruhy 2. Dotyková plocha min. 44 × 44.
- **Žádné stíny, přechody, záře, fotky, emoji.** Ploché barvy, velká typografie.
- **Seznam pod pevnou hlavičkou** (Komba pod filtry, Vlastní komba, Tréninky): obsah se při rolování
  neschovává přímo pod pilulky či nadpis, ale pod hranu 12 px pod nimi; jakmile je seznam odrolovaný,
  ukáže se na hraně hairline přes celou šířku (jako lišta v iOS). Řádky se přichytávají
  (`scroll-snap`), takže seznam se zastaví vždy na celém řádku a nikde netrčí useknutá kolečka.
  Bez přechodu do ztracena — design zakazuje přechody.
- **Přidávání v seznamech** (Tréninky, Vlastní komba): kulaté **+** vpravo v horní liště
  (stejné jako hledání u Komb, vzor iOS — Hodiny, Zkratky), žádné tlačítko pod seznamem. Seznam
  tak dojede až k dolnímu okraji displeje a řádky pod něj prostě odjíždějí. Zamítnuté varianty
  (uživatel 11. 10. 2026): řádek useknutý nad PrimaryButton; plovoucí pilulka přes seznam
  (obsah trčel kolem ní); seznam na celé řádky nad tlačítkem (prázdná díra, nevypadá to, že
  seznam pokračuje — „aby to nevypadalo jako AI slop"). Atribut `data-scrolled` nastavuje jeden posluchač rolování v `main.tsx`
  (uživatel 11. 10. 2026: useknuté řádky pod filtry „nevypadají dobře").
- **Stavová lišta:** styl `default` → appka začíná pod neprůhlednou lištou v barvě
  obrazovky (paper / akcent v kole / ink v pauze). Za běhu ji iOS 27 barví podle fixního
  pruhu u horního okraje (R11): každá `.screen` začíná `<i className="screen-edge">` —
  140 px, `background: inherit`, `z-index: -1`, takže je pod obsahem a nic nepřekryje (ani
  pytel v úvodu). `useThemeColor` dál nastavuje `theme-color` + pozadí `html` a `body` (barva
  při spuštění, Android). `black-translucent`
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
| `settings` | `prepSec`, `actionMs` (čas na úder 300–700 po 100, výchozí 500, jiná hodnota → 500; 7.2), `silentOverride`, `autoPause`, `voice` (id hlasu, výchozí harry; staré `voiceURI`, `rate` se ignorují), `onboarded` (verze úvodu, kterou už viděl: 0 nikdy, 1 = v8, 2 = v9; starší `true` = 1), `lang` (`cs` / `en`, 9.8; chybí u uloženého nastavení → `cs`, bez nastavení → jazyk zařízení) |
| `combos` | `{ disabled: id[] (vypnutá komba, vestavěná i vlastní), custom: Combo[] }`; vlastní kombo má navíc `name` |
| `presets` | uložené tréninky `{ id, name, config }[]` |
| `presetsVersion` | verze vestavěného seznamu, kterou už `presets` obsahuje (chybí = 1, v10 = 2); starší → doplní se tréninky, které od té verze přibyly (9.5) |
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
  zkušenosti a cílů; bazén Obrany; obranné čtení `plan`; jazyk (`lang` z úložiště, výchozí
  podle zařízení), anglické názvy komb a čipy, anglické texty mají všechny klíče jako české.
- `npm run build` (tsc + vite) a `npm run lint` čisté.
- **Prohlížeč** (chrome-devtools, viewport iPhone 15 Pro 393 × 852, DPR 3, simulované
  safe-area 59/34 px): projet trénink 1 kolo × 1 min, žádné chyby v konzoli, hlášení
  běží, všechny obrazovky se vejdou a odpovídají předlohám (kap. 9) — porovnání vedle sebe
  se screenshoty vykreslených předloh 390 × 844. **Angličtina (v11):** projít všechny obrazovky
  i v `en` — nic nepřeteče (delší slova: „Intermediate", „PUNCHES.", nadpisy dotazníku), žádný
  zbylý český text mimo slova hlasu. **Sdílení (v13):** obrázek v `cs` i `en` pro 1, 3 a 12 kol
  a dlouhý vlastní název — kromě obřího čísla nic nepřeteče okraje 80 px ani bezpečnou zónu.

**Na telefonu (uživatel):**
1. Safari → URL → Sdílet → Přidat na plochu → otevřít z plochy.
2. Nastavení → Hlas trenéra → poslechnout Harry / Charlie / Adam / Antonín, jeden vybrat.
3. Trénink 1 × 1:00: „Připrav se", pípání 3-2-1, gong, komba, v 0:10 klepnutí + „Naplno!"
   a do gongu žádné kombo, 3× gong; Hotovo ukáže počet komb a úderů a „celkem 1:00".
   Během tréninku občas „Again!" bez čísel.
   Trénink 3 × 1:00 s Rostoucí: kolo 1 znatelně volnější mezery než kolo 3.
10. Nastavení → Jazyk → English: celá appka anglicky, po zavření a otevření z plochy pořád.
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
11. Hotovo → Sdílet: otevře se list sdílení s obrázkem; Instagram → story ho vezme celý
    (9:16), „Uložit obrázek" ho dá do Fotek. Písmo na obrázku je široké jako v appce (R15).

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
16. **v11:** research (iOS jazyk v appce na ploše, anglická notace obrany) → dokumentace 9.8 →
    `src/i18n/` + `lang` v nastavení + testy → všechny obrazovky v obou jazycích (screenshoty),
    deploy.
17. **v12:** research české terminologie (FTVS UK, MUNI, IJP) → kap. 5 a 9.9 → texty, názvy
    kombinací, z/ze, povely z lap „Dolů!" a „Stranou!" pro Antonína (kontrola přepisem) + testy →
    screenshoty, deploy.
18. **v13:** research (WebKit: písmo v canvasu, Web Share na iOS) → R15, R16, 9.2, 9.10 → statické
    řezy písma, `shareCard.ts`, tlačítko na Hotovo, kolo bez Konec + testy → obrázky v `cs`/`en`
    pro 1, 3 a 12 kol, screenshoty, deploy.

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

### 15.1 Promo video do IG story (uživatel 11. 10. 2026: „marketing video na IG storku… promo")

- **Formát** (research): 1080 × 1920 (9:16), H.264 High + `yuv420p`, 30 fps, AAC 48 kHz, MP4
  s `faststart`, do 60 s; bezpečná zóna jako u obrázků (důležité jen v pásu y 250–1580).
  Hlasitost jako u reelů uživatele: **−14 LUFS**, true peak ≤ −1 dBTP. Zdroje:
  [wyzowl](https://wyzowl.com/instagram-story-dimensions/), [moonb](https://www.moonb.io/blog/instagram-story-specs),
  [postfa.st](https://postfa.st/sizes/instagram/stories/2025).
- **Délka 16 s**, střihy na zvuk. Vzhled = appka (kap. 10): ploché barvy, Archivo 125 % / 850–900,
  verzálky, žádné přechody barev, stíny ani fotky. Pohyb = dopad (zmenšení z většího + opacity)
  jako úvod 1-2-3 (10.1).
- **Zvuk = appka:** klipy hlasu Harry (`public/voice/harry/`), gong a klepnutí stejnou syntézou
  jako `src/audio/sounds.ts` i se stejným kompresorem; navíc jen tlumený úder do pytle pod
  dopady textu. Hudbu si uživatel může přidat v Instagramu.
- **Scénář:**

  | Čas | Scéna | Obraz | Zvuk |
  |---|---|---|---|
  | 0,0–2,2 | Háček | kobalt, obří bílá 1 → 2 → 3 dopadají po 0,6 s | „One!" „Two!" „Three!" + úder |
  | 2,2–4,4 | Hlavička | papír, „ŽÁDNÉ / ŘEČI. / JEN / ÚDERY." řádek po řádku (poslední dva akcent) | úder na každý řádek |
  | 4,4–9,7 | Appka v kole | ink, nahoře „TRENÉR / V MOBILU." + „Hlásí komba čísly. Ty biješ." (uživatel vybral z 5 variant; „k pytli" = česky „k ničemu"), zespodu vyjede telefon s obrazovkou kola (skutečné HTML a CSS appky), čas běží, pilulka skáče po úderech přesně s hlasem, pak „Znovu" | gong, „One, two, three body, slip!", „Again!" |
  | 9,7–12,9 | Funkce | karty po 0,55 s: „50 KOMB" · „ÚKLON. ZÁKLON. KRYT." · „PLÁN NA 4 TÝDNY" · „4 HLASY TRENÉRA" · „FINIŠ NAPLNO" (1 s) | úder na kartu; finiš 2× klepnutí + „All out!" |
  | 12,9–16,0 | Výzva | kobalt, spadne pytel, logotyp, „ZDARMA. / BEZ REGISTRACE.", `direkt-indol.vercel.app`, „iPhone: Safari → Sdílet → Přidat na plochu"; dole volno na nálepku Odkaz | 3× gong (konec kola) |

- Jen pravdivá tvrzení (kap. 15): 50 komb, obrana, plán na 4 týdny, 4 hlasy, finiš, zdarma, bez
  registrace.
- **Zdroje** v `marketing/video/`: `promo.html` (kompozice, čas řídí `seek(t)` — každý snímek je
  čistá funkce času), `phone-round.html` (obrazovka kola s `src/index.css`), `render.mjs` (Node bez
  závislostí: vlastní statický server, headless Chrome přes DevTools protokol, snímky PNG, zvuk
  z `OfflineAudioContext`, ffmpeg: dvouprůchodový `loudnorm`, x264 CRF 18). Náhled v prohlížeči:
  `node --experimental-websocket marketing/video/render.mjs --serve` → `/marketing/video/promo.html?play`
  (render bez `--serve`; Node 20 potřebuje příznak kvůli WebSocketu).
- Výstup: `~/Desktop/DIREKT-marketing/DIREKT-story-promo.mp4` + doplněné `texty.txt`.

### 15.2 Spot do IG story (uživatel 11. 10. 2026: „plno efektů… moderní, jako od agentury v roce 2026", „bez hudby, zvuky si doplň"; v2: „aby to nevypadalo jako AI slop… jak od grafika a videomakera z roku 2026", „odstraň tu časomíru napravo")

- **v1 zamítnutá jako „AI slop"**: hromada šablonových efektů na všem (RGB posun, rozbíhající se
  kruhy, glitch po pruzích, kývající se 3D telefon, karty funkcí jako z prezentace, HUD s odpočtem).
- **Proč v2 takhle** (research): agentury v roce 2026 staví pohyb z významu a geometrie loga, ne
  z „cool efektů" ([Lepisov Branding](https://contra.com/p/MbOAMeFO-great-brand-motion-isnt-about));
  vede výrazná typografie, syrovost, zrno, jump cuty ([GDJ 2026](https://graphicdesignjunction.com/2026/01/video-and-motion-creative-trends-2026/));
  impact frames z anime jsou zavedený jazyk střihových editů ([KYM](https://knowyourmeme.com/memes/cultures/impact-frames));
  háček do 1–2 s, scény krátké, text čitelný bez zvuku ([Sprout](https://sproutsocial.com/insights/instagram-story-ads/)).
- **Nápad: celé video je jedno kombo, úder = střih.** Trenér hlásí čísla a každé číslo je střih.
  Appka se jmenuje po úderu 1 (přední direkt) — první záběr to říká.
- **Jazyk z loga:** pytel (kruh) a lano (svislý pruh) z ikony. Pytel se v háčku houpe po úderech
  (kyvadlo, zploštění při zásahu), lano dělá stíračku titulku, pytel prolétne kamerou jako přechod
  a na konci se ustálí přesně v pozici ikony appky (logo).
- **Impact frame** na každý úder: 2 snímky — bílá / černá, vše jako silueta + paprskové čáry od
  místa zásahu; pak barva. Max. ~2 záblesky za sekundu (pod hranicí 3/s pro fotosenzitivitu).
- **Typografie:** obří čísla oříznutá rámem, řádky titulku sázené na celou šířku, malé popisky
  jazykem boxu („01 — PŘEDNÍ DIREKT"); popisky se s kamerou netřesou (motion blur by je zdvojil).
  Žádný HUD, odpočet ani štítky „Hlas — …". Pilulky komba nezasahují do telefonu.
- **Hlas jen anglicky** (uživatel: česká „Čtyři!" mezi anglickými „není správně"); „4 hlasy" nahradila
  „Vlastní komba".
- **Zakázáno (klišé):** RGB posun, kruhové vlny, glitch po pruzích, obrysové běžící pásy, 3D kývání.
- **15 s**, formát / bezpečná zóna / hlasitost jako 15.1, motion blur (4 dílčí snímky), jemné zrno.
- **Zvuk bez hudby:** hlasy z appky, gong a klepnutí z appky + syntéza: úder (prasknutí + tlumený
  úder + sub), cinknutí řetězů pytle po zásahu, whoosh před úderem, riser, tiky psaní.
- **Scénář:**

  | Čas | Scéna | Obraz | Zvuk |
  |---|---|---|---|
  | 0,0–2,35 | Háček = kombo | impact frame hned v 1. snímku; obří oříznuté „1" (kobalt), „2" (ink), „3" nízko na tělo (papír), pak celý záběr uhne — „SLIP"; pytel se houpe; popisky 01 — PŘEDNÍ DIREKT, 02 — ZADNÍ DIREKT, 03 — PŘEDNÍ HÁK NA TĚLO, ÚKLON | „One! Two! Three body! Slip!", údery, řetězy |
  | 2,35–3,55 | Titulek | ink; „TRENÉR / NA PYTEL / V MOBILU." na celou šířku, odkryje je bílý pruh (lano) | whoosh na řádek |
  | 3,55–6,95 | Appka | ink; telefon rovně, oříznutý pravým okrajem, obrazovka kola (CSS appky); vlevo velké pilulky komba ve stylu appky naskakují s hlasem; „HLÁSÍ KOMBA." → „TY BIJEŠ." | gong, kombo, tiky pilulek |
  | 6,95–7,35 | Přechod | obří pytel prolétne kamerou a zakryje záběr | hluboký whoosh |
  | 7,35–11,55 | Funkce = kombo 1-2-3-4 | čísla říkají anglické hlasy (Harry, Charlie, Adam, Harry): 1 „50 KOMB", 2 „OBRANA", 3 „PLÁN NA 4 TÝDNY", 4 „VLASTNÍ KOMBA" (sestav si svoje), pak „NAPLNO" (finiš); obří číslo za titulkem na celou šířku | impact + hlas, 2× klepnutí + „All out!" |
  | 11,55–15,0 | Výzva | kobalt; pytel se zhoupne a ustálí jako ikona, logotyp, „ZDARMA. BEZ ÚČTU.", adresa se vypíše | 3× gong, „Time! Great work!", tiky |

- **Zdroje:** `marketing/video/spot.html` (`seek(t)` je čistá funkce času; barvy přes CSS
  proměnné na `.stage`, impact frame je jen jiná sada proměnných), `marketing/video/shots/home.png`,
  `render.mjs --page spot` (snímky rovnou do ffmpeg; `--sheet 0.1,2,5 --out arch.png` = náhledový
  arch). Výstup `~/Desktop/DIREKT-marketing/DIREKT-story-spot.mp4`.
- **Pasti:** písmo s háčky (latin-ext) se stáhne až při prvním zobrazení → měřit až po
  `document.fonts.load(…, 'ŽÁŘČ…')`; `visibility: visible` u potomka přebije skrytého rodiče →
  skrývat `display`; silné zrno = 200+ MB a IG ho rozbije → jemné + `-maxrate 24M`; nálepka
  Odkaz vpravo nahoře (texty.txt).

### 15.3 Reklama do IG story „Pytel mlčí" (uživatel 13. 10. 2026: „profi reklamu s efekty… originální a zajímavá… na pohled top tier… zvuky bez hudby… v češtině, zkontroluj, jestli slova a věty dávají smysl")

- **Claude Motion** (funkce claude.ai, beta od 8. 10. 2026) v Claude Code není → stejný princip:
  animace kódem, `seek(t)` = čistá funkce času, render `render.mjs --page reklama`.
- **Nápad: dialog trenéra a boxera.** Obrazovku dělí **membrána**: nahoře kobalt = trenér (kobaltová je
  i obrazovka kola v appce), dole ink = ty. Trenér hlásí číslo → membrána se prohne dolů; ty dáš úder →
  membrána se vyboulí nahoru v místě zásahu (direkt vlevo, zadní direkt vpravo, hák proběhne vlnou
  zboku, úklon membránu nakloní). Na konci dialogu se kobaltová plocha trenéra smrští do obrazovky
  telefonu = trenér je appka.
- **Háček z bolesti uživatele:** „Pytel mlčí. Neřekne ti, co máš dát." → gong → „Trenér ne."
- **Jazyk:** texty česky; hlas Harry anglicky (výchozí hlas appky, 15.2: hlasy se nemíchají). Nahoře
  je hláška trenéra tak, jak ji appka s Harrym ukazuje („3 BODY", „SLIP"), dole tvoje akce česky
  („HÁK NA TĚLO", „ÚKLON") — dolní polovina je zároveň překlad a učí číslování.
- **Efekty jen s důvodem:** membrána (pružina), otřes kamery a motion blur při úderu, válec čísel
  u „50", obrana = pohyb kamery (úklon nakloní záběr, dolů s ním zhoupne, vzad ho oddálí), nájezd do
  displeje jako střih. Žádné klišé z 15.2 (RGB posun, kruhové vlny, glitch, 3D kývání, karty funkcí).
- **Scénář (15,6 s):**

  | Čas | Scéna | Obraz | Zvuk |
  |---|---|---|---|
  | 0,0–1,7 | Ticho | ink; pytel z ikony se houpe, „PYTEL / MLČÍ." (rozdílová prolnutí přes pytel), „Neřekne ti, co máš dát." | 2 údery, řetězy, vrzání, tep |
  | 1,7–2,5 | Trenér | kobalt spadne shora jako opona: „TRENÉR / NE." | gong, „Get ready!" |
  | 2,5–5,6 | Dialog | zespodu se vrátí ink, štítky TRENÉR / TY; 1 → DIREKT, 2 → ZADNÍ DIREKT, 3 BODY → HÁK NA TĚLO, SLIP → ÚKLON | „One! Two! Three body! Slip!", údery, výdech, řetězy |
  | 5,6–8,05 | Appka | kobalt se smrští do telefonu (obrazovka kola, čas běží od gongu), „TRENÉR / V MOBILU.", „Hlásí kombinace, hlídá kola i pauzy."; trenér zavelí „Znovu", telefon cuká s údery | „Again!", boxer kombinaci zopakuje (3 údery + úklon) |
  | 8,05–12,3 | Funkce | nájezd do displeje → „50 KOMBINACÍ" (válec), „NEJEN ÚDERY / OBRANA" (ÚKLON, DOLŮ, VZAD — pohyb kamery), „PLÁN NA 4 TÝDNY" (4 řádky kol rostou), „NAPLNO" (finiš) | tiky válce, „Slip! Roll! Back!", 2× klepnutí, „All out!", série úderů |
  | 12,3–15,6 | Výzva | kobalt spadne znovu: logotyp, „ZDARMA. / BEZ ÚČTU."; dole ikona appky (na kobaltu by splynula), adresa a „iPhone: Safari → Sdílet → Přidat na plochu" | 3× gong, „Time! Great work!", tiky psaní |

- **Kontrola češtiny:** „Pytel mlčí. Trenér ne." (elipsa jako „Já ne."), „Neřekne ti, co máš dát."
  (hovorově „dát úder"), názvy úderů a povely podle kap. 5 (Direkt, Zadní direkt, Hák na tělo, Úklon,
  Dolů, Vzad), „kombinace" ne „komba" (9.9), „50 kombinací", „Stačí odpovědět na 3 otázky",
  „Posledních 10 sekund kola", „Kolo 1 ze 3" (z/ze 9.9), „3 údery" (obrana se nepočítá, 9.2).
- **Telefon** = `phone-round.html` (CSS appky), ovládání podle v13 (pauza uprostřed, Další kolo vpravo).
- Výstup `~/Desktop/DIREKT-marketing/DIREKT-story-reklama.mp4`; nálepka Odkaz vpravo nahoře.

### 15.4 Anglická story „Autopilot" (uživatel 14. 10. 2026: „video marketing na appku Direkt v angličtině"; z konceptů A/B/C: „prokombinuj B a C… nejlepší co umíš… plné efektů a poutavé pro diváka a uživatele, který to bude chtít vyzkoušet")

- **Zadání (vybral uživatel):** úplně nový nápad, IG Story, hlas trenéra a údery bez hudby, pro
  **boxery z gymu** (číslování znají, chtějí trénovat i sami). Texty i hlas anglicky.
- **Research:** na lapech trenér hlásí a mění komba, na pytli si boxer vybírá sám; reakce na pytli
  potřebuje někoho, kdo volá náhodná komba, a trenér na lapech láme zvyk „jeden úder a dost"
  ([Fairtex — pad controllers](https://fairtexstore.com/en-se/blogs/news/the-conductor-of-chaos-how-pad-controllers-help-fighters-develop-combinations),
  [Fairtex — reaction bag drills](https://fairtexstore.com/blogs/news/how-to-train-reaction-time-with-boxing-bag-drills-sharpen-your-reflexes-fast)).
  Stories: háček do 1 s, přerušení vzoru (kontrast, nečekaný pohyb), text na obrazovce, jedna výzva,
  video pod 16 s se přehraje celé ([twominutereports](https://twominutereports.com/blog/instagram-ads-best-practices),
  [SmartSites](https://www.smartsites.com/blog/best-practices-for-high-performing-instagram-reels-ads-in-2026/)).
- **Nápad = B + C:** (B) sám na pytli házíš pořád to samé — zeď z „1-2" a trenér ji prorazí kombem,
  které by sis nevybral; (C) pak jedno kolo s trenérem zrychleně — jump cuty, čas skáče, mezi skoky
  vždy jedno skutečné hlášení. Konec: stejná zeď, ale z 50 různých komb appky (náhodné pořadí).
- **Efekty jen s důvodem:** zeď se v rytmu líných úderů posouvá a rozsvěcí po pořadí (autopilot);
  ticho před prvním hlášením (přerušení vzoru i ve zvuku); úder = díra ve tvaru pytle z ikony
  (kroužek a jádro), trosky slov letí ven s fyzikou a motion blurem, titulek se rozbije taky; třetí
  díra se rozevře přes celý obraz (přechod na kobalt trenéra); kolo = kamera uvnitř displeje
  telefonu, jump cut = číslice času proletí válcem + zvuk přetočení; impact frame (3 snímky, bílá
  plocha s obřím hlášením) jen na první úder střihu — max. ~1,5 záblesku za sekundu; obrana = pohyb
  kamery (slip nakloní, roll zhoupne); na gong kamera odjede a odhalí telefon. Zakázané klišé
  z 15.2 platí (RGB posun, kruhové vlny, glitch, 3D kývání, karty funkcí, HUD/odpočet v rohu —
  čas je tu jen časovač appky na displeji).
- **Scénář (15,8 s):**

  | Čas | Scéna | Obraz | Zvuk |
  |---|---|---|---|
  | 0,0–2,0 | Autopilot | papír; zeď z „1-2" (občas „1-2-3") se líně posouvá, po úderech se rozsvítí další v pořadí; „ALONE ON THE BAG" + „SAME 1-2. / EVERY ROUND." | líné údery po dvojicích, tlumený gym |
  | 2,0–3,6 | Hlášení | „Five!" — zeď zamrzne, díra ve tvaru pytle, v ní obří „5"; pak „4" a „3 BODY" nízko (kombo e07 `5 4 3t`); popisky 5 — UPPERCUT, 4 — REAR HOOK, 3B — BODY HOOK; třetí díra se rozevře přes obraz | ticho → „Five! Four! Three body!", tvrdé údery, trosky, řetězy |
  | 3,6–4,75 | Pointa | kobalt: „YOU DON'T PICK / THE NEXT ONE." | riser |
  | 4,75–10,85 | Poslední kolo zrychleně | displej appky zblízka (Round 3 of 3, Time left); 3:00 → 2:41 `1 2` → 2:12 `3 BODY 3` → 1:47 Again → 1:20 `SLIP 2 3` → 0:31 `… ROLL` → 0:10 finiš ALL OUT, čas doběhne | gong, „Last round!", hlášení, údery, přetočení na střih, 2× klepnutí, „All out!", série |
  | 10,85–12,6 | Odhalení | kamera odjede, telefon na inku; „THROW WHAT / YOU HEAR." | 3× gong, „Time! Great work!" |
  | 12,6–15,8 | Výzva | papír, zeď z 50 komb appky (rozsvěcí se náhodně); logotyp, „FREE. / NO ACCOUNT.", „50 combos · random order · defense in the mix", ikona + adresa + „iPhone: Safari → Share → Add to Home Screen"; nálepka Odkaz vpravo nahoře | údery řad, tiky psaní |

- **Texty (kontrola angličtiny):** názvy úderů a obrany přesně podle appky (kap. 9.8: Uppercut,
  Rear hook, Body hook, Slip, Roll), obrazovka kola anglickými texty appky (Round 3 of 3, Time left,
  Combo, Again, Finisher, To the bell, Punch 1 of 2, „All out", uvozovky “…”). Jen pravdivá tvrzení:
  50 komb, náhodné pořadí (7.1), obrana v kombech, Again, finiš, zdarma, bez účtu.
- **Zdroje:** `marketing/video/autopilot.html` (stejný princip jako 15.3: `seek(t)` je čistá funkce
  času, zvuk z `OfflineAudioContext`), `phone-round.html` umí nepovinné texty (`title`, `remaining`,
  `next`) a `bars` pro všechny tři pruhy kol, `render.mjs --page autopilot` (+ `--qa` = kontrola
  důležitých textů `[data-qa]`: v pásu y 250–1580 a ≥ 30 px; `--query hook=2` = varianta háčku).
  Výstup `~/Desktop/DIREKT-marketing/DIREKT-story-autopilot.mp4`.
