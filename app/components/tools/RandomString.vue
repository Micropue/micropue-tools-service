<script setup lang="ts">
const { t } = useI18n()
const presets: Record<string, string> = {
  'Alphanumeric': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  'Letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  'Lowercase': 'abcdefghijklmnopqrstuvwxyz',
  'Digits': '0123456789',
  'Hex': '0123456789abcdef',
  'Base64 URL': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  'Custom': ''
}
const preset = ref('Alphanumeric')
const custom = ref('ABCDEF0123456789')
const length = ref(32)
const secure = ref(true)
const output = ref('')

function generate() {
  const charset = preset.value === 'Custom' ? custom.value : presets[preset.value]!
  if (!charset) {
    output.value = ''
    return
  }
  const size = Math.min(4096, Math.max(1, Number(length.value) || 1))
  if (secure.value) {
    output.value = randomString(size, charset)
    return
  }
  output.value = Array.from({ length: size }, () => charset[Math.floor(Math.random() * charset.length)]).join('')
}

generate()
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <Select v-model="preset" :options="Object.keys(presets)" size="small" />
      <InputText v-if="preset === 'Custom'" v-model="custom" size="small" placeholder="Custom characters" />
      <label><span>Length</span><InputNumber v-model="length" :min="1" :max="4096" size="small" /></label>
      <label><Checkbox v-model="secure" binary /> Secure randomness</label>
      <TButton size="small" :label="t('ui.generate')" @click="generate" />
    </div>
    <pre class="tool-output">{{ output }}</pre>
    <div class="tool-actions">
      <ToolsCopyButton :text="output" />
      <ToolsDownloadTextButton :text="output" filename="random-string.txt" />
    </div>
    <p class="tool-hint">Secure mode uses crypto.getRandomValues. Unsecure mode uses Math.random and is only suitable for placeholders.</p>
  </div>
</template>
