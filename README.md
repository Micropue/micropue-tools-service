# Nuxt + PrimeVue 4

Nuxt 4 site with [PrimeVue 4](https://primevue.org) wired up via `@primevue/nuxt-module`.
Components are auto-registered globally — no imports needed.

Theme is the black/white **Noir** preset in `app/assets/themes/noir.ts` (Aura with `primary` mapped to the `zinc` scale), loaded via `importTheme` in `nuxt.config.ts`. Dark scheme follows the OS by default.

Global styles are copied from the BITS project: `app/assets/css/main.scss` (13px root, Montserrat + Dancing Script fonts, command-palette / code-highlight / dashboard helpers) and `profile-section.scss`.

PrimeVue docs are available to agents as a project skill: `.opencode/skills/primevue/SKILL.md` (`primevue-docs.txt` is the full official doc dump; grep it, don't read it whole).

The header also has a performance switch (`usePerformanceMode()`, `micropue-perf` cookie): off unmounts the homepage photo-wall carousel entirely, leaving the plain background and the tool stack. Header (`app/layouts/default.vue`) mirrors the BITS top bar (MICROPUE Tools wordmark + GitHub pill, no login) but is a fixed overlay: content runs underneath and the bar's backdrop is the Vue Bits `GradualBlur` component (`app/components/GradualBlur.vue`, blur strongest at the top, fading down) plus a faint theme-coloured scrim for text contrast. All HTTP errors render through `app/error.vue` (big status code + message + Back to Home).

i18n (`@nuxtjs/i18n`): English is unprefixed (`/`), the others live at `/zh`, `/ja`, `/ru`. Strings are in `i18n/locales/<code>.json` (`file` must be set on each locale in `nuxt.config.ts`). Selecting a locale stores it in the `micropue-locale` cookie, and `app/middleware/locale.global.ts` sends `/` back to that locale; without a cookie `/` is always English (no browser-language redirect). `useLocaleSwitch()` (auto-imported) changes locale + cookie; the header uses it for the language dropdown left of the GitHub pill.

Homepage foreground is `app/components/ToolStack.client.vue`: 30 random tools (`app/data/tools.ts`) as a square card deck, rising in after the carousel intro. Wheel (anywhere) and drag rotate it endlessly both ways; only the card edges take pointer events so the carousel behind keeps hover/drag. Background hero is the Vue Bits `FlexCarousel` (`app/components/FlexCarousel.vue`, WebGL via `ogl`). The original Tailwind classes were ported to plain CSS in the same file (no Tailwind in this project). Props are configured in `app/pages/index.vue`; images are random `picsum.photos` placeholders (12 per load, a new set on every refresh) until real assets are added.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
