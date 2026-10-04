# apps-dashboard — projekt (spec)

Data: 2026-10-04
Status: do akceptacji

## 1. Cel i kontekst

Nowa strona-wizytówka (portfolio) gier i aplikacji studia **ntwins**, będąca jednocześnie odświeżeniem
starej strony http://ntwins.pl/#/ (wersja z 2020 r.), której kod źródłowy został utracony.

Źródła treści:

- `docs/legacy/src-2020/` — kod wersji 2020 odzyskany z publicznych source map ntwins.pl
  (**źródło prawdy** dla treści i struktury).
- `../apps-page/` — starsza wersja z 2019 r. (marka A&A Games); źródło ikon, bannerów i fontów.
- `../ntwins-2020-recovered/public/` — grafiki pobrane z ntwins.pl (15 screenshotów DP2).
- `~/Downloads/dp2/` — aktualne dane DP2 od właściciela (`dp2.txt`, `icon.jpg`, `banner.png`)
  oraz opis Interstellar Lander (`interstellar.txt`).

Strona stara (ntwins.pl) pozostaje online i nadal obsługuje linki do polityk prywatności podpięte
w Google Play — nowa strona **nie** musi zachowywać starych URL-i (`#/details/...`).

### Wymagania (od właściciela)

1. Stack: React + Next.js + MUI; hosting na GitHub Pages pod `https://drachelski.github.io/apps-dashboard/`.
2. Usunięte sekcje **Incoming games** i **News**.
3. W sekcji **Apps & Games** trzy główne aplikacje z większymi kaflami: **Dragon Pet 2** (największy,
   pierwszy), **Dragon Pet**, **Unicorn Pet**. Pozostałe aplikacje bez zmian.
4. Rok w stopce dynamiczny (bieżący rok, nie statyczny).
5. Bardziej nowoczesny wygląd, więcej animacji; kierunek: odświeżony obecny klimat (ciemny, fiolet, fantasy).
6. Marka: **ntwins**, kontakt `ntwins.info@gmail.com`.
7. Strona gry: banner + opis; dla DP2 dodatkowo galeria screenshotów.
8. Tylko fonty z licencją pozwalającą na publiczne/komercyjne użycie.

### Kryteria sukcesu

- Strona działa pod `https://drachelski.github.io/apps-dashboard/` i zawiera wszystkie **15** aplikacji.
- DP2, DP, UP wyświetlane jako duże kafle (DP2 największy); brak sekcji Incoming games i News.
- Stopka pokazuje bieżący rok w przeglądarce użytkownika.
- Lighthouse (mobile) dla strony głównej: Performance ≥ 90, Accessibility ≥ 95.
- Brak błędów w konsoli, brak zepsutych obrazków, wszystkie testy i build zielone w CI.

### Poza zakresem

- Przekierowania ze starych URL-i `#/details/...`.
- Sekcje Incoming games, News, karuzela promocyjna.
- CMS / edycja treści poza plikiem `apps.ts`, i18n (strona tylko po angielsku), analityka, formularz kontaktowy.
- Galerie screenshotów dla gier innych niż DP2 (model danych na to pozwala — dodanie to zmiana w danych).
- Własna domena (konfiguracja ma to umożliwić jedną zmienną, ale nie jest konfigurowana).

## 2. Stack i konfiguracja

| Obszar | Wybór |
|---|---|
| Framework | Next.js 15, App Router, `output: 'export'` |
| Język | TypeScript (strict) |
| UI | MUI v6 + Emotion (`@mui/material-nextjs` dla App Router) |
| Animacje | `motion` (Framer Motion) + własny canvas (cząstki) |
| Fonty | `next/font/google`: **Cinzel Decorative** (nagłówki), **Inter** (tekst) |
| Package manager | pnpm |
| Jakość | ESLint (`next/core-web-vitals`), Prettier |
| Testy | Vitest + @testing-library/react + jsdom |
| CI/CD | GitHub Actions → GitHub Pages (`actions/deploy-pages`) |

`next.config.ts`:

