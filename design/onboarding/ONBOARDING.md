# DIREKT – úvod a dotazník (onboarding)

Navazuje na hlavní zadání (`ZADANI.md`): používej stejné tokeny (`paper`, `ink`, `accent` = #2C3BFF, `muted`, `fill`, `hairline`), písmo Archivo / Archivo Expanded a komponenty `RoundProgress`, `PrimaryButton` a kartu „Dnešní trénink“. Vzhled ber z HTML předloh ve složce `predlohy/`.

Zobrazí se jen při prvním spuštění (příznak `onboardingDone` v úložišti). Předlohy: `predlohy/Uvod.html`, `Otazka1.html`, `Otazka2.html`, `Otazka3.html`, `Plan.html`.

- **Úvod** (pozadí `accent`): značka „pěst v pytli“ visí z horního okraje obrazovky (stejná kompozice jako ikona), logotyp vlevo nahoře, nadpis „PRVNÍ / KOLO / ZAČÍNÁ.“, pod ním „Trenér ti hlásí komba, hlídá kola i pauzy. Ty se soustředíš jen na údery.“, bílá pilulka „Sestavit můj plán“, pod ní odkaz „Přeskočit, chci rovnou trénovat“ (→ výchozí plán, Domů).
- **Otázky** (pozadí `paper`): nahoře zpět + „1 ze 3“, pod tím `RoundProgress` jako ukazatel postupu (stejná komponenta jako v tréninku). Nadpis `display` 34 px. Tlačítko „Pokračovat“ (`PrimaryButton`) je aktivní až po výběru.
  1. **Jak dlouho boxuješ?** – jedna volba ze 4: Začínám / Pár měsíců / Rok a víc / Závodím. Jen krátké texty bez podtitulků, bílé karty výšky 64 px s rádiusem 20, vybraná je `ink` s modrým zaškrtnutím.
  2. **Co chceš zlepšit?** – více voleb, mřížka 2 × 3 (Kondici, Techniku, Sílu úderu, Rychlost, Obranu, Vyčistit hlavu), dlaždice výšky 64 px jen s textem (žádná čísla ani ikony), vybraná je `accent` se zaškrtnutím.
  3. **Kolik času máš?** – kolikrát týdně (kolečka 2×–5×, vybrané `ink`) a délka tréninku (10/15/20/30 min, vybraná `accent`); pod tím živý součet „To je X minut boxu týdně.“
- **Tvůj plán**: shrnutí odpovědí jednou obyčejnou větou (ne řetězec slov oddělených tečkami), týdenní pás Po–Ne jako kolečka se zkratkou dne uvnitř (dnešní trénink `accent`, další tréninkové dny `ink`, volno obrys), karta dnešního tréninku stejná jako na Domů (→ Odpočet) a seznam dalších tréninků v týdnu. Žádné grafy ani statistiky navíc.

Pravidla pro sestavení plánu (navrhni a zdokumentuj v kódu):
- zkušenost → výchozí počet kol, poměr práce/pauza, intenzita a kategorie komb (začátečník jen základní komba),
- cíle → výběr typů tréninků (kondice = víc kol, technika = pomalejší tempo + obrana, síla = kratší kola s delší pauzou, rychlost = tvrdá intenzita),
- frekvence → tréninkové dny rozložit s odstupem (2× Po/Čt, 3× Po/St/Pá, 4× Po/Út/Čt/Pá, 5× Po–Pá),
- délka → žádný trénink nesmí přesáhnout zvolenou délku,
- progrese → 4 týdny, každý týden +1 kolo nebo kratší pauza, nikdy obojí najednou.

Plán ulož jako `Plan = { createdAt, answers, weeks: { days: { weekday, workoutId }[] }[] }`; karta „Dnešní trénink“ na Domů pak bere trénink z plánu.
