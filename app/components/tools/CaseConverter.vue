<script setup lang="ts">
const { t } = useI18n()

const input = ref('')
const mode = ref<'upper' | 'lower' | 'title' | 'sentence'>('upper')

const output = computed(() => {
  const value = input.value
  if (mode.value === 'upper') return value.toUpperCase()
  if (mode.value === 'lower') return value.toLowerCase()
  if (mode.value === 'title') {
    return value.replace(/\b([\p{L}])/gu, (char: string) => char.toUpperCase())
  }
  return value
    .toLowerCase()
    .replace(/(^\s*|[.!?]\s+)([\p{L}])/gu, (_m, prefix: string, char: string) => prefix + char.toUpperCase())
})

const modes = [
  { value: 'upper', label: 'UPPERCASE' },
  { value: 'lower', label: 'lowercase' },
  { value: 'title', label: 'Title Case' },
  { value: 'sentence', label: 'Sentence case' }
] as const
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="input" class="tool-textarea" rows="8" placeholder="Paste text here…" />

    <div class="tool-actions">
      <TButton
        v-for="item in modes"
        :key="item.value"
        size="small"
        :severity="mode === item.value ? undefined : 'secondary'"
        :label="item.label"
        @click="mode = item.value"
      />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''" />
    </div>

    <p class="tool-label">{{ t('ui.result') }}</p>
    <pre class="tool-output">{{ output }}</pre>

    <div class="tool-actions">
      <ToolsCopyButton :text="output" />
    </div>
  </div>
</template>