- `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`.
- `basePath` i `assetPrefix` z env `NEXT_PUBLIC_BASE_PATH` (lokalnie puste, w CI `/apps-dashboard`).

`public/.nojekyll` — zabezpieczenie folderu `_next` na GitHub Pages.

## 3. Architektura

```
src/
  app/
    layout.tsx                         # html/body, fonty, ThemeProvider, NavBar, Footer
    page.tsx                           # Hero + AppsSection + ContactSection
    not-found.tsx                      # ostylowane 404 (→ out/404.html)
    apps/[slug]/page.tsx               # strona gry; generateStaticParams, dynamicParams = false
    apps/[slug]/privacy-policy/page.tsx
  data/
    apps.ts                            # typowana lista aplikacji (jedyne źródło danych)
  lib/
    asset.ts                           # asset(path): doklejanie basePath do ścieżek tekstowych
    apps.ts                            # getApps(), getAppBySlug(), getHeroApps(), getStandardApps()
  components/
    layout/NavBar.tsx                  # sticky, transparentny → blur po scrollu; Drawer na mobile
    layout/Footer.tsx                  # 'use client'; © {bieżący rok} ntwins
    home/Hero.tsx                      # logo, slogan, CTA, parallax
    home/EmberBackground.tsx           # 'use client'; canvas z cząstkami
    home/AppsSection.tsx               # nagłówek + siatka bento
    home/AppTile.tsx                   # kafel (wariant hero/standard), tilt, glow
    home/ContactSection.tsx
    app-details/AppHeader.tsx          # banner + ikona + tytuł
    app-details/AppDescription.tsx     # akapity + lista features
    app-details/ScreenshotGallery.tsx  # karuzela scroll-snap
    app-details/Lightbox.tsx           # MUI Dialog, klawiatura, swipe
    app-details/GooglePlayBadge.tsx
    privacy/PrivacyPolicy.tsx          # treść z wersji 2020, parametryzowana nazwą aplikacji
    motion/Reveal.tsx                  # wrapper animacji wejścia przy scrollu
    common/SafeImage.tsx               # <img> z asset(), aspect-ratio, fallback onError
  theme/
    theme.ts                           # paleta, typografia, overrides komponentów
public/
  img/logo-ntwins.png
  img/google-play-badge.png
  img/icons/*.webp|png
  img/banners/*.webp|jpg
  img/screens/dp2/{thumb,full}/*.webp
  .nojekyll
scripts/
  verify-export.mjs                    # smoke test zawartości out/
docs/
  legacy/src-2020/                     # referencja (nie jest kompilowana)
  superpowers/specs/, superpowers/plans/
.github/workflows/deploy.yml
```

Zasady:

- Komponenty serwerowe domyślnie; `'use client'` tylko tam, gdzie są animacje, stan lub API przeglądarki
  (Footer, EmberBackground, AppTile, Reveal, NavBar, ScreenshotGallery, Lightbox).
- Wszystkie dane aplikacji pochodzą wyłącznie z `src/data/apps.ts`; komponenty nie zawierają treści gier.
- Każda tekstowa ścieżka do zasobu z `public/` przechodzi przez `asset()` (Next nie dokleja `basePath`
  do `<img src>` ani CSS `url()`).

## 4. Model danych

```ts
export type AppTier = 'hero' | 'standard';

export interface Screenshot {
  file: string;                          // np. 'port1' → /img/screens/dp2/{thumb,full}/port1.webp
  orientation: 'portrait' | 'landscape';
}

export interface AppEntry {
  slug: string;                          // kebab-case, unikalny, używany w URL
  title: string;
  packageId: string;                     // Google Play application id
  icon: string;                          // ścieżka względem public/, np. '/img/icons/dp2.png'
  banner?: string;                       // brak → fallback (gradient + ikona)
  tier: AppTier;
  description: string[];                 // akapity
  features?: string[];                   // lista punktowana (np. „Main features” DP2)
  screenshots?: Screenshot[];
}
```

Link do sklepu: `https://play.google.com/store/apps/details?id=${packageId}`.

