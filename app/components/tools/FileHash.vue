<script setup lang="ts">
const { t } = useI18n()
const algorithm = ref('SHA-256')
const file = ref<File | null>(null)
const hash = ref('')
const busy = ref(false)
const error = ref('')

async function onFile(event: Event) {
  const next = (event.target as HTMLInputElement).files?.[0]
  if (!next) return
  file.value = next
  hash.value = ''
  error.value = ''
  busy.value = true
  try {
    const buffer = await next.arrayBuffer()
    const digest = await crypto.subtle.digest(algorithm.value, buffer)
    hash.value = Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('')
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <Select v-model="algorithm" :options="['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']" size="small" />
      <input type="file" @change="onFile" />
    </div>
    <p v-if="busy" class="tool-hint">Hashing locally…</p>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <template v-if="file">
      <div class="tool-stat-grid">
        <div class="tool-stat"><b>{{ file.name }}</b><span>File</span></div>
        <div class="tool-stat"><b>{{ formatBytes(file.size) }}</b><span>Size</span></div>
        <div class="tool-stat"><b>{{ algorithm }}</b><span>Algorithm</span></div>
      </div>
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ hash }}</pre>
      <div class="tool-actions"><ToolsCopyButton :text="hash" /></div>
    </template>
    <p class="tool-hint">Computed with the Web Crypto API. The file stays in the browser. SHA-1 is legacy; prefer SHA-256 or stronger.</p>
  </div>
</template>
