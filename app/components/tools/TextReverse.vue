<script setup lang="ts">
const { t } = useI18n()
const input = ref('')
const mode = ref<'all' | 'lineOrder' | 'words' | 'lineChars'>('all')

const output = computed(() => {
  const text = input.value
  if (mode.value === 'all') return [...text].reverse().join('')
  if (mode.value === 'lineOrder') return text.split('\n').reverse().join('\n')
  if (mode.value === 'words') return text.split(/(\s+)/).reverse().join('')
  return text.split('\n').map(line => [...line].reverse().join('')).join('\n')
})

const modes = [
  ['all', 'Whole text'],
  ['lineOrder', 'Line order'],
  ['words', 'Word order'],
  ['lineChars', 'Each line']
] as const
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="input" class="tool-textarea" rows="8" placeholder="Text to reverse…" />
    <div class="tool-actions">
      <TButton
        v-for="[value, label] in modes"
        :key="value"
        size="small"
        :severity="mode === value ? undefined : 'secondary'"
        :label="label"
        @click="mode = value"
      />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''" />
    </div>
    <p class="tool-label">{{ t('ui.result') }}</p>
    <pre class="tool-output">{{ output }}</pre>
    <div class="tool-actions">
      <ToolsCopyButton :text="output" />
    </div>
    <p class="tool-hint">Uses Unicode code points, so emoji and CJK characters stay intact.</p>
  </div>
</template>