### Lista aplikacji (kolejność wyświetlania)

| # | slug | tytuł | packageId | tier |
|---|---|---|---|---|
| 1 | `dragon-pet-2` | Dragon Pet 2 | `pl.ntwins.dragon.pet2` | hero |
| 2 | `dragon-pet` | Dragon Pet | `eu.aagames.dragopet` | hero |
| 3 | `unicorn-pet` | Unicorn Pet | `eu.aagames.unicornpet` | hero |
| 4 | `real-dragon-pet` | Real Dragon Pet | `eu.aagames.real.dragon.pet` | standard |
| 5 | `dragon-pet-xmass` | Dragon Pet Xmass | `eu.aagames.dragopet.xmass` | standard |
| 6 | `interstellar-lander` | Interstellar Lander | `eu.aagames.interstellar.lander` | standard |
| 7 | `beautiful-battery-widget` | Beautiful Battery Widget | `eu.aagames.widget.battery.beautiful` | standard |
| 8 | `circle-battery-widget` | Circle Battery Widget | `eu.aagames.widget.battery.circle` | standard |
| 9 | `elemental-jewels` | Elemental Jewels | `eu.aagames.elementaljewels.free` | standard |
| 10 | `laboratory-jewels` | Laboratory Jewels | `eu.aagames.laboratory.jewels` | standard |
| 11 | `flappy-dragon` | Flappy Dragon | `eu.aagames.floppydragon` | standard |
| 12 | `unicorn-ride` | Unicorn Ride | `eu.aagames.unicornride` | standard |
| 13 | `football-wroclaw-panthers` | Football Wroclaw Panthers | `eu.aagames.kick` | standard |
| 14 | `my-real-girlfriend` | My Real Girlfriend | `eu.aagames.my.real.girl` | standard |
| 15 | `dragon-pet-vr` | Dragon Pet VR | `eu.aagames.vr.dragonpet` | standard |

Uwagi do danych:

- **DP2**: tytuł, packageId, opis i features z `~/Downloads/dp2/dp2.txt` (emoji zachowane; akapity →
  `description`, punkty „★ …” → `features`, akapit „Please note…” i zdanie końcowe → `description`).
  Ikona: `~/Downloads/dp2/icon.jpg` (zastępuje ikonę z 2020). Banner: `~/Downloads/dp2/banner.png`.
  Screenshoty (15): kolejność jak w wersji 2020 —
  `port1, port4, land5, land1, port2, land6, land4, port9, port6, port8, port3, port5, port7, land2, land3`.
  PackageId zweryfikowany: `pl.ntwins.dragon.pet2` istnieje w Google Play, `pl.ntwins.dragonpet2` (z kodu 2020) zwraca 404.
- **Interstellar Lander**: opis z `~/Downloads/dp2/interstellar.txt` (zastępuje omyłkowo skopiowany opis
  Elemental Jewels); lista „Features” → `features`; podziękowania dla NASA jako osobny akapit bez gwiazdek.
- Pozostałe: opisy z wersji 2020 z poprawą literówek (m.in. „scienist”→„scientist”, „an it might”→„and it might”,
  „separeted”→„separated”, „throught”→„through”, „fairlyland”→„fairyland”), tytuły w Title Case.
- Ikony i bannery pozostałych gier: `../apps-page/public/img/{icons,promos}/`.

## 5. Strony i sekcje

### 5.1 Layout

- **NavBar** (sticky): logo ntwins (link do `/`), linki `Games` (`/#apps`), `Contact` (`/#contact`).
  Na górze strony przezroczysty; po przewinięciu > 24 px — tło z `backdrop-filter: blur`, cień.
  < 900 px: hamburger → MUI `Drawer`. Kotwice z `scroll-margin-top` równym wysokości paska.
- **Footer**: `© {new Date().getFullYear()} ntwins. All rights reserved.` — komponent kliencki, aby rok
  liczyła przeglądarka, a nie build. Do czasu hydracji renderuje rok z buildu (brak pustego miejsca;
  `suppressHydrationWarning` na elemencie roku).

