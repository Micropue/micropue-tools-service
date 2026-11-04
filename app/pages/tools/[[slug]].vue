<script setup lang="ts">
import { categories, tools } from '~/data/tools'

const route = useRoute()
const localePath = useLocalePath()
const { t, locale } = useI18n()
const { name: toolName, description: toolDescription, category: categoryName } = useToolText()
useToolPhrases()
const config = useRuntimeConfig()

const siteUrl = String(config.public.siteUrl).replace(/\/+$/, '')
const localePrefixes = ['', '/zh', '/ja', '/ru']

const slug = computed(() => String(route.params.slug ?? ''))
const current = computed(() => tools.find(tool => tool.slug === slug.value))

if (slug.value && !current.value) {
  throw createError({ statusCode: 404, statusMessage: 'Tool not found' })
}

const indexMode = computed(() => !slug.value)
const selected = computed(() => current.value ?? tools[0]!)
const selectedCategory = computed(() => categories.find(item => item.code === selected.value.category))

const groups = computed(() =>
  categories.map(category => ({
    category,
    tools: tools.filter(tool => tool.category === category.code)
  }))
)

const categoryFilter = ref('all')
const categoryOptions = computed(() => [
  { label: t('tools.allCategories'), value: 'all' },
  ...categories.map(category => ({ label: `${category.code} ${categoryName(category.code)}`, value: category.code }))
])
const visibleGroups = computed(() =>
  groups.value.filter(group => categoryFilter.value === 'all' || group.category.code === categoryFilter.value)
)

const categoryIcons: Record<string, string> = {
  '01': 'pi pi-file-edit',
  '02': 'pi pi-code',
  '03': 'pi pi-image',
  '04': 'pi pi-sync',
  '05': 'pi pi-calculator',
  '06': 'pi pi-qrcode',
  '07': 'pi pi-folder',
  '08': 'pi pi-globe',
  '09': 'pi pi-clock',
  '10': 'pi pi-palette',
  '11': 'pi pi-lock'
}

const modules = import.meta.glob('../../components/tools/*.vue')
const toolComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {}
for (const [path, loader] of Object.entries(modules)) {
  const name = path.split('/').pop()!.replace(/\.vue$/, '')
  toolComponents[name] = defineAsyncComponent(loader as any)
}

const activeComponent = computed(() => (selected.value.component ? toolComponents[selected.value.component] : null))

const sidebarRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const sidebarScroll = useState('tools-sidebar-scroll', () => 0)
const drawerOpen = ref(false)

function saveSidebarScroll() {
  if (sidebarRef.value) sidebarScroll.value = sidebarRef.value.scrollTop
}

function syncSelection() {
  nextTick(() => {
    const sidebar = sidebarRef.value
    if (sidebar) sidebar.scrollTop = sidebarScroll.value
    const active = sidebar?.querySelector('.tool-link.is-active') as HTMLElement | null
    if (sidebar && active) {
      const sidebarRect = sidebar.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      if (activeRect.top < sidebarRect.top) sidebar.scrollTop -= sidebarRect.top - activeRect.top + 8
      else if (activeRect.bottom > sidebarRect.bottom) sidebar.scrollTop += activeRect.bottom - sidebarRect.bottom + 8
      sidebarScroll.value = sidebar.scrollTop
    }
    if (panelRef.value) panelRef.value.scrollTop = 0
  })
}

onMounted(() => {
  if (!indexMode.value) syncSelection()
  window.addEventListener('keydown', onDrawerKeydown)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onDrawerKeydown))

function onDrawerKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') drawerOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    drawerOpen.value = false
  }
)
watch(
  () => selected.value.slug,
  () => {
    if (!indexMode.value) syncSelection()
  }
)

const pagePath = computed(() => (indexMode.value ? '/tools' : `/tools/${selected.value.slug}`))
const pageTitle = computed(() => (indexMode.value ? `${t('tools.all')} · MICROPUE Tools` : `${toolName(selected.value)} · MICROPUE Tools`))
const pageDescription = computed(() => (indexMode.value ? t('tools.allDescription') : toolDescription(selected.value)))

