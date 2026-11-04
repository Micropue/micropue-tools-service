<script setup lang="ts">
import { references } from '~/data/reference'
import { referencesZh } from '~/data/reference.zh'

const route = useRoute()
const { t, locale } = useI18n()
const source = computed(() => (locale.value === 'zh' ? referencesZh : references))
const search = ref('')
const data = computed(() => source.value[String(route.params.slug ?? '')] ?? { head: [], rows: [] })
const rows = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return data.value.rows
  return data.value.rows.filter(row => row.some(cell => cell.toLowerCase().includes(query)))
})
</script>

<template>
  <div class="tool-ui">
    <InputText v-model="search" size="small" :placeholder="t('ui.filter')" style="max-width: 320px" />
    <div class="ref-wrap">
      <table class="ref-table">
        <thead>
          <tr>
            <th v-for="cell in data.head" :key="cell">{{ cell }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td v-for="(cell, col) in row" :key="col" :class="{ 'is-code': col === 0 || col === 1 }">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="tool-hint">{{ t('ui.noMatches') }}</p>
    </div>
  </div>
</template>

<style scoped>
.ref-wrap {
  max-height: 60vh;
  overflow: auto;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
}

.ref-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}

th {
  position: sticky;
  top: 0;
  background: var(--p-content-background, #fff);
  text-align: left;
  font-weight: 600;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

th,
td {
  padding: 0.5rem 0.7rem;
  border-bottom: 1px solid color-mix(in srgb, var(--p-text-color) 8%, transparent);
  vertical-align: top;
}

td.is-code {
  font-family: var(--font-code, ui-monospace, monospace);
  white-space: nowrap;
}

tr:last-child td {
  border-bottom: 0;
}

@media (prefers-color-scheme: dark) {
  th {
    background: #18181b;
  }
}
</style>
