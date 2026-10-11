# DIREKT – zadání pro implementaci

Mobilní aplikace: osobní trenér na boxovací pytel. Uživatel spustí trénink, aplikace odpočítává kola a pauzy a hlasem (TTS, čeština) hlásí komba úderů, která má uživatel na pytel vymlátit.

Ve složce `predlohy/` je 8 HTML předloh obrazovek (390 × 844 px). Jsou to **zdroj pravdy pro vzhled**: rozměry, barvy, písmo a texty ber odtud. Předlohy používají šablonovací syntaxi:
- `{{accent}}` = `#2C3BFF`,
- `<sc-for list="…">` = cyklus přes data definovaná ve `<script>` na konci souboru,
- `<sc-if>` = podmínka.

---

## 1. Stack (výchozí, můžeš navrhnout jiný)

- **Expo (React Native) + TypeScript**, Expo Router pro navigaci
- `expo-speech` – hlas trenéra (cs-CZ)
- `expo-av` – gong / pípnutí na začátku a konci kola
- `expo-keep-awake` – displej nezhasíná během tréninku
- `expo-haptics` – vibrace při změně fáze
- `@react-native-async-storage/async-storage` – ukládání nastavení, vlastních komb a tréninků
- Písmo **Archivo** (variabilní, osa `wdth` 62–125) přes `expo-font` / `@expo-google-fonts/archivo`. Pokud variabilní osa `wdth` v RN nefunguje, použij statické řezy **Archivo Expanded** (ExtraBold 800 a Black 900) pro nadpisy a čísla a Archivo Regular/Medium/SemiBold pro text.

---

## 2. Design tokeny

Vytvoř `theme.ts` a **nikde nepiš hex hodnoty natvrdo**.

### Barvy
| Token | Hodnota | Použití |
|---|---|---|
| `paper` | `#F3F2EE` | pozadí světlých obrazovek (menu, seznamy, nastavení, odpočet) |
| `ink` | `#111111` | hlavní text, pozadí obrazovky Pauza, primární tlačítka na světlém |
| `accent` | `#2C3BFF` | kobaltová modrá; pozadí obrazovky Kolo, karta „Dnešní trénink“, akcenty |
| `white` | `#FFFFFF` | text na `accent` a `ink`, karty v Nastavení |
| `muted` | `#6B6A66` | sekundární text na `paper` (kontrast 5:1) |
| `mutedOnDark` | `#A9A8A3` | sekundární text na `ink` |
| `fill` | `#E6E4DD` | kulatá ikonová tlačítka a neaktivní pilulky na `paper` |
| `hairline` | `#DCDAD3` | oddělovače řádků, neaktivní segmenty |
| `hairlineCard` | `#ECEAE4` | oddělovače uvnitř bílých karet |
| `darkFill` | `#262624` | ikonová tlačítka na `ink` |
| `darkCard` | `#1E1E1C` | karta „Další kombo“ na obrazovce Pauza |
| `darkTrack` | `#3A3A37` | neaktivní segmenty na `ink` |
| `whiteA16` | `rgba(255,255,255,0.16)` | ikonová tlačítka na `accent` |
| `whiteA30` | `rgba(255,255,255,0.30)` | neaktivní segmenty na `accent` |

Akcent musí jít v budoucnu změnit na jednom místě (alternativy: `#FF3B2F`, `#0B8F5A`).

### Typografie
| Token | Písmo | Velikost / výška řádku | Poznámka |
|---|---|---|---|
| `timer` | Archivo Expanded Black 900 | 128 / 0.86 | `tabular-nums`, letter-spacing −3 % |
| `countdown` | Archivo Expanded Black 900 | 520 / 0.78 | jediná číslice přes celou šířku |
| `display` | Archivo Expanded ExtraBold 850 | 40–46 / 0.92–1.0 | VŽDY VERZÁLKY, letter-spacing −1 % |
| `displayS` | Archivo Expanded ExtraBold 850 | 24–34 | verzálky (název tréninku na kartě, „ZAČÍT“, sekvence úderů v kole) |
| `body` | Archivo 400/500 | 15–17 | |
| `bodyStrong` | Archivo 600 | 15–17 | názvy řádků, tlačítka |
| `caption` | Archivo 500/600 | 13 | nadpisy sekcí, popisky; větný tvar písma, **ne verzálky** |

