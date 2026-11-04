<script setup lang="ts">
const { t } = useI18n()
const mode = ref<'to-code' | 'to-char'>('to-code')
const input = ref('你好 👋')
const error = ref('')

const rows = computed(() => {
  if (mode.value !== 'to-code') return []
  return [...input.value].map(char => {
    const code = char.codePointAt(0)!
    return {
      char,
      hex: `U+${code.toString(16).toUpperCase().padStart(4, '0')}`,
      decimal: String(code),
      utf8: [...new TextEncoder().encode(char)].map(byte => byte.toString(16).toUpperCase().padStart(2, '0')).join(' ')
    }
  })
})

const output = computed(() => {
  error.value = ''
  if (mode.value === 'to-code') return rows.value.map(row => row.hex).join(' ')
  try {
    return input.value
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(token => {
        const clean = token.replace(/^u\+/i, '').replace(/^0x/i, '')
        const code = Number.parseInt(clean, 16)
        if (!Number.isInteger(code) || code < 0 || code > 0x10ffff) throw new Error(`Invalid code point: ${token}`)
        return String.fromCodePoint(code)
      })
      .join('')
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    return ''
  }
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-actions">
      <TButton size="small" :severity="mode === 'to-code' ? undefined : 'secondary'" label="Character → code point" @click="mode = 'to-code'" />
      <TButton size="small" :severity="mode === 'to-char' ? undefined : 'secondary'" label="Code point → character" @click="mode = 'to-char'" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''" />
    </div>
    <Textarea v-model="input" class="tool-textarea" rows="4" :placeholder="mode === 'to-code' ? '你好 👋' : 'U+4F60 U+597D U+1F44B'" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <template v-if="mode === 'to-code'">
      <div class="tool-stat-grid">
        <div v-for="row in rows" :key="`${row.hex}-${row.char}`" class="tool-stat">
          <b>{{ row.char }}</b>
          <span>{{ row.hex }} · {{ row.decimal }} · UTF-8 {{ row.utf8 }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ output }}</pre>
    </template>
    <div class="tool-actions"><ToolsCopyButton :text="mode === 'to-code' ? rows.map(row => row.hex).join(' ') : output" /></div>
    <p class="tool-hint">Uses Unicode code points, so emoji outside the basic plane stay in one piece.</p>
  </div>
</template>
