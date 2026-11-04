<script setup lang="ts">
const { t } = useI18n()
const input = ref('')
const mode = ref<'alpha-asc' | 'alpha-desc' | 'numeric-asc' | 'numeric-desc' | 'length-asc' | 'length-desc' | 'pinyin'>('alpha-asc')
const trim = ref(true)
const dropEmpty = ref(true)

const output = computed(() => {
  let lines = input.value.split('\n')
  if (trim.value) lines = lines.map(line => line.trim())
  if (dropEmpty.value) lines = lines.filter(line => line !== '')

  const pinyin = new Intl.Collator('zh-Hans-CN', { usage: 'sort' }).compare
  const compare: Record<string, (a: string, b: string) => number> = {
    'alpha-asc': (a, b) => a.localeCompare(b, undefined, { numeric: false, sensitivity: 'variant' }),
    'alpha-desc': (a, b) => b.localeCompare(a, undefined, { numeric: false, sensitivity: 'variant' }),
    'numeric-asc': (a, b) => (Number.parseFloat(a) || 0) - (Number.parseFloat(b) || 0),
    'numeric-desc': (a, b) => (Number.parseFloat(b) || 0) - (Number.parseFloat(a) || 0),
    'length-asc': (a, b) => a.length - b.length,
    'length-desc': (a, b) => b.length - a.length,
    pinyin: (a, b) => pinyin(a, b)
  }

  return [...lines].sort(compare[mode.value]).join('\n')
})

const modes = [
  ['alpha-asc', 'A → Z'],
  ['alpha-desc', 'Z → A'],
  ['numeric-asc', 'Number ↑'],
  ['numeric-desc', 'Number ↓'],
  ['length-asc', 'Length ↑'],
  ['length-desc', 'Length ↓'],
  ['pinyin', 'Pinyin (中文)']
] as const
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="input" class="tool-textarea" rows="9" placeholder="One entry per line…" />
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
    <div class="tool-row">
      <label><Checkbox v-model="trim" binary /> Trim lines</label>
      <label><Checkbox v-model="dropEmpty" binary /> Drop empty lines</label>
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''" />
    </div>
    <p class="tool-label">{{ t('ui.result') }}</p>
    <pre class="tool-output">{{ output }}</pre>
    <div class="tool-actions">
      <ToolsCopyButton :text="output" />
      <ToolsDownloadTextButton :text="output" filename="sorted.txt" />
    </div>
    <p class="tool-hint">Pinyin order uses the browser's Chinese collation (Intl.Collator); results can vary by browser.</p>
  </div>
</template>