### Rozměry
- Okraje obrazovky: 20 px po stranách. Shora safe area + cca 20 px (předlohy mají 64 px a nemají falešný stavový řádek). Dole safe area + 24–32 px.
- Rádiusy: pilulky a kulatá tlačítka `999`, velké karty `28`, skupiny v nastavení `20`, segmenty a pruhy `2`.
- Minimální dotyková plocha je **44 × 44 px**, všude.
- Mezery: 4 / 6 / 8 / 10 / 12 / 14 / 16 / 20 / 40.

### Co nedělat (důležité pro vzhled)
Žádné stíny, přechody, záře, zrno, emoji ani ikonky v kartách. Žádné verzálkové mikro-popisky v monospace písmu. Ploché plné barvy, velká typografie a hodně vzduchu.

---

## 3. Sdílené komponenty

| Komponenta | Popis |
|---|---|
| `IconButton` | kruh 44 px; varianty `onPaper` (`fill`), `onAccent` (`whiteA16`), `onInk` (`darkFill`); ikona 18–20 px, tah 1,75–2 px; povinný `accessibilityLabel` |
| `PunchChip` | prvek sekvence komba. Typ `number` (1–6): plné `ink` kolečko s bílým číslem. Typ `modifier` (T, Ú, LK, 3T): obrysová pilulka 1,5 px v `accent` s textem v `accent`. Velikosti S 28 / M 32–34 px. Na tmavém pozadí je číslo obráceně (bílé kolečko, `ink` text) a modifier má bílý obrys. |
| `PunchSequence` | řádek `PunchChip` s mezerou 4–6 px |
| `RoundBar` | vodorovná časová osa tréninku: bloky kol (`flex = délka práce`) a pauz (`flex = délka pauzy`), mezera 3–4 px, výška 6–8 px |
| `RoundProgress` | 3 až N segmentů výšky 4 px s mezerou 6 px; hotové kolo je plné, aktuální kolo se plní zleva podle uplynulého času |
| `ListRow` | řádek s horním oddělovačem 1 px `hairline`, min. výška 56 px, celý řádek je klikatelný |
| `PrimaryButton` | pilulka výšky 60 px, `ink` pozadí, bílý text 17/600, volitelně ikona „+“ |
| `Segmented` | kontejner `fill` s rádiusem 999 a paddingem 4; položky 44 px; vybraná položka je `ink` s bílým textem |
| `Stepper` | [−] hodnota [+]: kulatá tlačítka 44 px v `paper` na bílé kartě, hodnota v `displayS` 20 px, šířka 68 px, `tabular-nums` |
| `Switch` | 50 × 30 px; zapnuto = `accent` dráha, vypnuto = `#D6D4CD`; jezdec je bílý 24 px |

---

## 4. Obrazovky

Pořadí odpovídá souborům v `predlohy/`.

### 4.1 Domů – `Main.html` (pozadí `paper`)
- Hlavička: vlevo logo „DIREKT“ (Expanded 900, 20 px), vpravo `IconButton` nastavení → Nastavení.
- Nadpis `display` 46 px na 4 řádky: „LEPŠÍ / KONDICE. / SILNĚJŠÍ / TY.“. Poslední dva řádky jsou v `accent`.
- Pružná mezera.
- **Karta „Dnešní trénink“** (`accent`, rádius 28, padding 22, bílý text). Celá karta je jedno tlačítko → Odpočet. Obsah:
  - „Dnešní trénink“ + celková délka „8 min“,
  - název tréninku (`displayS` 24),
  - meta „3 kola · 2:00 práce · 1:00 pauza“,
  - `RoundBar` (bílá = práce, `whiteA30` = pauza),
  - „ZAČÍT“ (`displayS` 30) + bílé kolečko 56 px s ikonou play v `accent`.
  - Zobrazuje se naposledy použitý trénink; pokud žádný není, první uložený.
