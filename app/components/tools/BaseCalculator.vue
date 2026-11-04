<script setup lang="ts">
const base = ref(10)
const left = ref('10')
const right = ref('1')
const operator = ref<'+' | '-' | '*' | '/' | '%'>('+')
const error = ref('')

function parse(value: string) {
  const clean = value.trim().toLowerCase().replace(/^0[bxo]/, '').replace(/^-/, '')
  if (!clean) throw new Error('Empty value')
  let result = 0n
  for (const char of clean) {
    const digit = Number.parseInt(char, 36)
    if (Number.isNaN(digit) || digit >= base.value) throw new Error(`Invalid digit "${char}" in base ${base.value}`)
    result = result * BigInt(base.value) + BigInt(digit)
  }
  return value.trim().startsWith('-') ? -result : result
}

const result = computed(() => {
  error.value = ''
  try {
    const a = parse(left.value)
    const b = parse(right.value)
    let value: bigint
    if (operator.value === '+') value = a + b
    else if (operator.value === '-') value = a - b
    else if (operator.value === '*') value = a * b
    else if (operator.value === '/') {
      if (b === 0n) throw new Error('Division by zero')
      value = a / b
    } else {
      if (b === 0n) throw new Error('Division by zero')
      value = a % b
    }
    return value
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    return null
  }
})

const outputs = computed(() => {
  if (result.value === null) return []
  return [
    { label: 'Binary', value: result.value.toString(2) },
    { label: 'Octal', value: result.value.toString(8) },
    { label: 'Decimal', value: result.value.toString(10) },
    { label: 'Hex', value: result.value.toString(16).toUpperCase() }
  ]
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label><span>Base</span><Select v-model="base" :options="[2, 8, 10, 16]" size="small" /></label>
      <InputText v-model="left" size="small" style="width: 130px" />
      <Select v-model="operator" :options="['+', '-', '*', '/', '%']" size="small" style="width: 72px" />
      <InputText v-model="right" size="small" style="width: 130px" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="tool-stat-grid">
      <div v-for="item in outputs" :key="item.label" class="tool-stat">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </div>
    </div>
    <div class="tool-actions"><ToolsCopyButton v-for="item in outputs" :key="item.label" :text="item.value" /></div>
    <p class="tool-hint">Integer arithmetic with BigInt. Division truncates toward zero; fractions are not supported.</p>
  </div>
</template>
