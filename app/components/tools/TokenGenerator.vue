<script setup lang="ts">
const { t } = useI18n()
const bytes = ref(32)
const encoding = ref<'hex' | 'base64url'>('hex')
const token = ref('')

function generate() {
  const size = Math.min(256, Math.max(8, Number(bytes.value) || 32))
  const data = new Uint8Array(size)
  crypto.getRandomValues(data)
  if (encoding.value === 'hex') {
    token.value = Array.from(data).map(byte => byte.toString(16).padStart(2, '0')).join('')
  } else {
    let binary = ''
    data.forEach(byte => (binary += String.fromCharCode(byte)))
    token.value = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
}

generate()
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label><span>Bytes</span><InputNumber v-model="bytes" :min="8" :max="256" size="small" /></label>
      <Select v-model="encoding" :options="[{ label: 'Hex', value: 'hex' }, { label: 'Base64 URL', value: 'base64url' }]" option-label="label" option-value="value" size="small" />
      <TButton size="small" :label="t('ui.generate')" @click="generate" />
    </div>
    <pre class="tool-output">{{ token }}</pre>
    <div class="tool-actions">
      <ToolsCopyButton :text="token" />
      <span class="tool-hint">{{ token.length }} characters</span>
    </div>
    <p class="tool-hint">Generated locally with crypto.getRandomValues. This is a random string, not an authenticated token: it has no expiry, signature or server-side record.</p>
  </div>
</template>