- Menu: 3× `ListRow` (Komba · počet, Vlastní komba · počet, Uložené tréninky · počet) se šipkou →.

### 4.2 Kolo běží – `Trenink.html` (pozadí `accent`, celý text bílý)
- Hlavička: zavřít (×) → potvrzovací dialog „Ukončit trénink?“ → Domů. Uprostřed „Kolo 1 ze 3“, vpravo nastavení tréninku.
- `RoundProgress`.
- „Zbývá“ + čas `timer` ve formátu `m:ss` (bez úvodní nuly).
- Sekce Kombo: vpravo „Úder 4 ze 6“. Sekvence je typograficky v `displayS` 34 px: odehrané údery mají opacity 0,45, **aktuální úder** je bílá pilulka s textem v `accent`, další údery jsou plně bílé. Vypisuje se slovně („TĚLO“, „ÚKLON“, „LK“), čísla zůstávají čísly.
- Řádek s ikonou reproduktoru a přepisem toho, co hlas právě říká („„Jedna, dva, tři na tělo, dva, tři!““).
- Ovládání (3 sloupce):
  - vlevo „Další kolo“ (přeskočí zbytek kola → Pauza),
  - uprostřed **pauza/pokračovat** (bílé kolečko 84 px, ikona v `accent`),
  - vpravo „Konec“ (čtverec).
- Na pozastavené obrazovce se ikona změní na play, čas se zastaví a nad časem se objeví „Pozastaveno“.

### 4.3 Komba – `Komba.html` (`paper`)
- Zpět + vyhledávání. Nadpis „KOMBA“ + počet v `muted`.
- Filtr: pilulky Vše / Základní / Pokročilé / Obrana. Vybraná pilulka je `ink`, ostatní `fill`.
- Legenda v `caption`: „1 jab · 2 cross · 3 hák · T na tělo · Ú úklon · LK low kick“.
- Seznam: název (16/600), pod ním `PunchSequence` S. Vpravo délka `m:ss` a kategorie v `muted`.
- Klik na kombo otevře detail nebo ho rovnou spustí jako krátký drill (navrhni a zeptej se).
- Vyhledávání filtruje podle názvu.

### 4.4 Vlastní komba – `VlastniKomba.html` (`paper`)
- Zpět, vpravo počet „5 komb“. Nadpis „VLASTNÍ / KOMBA“ na 2 řádky.
- Seznam: název 17/600 + délka; pod tím `PunchSequence` M (34 px).
- Dole `PrimaryButton` „+ Sestavit kombo“ → editor. Editor není v předlohách: udělej ho ve stejném stylu. Obsahuje název, klávesnici úderů 1–6 + T, Ú, LK, mazání posledního úderu a náhled sekvence. Délku komba spočítej automaticky (např. 1,5–2 s na úder + pauza).
- Swipe doleva na řádku nabídne Smazat.

### 4.5 Uložené tréninky – `Treninky.html` (`paper`)
- Zpět, vpravo „5 uložených“. Nadpis „TRÉNINKY“.
- Řádek obsahuje:
  - název,
  - meta „3 kola · 2:00 / 1:00 · Začátečník“,
  - `RoundBar` (práce je `ink`, u obtížnosti Pokročilý `accent`; pauzy `hairline`),
  - vpravo celková délka v minutách (`displayS` 34 + „min“).
- Celková délka = `kola × práce + (kola − 1) × pauza`, zaokrouhleno na minuty.
- Klik na řádek → Odpočet s tímto tréninkem. Dole `PrimaryButton` „+ Nový trénink“ → formulář: název, počet kol, délka kola, pauza, obtížnost, výběr komb.

