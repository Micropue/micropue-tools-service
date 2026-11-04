<script setup lang="ts">
import { categories, tools } from '~/data/tools'
import zhRaw from '../../i18n/locales/zh.json?raw'
import jaRaw from '../../i18n/locales/ja.json?raw'
import ruRaw from '../../i18n/locales/ru.json?raw'

const { t } = useI18n()
const { name: toolName, description: toolDescription, category: categoryName } = useToolText()
const searchMessages: Record<string, any> = {
  zh: JSON.parse(zhRaw),
  ja: JSON.parse(jaRaw),
  ru: JSON.parse(ruRaw)
}
const localePath = useLocalePath()

const query = ref('')
const focused = ref(false)
const active = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

function allLocaleText(tool: (typeof tools)[number], category?: (typeof categories)[number]) {
  return Object.values(searchMessages)
    .map(messages => [
      messages?.toolNames?.[tool.slug] ?? '',
      messages?.toolDescriptions?.[tool.slug] ?? '',
      category ? messages?.categories?.[category.code] ?? '' : ''
    ].join(' '))
    .join(' ')
}

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []

  return tools
    .map(tool => ({
      tool,
      category: categories.find(item => item.code === tool.category)
    }))
    .filter(({ tool, category }) => {
      const haystack = `${tool.name} ${tool.description} ${toolName(tool)} ${toolDescription(tool)} ${category?.code ?? ''} ${category ? categoryName(category.code) : ''} ${allLocaleText(tool, category)}`
      return haystack.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      const rank = (name: string) => {
        const value = name.toLowerCase()
        return value.startsWith(q) ? 0 : value.includes(q) ? 1 : 2
      }
      return rank(toolName(a.tool)) - rank(toolName(b.tool))
    })
    .slice(0, 8)
})

const open = computed(() => focused.value && query.value.trim().length > 0)

watch(results, () => {
  active.value = 0
})

function select(index: number) {
  const item = results.value[index]
  if (!item) return
  navigateTo(localePath(`/tools/${item.tool.slug}`))
}

function onFocusOut(event: FocusEvent) {
  const root = event.currentTarget as HTMLElement
  if (!root.contains(event.relatedTarget as Node | null)) {
    focused.value = false
  }
}

function focusSearch(event: KeyboardEvent) {
  if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
  const target = event.target
  if (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable="true"]')) return
  event.preventDefault()
  inputEl.value?.focus()
  inputEl.value?.select()
}

onMounted(() => window.addEventListener('keydown', focusSearch))
onBeforeUnmount(() => window.removeEventListener('keydown', focusSearch))

function onKeydown(event: KeyboardEvent) {
  if (!open.value) return
  const total = results.value.length

  if (event.key === 'ArrowDown' && total > 0) {
    event.preventDefault()
    active.value = (active.value + 1) % total
  } else if (event.key === 'ArrowUp' && total > 0) {
    event.preventDefault()
    active.value = (active.value - 1 + total) % total
  } else if (event.key === 'Enter' && total > 0) {
    event.preventDefault()
    select(active.value)
  } else if (event.key === 'Escape') {
    query.value = ''
    focused.value = false
    inputEl.value?.blur()
  }
}
</script>

<template>
  <div class="tool-search" @focusin="focused = true" @focusout="onFocusOut">
    <div class="search-field" @click="inputEl?.focus()">
      <i class="pi pi-search" aria-hidden="true" />
      <input
        ref="inputEl"
        v-model="query"
        type="search"
        :placeholder="t('search.placeholder')"
        :aria-label="t('search.placeholder')"
        autocomplete="off"
        spellcheck="false"
        aria-keyshortcuts="/"
        @keydown="onKeydown"
      />
      <kbd class="search-key" aria-hidden="true">/</kbd>
    </div>

    <ul v-if="open" class="search-results" role="listbox">
      <li v-if="results.length === 0" class="search-empty" role="presentation">
        {{ t('search.empty') }}
      </li>
      <li
        v-for="(item, index) in results"
        :key="item.tool.slug"
        role="option"
        :aria-selected="index === active"
        class="search-result"
        :class="{ 'is-active': index === active }"
        @mousemove="active = index"
        @mousedown.prevent
        @click="select(index)"
      >
        <span class="search-name">{{ toolName(item.tool) }}</span>
        <span class="search-category">{{ item.category?.code }} {{ item.category ? categoryName(item.category.code) : '' }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tool-search {
  position: relative;
  z-index: 20;
  flex: 1 1 auto;
  min-width: 0;
  max-width: 520px;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 44px;
  padding: 0 1rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--p-content-background) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 12px 34px -24px rgba(0, 0, 0, 0.5);
  cursor: text;
  transition: border-color 0.15s, background-color 0.15s;
}

.tool-search:focus-within .search-field {
  border-color: color-mix(in srgb, var(--p-text-color) 38%, transparent);
  background: color-mix(in srgb, var(--p-content-background) 94%, transparent);
}

.search-field .pi {
  color: var(--p-text-muted-color);
  font-size: 0.9rem;
}

.search-field input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--p-text-color);
  font: inherit;
  font-size: 0.92rem;
  -webkit-appearance: none;
  appearance: none;
}

.search-field input::placeholder {
  color: var(--p-text-muted-color);
}

.search-field input::-webkit-search-cancel-button {
  display: none;
}

.search-key {
  flex: none;
  min-width: 20px;
  padding: 1px 5px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  border-radius: 5px;
  color: var(--p-text-muted-color);
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 0.7rem;
  line-height: 1.3;
  text-align: center;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.tool-search:focus-within .search-key {
  opacity: 0;
}

@media (max-width: 700px) {
  .search-key {
    display: none;
  }
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  left: 0;
  max-height: 320px;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  list-style: none;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 16%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--p-content-background) 94%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 24px 60px -34px rgba(0, 0, 0, 0.55);
}

.search-result {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
}

.search-result {
  transition: background-color 0.12s ease;
}

.search-result.is-active,
.search-result:hover {
  background: color-mix(in srgb, var(--p-text-color) 8%, transparent);
}

.search-name {
  color: var(--p-text-color);
  font-size: 0.9rem;
  font-weight: 500;
}

.search-category {
  flex: none;
  color: var(--p-text-muted-color);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.search-empty {
  padding: 0.6rem 0.7rem;
  color: var(--p-text-muted-color);
  font-size: 0.85rem;
}

</style>
