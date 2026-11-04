<script setup lang="ts">
const { t } = useI18n()
const mode = ref<'csv-json' | 'json-csv'>('csv-json')
const input = ref('name,role\nAda,Engineer\nGrace,Admiral')
const headerRow = ref(true)
const output = ref('')
const error = ref('')

function convert() {
  error.value = ''
  output.value = ''
  try {
    if (mode.value === 'csv-json') {
      const rows = parseCsv(input.value)
      if (!rows.length) return
      const value = headerRow.value
        ? rows.slice(1).map(row => Object.fromEntries(rows[0]!.map((key, index) => [key, row[index] ?? ''])))
        : rows
      output.value = JSON.stringify(value, null, 2)
    } else {
      const value = JSON.parse(input.value)
      if (!Array.isArray(value)) throw new Error('JSON → CSV expects an array.')
      if (value.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))) {
        const keys = [...new Set(value.flatMap(item => Object.keys(item)))]
        output.value = toCsv([keys, ...value.map(item => keys.map(key => {
          const cell = (item as Record<string, unknown>)[key]
          return cell === null || cell === undefined ? '' : typeof cell === 'object' ? JSON.stringify(cell) : String(cell)
        }))])
      } else {
        output.value = toCsv(value.map(item => (Array.isArray(item) ? item.map(String) : [String(item)])))
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}

function swap() {
  mode.value = mode.value === 'csv-json' ? 'json-csv' : 'csv-json'
  input.value = output.value || input.value
  output.value = ''
}

convert()
</script>

<template>
  <div class="tool-ui">
    <div class="tool-actions">
      <TButton size="small" :severity="mode === 'csv-json' ? undefined : 'secondary'" label="CSV → JSON" @click="mode = 'csv-json'" />
      <TButton size="small" :severity="mode === 'json-csv' ? undefined : 'secondary'" label="JSON → CSV" @click="mode = 'json-csv'" />
      <label v-if="mode === 'csv-json'"><Checkbox v-model="headerRow" binary /> First row is header</label>
    </div>
    <Textarea v-model="input" class="tool-textarea" rows="8" />
    <div class="tool-actions">
      <TButton size="small" label="Convert" @click="convert" />
      <TButton size="small" severity="secondary" label="Swap result into input" @click="swap" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''; output = ''; error = ''" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <template v-if="output">
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ output }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="output" />
        <ToolsDownloadTextButton :text="output" :filename="mode === 'csv-json' ? 'data.json' : 'data.csv'" :mime="mode === 'csv-json' ? 'application/json' : 'text/csv'" />
      </div>
    </template>
    <p class="tool-hint">Nested values are kept as JSON strings in CSV cells. Quoted fields with commas and line breaks are supported.</p>
  </div>
</template>