### 4.6 Nastavení – `Nastaveni.html` (`paper`, skupiny na bílých kartách s rádiusem 20)
- **Hlas trenéra:** „Zuzana · Čeština (cs-CZ)“ + kulaté tlačítko play v `accent`, které přehraje ukázkovou větu. Řádek „Další hlasy a stažení“ ukáže seznam hlasů z `Speech.getAvailableVoicesAsync()` filtrovaný na `cs`; pokud žádný není, zobraz návod k instalaci hlasu v systému.
- **Intenzita:** `Segmented` Lehká / Střední / Tvrdá. Ovlivňuje tempo hlášení komb (viz 6).
- **Kolo:** `Stepper` Délka kola (1:00–10:00, krok 0:30, výchozí 2:00), `Stepper` Pauza mezi koly (0:15–5:00, krok 0:15, výchozí 1:00).
- **Přehrávání:** `Switch` „Hrát i v tichém režimu“ (výchozí vypnuto), `Switch` „Automatická pauza na pozadí“ (výchozí zapnuto).
- Řádek „O aplikaci“.
- Všechno se ukládá okamžitě, bez tlačítka Uložit.

### 4.7 Odpočet – `Odpocet.html` (`paper`)
- „PŘIPRAV SE“ (`display` 40) + „Základní kondice · kolo 1 ze 3“ v `muted`.
- Obří číslice `countdown` v `accent`, přes celou šířku, odpočet 3 → 2 → 1. Při každé změně číslice proběhne haptika a hlas řekne „tři“, „dva“, „jedna“.
- Dole `RoundProgress` (první segment plný), „První kombo“ + `PunchSequence` a pilulka „Přeskočit“ → rovnou Kolo.

### 4.8 Pauza – `Pauza.html` (pozadí `ink`, bílý text)
- × (ukončit), „Kolo 1 ze 3 hotovo“, `RoundProgress` (hotová kola bílá).
- „PAUZA“ (`display` 40), „Další kolo za“, čas `timer`, pod ním pruh 8 px, který se plní v `accent` podle uplynulé pauzy.
- Karta „Další kombo“ (`darkCard`, rádius 20): název + `PunchSequence` v obrácených barvách.
- Tlačítka: kulaté pozastavení 60 px (`darkFill`) a bílá pilulka „Přeskočit pauzu“ → Kolo.
- Po posledním kole se místo Pauzy zobrazí obrazovka **Hotovo**, která není v předlohách: pozadí `paper`, „HOTOVO“ (`display`), počet odjetých kol, celkový čas a tlačítka „Znovu“ a „Domů“.

---

## 5. Datový model

```ts
type Punch =
  | { kind: 'number'; value: 1 | 2 | 3 | 4 | 5 | 6 }
  | { kind: 'body'; value: 1 | 2 | 3 | 4 | 5 | 6 }   // např. 3T = hák na tělo
  | { kind: 'slip' }                                  // Ú
  | { kind: 'lowKick' };                              // LK

type Combo = {
  id: string;
  name: string;
  punches: Punch[];
  category: 'zakladni' | 'pokrocile' | 'obrana' | 'vlastni';
  durationSec: number;
  spoken: string;          // text pro TTS, např. "Jedna, dva, tři na tělo, dva, tři!"
};

type Workout = {
  id: string;
  name: string;
  rounds: number;
  workSec: number;
  restSec: number;
  level: 1 | 2 | 3;        // Začátečník / Střední / Pokročilý
  comboIds: string[];      // prázdné = náhodně ze všech podle levelu
};

type Settings = {
  voiceId: string | null;
  intensity: 'lehka' | 'stredni' | 'tvrda';
  defaultWorkSec: number;
  defaultRestSec: number;
  playInSilentMode: boolean;
  autoPauseInBackground: boolean;
  lastWorkoutId: string | null;
};
```

