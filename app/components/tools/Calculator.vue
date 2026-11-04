<script setup lang="ts">
const expression = ref('')
const result = ref('')
const error = ref('')
const history = ref<string[]>([])

function calculate() {
  error.value = ''
  if (!expression.value.trim()) return
  try {
    const value = evaluateExpression(expression.value)
    result.value = String(Number(value.toPrecision(12)))
    history.value = [`${expression.value} = ${result.value}`, ...history.value].slice(0, 8)
  } catch (err) {
    result.value = ''
    error.value = err instanceof Error ? err.message : String(err)
  }
}

function insert(value: string) {
  expression.value += value
}
</script>

<template>
  <div class="tool-ui">
    <InputText
      v-model="expression"
      size="large"
      placeholder="e.g. (12 + 8) * 3"
      style="width: 100%; font-family: var(--font-code, monospace)"
      @keydown.enter="calculate"
    />
    <div class="tool-actions">
      <TButton v-for="token in ['+', '-', '*', '/', '(', ')', '.', '%']" :key="token" size="small" severity="secondary" :label="token" @click="insert(token)" />
      <TButton size="small" label="=" @click="calculate" />
      <TButton size="small" severity="secondary" label="Clear" @click="expression = ''; result = ''; error = ''" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div v-if="result" class="result">{{ result }}</div>
    <div class="tool-actions"><ToolsCopyButton :text="result" /></div>
    <template v-if="history.length">
      <p class="tool-label">History</p>
      <pre class="tool-output">{{ history.join('\n') }}</pre>
    </template>
    <p class="tool-hint">Supports + − × ÷, parentheses, % (modulo) and ^. Keyboard Enter calculates. Nothing is sent to a server.</p>
  </div>
</template>

<style scoped>
.result {
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 700;
  word-break: break-all;
}
</style>
