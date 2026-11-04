<script setup lang="ts">
const { t } = useI18n()

const input = ref('')
const keep = ref<'first' | 'last'>('first')
const ignoreCase = ref(true)
const trim = ref(true)
const dropEmpty = ref(true)

const output = computed(() => {
  let lines = input.value.split('\n').map(line => (trim.value ? line.trim() : line))
  if (dropEmpty.value) lines = lines.filter(line => line.trim() !== '')

  const seen = new Set<string>()
  const kept: string[] = []
  const source = keep.value === 'first' ? lines : [...lines].reverse()

  for (const line of source) {
    const key = ignoreCase.value ? line.toLowerCase() : line
    if (seen.has(key)) continue
    seen.add(key)
    kept.push(line)
  }

  return (keep.value === 'first' ? kept : kept.reverse()).join('\n')
})

const removed = computed(() => {
  const inputLines = input.value ? input.value.split('\n').length : 0
  const outputLines = output.value ? output.value.split('\n').length : 0
  return Math.max(0, inputLines - outputLines)
})
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="input" class="tool-textarea" rows="9" placeholder="One entry per line…" />

    <div class="tool-row">
      <label>
        <span>Keep</span>
        <Select
          v-model="keep"
          :options="[{ label: 'First occurrence', value: 'first' }, { label: 'Last occurrence', value: 'last' }]"
          option-label="label"
          option-value="value"
          size="small"
        />
      </label>
      <label><Checkbox v-model="ignoreCase" binary /> Case-insensitive</label>
      <label><Checkbox v-model="trim" binary /> Trim lines</label>
      <label><Checkbox v-model="dropEmpty" binary /> Drop empty lines</label>
    </div>

    <div class="tool-actions">
      <span class="tool-hint">{{ t('ui.dupesRemoved', { count: removed }) }}</span>
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''" />
    </div>

    <p class="tool-label">{{ t('ui.result') }}</p>
    <pre class="tool-output">{{ output }}</pre>

    <div class="tool-actions">
      <ToolsCopyButton :text="output" />
    </div>
  </div>
</template>
