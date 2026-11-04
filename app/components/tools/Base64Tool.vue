<script setup lang="ts">
const { t } = useI18n()

const mode = ref<'encode' | 'decode'>('encode')
const input = ref('')
const output = ref('')
const error = ref('')
const fileInfo = ref('')

function encodeText(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function decodeText(value: string) {
  const binary = atob(value.replace(/\s+/g, ''))
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function run() {
  error.value = ''
  output.value = ''
  try {
    output.value = mode.value === 'encode' ? encodeText(input.value) : decodeText(input.value)
  } catch {
    error.value = 'Cannot decode: the input is not valid Base64.'
  }
}

async function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const buffer = new Uint8Array(await file.arrayBuffer())
  let binary = ''
  for (let i = 0; i < buffer.length; i++) binary += String.fromCharCode(buffer[i]!)

  input.value = btoa(binary)
  fileInfo.value = `${file.name} · ${(file.size / 1024).toFixed(1)} KB`
  output.value = ''
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <TButton
        size="small"
        :severity="mode === 'encode' ? undefined : 'secondary'"
        label="Encode"
        @click="mode = 'encode'"
      />
      <TButton
        size="small"
        :severity="mode === 'decode' ? undefined : 'secondary'"
        label="Decode"
        @click="mode = 'decode'"
      />
      <input type="file" @change="onFile" />
    </div>

    <p v-if="fileInfo" class="tool-hint">{{ fileInfo }} — Base64 is in the input box.</p>

    <Textarea v-model="input" class="tool-textarea" rows="8" placeholder="Text or Base64…" />

    <div class="tool-actions">
      <TButton size="small" :label="mode === 'encode' ? 'Encode' : 'Decode'" @click="run" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''; output = ''; error = ''" />
    </div>

    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>

    <template v-if="output">
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ output }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="output" />
      </div>
    </template>

    <p class="tool-hint">UTF-8 text is supported. Large files increase memory usage.</p>
  </div>
</template>
