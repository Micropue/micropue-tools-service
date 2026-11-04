<script setup lang="ts">
import { dump as yamlDump, load as yamlLoad } from 'js-yaml'

const { t } = useI18n()
const input = ref('{"name":"Ada","age":36,"tags":["math","code"],"address":{"city":"London"}}')
const mode = ref<'json-yaml' | 'yaml-json' | 'json-csv' | 'json-ts'>('json-yaml')
const output = ref('')
const error = ref('')

const modes = [
  ['json-yaml', 'JSON → YAML'],
  ['yaml-json', 'YAML → JSON'],
  ['json-csv', 'JSON → CSV'],
  ['json-ts', 'JSON → TypeScript']
] as const

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function indentType(type: string, spaces: number) {
  const pad = ' '.repeat(spaces)
  return type.split('\n').map((line, index) => (index === 0 ? line : pad + line)).join('\n')
}

function inferType(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) {
    if (!value.length) return 'unknown[]'
    if (value.every(isPlainObject)) return `${objectType(value)}[]`
    const types = [...new Set(value.map(inferType))]
    return types.length === 1 ? `${types[0]}[]` : `(${types.join(' | ')})[]`
  }
  if (isPlainObject(value)) return objectType([value])
  return typeof value
}

function objectType(items: Record<string, unknown>[]): string {
  const keys = [...new Set(items.flatMap(item => Object.keys(item)))]
  const lines = keys.map(key => {
    const values = items.filter(item => key in item).map(item => item[key])
    const optional = values.length < items.length ? '?' : ''
    return `  ${key}${optional}: ${indentType(inferType(values[0]), 2)}`
  })
  return `{\n${lines.join('\n')}\n}`
}

function jsonToCsv(value: unknown) {
  if (!Array.isArray(value) || !value.every(isPlainObject)) {
    throw new Error('JSON → CSV expects an array of flat objects.')
  }
  const keys = [...new Set(value.flatMap(item => Object.keys(item)))]
  const rows = value.map(item =>
    keys.map(key => {
      const cell = item[key]
      if (cell === null || cell === undefined) return ''
      return typeof cell === 'object' ? JSON.stringify(cell) : String(cell)
    })
  )
  return toCsv([keys, ...rows])
}

function convert() {
  error.value = ''
  output.value = ''
  if (!input.value.trim()) return
  try {
    if (mode.value === 'json-yaml') {
      output.value = yamlDump(JSON.parse(input.value), { noRefs: true, lineWidth: 100 })
    } else if (mode.value === 'yaml-json') {
      output.value = JSON.stringify(yamlLoad(input.value), null, 2)
    } else if (mode.value === 'json-csv') {
      output.value = jsonToCsv(JSON.parse(input.value))
    } else {
      const value = JSON.parse(input.value)
      output.value = isPlainObject(value) || Array.isArray(value)
        ? `export type Root = ${inferType(value)}`
        : `export type Root = ${inferType(value)}`
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-actions">
      <TButton
        v-for="[value, label] in modes"
        :key="value"
        size="small"
        :severity="mode === value ? undefined : 'secondary'"
        :label="label"
        @click="mode = value"
      />
    </div>
    <Textarea v-model="input" class="tool-textarea" rows="10" placeholder="Paste JSON or YAML…" />
    <div class="tool-actions">
      <TButton size="small" label="Convert" @click="convert" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''; output = ''; error = ''" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <template v-if="output">
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ output }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="output" />
        <ToolsDownloadTextButton :text="output" :filename="mode === 'json-ts' ? 'types.ts' : mode === 'json-csv' ? 'data.csv' : mode === 'json-yaml' ? 'data.yaml' : 'data.json'" />
      </div>
    </template>
    <p class="tool-hint">YAML parsing uses js-yaml's safe default schema. TypeScript types are inferred from the sample, so optional and mixed fields may need review.</p>
  </div>
</template>