### 5.2 Strona główna (`/`)

1. **Hero** (min. 100 svh): `EmberBackground`, logo ntwins (odwrócone na jasne) z animacją pojawiania się
   litera po literze (maska / clip-path), slogan „Virtual pets & indie games”, CTA „Explore games”
   (smooth scroll do `#apps`), pulsująca strzałka. Parallax tła przy scrollu (`useScroll` + `useTransform`).
2. **Apps & Games** (`#apps`): nagłówek gradientowy (fiolet → złoto), siatka bento (sekcja 6).
3. **Contact** (`#contact`): karta glass z `ntwins.info@gmail.com` (link `mailto:`), przycisk kopiowania
   do schowka ze snackbarem.

### 5.3 Strona gry (`/apps/[slug]/`)

- **AppHeader**: banner na pełną szerokość (proporcje 1024×500) z gradientem przechodzącym w tło;
  ikona 128 px + tytuł nakładające się na dolną krawędź; animacja wejścia.
  Brak bannera → gradient fiolet→złoto z rozmytą ikoną w tle.
- **Akcje**: oficjalny badge Google Play (link do sklepu, `target="_blank" rel="noopener"`),
  przycisk tekstowy „Privacy policy”, przycisk „Back to games” (`/#apps`).
- **AppDescription**: akapity i lista `features` z animacją `Reveal`.
- **ScreenshotGallery** (tylko gdy `screenshots` niepuste): pozioma karuzela `scroll-snap`, miniatury
  o stałej wysokości (pion i poziom w naturalnych proporcjach), przyciski ←/→ na desktopie.
  Klik → **Lightbox**: MUI `Dialog` pełnoekranowy, obraz `full`, strzałki, licznik `n / 15`,
  klawiatura ←/→/Esc, swipe na dotyku, nawigacja w pętli, focus trap (z `Dialog`).
- `generateMetadata`: `title` = „{tytuł} — ntwins”, `description` = pierwszy akapit (≤ 160 znaków),
  Open Graph z bannerem/ikoną.

### 5.4 Polityka prywatności (`/apps/[slug]/privacy-policy/`)

Treść 1:1 z `docs/legacy/src-2020/privacy-policy/PrivacyPolicyContent.tsx` (poprawka „permisions”→„permissions”,
„two permissions” → „the following permissions”, bo lista ma trzy pozycje), nagłówek „{tytuł} — Privacy Policy”,
kontakt `ntwins.info@gmail.com`, przycisk „Back to {tytuł}”. Karta glass na tle strony.

### 5.5 404

`not-found.tsx` → `out/404.html` (GitHub Pages serwuje go automatycznie): „Lost in the mountains…”,
ikona smoka, przycisk „Back to games”.

## 6. Siatka bento (Apps & Games)

CSS Grid, `grid-auto-flow: dense`, gap 16–24 px.

| Breakpoint | Kolumny | DP2 | DP, UP | standard |
|---|---|---|---|---|
| ≥ 1200 px | 4 | 2×2 | 2×1 każdy | 1×1 |
| 600–1199 px | 2 | 2×2 | 2×1 każdy | 1×1 |
| < 600 px | 2 | 2×2 (pełna szerokość) | 2×1 (pełna szerokość) | 1×1 |

Desktop: DP2 zajmuje kolumny 1–2 i wiersze 1–2, DP i UP — kolumny 3–4 w wierszach 1 i 2.

**Kafel hero**: tło = banner (`object-fit: cover`) z powolnym efektem Ken Burns (scale 1→1.08, 20 s,
alternate); gradient od dołu; ikona 64–96 px, tytuł (Cinzel Decorative), dla DP2 odznaka „Featured” i
krótki tagline (pierwsze zdanie opisu bez emoji, maks. 2 linie).
**Kafel standard**: ikona (zaokrąglona, 1:1) + tytuł pod spodem na karcie glass.
Cały kafel to `<a>` (Next `Link`) do `/apps/{slug}/` z widocznym `:focus-visible`.

