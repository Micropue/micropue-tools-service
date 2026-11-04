<script setup lang="ts">
const text = ref('The quick brown fox jumps over the lazy dog.\n敏捷的棕色狐狸跳过了懒狗。')
const size = ref(28)
const weight = ref(500)
const lineHeight = ref(1.5)
const spacing = ref(0)
const family = ref('system-ui')

const css = computed(() => `font-family: ${family.value};\nfont-size: ${size.value}px;\nfont-weight: ${weight.value};\nline-height: ${lineHeight.value};\nletter-spacing: ${spacing.value}px;`)
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="text" class="tool-textarea" rows="4" />
    <div class="tool-row">
      <Select v-model="family" :options="[{ label: 'System', value: 'system-ui' }, { label: 'Serif', value: 'Georgia, serif' }, { label: 'Monospace', value: 'ui-monospace, monospace' }]" option-label="label" option-value="value" size="small" />
      <label><span>Size</span><InputNumber v-model="size" :min="8" :max="120" size="small" /></label>
      <label><span>Weight</span><InputNumber v-model="weight" :min="100" :max="900" :step="100" size="small" /></label>
      <label><span>Line height</span><InputNumber v-model="lineHeight" :min="0.8" :max="3" :step="0.1" size="small" /></label>
      <label><span>Letter spacing</span><InputNumber v-model="spacing" :min="-5" :max="20" :step="0.5" size="small" /></label>
    </div>
    <div class="preview" :style="{ fontFamily: family, fontSize: `${size}px`, fontWeight: weight, lineHeight, letterSpacing: `${spacing}px` }">
      {{ text || 'Type something…' }}
    </div>
    <p class="tool-label">CSS</p>
    <pre class="tool-output">{{ css }}</pre>
    <div class="tool-actions"><ToolsCopyButton :text="css" /></div>
    <p class="tool-hint">Only locally available fonts are shown. A font stack behaves differently across devices.</p>
  </div>
</template>

<style scoped>
.preview {
  padding: 1rem;
  min-height: 160px;
  border: 1px dashed color-mix(in srgb, var(--p-text-color) 20%, transparent);
  border-radius: 12px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
