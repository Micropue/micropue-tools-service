# Nuxt + PrimeVue 4

Nuxt 4 site with [PrimeVue 4](https://primevue.org) wired up via `@primevue/nuxt-module`.
Components are auto-registered globally — no imports needed.

Theme is the black/white **Noir** preset in `app/assets/themes/noir.ts` (Aura with `primary` mapped to the `zinc` scale), loaded via `importTheme` in `nuxt.config.ts`. Dark scheme follows the OS by default.

Global styles are copied from the BITS project: `app/assets/css/main.scss` (13px root, Montserrat + Dancing Script fonts, command-palette / code-highlight / dashboard helpers) and `profile-section.scss`.

PrimeVue docs are available to agents as a project skill: `.opencode/skills/primevue/SKILL.md` (`primevue-docs.txt` is the full official doc dump; grep it, don't read it whole).

Header (`app/layouts/default.vue`) mirrors the BITS top bar: MICROPUE Tools wordmark + GitHub pill, no login. All HTTP errors render through `app/error.vue` (big status code + message + Back to Home).

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
