<script setup lang="ts">
const { t } = useI18n()

const input = ref('')
const output = ref('')
const error = ref('')
const parsed = ref<unknown>(undefined)
const view = ref<'text' | 'tree'>('text')
const treeQuery = ref('')

function describeError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  const match = message.match(/position\s+(\d+)/i)
  if (!match) return message

  const position = Number(match[1])
  const before = input.value.slice(0, position)
  const line = before.split('\n').length
  const column = position - before.lastIndexOf('\n')
  return `${message} (line ${line}, column ${column})`
}

function run(mode: 'format' | 'minify' | 'validate') {
  error.value = ''
  if (!input.value.trim()) {
    output.value = ''
    parsed.value = undefined
    return
  }

  try {
    const value = JSON.parse(input.value)
    parsed.value = value
    if (mode === 'validate') {
      output.value = 'Valid JSON.'
      view.value = 'text'
      return
    }
    output.value = mode === 'format' ? JSON.stringify(value, null, 2) : JSON.stringify(value)
    view.value = 'text'
  } catch (err) {
    output.value = ''
    error.value = describeError(err)
  }
}
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="input" class="tool-textarea" rows="10" placeholder='{"hello":"world"}' />

    <div class="tool-actions">
      <TButton size="small" label="Beautify" @click="run('format')" />
      <TButton size="small" severity="secondary" label="Minify" @click="run('minify')" />
      <TButton size="small" severity="secondary" label="Validate" @click="run('validate')" />
      <TButton size="small" :severity="view === 'tree' ? undefined : 'secondary'" label="Tree" :disabled="parsed === undefined" @click="view = view === 'tree' ? 'text' : 'tree'" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''; output = ''; error = ''; parsed = undefined; view = 'text'" />
    </div>

    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>

    <template v-if="output">
      <p class="tool-label">{{ t('ui.result') }}</p>
      <template v-if="view === 'tree'">
        <InputText v-model="treeQuery" size="small" placeholder="Search keys and values…" />
        <div class="tree">
          <ToolsJsonTree :value="parsed" :query="treeQuery" />
        </div>
      </template>
      <pre v-else class="tool-output">{{ output }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="output" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.tree {
  max-height: 360px;
  overflow: auto;
  padding: 0.8rem 1rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
}
</style>
