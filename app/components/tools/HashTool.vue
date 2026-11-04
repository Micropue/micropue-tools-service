<script setup lang="ts">
const { t } = useI18n()

const mode = ref<'text' | 'file'>('text')
const text = ref('')
const algorithms = ref<Record<string, boolean>>({ 'SHA-1': true, 'SHA-256': true, 'SHA-384': false, 'SHA-512': false })
const results = ref<{ name: string; hash: string }[]>([])
const error = ref('')
const fileInfo = ref('')

async function digest(buffer: ArrayBuffer | Uint8Array, name: string) {
  const hash = await crypto.subtle.digest(name, buffer as BufferSource)
  return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('')
}

async function runText() {
  error.value = ''
  results.value = []
  const names = Object.entries(algorithms.value).filter(([, on]) => on).map(([name]) => name)
  if (!names.length) {
    error.value = 'Select at least one algorithm.'
    return
  }
  try {
    const data = new TextEncoder().encode(text.value)
    results.value = await Promise.all(names.map(async name => ({ name, hash: await digest(data, name) })))
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}

async function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  error.value = ''
  results.value = []
  fileInfo.value = `${file.name} · ${(file.size / 1024).toFixed(1)} KB`

  const names = Object.entries(algorithms.value).filter(([, on]) => on).map(([name]) => name)
  if (!names.length) {
    error.value = 'Select at least one algorithm.'
    return
  }

  const buffer = await file.arrayBuffer()
  results.value = await Promise.all(names.map(async name => ({ name, hash: await digest(buffer, name) })))
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <TButton size="small" :severity="mode === 'text' ? undefined : 'secondary'" label="Text" @click="mode = 'text'" />
      <TButton size="small" :severity="mode === 'file' ? undefined : 'secondary'" label="File" @click="mode = 'file'" />
    </div>

    <div class="tool-row">
      <label v-for="(_, name) in algorithms" :key="name">
        <Checkbox v-model="algorithms[name]" binary /> {{ name }}
      </label>
    </div>

    <template v-if="mode === 'text'">
      <Textarea v-model="text" class="tool-textarea" rows="5" placeholder="Text to hash…" />
      <div class="tool-actions">
        <TButton size="small" :label="t('ui.generate')" @click="runText" />
      </div>
    </template>

    <template v-else>
      <input type="file" @change="onFile" />
      <p v-if="fileInfo" class="tool-hint">{{ fileInfo }}</p>
    </template>

    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>

    <div v-for="item in results" :key="item.name" class="hash">
      <p class="tool-label">{{ item.name }}</p>
      <pre class="tool-output">{{ item.hash }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="item.hash" />
      </div>
    </div>

    <p class="tool-hint">Hashes are computed locally with the Web Crypto API. MD5 is not offered as a secure hash.</p>
  </div>
</template>

<style scoped>
.hash + .hash {
  margin-top: 0.9rem;
}
</style>
