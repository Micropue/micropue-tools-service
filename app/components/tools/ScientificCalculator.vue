<script setup lang="ts">
const expression = ref('')
const result = ref('')
const error = ref('')
const degrees = ref(true)

function calculate() {
  error.value = ''
  if (!expression.value.trim()) return
  try {
    const value = evaluateExpression(expression.value, degrees.value)
    result.value = String(Number(value.toPrecision(12)))
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
    <InputText v-model="expression" size="large" placeholder="e.g. sin(30) + sqrt(16)" style="width: 100%; font-family: var(--font-code, monospace)" @keydown.enter="calculate" />
    <div class="tool-actions">
      <TButton v-for="token in ['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 'sqrt(', 'log(', 'ln(', 'abs(', '^', 'pi', 'e', '(', ')']" :key="token" size="small" severity="secondary" :label="token" @click="insert(token)" />
    </div>
    <div class="tool-actions">
      <TButton size="small" :severity="degrees ? undefined : 'secondary'" label="Degrees" @click="degrees = true" />
      <TButton size="small" :severity="!degrees ? undefined : 'secondary'" label="Radians" @click="degrees = false" />
      <TButton size="small" label="=" @click="calculate" />
      <TButton size="small" severity="secondary" label="Clear" @click="expression = ''; result = ''; error = ''" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div v-if="result" class="result">{{ result }}</div>
    <div class="tool-actions"><ToolsCopyButton :text="result" /></div>
    <p class="tool-hint">Trigonometric input and inverse output follow the selected angle mode. log is base 10, ln is natural log.</p>
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
