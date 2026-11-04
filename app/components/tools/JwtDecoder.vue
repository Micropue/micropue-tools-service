<script setup lang="ts">
const { t } = useI18n()
const token = ref('')
const header = ref('')
const payload = ref('')
const times = ref<{ label: string; value: string }[]>([])
const error = ref('')

function decodePart(part: string) {
  const padded = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes))
}

function run() {
  error.value = ''
  header.value = ''
  payload.value = ''
  times.value = []
  if (!token.value.trim()) return

  try {
    const parts = token.value.trim().split('.')
    if (parts.length < 2) throw new Error('A JWT needs at least a header and a payload.')
    const head = decodePart(parts[0]!)
    const body = decodePart(parts[1]!)
    header.value = JSON.stringify(head, null, 2)
    payload.value = JSON.stringify(body, null, 2)
    times.value = ['exp', 'iat', 'nbf']
      .filter(key => typeof body[key] === 'number')
      .map(key => ({
        label: key === 'exp' ? 'Expires' : key === 'iat' ? 'Issued at' : 'Not before',
        value: new Date(body[key] * 1000).toLocaleString()
      }))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Cannot decode this token.'
  }
}
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="token" class="tool-textarea" rows="5" placeholder="Paste a JWT…" />
    <div class="tool-actions">
      <TButton size="small" label="Decode" @click="run" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="token = ''; header = ''; payload = ''; times = []; error = ''" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div v-if="times.length" class="tool-actions">
      <span v-for="item in times" :key="item.label" class="tool-hint">{{ item.label }}: {{ item.value }}</span>
    </div>
    <template v-if="header">
      <p class="tool-label">Header</p>
      <pre class="tool-output">{{ header }}</pre>
      <div class="tool-actions"><ToolsCopyButton :text="header" /></div>
    </template>
    <template v-if="payload">
      <p class="tool-label">Payload</p>
      <pre class="tool-output">{{ payload }}</pre>
      <div class="tool-actions"><ToolsCopyButton :text="payload" /></div>
    </template>
    <p class="tool-hint" style="color: #f59e0b">The signature is not verified. A decoded token is not proof that it is valid or trustworthy.</p>
  </div>
</template>
