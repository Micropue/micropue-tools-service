---
name: primevue
description: PrimeVue 4 reference and project conventions. Use when adding, styling, or debugging PrimeVue components, theming (Noir preset, CSS variables, dark mode), PassThrough, forms, or the @primevue/nuxt-module setup in this Nuxt app.
---

# PrimeVue 4 in this repo

Stack: Nuxt 4 + `primevue@4.5.5` + `@primevue/nuxt-module@4.5.5` + `@primeuix/themes@2`
(the v2 line matches PrimeVue 4.5; `@primeuix/themes@3` is for PrimeVue 5, `@primevue/themes` is deprecated).

## Rules

- Components and composables are auto-imported globally by the Nuxt module. Never write `import Button from 'primevue/button'` in `app/` — just use `<Button>` / `<Toast>`.
- Icons: use `primeicons` classes (`<i class="pi pi-check" />`), already loaded in `nuxt.config.ts`.
- Style through theme tokens (`--p-primary-color`, `--p-content-background`, `--p-text-muted-color`, ...). Do not hardcode colors that the token system already provides.
- Theme lives in `app/assets/themes/noir.ts` (Aura + primary mapped to the `zinc` scale = black/white). It is loaded with `importTheme` in `nuxt.config.ts`.
- `importTheme` default export must be a theme config object (`{ preset }`) because the module calls `Theme.setTheme(exported)`; exporting the bare preset renders `undefined` CSS. `as` is required too.
- Dark scheme follows the OS (`darkModeSelector: 'system'`), so write `@media (prefers-color-scheme: dark)` overrides, not `.p-dark`.
- Global SCSS: `app/assets/css/main.scss` (html font-size 13px, Montserrat, command-palette / code-highlight helpers, dashboard + logo CSS variables) plus `profile-section.scss`.

## Full documentation

`primevue-docs.txt` next to this file is the full official docs dump (~44k lines). Do not read it end to end — grep it for the component or topic first:

```bash
grep -n "^## Styling" -A 40 .opencode/skills/primevue/primevue-docs.txt
grep -n "^# DataTable" -A 200 .opencode/skills/primevue/primevue-docs.txt | head -200
```
