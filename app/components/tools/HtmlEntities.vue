<script setup lang="ts">
const { t } = useI18n()
const input = ref('<p class="note">Tom & Jerry\'s</p>')
const mode = ref<'encode' | 'decode'>('encode')

const output = computed(() => {
  try {
    return mode.value === 'encode' ? escapeHtml(input.value) : decodeHtml(input.value)
  } catch {
    return ''
  }
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-actions">
      <TButton size="small" :severity="mode === 'encode' ? undefined : 'secondary'" label="Encode" @click="mode = 'encode'" />
      <TButton size="small" :severity="mode === 'decode' ? undefined : 'secondary'" label="Decode" @click="mode = 'decode'" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''" />
    </div>
    <Textarea v-model="input" class="tool-textarea" rows="8" />
    <p class="tool-label">{{ t('ui.result') }}</p>
    <pre class="tool-output">{{ output }}</pre>
    <div class="tool-actions"><ToolsCopyButton :text="output" /></div>
    <p class="tool-hint">Encodes &amp; &lt; &gt; &quot; and ', plus existing entities on decode.</p>
  </div>
</template>