## 7. Wygląd

- Paleta (MUI `palette`, tryb dark):
  - `background.default` `#0f0c14`, `background.paper` `#1a1522`
  - `primary.main` `#8e44c4` (rozwinięcie dawnego `#692f88`), `secondary.main` `#f5b524` (złoto ze skrzydeł smoka DP2)
  - `text.primary` `#f3eef8`, `text.secondary` `#b9aec7`
  - ramki kart `rgba(255,255,255,0.08)`, glass: `background: rgba(26,21,34,0.6)` + `backdrop-filter: blur(12px)`
- Typografia: nagłówki h1–h3 Cinzel Decorative; reszta Inter. Skala MUI `responsiveFontSizes`.
- Kontrast tekstu ≥ WCAG AA (4.5:1 dla tekstu, 3:1 dla dużych nagłówków).

## 8. Animacje

| Element | Animacja | Implementacja |
|---|---|---|
| Tło hero | ~60 cząstek żaru (fiolet/złoto) unoszących się w górę, lekki parallax za kursorem | canvas 2D + `requestAnimationFrame`; pauza przy `document.hidden` i gdy hero poza viewportem (`IntersectionObserver`); DPR ≤ 2 |
| Logo | pojawianie się od lewej (clip-path), 1.2 s | `motion` |
| Hero przy scrollu | tło wolniej niż treść, treść blednie | `useScroll` / `useTransform` |
| Kafle | reveal: `y: 24→0`, `opacity: 0→1`, `scale: .96→1`, stagger 60 ms | `Reveal` (`whileInView`, `once: true`) |
| Kafel hover | tilt 3D do 6° za kursorem + glow w kolorze akcentu | `motion` `useMotionValue` / `useSpring`; tylko `(hover: hover) and (pointer: fine)` |
| Kafel tap | `scale: .97` | `whileTap` |
| Kafel hero | Ken Burns | CSS keyframes |
| Strona gry | wejście nagłówka i treści (fade + slide) | `motion` |
| NavBar | przejście tła/cienia po scrollu | CSS transition |
| Lightbox | fade + scale obrazu, slide przy zmianie | `AnimatePresence` |

**Reduced motion** (`prefers-reduced-motion: reduce`): brak cząstek (statyczny gradient), brak tiltu,
Ken Burns i parallax; pozostaje wyłącznie fade ≤ 200 ms (`MotionConfig reducedMotion="user"` + warunki w canvasie/CSS).

**Bez JS**: treść w całości w statycznym HTML. `motion` renderuje stan początkowy (`opacity: 0`) już w HTML,
dlatego `Reveal` oznacza elementy atrybutem `data-reveal`, a `layout.tsx` zawiera w `<head>`
`<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>` —
bez JS treść jest widoczna, z JS animuje się normalnie.

Przejście kafel → strona gry odbywa się zwykłą animacją wejścia strony (bez shared-element, które
przy statycznym eksporcie i nawigacji między dokumentami jest zawodne).

## 9. Zasoby i wydajność

- Konwersja do WebP skryptem jednorazowym (`sharp`, devDependency, `scripts/optimize-images.mjs`),
  wyniki commitowane do `public/`:
  - screenshoty DP2: `thumb` (wys. 360 px) i `full` (dłuższy bok ≤ 1600 px), jakość 80;
  - bannery: szerokość 1024 i 512 px; ikony: 512 i 192 px.
- `loading="lazy"` i `decoding="async"` dla wszystkiego poza logo w hero i bannerem na stronie gry (`fetchpriority="high"`).
- Każdy obraz ma zarezerwowane wymiary (`width`/`height` lub `aspect-ratio`) — brak CLS.
- Brak bibliotek: Bootstrap, masonry, react-image-lightbox.

## 10. Obsługa błędów

