<script setup lang="ts">
const { t } = useI18n()
const mode = ref<'to-code' | 'to-char'>('to-code')
const input = ref('Hello')
const error = ref('')

const output = computed(() => {
  error.value = ''
  try {
    if (mode.value === 'to-code') {
      return [...input.value].map(char => `${char} → ${char.codePointAt(0)} (0x${char.codePointAt(0)!.toString(16).toUpperCase()})`).join('\n')
    }
    return input.value
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(token => {
        const value = token.toLowerCase().startsWith('0x') ? Number.parseInt(token, 16) : Number(token)
        if (!Number.isInteger(value) || value < 0 || value > 0x10ffff) throw new Error(`Invalid code: ${token}`)
        return String.fromCodePoint(value)
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
      <TButton size="small" :severity="mode === 'to-code' ? undefined : 'secondary'" label="Text → codes" @click="mode = 'to-code'" />
      <TButton size="small" :severity="mode === 'to-char' ? undefined : 'secondary'" label="Codes → text" @click="mode = 'to-char'" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''" />
    </div>
    <Textarea v-model="input" class="tool-textarea" rows="5" :placeholder="mode === 'to-code' ? 'Hello' : '72 101 108 108 111'" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <p class="tool-label">{{ t('ui.result') }}</p>
    <pre class="tool-output">{{ output }}</pre>
    <div class="tool-actions"><ToolsCopyButton :text="output" /></div>
    <p class="tool-hint">Accepts decimal codes or hex with a 0x prefix. ASCII is a subset of Unicode; non-ASCII characters use their code points.</p>
  </div>
</template>