const canonical = computed(() => `${siteUrl}${localePath(pagePath.value)}`)

const alternates = computed(() => [
  ...localePrefixes.map(prefix => ({
    rel: 'alternate',
    hreflang: prefix === '' ? 'en' : prefix.slice(1),
    href: `${siteUrl}${prefix}${pagePath.value}`
  })),
  { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}${pagePath.value}` }
])

const ogLocale = computed(() => ({ en: 'en_US', zh: 'zh_CN', ja: 'ja_JP', ru: 'ru_RU' }[locale.value] ?? 'en_US'))

useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: pageDescription.value },
    { property: 'og:title', content: pageTitle.value },
    { property: 'og:description', content: pageDescription.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonical.value },
    { property: 'og:locale', content: ogLocale.value }
  ],
  link: [{ rel: 'canonical', href: canonical.value }, ...alternates.value]
}))
</script>

<template>
  <div class="tools-page">
    <button
      class="sidebar-toggle"
      type="button"
      :aria-label="t('header.openMenu')"
      aria-controls="tool-sidebar"
      :aria-expanded="drawerOpen"
      @click="drawerOpen = true"
    >
      <i class="pi pi-bars" aria-hidden="true" />
    </button>

    <aside
      id="tool-sidebar"
      ref="sidebarRef"
      class="sidebar"
      :class="{ 'is-open': drawerOpen }"
      @scroll.passive="saveSidebarScroll"
    >
      <div class="sidebar-head">
        <p class="sidebar-title">{{ t('tools.title') }}</p>
        <button class="sidebar-close" type="button" :aria-label="t('header.closeMenu')" @click="drawerOpen = false">
          <i class="pi pi-times" aria-hidden="true" />
        </button>
      </div>

      <nav class="sidebar-nav">
        <section v-for="group in groups" :key="group.category.code" class="group">
          <p class="group-title">{{ group.category.code }} {{ categoryName(group.category.code) }}</p>
          <NuxtLink
            v-for="tool in group.tools"
            :key="tool.slug"
            :to="localePath(`/tools/${tool.slug}`)"
            class="tool-link"
            :class="{ 'is-active': !indexMode && tool.slug === selected.slug }"
          >
            {{ toolName(tool) }}
            <span v-if="!tool.component" class="soon">soon</span>
          </NuxtLink>
        </section>
      </nav>
    </aside>

    <div v-if="drawerOpen" class="sidebar-backdrop" aria-hidden="true" @click="drawerOpen = false" />

    <main v-if="indexMode" class="tools-index">
      <header class="index-head">
        <div class="index-head-copy">
          <p class="index-kicker">MICROPUE TOOLS</p>
          <h1 class="index-title">{{ t('tools.index') }}</h1>
          <p class="index-meta">{{ t('tools.count', { tools: tools.length, categories: categories.length }) }}</p>
        </div>
        <div class="index-search">
          <ToolSearch />
        </div>
      </header>

      <div class="index-toolbar">
        <Select
          v-model="categoryFilter"
          :options="categoryOptions"
          option-label="label"
          option-value="value"
          size="small"
          class="index-filter"
          :aria-label="t('tools.allCategories')"
        />
      </div>

      <div class="index-groups">
        <section v-for="group in visibleGroups" :key="group.category.code" class="index-group">
          <div class="index-group-head">
            <span class="index-group-code">{{ group.category.code }}</span>
            <h2><i :class="categoryIcons[group.category.code]" class="index-group-icon" aria-hidden="true" /> {{ categoryName(group.category.code) }}</h2>
            <span class="index-rule" />
            <span class="index-count">{{ group.tools.length }}</span>
          </div>
          <div class="card-grid">
            <NuxtLink
              v-for="tool in group.tools"
              :key="tool.slug"
              :to="localePath(`/tools/${tool.slug}`)"
              class="tool-card"
            >
              <span class="card-preview" aria-hidden="true">
                <span class="card-monogram">{{ toolName(tool).slice(0, 1) }}</span>
                <span class="card-code">{{ group.category.code }}</span>
              </span>
              <span class="card-body">
                <span class="card-title">{{ toolName(tool) }}</span>
                <span class="card-desc">{{ toolDescription(tool) }}</span>
                <span class="card-meta">{{ categoryName(group.category.code) }}</span>
              </span>
            </NuxtLink>
          </div>
        </section>
      </div>
    </main>

    <main v-else ref="panelRef" class="panel">
      <header class="panel-head">
        <div class="panel-head-copy">
          <p class="panel-category">{{ selectedCategory?.code }} · {{ selectedCategory ? categoryName(selectedCategory.code) : '' }}</p>
          <h1 class="panel-title">{{ toolName(selected) }}</h1>
          <p class="panel-desc">{{ toolDescription(selected) }}</p>
        </div>
        <div class="panel-search">
          <ToolSearch />
        </div>
      </header>

      <div v-if="activeComponent" class="tool-body">
        <component :is="activeComponent" />
      </div>

      <section v-else class="usage">
        <p class="usage-empty">{{ t('tools.placeholder', { name: selected.name }) }}</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.tools-index {
  box-sizing: border-box;
  height: 100svh;
  overflow-y: auto;
  padding: clamp(24px, 4vh, 48px) clamp(20px, 4vw, 56px) 72px;
}

.index-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.4rem 2rem;
}

.index-kicker {
  margin: 0 0 0.5rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.index-title {
  margin: 0;
  font-size: clamp(44px, 6vw, 80px);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.05em;
  color: var(--p-text-color);
}

.index-meta {
  margin: 0.8rem 0 0;
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}

.index-search {
  flex: none;
  width: min(330px, 100%);
}

.index-toolbar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.4rem;
}

.index-filter {
  flex: none;
  width: 220px;
}

.index-group {
  margin-top: clamp(28px, 4vh, 44px);
}

.index-group-head {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  margin-bottom: 0.85rem;
}

.index-group-code {
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: var(--p-text-muted-color);
}

.index-group-head h2 {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--p-text-color);
}

.index-group-icon {
  font-size: 0.85rem;
  color: var(--p-text-muted-color);
}

.index-rule {
  flex: 1;
  height: 1px;
  background: color-mix(in srgb, var(--p-text-color) 12%, transparent);
}

.index-count {
  font-size: 0.68rem;
  color: var(--p-text-muted-color);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 0.85rem;
}

.tool-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--p-content-background, #fff) 94%, transparent);
  color: inherit;
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.tool-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--p-text-color) 28%, transparent);
  box-shadow: 0 18px 40px -32px color-mix(in srgb, var(--p-text-color) 70%, transparent);
}

.card-preview {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background:
    radial-gradient(circle at 68% 18%, color-mix(in srgb, var(--p-text-color) 13%, transparent), transparent 58%),
    linear-gradient(145deg, color-mix(in srgb, var(--p-text-color) 8%, transparent), color-mix(in srgb, var(--p-text-color) 2%, transparent));
}

.card-preview::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(color-mix(in srgb, var(--p-text-color) 7%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--p-text-color) 7%, transparent) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(circle at center, #000, transparent 78%);
}

.card-monogram {
  position: relative;
  z-index: 1;
  font-size: clamp(32px, 3vw, 46px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
  color: color-mix(in srgb, var(--p-text-color) 58%, transparent);
}

.card-code {
  position: absolute;
  top: 12px;
  left: 14px;
  z-index: 1;
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 0.64rem;
  letter-spacing: 0.12em;
  color: var(--p-text-muted-color);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  padding: 0.68rem 0.8rem 0.88rem;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.card-desc {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 0.72rem;
  line-height: 1.4;
  color: var(--p-text-muted-color);
}

.card-meta {
  margin-top: 0.12rem;
  font-size: 0.58rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
  opacity: 0.8;
}

.tools-page {
  display: grid;
  grid-template-columns: 280px 1fr;
  box-sizing: border-box;
  height: 100svh;
  padding-right: 76px;
}

.sidebar {
  min-height: 0;
  overflow-y: auto;
  padding: 18px 16px 32px;
  border-right: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  scrollbar-gutter: stable;
}

.sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0 0 1.1rem;
  padding: 2px 0 2px 0.5rem;
}

.sidebar-title {
  margin: 0;
  padding: 0;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.sidebar-close {
  display: none;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 16%, transparent);
  border-radius: 8px;
  background: transparent;
  color: var(--p-text-color);
  font: inherit;
  cursor: pointer;
}

.sidebar-toggle {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  display: none;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--p-content-border-color);
  border-top: 0;
  border-left: 0;
  border-radius: 0 0 14px 0;
  background: color-mix(in srgb, var(--p-content-background) 88%, transparent);
  backdrop-filter: blur(10px);
  color: var(--p-text-color);
  font: inherit;
  cursor: pointer;
}

.sidebar-toggle .pi {
  font-size: 1.15rem;
}

.sidebar-backdrop {
  display: none;
}

.group {
  margin-bottom: 1.3rem;
}

.group-title {
  margin: 0 0 0.35rem;
  padding: 0 0.5rem;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
  opacity: 0.75;
}

.tool-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.42rem 0.5rem;
  border-radius: 7px;
  color: var(--p-text-muted-color);
  font-size: 0.85rem;
  text-decoration: none;
  transition: background-color 0.12s ease, color 0.12s ease;
}

.tool-link:hover {
  background: color-mix(in srgb, var(--p-text-color) 7%, transparent);
  color: var(--p-text-color);
}

.tool-link.is-active {
  background: color-mix(in srgb, var(--p-text-color) 11%, transparent);
  color: var(--p-text-color);
  font-weight: 500;
}

.soon {
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
  opacity: 0.6;
}

.panel {
  min-width: 0;
  overflow-y: auto;
  padding: clamp(24px, 5vh, 48px) clamp(24px, 5vw, 64px);
}

.panel-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 330px);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
}

.panel-search {
  width: 100%;
}

.panel-category {
  margin: 0 0 0.6rem;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.panel-title {
  margin: 0;
  font-size: clamp(28px, 4vw, 46px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--p-text-color);
}

.panel-desc {
  margin: 0.9rem 0 0;
  max-width: 52ch;
  color: var(--p-text-muted-color);
  font-size: 0.95rem;
  line-height: 1.6;
}

.tool-body {
  margin-top: 2rem;
  max-width: 860px;
}

.usage {
  display: grid;
  place-items: center;
  min-height: 320px;
  margin-top: 2.4rem;
  padding: 2rem;
  border: 1px dashed color-mix(in srgb, var(--p-text-color) 22%, transparent);
  border-radius: 14px;
}

.usage-empty {
  margin: 0;
  color: var(--p-text-muted-color);
  font-size: 0.9rem;
  text-align: center;
}

@media screen and (max-width: 1000px) {
  .tools-page {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 60;
    width: min(330px, 86vw);
    height: 100svh;
    padding: 14px 16px 32px;
    background: var(--p-content-background, #fff);
    border-right: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
    box-shadow: 24px 0 70px -48px rgba(0, 0, 0, 0.65);
    visibility: hidden;
    transform: translateX(-100%);
    transition: transform 0.28s ease, visibility 0s linear 0.28s;
  }

  .sidebar.is-open {
    visibility: visible;
    transform: none;
    transition: transform 0.28s ease;
  }

  .sidebar-head {
    position: sticky;
    top: 0;
    z-index: 2;
    margin: 0 0 1rem;
    padding: 2px 0;
    background: color-mix(in srgb, var(--p-content-background, #fff) 94%, transparent);
    backdrop-filter: blur(10px);
  }

  .sidebar-close {
    display: grid;
  }

  .sidebar-toggle {
    display: grid;
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 55;
    background: rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(2px);
  }

  .panel,
  .tools-index {
    padding-top: 76px;
  }
}

@media screen and (max-width: 900px) {
  .index-head {
    align-items: flex-start;
  }

  .index-search {
    width: 100%;
  }

  .index-toolbar {
    align-items: stretch;
  }

  .index-filter {
    width: 100%;
  }

  .panel-head {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .panel-search {
    order: -1;
  }
}

@media screen and (max-width: 700px) {
  .tools-page {
    padding-right: 0;
  }

  .tools-index {
    padding: 76px 18px 56px;
  }

  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .panel {
    padding: 76px 18px 32px;
  }
}
</style>