Seed data (7 komb, 5 vlastních komb, 5 tréninků) jsou ve `<script>` blocích předloh `Komba`, `VlastniKomba` a `Treninky`; převezmi je.

Slovník pro TTS:

| Úder | TTS |
|---|---|
| 1 | „jedna“ |
| 2 | „dva“ |
| 3 | „tři“ |
| 4 | „čtyři“ |
| 5 | „pět“ |
| 6 | „šest“ |
| 3T | „tři na tělo“ |
| Ú | „úklon“ |
| LK | „low kick“ |

---

## 6. Logika tréninku

Implementuj jako **stavový automat** v samostatném hooku `useWorkoutEngine`, odděleně od UI:

```
idle → countdown(3 s) → work(kolo n) → rest → work(kolo n+1) → … → done
                 ↘ paused ↙ (z countdown / work / rest)
```

- Čas měř podle `Date.now()` / `performance.now()` (rozdíl od startu), **ne** sčítáním intervalů; UI se překresluje cca 4× za sekundu.
- Začátek kola: gong, haptika a hlas „Kolo jedna“. Konec kola: dvojitý gong a hlas „Pauza“. V pauze 10 s před koncem zazní hlas „Deset sekund“, posledních 3 s pípání.
- Během kola se střídají komba. Každé kombo se jednou nahlásí (`Speech.speak(combo.spoken, { language: 'cs-CZ', rate })`), pak následuje mezera na provedení a další kombo. Rozestup podle intenzity: Lehká 6 s, Střední 4 s, Tvrdá 2,5 s. Nové kombo nespouštěj, pokud do konce kola zbývá méně než jeho délka.
- Index „aktuálního úderu“ se v UI posouvá rovnoměrně během `durationSec` komba (je to vizuální vodítko, ne detekce úderů).
- Při přechodu aplikace na pozadí (`AppState`) a zapnutém `autoPauseInBackground` → stav `paused`.
- Během tréninku platí `keep-awake`. S `playInSilentMode` nastav audio mód `playsInSilentModeIOS: true`.

---

## 7. Přístupnost

- Každé ikonové tlačítko má `accessibilityLabel` (texty jsou v předlohách v `aria-label`).
- Přepínače mají `accessibilityRole="switch"` a `accessibilityState={{ checked }}`, segmenty `selected`.
- Časovač má `accessibilityLiveRegion="polite"` a hlásí se jen při změně fáze, ne každou sekundu.
- Respektuj systémové zvětšení písma, ale u `timer` a `countdown` ho omez (`maxFontSizeMultiplier={1}`), aby se vešly.

---

## 8. Hraniční stavy

- **Prázdné seznamy:** Vlastní komba „Zatím žádné kombo. Sestav první.“ + `PrimaryButton`. Tréninky obdobně.
- **Dlouhé názvy:** 1 řádek s výpustkou (`numberOfLines={1}`). Max. délka názvu 40 znaků.
- **Dlouhá sekvence (víc než 8 úderů):** `PunchSequence` se zalomí na druhý řádek; v Kolo se zmenší písmo na 28 px.
- **Chybí český hlas:** při startu tréninku zobraz jednorázové upozornění s odkazem do Nastavení; trénink jede dál jen se zvuky.
- **Malé telefony (výška pod 700 px):** `timer` 104 px a `countdown` 400 px.

---

## 9. Pořadí prací

1. `theme.ts` + načtení písma + sdílené komponenty (ověř je na jedné testovací obrazovce).
2. Statické obrazovky 4.1–4.8 přesně podle předloh, navigace mezi nimi.
3. Úložiště + seed data.
4. `useWorkoutEngine` + TTS + zvuky + haptika, napojení na Odpočet / Kolo / Pauza / Hotovo.
5. Editory (kombo, trénink), hraniční stavy, přístupnost.

Po každém kroku spusť aplikaci a porovnej obrazovky s předlohami.
