<script setup lang="ts">
const { t } = useI18n()
const mode = ref<'html' | 'url' | 'unicode' | 'json'>('html')
const direction = ref<'encode' | 'decode'>('encode')
const input = ref('')
const output = ref('')
const error = ref('')

function unicodeEncode(value: string) {
  return [...value]
    .map(char => {
      const code = char.codePointAt(0)!
      return code > 0xffff ? `\\u{${code.toString(16).toUpperCase()}}` : `\\u${code.toString(16).toUpperCase().padStart(4, '0')}`
    })
    .join('')
}

function unicodeDecode(value: string) {
  return value.replace(/\\u\{([0-9a-f]+)\}|\\u([0-9a-f]{4})/gi, (_match, long?: string, short?: string) =>
    String.fromCodePoint(Number.parseInt(long ?? short!, 16))
  )
}

function run() {
  error.value = ''
  try {
    if (mode.value === 'html') {
      output.value = direction.value === 'encode' ? escapeHtml(input.value) : decodeHtml(input.value)
    } else if (mode.value === 'url') {
      output.value = direction.value === 'encode' ? encodeURIComponent(input.value) : decodeURIComponent(input.value)
    } else if (mode.value === 'unicode') {
      output.value = direction.value === 'encode' ? unicodeEncode(input.value) : unicodeDecode(input.value)
    } else {
      output.value = direction.value === 'encode' ? JSON.stringify(input.value) : String(JSON.parse(input.value))
    }
  } catch (err) {
    output.value = ''
    error.value = err instanceof Error ? err.message : 'Cannot convert this input.'
  }
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-actions">
      <TButton
        v-for="item in [['html', 'HTML'], ['url', 'URL'], ['unicode', 'Unicode'], ['json', 'JSON']] as const"
        :key="item[0]"
        size="small"
        :severity="mode === item[0] ? undefined : 'secondary'"
        :label="item[1]"
        @click="mode = item[0]"
      />
    </div>
    <div class="tool-actions">
      <TButton size="small" :severity="direction === 'encode' ? undefined : 'secondary'" label="Encode" @click="direction = 'encode'" />
      <TButton size="small" :severity="direction === 'decode' ? undefined : 'secondary'" label="Decode" @click="direction = 'decode'" />
    </div>
    <Textarea v-model="input" class="tool-textarea" rows="6" placeholder="Input…" />
    <div class="tool-actions">
      <TButton size="small" :label="direction === 'encode' ? 'Encode' : 'Decode'" @click="run" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''; output = ''; error = ''" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <template v-if="output">
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ output }}</pre>
      <div class="tool-actions"><ToolsCopyButton :text="output" /></div>
    </template>
    <p class="tool-hint">HTML decoding uses a detached textarea, so no HTML is executed.</p>
  </div>
</template>