| Sytuacja | Zachowanie |
|---|---|
| Nieznany slug / nieznany URL | brak strony w eksporcie (`dynamicParams = false`) → GitHub Pages serwuje `404.html` |
| Brak `banner` w danych | fallback: gradient + rozmyta ikona |
| Obraz nie wczytał się (`onError`) | `SafeImage` podmienia na gradient z inicjałem tytułu, układ bez zmian |
| Brak `screenshots` | sekcja galerii nie jest renderowana |
| `navigator.clipboard` niedostępny | przycisk kopiowania ukryty, zostaje link `mailto:` |
| Brak JS / reduced motion | patrz sekcja 8 |

## 11. Licencje

- Fonty z `apps-page` (**thunder**, **stranger**, **quaaludes** — tylko użytek prywatny/niekomercyjny;
  **tw-cen** — komercyjny Monotype; **annabel**, **digitalanarchy** — brak licencji) **nie są używane ani kopiowane** do repo.
- Używane wyłącznie fonty OFL z Google Fonts (Cinzel Decorative, Inter) przez `next/font` (self-hosting w buildzie).
- Badge Google Play: oficjalny plik z https://play.google.com/intl/en_us/badges/ bez modyfikacji, zgodnie z wytycznymi Google.
- Grafiki gier i logo ntwins należą do właściciela.

## 12. Testy

Vitest + Testing Library (jsdom):

1. **Dane** (`apps.test.ts`): unikalne slugi w kebab-case; dokładnie 3 aplikacje `hero` w kolejności
   DP2, DP, UP; łącznie 15 aplikacji; `packageId` pasuje do `^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$`;
   `description` niepusty; każda ścieżka (`icon`, `banner`, screenshoty thumb/full) istnieje w `public/`.
2. **`asset()`**: z i bez `NEXT_PUBLIC_BASE_PATH`, brak podwójnych ukośników.
3. **Brak gołych ścieżek**: test skanuje `src/**/*.tsx` w poszukiwaniu `src="/` lub `url('/` poza `asset()`.
4. **Footer**: przy zegarze ustawionym na 2031-03-01 renderuje „© 2031 ntwins”.
5. **AppTile**: renderuje link `href="/apps/dragon-pet-2/"`, dostępną nazwę z tytułem, `alt` ikony.
6. **Lightbox**: ←/→ przełącza obrazy w pętli (15 → 1), Esc wywołuje zamknięcie, licznik się aktualizuje.
7. **SafeImage**: po zdarzeniu `error` renderuje fallback z inicjałem.

Smoke test eksportu (`scripts/verify-export.mjs`, uruchamiany po `pnpm build`): w `out/` istnieją
`index.html`, `404.html`, `.nojekyll` oraz `apps/{slug}/index.html` i `apps/{slug}/privacy-policy/index.html`
dla każdego z 15 slugów; w `index.html` występują ścieżki z prefiksem `/apps-dashboard/` gdy ustawiony basePath.

Ręcznie (przed oznaczeniem jako gotowe): `pnpm build && npx serve out` pod basePath, przejście po
wszystkich stronach, Lighthouse mobile, test z `prefers-reduced-motion` i z wyłączonym JS.

## 13. Deploy

`.github/workflows/deploy.yml`:

- Trigger: `push` na `main` + `workflow_dispatch`.
- Uprawnienia: `contents: read`, `pages: write`, `id-token: write`; `concurrency: pages`.
- Job `build`: checkout → `pnpm/action-setup` → `actions/setup-node` (Node 22, cache pnpm) →
  `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm test` →
  `pnpm build` (env `NEXT_PUBLIC_BASE_PATH=/apps-dashboard`) → `node scripts/verify-export.mjs` →
  `actions/upload-pages-artifact` (`path: out`).
- Job `deploy` (needs: build): `actions/deploy-pages`, environment `github-pages`.

Jednorazowo po stronie właściciela: *Settings → Pages → Source: GitHub Actions*.
Wszystkie operacje git (commit, push) wykonuje właściciel.

## 14. Skrypty `package.json`

`dev`, `build`, `start` (serwowanie `out/` przez `serve`, devDependency), `lint`, `test`, `test:watch`, `verify` (smoke test eksportu),
`optimize-images` (jednorazowa konwersja zasobów).
